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

  const modals = $$(".modal");
  const openModal = (id) => { const m = $(id); if (!m) return; m.classList.add("open"); m.setAttribute("aria-hidden", "false"); document.body.classList.add("modal-open"); };
  const closeModal = (m) => { m?.classList.remove("open"); m?.setAttribute("aria-hidden", "true"); if (!$(".modal.open")) document.body.classList.remove("modal-open"); };
  $$('[data-open-learn]').forEach(b => b.addEventListener("click", () => openModal("#learn-modal")));
  $$('[data-close-modal]').forEach(b => b.addEventListener("click", () => closeModal(b.closest(".modal"))));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal($(".modal.open")); });

  const categoryData = {
    business: {
      title: "Business advertising", intro: "Promote a shop, service, product or brand. Only the basics are required.",
      fields: `<div class="field-grid"><label><span>Website <em>optional</em></span><input name="website" type="url" placeholder="https://example.com"></label><label><span>Contact / social <em>optional</em></span><input name="social" type="text" maxlength="160" placeholder="Instagram, Telegram, phone, etc."></label></div><label><span>Business description <em>optional</em></span><textarea name="description" rows="3" maxlength="300" placeholder="What do you offer?"></textarea></label>`
    },
    website: {
      title: "Website advertising", intro: "Put your website, store, blog or community in front of new visitors.",
      fields: `<label><span>Website URL <em>optional</em></span><input name="website" type="url" placeholder="https://example.com"></label><div class="field-grid"><label><span>Social / community <em>optional</em></span><input name="social" type="text" maxlength="160" placeholder="X, Telegram, Discord, etc."></label><label><span>Short description <em>optional</em></span><input name="description" type="text" maxlength="300" placeholder="What is the site about?"></label></div>`
    },
    crypto: {
      title: "Crypto advertising", intro: "Promote a token or Web3 project. CA, DEX and socials are all optional.",
      fields: `<label><span>Website <em>optional</em></span><input name="website" type="url" placeholder="https://example.com"></label><div class="field-grid"><label><span>Contract Address / CA <em>optional</em></span><input name="ca" type="text" maxlength="160" placeholder="Token contract address"></label><label><span>DEX / trading link <em>optional</em></span><input name="dex" type="url" placeholder="https://.../"></label></div><div class="field-grid"><label><span>X / Twitter <em>optional</em></span><input name="x" type="url" placeholder="https://x.com/..."></label><label><span>Telegram / Discord <em>optional</em></span><input name="community" type="text" maxlength="160" placeholder="Community link"></label></div><label><span>Project description <em>optional</em></span><textarea name="description" rows="3" maxlength="300" placeholder="Tell people what the project does..."></textarea></label>`
    },
    ai: {
      title: "AI & Apps advertising", intro: "Promote an AI tool, mobile app, SaaS product or software launch.",
      fields: `<div class="field-grid"><label><span>Website / landing page <em>optional</em></span><input name="website" type="url" placeholder="https://example.com"></label><label><span>Download / store link <em>optional</em></span><input name="download" type="url" placeholder="App Store, Play Store, etc."></label></div><div class="field-grid"><label><span>Social link <em>optional</em></span><input name="social" type="url" placeholder="https://..."></label><label><span>Short description <em>optional</em></span><input name="description" type="text" maxlength="300" placeholder="What does the app do?"></label></div>`
    }
  };

  const categoryModal = $("#category-modal"), categoryFields = $("#category-fields"), categoryTitle = $("#category-title"), categoryIntro = $("#category-intro"), formCategory = $("#form-category"), categoryForm = $("#category-form"), categoryMessage = $("#category-message");
  function showCategory(category) {
    const d = categoryData[category]; if (!d) return;
    formCategory.value = category; categoryTitle.textContent = d.title; categoryIntro.textContent = d.intro; categoryFields.innerHTML = d.fields; categoryMessage.textContent = "";
    openModal("#category-modal");
    setTimeout(() => $("#form-brand")?.focus(), 80);
  }
  $$('[data-category]').forEach(b => b.addEventListener("click", () => showCategory(b.dataset.category)));

  categoryForm?.addEventListener("submit", e => {
    e.preventDefault();
    if (!categoryForm.checkValidity()) { categoryForm.reportValidity(); return; }
    const brand = $("#form-brand").value.trim(), email = $("#form-email").value.trim(), category = formCategory.value;
    categoryMessage.innerHTML = `<strong>Submitted.</strong> ${brand} is ready for review. If approved, the 3-day demo will start and the campaign email will be used for reminders.`;
    categoryForm.querySelector(".full-button").textContent = "Submitted ✓";
    categoryForm.querySelector(".full-button").disabled = true;
    // This is intentionally UI-only until a backend/email service is connected.
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

  // Allow a future backend/payment button to open the payment layer without changing the UI code.
  window.GYBS = { openPayment: () => openModal("#payment-modal") };
})();
