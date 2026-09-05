(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
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
  const cryptoFields = (network) => `<div class="crypto-network-picked"><span class="network-dot ${cryptoNetworks[network].dot}"></span><strong>${cryptoNetworks[network].name}</strong></div><label><span>Project logo <em>optional</em></span><input name="projectLogo" type="file" accept="image/png,image/jpeg,image/webp"></label><div class="field-grid"><label><span>CA / Contract Address <em>optional</em></span><input name="ca" type="text" maxlength="160" placeholder="Token contract address"></label><label><span>DEX / trading link <em>optional</em></span><input name="dex" type="url" placeholder="https://..."></label></div><div class="field-grid"><label><span>X / Twitter <em>optional</em></span><input name="x" type="url" placeholder="https://x.com/..."></label><label><span>Telegram / Discord <em>optional</em></span><input name="community" type="text" maxlength="160" placeholder="Community link"></label></div><label><span>Website <em>optional</em></span><input name="website" type="url" placeholder="https://example.com"></label><label><span>Project description <em>optional</em></span><textarea name="description" rows="3" maxlength="300" placeholder="Tell people what the project does..."></textarea></label><button type="button" class="form-back" id="crypto-back">← Change network</button>`;

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

  categoryForm?.addEventListener("submit", e => {
    e.preventDefault();
    if (!categoryForm.checkValidity()) { categoryForm.reportValidity(); return; }
    const brand = $("#form-brand").value.trim(), email = $("#form-email").value.trim(), category = formCategory.value;
    categoryMessage.innerHTML = `<strong>Submitted.</strong> ${brand} is ready for review. If approved, the 3-day demo will start. We’ll use ${email} for campaign reminders when email automation is connected.`;
    categoryForm.querySelector(".full-button").textContent = "Submitted ✓";
    categoryForm.querySelector(".full-button").disabled = true;
    console.info("GYBS demo request", { category, brand, email });
  });

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

  $("#txn-form")?.addEventListener("submit", e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const message = $("#txn-message");
    message.innerHTML = `<strong>Submitted.</strong> Your transaction details have been recorded for confirmation. Automatic verification is not connected yet.`;
    form.querySelector(".full-button").textContent = "Submitted ✓";
    form.querySelector(".full-button").disabled = true;
    console.info("GYBS transaction confirmation", Object.fromEntries(new FormData(form).entries()));
  });

  window.GYBS = { openPayment: () => openModal("#payment-modal") };
})();
