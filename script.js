(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-button");
  const navLinks = document.querySelector(".nav-links");
  const categoryButtons = document.querySelectorAll("[data-category]");
  const categorySelect = document.querySelector("#category");
  const form = document.querySelector("#advertise-form");
  const formMessage = document.querySelector("#form-message");
  const year = document.querySelector("#year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");
      if (categorySelect && category) {
        categorySelect.value = category;
        document.querySelector("#advertise")?.scrollIntoView({ behavior: "smooth" });
        window.setTimeout(() => document.querySelector("#brand")?.focus(), 450);
      }
    });
  });

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const category = data.get("category");
      const brand = data.get("brand");

      formMessage.textContent =
        `Thanks — ${brand} is ready for the ${String(category).replace("-", " ")} advertising flow. ` +
        "The backend and crypto payment step will be connected next.";

      formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }
})();
