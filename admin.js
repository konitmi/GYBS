(() => {
  "use strict";
  const cfg = window.GYBS_CONFIG || {};
  const configured = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase;
  const loginView = document.getElementById("login-view");
  const dashboardView = document.getElementById("dashboard-view");
  const loginForm = document.getElementById("login-form");
  const loginMessage = document.getElementById("login-message");
  const adminMessage = document.getElementById("admin-message");
  const campaignList = document.getElementById("campaign-list");
  const logout = document.getElementById("logout");
  const refresh = document.getElementById("refresh");
  if (!configured) { loginMessage.textContent = "Backend is not configured."; return; }
  const db = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  const esc = v => String(v ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));
  const prettyDate = v => v ? new Date(v).toLocaleString() : "—";
  const setMessage = (text, bad=false) => { adminMessage.textContent = text; adminMessage.className = "admin-message" + (bad ? " bad" : ""); };

  function showLoggedOut() { loginView.classList.remove("hidden"); dashboardView.classList.add("hidden"); logout.classList.add("hidden"); }
  function showLoggedIn() { loginView.classList.add("hidden"); dashboardView.classList.remove("hidden"); logout.classList.remove("hidden"); loadCampaigns(); }

  loginForm.addEventListener("submit", async e => {
    e.preventDefault(); loginMessage.textContent = "Signing in…";
    const { error } = await db.auth.signInWithPassword({ email: document.getElementById("login-email").value.trim(), password: document.getElementById("login-password").value });
    if (error) { loginMessage.textContent = error.message; return; }
    loginMessage.textContent = "";
    showLoggedIn();
  });

  logout.addEventListener("click", async () => { await db.auth.signOut(); showLoggedOut(); });
  refresh.addEventListener("click", loadCampaigns);

  async function loadCampaigns() {
    setMessage("Loading campaigns…");
    const { data, error } = await db.from("campaigns").select("*").order("created_at", { ascending: false });
    if (error) { setMessage(error.message, true); campaignList.innerHTML = ""; return; }
    if (!data?.length) { campaignList.innerHTML = '<div class="admin-card"><strong>No campaigns yet.</strong><p class="admin-muted">New submissions will appear here.</p></div>'; setMessage(""); return; }
    setMessage(`${data.length} campaign${data.length === 1 ? "" : "s"}`);
    campaignList.innerHTML = data.map(c => renderCampaign(c)).join("");
    campaignList.querySelectorAll("[data-action]").forEach(btn => btn.addEventListener("click", () => updateCampaign(btn.dataset.code, btn.dataset.action)));
  }

  function renderCampaign(c) {
    const d = c.details || {};
    const publicUrl = new URL(`campaign.html?id=${encodeURIComponent(c.campaign_code)}`, location.href).href;
    const status = c.status || "pending";
    return `<article class="admin-campaign">
      <div class="admin-campaign-top"><div><span class="admin-code">${esc(c.campaign_code)}</span><h2>${esc(c.brand)}</h2><p>${esc(c.category)}${c.network ? " · " + esc(c.network) : ""} · ${esc(c.email)}</p></div><span class="admin-status status-${esc(status)}">${esc(status).toUpperCase()}</span></div>
      ${c.logo_data ? `<img class="admin-logo" src="${esc(c.logo_data)}" alt="">` : ""}
      <div class="admin-details">${d.ca ? `<div><b>CA</b><code>${esc(d.ca)}</code></div>` : ""}${d.description ? `<div><b>Description</b><span>${esc(d.description)}</span></div>` : ""}${d.website ? `<div><b>Website</b><span>${esc(d.website)}</span></div>` : ""}<div><b>Submitted</b><span>${esc(prettyDate(c.created_at))}</span></div><div><b>Demo</b><span>${esc(prettyDate(c.demo_started_at))} → ${esc(prettyDate(c.demo_ends_at))}</span></div></div>
      <div class="admin-actions"><a class="button button-ghost" href="${esc(publicUrl)}" target="_blank" rel="noopener">View page ↗</a><button class="button" data-code="${esc(c.campaign_code)}" data-action="approved">Approve</button><button class="button button-primary" data-code="${esc(c.campaign_code)}" data-action="live">Start 3-day demo</button><button class="button button-ghost" data-code="${esc(c.campaign_code)}" data-action="expired">Expire</button></div>
    </article>`;
  }

  async function updateCampaign(code, action) {
    const updates = { status: action };
    if (action === "live") {
      const start = new Date();
      const end = new Date(start.getTime() + 3 * 24 * 60 * 60 * 1000);
      updates.status = "live"; updates.demo_started_at = start.toISOString(); updates.demo_ends_at = end.toISOString();
    }
    if (action === "expired") updates.campaign_ends_at = new Date().toISOString();
    setMessage(`Updating ${code}…`);
    const { error } = await db.from("campaigns").update(updates).eq("campaign_code", code);
    if (error) { setMessage(error.message, true); return; }
    await loadCampaigns();
  }

  db.auth.getSession().then(({ data }) => { if (data.session) showLoggedIn(); else showLoggedOut(); });
})();
