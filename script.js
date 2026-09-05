(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  const menuButton = $(".menu-button"), navLinks = $(".nav-links");
  menuButton?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  const openModal = (id) => { const m = $(id); if (!m) return; m.classList.add("open"); m.setAttribute("aria-hidden", "false"); document.body.classList.add("modal-open"); };
  const closeModal = (m) => { m?.classList.remove("open"); m?.setAttribute("aria-hidden", "true"); if (!$('.modal.open')) document.body.classList.remove("modal-open"); };
  $$('[data-open-learn]').forEach(b => b.addEventListener("click", () => openModal("#learn-modal")));
  $$('[data-close-modal]').forEach(b => b.addEventListener("click", () => closeModal(b.closest(".modal"))));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal($(".modal.open")); });

  const categoryData = {
    crypto: { title: "Crypto advertising", intro: "Choose a network, then add the project details you want displayed.", networkChooser: true },
    business: {
      title: "Business advertising", intro: "Promote a shop, service, product or brand. Only the basics are required.",
      fields: `<div class="field-grid"><label><span>Website <em>optional</em></span><input name="website" type="url" placeholder="https://example.com"></label><label><span>Contact / social <em>optional</em></span><input name="social" type="text" maxlength="160" placeholder="Instagram, phone, etc."></label></div><label><span>Business description <em>optional</em></span><textarea name="description" rows="3" maxlength="300" placeholder="What do you offer?"></textarea></label>`
    },
    website: {
      title: "Websites & Apps advertising", intro: "Promote a website, store, app, SaaS product or online service.",
      fields: `<div class="field-grid"><label><span>Website / landing page <em>optional</em></span><input name="website" type="url" placeholder="https://example.com"></label><label><span>Download / store link <em>optional</em></span><input name="download" type="url" placeholder="App Store, Play Store, etc."></label></div><div class="field-grid"><label><span>Social / community <em>optional</em></span><input name="social" type="text" maxlength="160" placeholder="X, Instagram, Discord, etc."></label><label><span>Short description <em>optional</em></span><input name="description" type="text" maxlength="300" placeholder="What is it about?"></label></div>`
    },
    socials: {
      title: "Socials advertising", intro: "Promote a Telegram, X, Discord, Instagram, YouTube or another social account.",
      fields: `<div class="field-grid"><label><span>Platform <em>optional</em></span><select name="platform"><option value="">Choose platform</option><option>Telegram channel / group</option><option>X / Twitter</option><option>Discord server</option><option>Instagram</option><option>YouTube</option><option>Other</option></select></label><label><span>Profile / channel link <em>optional</em></span><input name="profileLink" type="url" placeholder="https://..."></label></div><label><span>Community / account name <em>optional</em></span><input name="communityName" type="text" maxlength="120" placeholder="Your channel or account name"></label><label><span>Short description <em>optional</em></span><textarea name="description" rows="3" maxlength="300" placeholder="What should people know?"></textarea></label>`
    }
  };

  const cryptoNetworks = {
    solana: { name: "Solana", dot: "purple" },
    robinhood: { name: "Robinhood", dot: "green" },
    ethereum: { name: "Ethereum", dot: "white" },
    base: { name: "Base", dot: "blue" }
  };
  const cryptoFields = (network) => `<input type="hidden" name="network" value="${cryptoNetworks[network].name}"><div class="crypto-network-picked"><span class="network-dot ${cryptoNetworks[network].dot}"></span><strong>${cryptoNetworks[network].name}</strong></div><label><span>Project logo <em>optional</em></span><input name="projectLogo" type="file" accept="image/png,image/jpeg,image/webp"></label><div class="field-grid"><label><span>CA / Contract Address <em>optional</em></span><input name="ca" type="text" maxlength="160" placeholder="Token contract address"></label><label><span>DEX / trading link <em>optional</em></span><input name="dex" type="url" placeholder="https://..."></label></div><div class="field-grid"><label><span>X / Twitter <em>optional</em></span><input name="x" type="url" placeholder="https://x.com/..."></label><label><span>Telegram / Discord <em>optional</em></span><input name="community" type="text" maxlength="160" placeholder="Community link"></label></div><label><span>Website <em>optional</em></span><input name="website" type="url" placeholder="https://example.com"></label><label><span>Project description <em>optional</em></span><textarea name="description" rows="3" maxlength="300" placeholder="Tell people what the project does..."></textarea></label><button type="button" class="form-back" id="crypto-back">← Change network</button>`;

  const categoryFields = $("#category-fields"), categoryTitle = $("#category-title"), categoryIntro = $("#category-intro"), formCategory = $("#form-category"), categoryForm = $("#category-form"), categoryMessage = $("#category-message");
  function showCategory(category) {
    const d = categoryData[category]; if (!d) return;
    formCategory.value = category; categoryTitle.textContent = d.title; categoryIntro.textContent = d.intro; categoryMessage.textContent = "";
    categoryForm.querySelector(".full-button").disabled = false; categoryForm.querySelector(".full-button").textContent = "Submit for review ↗";
    if (d.networkChooser) {
      categoryFields.innerHTML = `<div class="crypto-network-grid">${Object.entries(cryptoNetworks).map(([key, n]) => `<button type="button" class="crypto-network-button" data-network="${key}"><span class="network-dot ${n.dot}"></span>${n.name}</button>`).join("")}</div><div class="crypto-network-help">Choose one to continue.</div>`;
      $$('[data-network]', categoryFields).forEach(btn => btn.addEventListener("click", () => {
        categoryFields.innerHTML = cryptoFields(btn.dataset.network);
        categoryIntro.textContent = `${cryptoNetworks[btn.dataset.network].name} project details. Add only what you want displayed.`;
        $("#crypto-back")?.addEventListener("click", () => showCategory("crypto"));
      }));
    } else categoryFields.innerHTML = d.fields;
    openModal("#category-modal");
    setTimeout(() => $("#form-brand")?.focus(), 80);
  }
  $$('[data-category]').forEach(b => b.addEventListener("click", () => showCategory(b.dataset.category)));

  const cfg = window.GYBS_CONFIG || {};
  const backendConfigured = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_URL.startsWith("YOUR_") && !cfg.SUPABASE_ANON_KEY.startsWith("YOUR_") && window.supabase;
  const db = backendConfigured ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
  const makeCode = () => "GYBS-" + Math.random().toString(36).slice(2, 7).toUpperCase() + Math.floor(Math.random() * 10);
  const readImage = (file) => new Promise((resolve) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 500, scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(img.width * scale)); canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", .78));
      };
      img.onerror = () => resolve(null); img.src = reader.result;
    };
    reader.onerror = () => resolve(null); reader.readAsDataURL(file);
  });
  const cleanDetails = (formData) => {
    const details = {};
    for (const [key, value] of formData.entries()) if (key !== "brand" && key !== "email" && key !== "category" && key !== "projectLogo") details[key] = String(value).trim();
    return details;
  };

  categoryForm?.addEventListener("submit", async e => {
    e.preventDefault();
    if (!categoryForm.checkValidity()) { categoryForm.reportValidity(); return; }
    const button = categoryForm.querySelector(".full-button");
    const brand = $("#form-brand").value.trim(), email = $("#form-email").value.trim(), category = formCategory.value;
    const fd = new FormData(categoryForm);
    const networkName = category === "crypto" ? (fd.get("network") || $(".crypto-network-picked strong")?.textContent || "") : null;
    const logo = await readImage(fd.get("projectLogo"));
    const campaignCode = makeCode();
    const details = cleanDetails(fd);
    if (category === "crypto") details.network = networkName;
    if (!db) {
      categoryMessage.innerHTML = `<strong>Backend not connected yet.</strong> Add your Supabase settings to <code>config.js</code>, then submit again.`;
      return;
    }
    button.disabled = true; button.textContent = "Saving…";
    const { error } = await db.from("campaigns").insert({ campaign_code: campaignCode, brand, email, category, network: networkName || null, details, logo_data: logo, status: "pending" });
    if (error) {
      console.error(error); categoryMessage.innerHTML = `<strong>Couldn’t save.</strong> ${error.message}`; button.disabled = false; button.textContent = "Submit for review ↗"; return;
    }
    const url = new URL("campaign.html", location.href); url.searchParams.set("id", campaignCode);
    categoryMessage.innerHTML = `<strong>Submitted ✓</strong><br>Your campaign ID is <code>${campaignCode}</code>.<br><a href="${url.href}" target="_blank" rel="noopener">Open campaign page ↗</a><br><small>It stays private to the public until an admin changes its status to approved/live.</small>`;
    button.textContent = "Submitted ✓";
  });

  const liveCampaignList = $("#live-campaign-list");
  const loadLiveCampaigns = async () => {
    if (!liveCampaignList) return;
    if (!db) {
      liveCampaignList.innerHTML = '<div class="live-empty"><strong>Live ads are unavailable.</strong><span>Connect the GYBS backend to load campaigns.</span></div>';
      return;
    }
    const { data, error } = await db.from("campaigns").select("campaign_code,brand,category,network,details,logo_data").eq("status", "live").order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      liveCampaignList.innerHTML = '<div class="live-empty"><strong>Couldn’t load live campaigns.</strong><span>Please try again in a moment.</span></div>';
      return;
    }
    if (!data?.length) {
      liveCampaignList.innerHTML = '<div class="live-empty"><strong>No live campaigns yet.</strong><span>Approved campaigns will appear here when their 3-day demo starts.</span></div>';
      return;
    }
    liveCampaignList.innerHTML = data.map(c => {
      const d = c.details || {};
      const url = new URL("campaign.html", location.href);
      url.searchParams.set("id", c.campaign_code);
      const description = d.description || "Live campaign on GYBS.";
      return `<article class="live-campaign-card">
        <div class="live-card-top">
          <span class="live-pill"><span class="status-dot"></span>LIVE</span>
          <span class="live-category">${esc(c.category)}${c.network ? ` · ${esc(c.network)}` : ""}</span>
        </div>
        <div class="live-brand-row">
          ${c.logo_data ? `<img class="live-campaign-logo" src="${esc(c.logo_data)}" alt="${esc(c.brand)} logo">` : `<div class="live-campaign-logo live-logo-placeholder" aria-hidden="true">${esc(String(c.brand || "G").slice(0,1).toUpperCase())}</div>`}
          <div><h3>${esc(c.brand)}</h3><p>${esc(description)}</p></div>
        </div>
        ${d.ca ? `<div class="live-ca"><span>CA</span><code>${esc(d.ca)}</code></div>` : ""}
        <a class="live-card-link" href="${esc(url.href)}">View campaign ↗</a>
      </article>`;
    }).join("");
  };
  loadLiveCampaigns();

  const paymentTabs = $$(".payment-tab"), paymentPanels = $$(".payment-panel");
  paymentTabs.forEach(tab => tab.addEventListener("click", () => {
    const network = tab.dataset.payment;
    paymentTabs.forEach(t => t.classList.toggle("active", t === tab));
    paymentPanels.forEach(p => p.hidden = p.dataset.paymentPanel !== network);
  }));
  $$(".copy-wallet").forEach(btn => btn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = "Copied ✓"; setTimeout(() => btn.textContent = "Copy", 1500); }
    catch { btn.textContent = "Copy manually"; }
  }));

  $("#txn-form")?.addEventListener("submit", async e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const message = $("#txn-message"), button = form.querySelector(".full-button");
    if (!db) { message.innerHTML = `<strong>Backend not connected yet.</strong> Add your Supabase settings to <code>config.js</code>.`; return; }
    const fd = new FormData(form); let screenshot = null;
    const file = fd.get("screenshot");
    if (file && file.size) screenshot = await readImage(file);
    button.disabled = true; button.textContent = "Saving…";
    const { error } = await db.from("transaction_confirmations").insert({ email: fd.get("email"), campaign: fd.get("brand"), payment_network: fd.get("network"), tx_hash: fd.get("txid"), screenshot_data: screenshot });
    if (error) { message.innerHTML = `<strong>Couldn’t save.</strong> ${error.message}`; button.disabled = false; button.textContent = "Submit Transaction for Confirmation"; return; }
    message.innerHTML = `<strong>Submitted ✓</strong> Your transaction confirmation has been sent for review.`;
    button.textContent = "Submitted ✓";
  });

  window.GYBS = { openPayment: () => openModal("#payment-modal") };
})();
