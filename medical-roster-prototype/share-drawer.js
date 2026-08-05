// Share profile workflow — mirrors src/components/ShareProfileDrawer.jsx pattern
// (row menu -> single share, checkbox selection -> bulk share, same drawer, same confirmation behaviour).
(function () {
  const PHYSICIANS = ["Dr. Sarah Chen", "Dr. Amara Okafor", "Dr. Liam Fitzgerald", "Dr. Priya Nair"];
  const ORGANIZATIONS = ["City General Hospital", "Sportsmed Clinic", "National Performance Institute"];
  const INFO_CATEGORIES = ["Medical history", "Imaging", "Assessment reports", "Treatment notes"];

  const overlay = document.getElementById("share-drawer-overlay");
  const body = document.getElementById("share-drawer-body");
  const closeBtn = document.getElementById("share-drawer-close");
  const cancelBtn = document.getElementById("share-drawer-cancel");
  const submitBtn = document.getElementById("share-drawer-submit");
  const bulkBar = document.getElementById("bulk-action-bar");
  const bulkCount = document.getElementById("bulk-action-count");
  const bulkShareBtn = document.getElementById("bulk-share-btn");
  const snackbar = document.getElementById("share-snackbar");
  const selectAll = document.getElementById("select-all");

  const selected = new Set();
  let drawerAthletes = [];
  let state = { physician: "", organization: "", reason: "", categories: {} };
  let openMenuIndex = null;

  function closeRowMenus() {
    document.querySelectorAll(".row-menu-dropdown").forEach((el) => el.remove());
    document.querySelectorAll(".row-menu-btn").forEach((btn) => btn.setAttribute("aria-expanded", "false"));
    openMenuIndex = null;
  }

  function updateBulkBar() {
    if (selected.size > 0) {
      bulkBar.hidden = false;
      bulkCount.textContent = `${selected.size} athlete${selected.size > 1 ? "s" : ""} selected`;
    } else {
      bulkBar.hidden = true;
    }
    selectAll.checked = selected.size > 0 && selected.size === ROSTER_DATA.length;
  }

  function renderDrawer() {
    const isBulk = drawerAthletes.length > 1;
    let summaryHtml;
    if (isBulk) {
      const avatars = drawerAthletes.slice(0, 4).map((a) => `<div class="avatar avatar-placeholder share-drawer-stack-avatar"><span class="material-icons-outlined">person</span></div>`).join("");
      summaryHtml = `
        <div class="share-drawer-summary">
          <div class="share-drawer-avatar-stack">${avatars}</div>
          <div>
            <div class="share-drawer-summary-title">${drawerAthletes.length} athletes selected</div>
            <div class="share-drawer-summary-sub">${drawerAthletes.map((a) => a.name).join(", ")}</div>
          </div>
        </div>
      `;
    } else {
      const a = drawerAthletes[0];
      summaryHtml = a
        ? `
        <div class="share-drawer-summary">
          <div class="avatar avatar-placeholder"><span class="material-icons-outlined">person</span></div>
          <div>
            <div class="share-drawer-summary-title">${a.name}</div>
            <div class="share-drawer-summary-sub">${a.position}</div>
          </div>
        </div>
      `
        : "";
    }

    body.innerHTML = `
      ${summaryHtml}
      <div class="share-drawer-label">Recipient</div>
      <div class="filter-field share-drawer-select" data-field="physician">
        <span>${state.physician || "Physician"}</span>
        <span class="material-icons-outlined">expand_more</span>
      </div>
      <div class="filter-field share-drawer-select" data-field="organization">
        <span>${state.organization || "Organization"}</span>
        <span class="material-icons-outlined">expand_more</span>
      </div>
      <textarea class="share-drawer-textarea" id="share-reason" placeholder="Reason for sharing (optional)">${state.reason}</textarea>
      <div class="share-drawer-label">Information to include</div>
      <div class="share-drawer-checkboxes">
        ${INFO_CATEGORIES.map(
          (cat) => `
          <label class="share-drawer-checkbox">
            <input type="checkbox" data-category="${cat}" ${state.categories[cat] ? "checked" : ""} />
            <span>${cat}</span>
          </label>
        `
        ).join("")}
      </div>
    `;

    body.querySelectorAll(".share-drawer-select").forEach((el) => {
      el.addEventListener("click", () => openSelectMenu(el));
    });
    body.querySelector("#share-reason").addEventListener("input", (e) => {
      state.reason = e.target.value;
    });
    body.querySelectorAll("[data-category]").forEach((cb) => {
      cb.addEventListener("change", (e) => {
        state.categories[e.target.dataset.category] = e.target.checked;
        updateSubmitEnabled();
      });
    });

    updateSubmitEnabled();
  }

  function openSelectMenu(el) {
    document.querySelectorAll(".share-drawer-dropdown").forEach((d) => d.remove());
    const field = el.dataset.field;
    const options = field === "physician" ? PHYSICIANS : ORGANIZATIONS;
    const dropdown = document.createElement("div");
    dropdown.className = "share-drawer-dropdown";
    dropdown.innerHTML = options.map((opt) => `<div class="share-drawer-dropdown-item">${opt}</div>`).join("");
    el.appendChild(dropdown);
    dropdown.querySelectorAll(".share-drawer-dropdown-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        state[field] = item.textContent;
        dropdown.remove();
        renderDrawer();
      });
    });
    setTimeout(() => {
      document.addEventListener(
        "click",
        function handler(e) {
          if (!dropdown.contains(e.target)) {
            dropdown.remove();
            document.removeEventListener("click", handler);
          }
        },
        { once: true }
      );
    }, 0);
  }

  function updateSubmitEnabled() {
    const canContinue = state.physician && state.organization && Object.values(state.categories).some(Boolean);
    submitBtn.disabled = !canContinue;
  }

  function openDrawer(athletes) {
    drawerAthletes = athletes;
    state = { physician: "", organization: "", reason: "", categories: {} };
    renderDrawer();
    overlay.hidden = false;
  }

  function closeDrawer() {
    overlay.hidden = true;
  }

  function showSnackbar(message) {
    snackbar.textContent = message;
    snackbar.hidden = false;
    clearTimeout(showSnackbar._t);
    showSnackbar._t = setTimeout(() => {
      snackbar.hidden = true;
    }, 3000);
  }

  function handleShare() {
    const count = drawerAthletes.length;
    closeDrawer();
    selected.clear();
    document.querySelectorAll(".row-select").forEach((cb) => (cb.checked = false));
    updateBulkBar();
    showSnackbar(`Profile shared for ${count} athlete${count > 1 ? "s" : ""}`);
  }

  closeBtn.addEventListener("click", closeDrawer);
  cancelBtn.addEventListener("click", closeDrawer);
  submitBtn.addEventListener("click", handleShare);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeDrawer();
  });

  bulkShareBtn.addEventListener("click", () => {
    const athletes = Array.from(selected).map((i) => ROSTER_DATA[i]);
    openDrawer(athletes);
  });

  selectAll.addEventListener("change", () => {
    selected.clear();
    if (selectAll.checked) {
      ROSTER_DATA.forEach((_, i) => selected.add(i));
    }
    document.querySelectorAll(".row-select").forEach((cb) => {
      cb.checked = selectAll.checked;
    });
    updateBulkBar();
  });

  document.getElementById("roster-body").addEventListener("change", (e) => {
    if (e.target.classList.contains("row-select")) {
      const idx = Number(e.target.dataset.rowIndex);
      if (e.target.checked) selected.add(idx);
      else selected.delete(idx);
      updateBulkBar();
    }
  });

  document.getElementById("roster-body").addEventListener("click", (e) => {
    const menuBtn = e.target.closest(".row-menu-btn");
    if (!menuBtn) return;
    e.stopPropagation();
    const idx = Number(menuBtn.dataset.rowIndex);
    if (openMenuIndex === idx) {
      closeRowMenus();
      return;
    }
    closeRowMenus();
    openMenuIndex = idx;
    menuBtn.setAttribute("aria-expanded", "true");
    const dropdown = document.createElement("div");
    dropdown.className = "row-menu-dropdown";
    dropdown.innerHTML = `<div class="row-menu-item" id="row-menu-share">Share profile</div>`;
    menuBtn.parentElement.appendChild(dropdown);
    dropdown.querySelector("#row-menu-share").addEventListener("click", (ev) => {
      ev.stopPropagation();
      closeRowMenus();
      openDrawer([ROSTER_DATA[idx]]);
    });
  });

  document.addEventListener("click", closeRowMenus);

  updateBulkBar();
})();
