
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  function setNav(open) {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navMenu.classList.toggle("is-open", open);
  }

  navToggle?.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") !== "true";
    setNav(open);
  });

  // Close menu when clicking a link (mobile)
  $$(".nav__link").forEach((link) => {
    link.addEventListener("click", () => setNav(false));
  });

  // Filters
  const filters = $$(".filter");
  const projects = $$(".project");
  function applyFilter(tag) {
    projects.forEach((p) => {
      const tags = (p.getAttribute("data-tags") || "").split(/\s+/);
      const show = tag === "all" ? true : tags.includes(tag);
      p.style.display = show ? "" : "none";
    });
  }

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyFilter(btn.dataset.filter || "all");
    });
  });

  // Case study modal
  const caseModal = $("#caseModal");
  const modalTitle = $("#modalTitle");
  const modalMeta = $("#modalMeta");
  const modalSummary = $("#modalSummary");
  const modalBullets = $("#modalBullets");
  const modalResults = $("#modalResults");

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    const mm = document.getElementById("modalMedia");
    const v = mm?.querySelector("video");
    if (v) v.pause();
    if (mm) mm.innerHTML = "";
  }

  function fillCaseFromCard(card) {
    if (!card) return;

    const title = card.getAttribute("data-title") || "Project Title";
    const role = card.getAttribute("data-role") || "Role";
    const tech = card.getAttribute("data-tech") || "Tech";
    const summary = card.getAttribute("data-summary") || "";
    const bullets = (card.getAttribute("data-bullets") || "").split("|").filter(Boolean);
    const results = (card.getAttribute("data-results") || "").split("|").filter(Boolean);   
    // Text
    if (modalTitle) modalTitle.textContent = title;
    if (modalMeta) modalMeta.textContent = `${role} · ${tech}`;
    if (modalSummary) modalSummary.textContent = summary;   
    if (modalBullets) {
      modalBullets.innerHTML = "";
      bullets.forEach((b) => {
        const li = document.createElement("li");
        li.textContent = b;
        modalBullets.appendChild(li);
      });
    }   
    if (modalResults) {
      modalResults.innerHTML = "";
      results.forEach((r) => {
        const li = document.createElement("li");
        li.textContent = r;
        modalResults.appendChild(li);
      });
    }   
    // ✅ Media (Modal)
    const modalMedia = document.getElementById("modalMedia");
    if (!modalMedia) return;    
    modalMedia.innerHTML = ""; // limpiar   
    const mediaType = card.getAttribute("data-media-type");   // "video" | "image"
    const mediaSrc = card.getAttribute("data-media-src");     // ruta
    const mediaPoster = card.getAttribute("data-media-poster") || "";   
    if (!mediaType || !mediaSrc) {
      // fallback si aún no has configurado media
      const div = document.createElement("div");
      div.className = "mediaPlaceholder mediaPlaceholder--big";
      div.innerHTML = "<span>Media coming soon</span>";
      modalMedia.appendChild(div);
      return;
    }   
    if (mediaType === "video") {
      // Inyectamos HTML directo (más confiable que createElement en algunos casos)
      modalMedia.innerHTML = `
        <video class="modalMedia__item" controls playsinline preload="metadata" ${mediaPoster ? `poster="${mediaPoster}"` : ""}>
          <source src="${mediaSrc}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
    } else {
      modalMedia.innerHTML = `
        <img class="modalMedia__item" src="${mediaSrc}" alt="${title} media">
      `;
    }
}

  // Open modal on button click
  projects.forEach((card) => {
    const openBtn = $('[data-open="modal"]', card);
    openBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Opening modal for:", card.getAttribute("data-title"));
      fillCaseFromCard(card);
      openModal(caseModal);
    });

    // Also allow Enter key on focused card
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        console.log("Opening modal for:", card.getAttribute("data-title"));
        fillCaseFromCard(card);
        openModal(caseModal);
      }
    });
  });

  // Close modal actions
  $$("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-close");
      if (type === "modal") closeModal(caseModal);
    });
  });

  // ESC closes modals
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeModal(caseModal);
    setNav(false);
  });


  // Copy email
  function wireCopy(btn) {
    if (!btn) return;
    btn.addEventListener("click", async () => {
      const email = btn.getAttribute("data-email") || "";
      if (!email) return;

      try {
        await navigator.clipboard.writeText(email);
        const old = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = old), 900);
      } catch {
        // fallback
        window.prompt("Copy email:", email);
      }
    });
  }

  wireCopy($("#copyEmailBtn"));
  wireCopy($("#copyEmailBtn2"));
})();
