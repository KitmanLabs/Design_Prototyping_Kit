function initials(name) {
  const parts = name.split(",").map(s => s.trim());
  const last = parts[0] || "";
  const first = parts[1] || "";
  return ((first[0] || "") + (last[0] || "")).toUpperCase();
}

function cardiacChip(status) {
  if (status === "outstanding") {
    return `<span class="chip chip-warning"><span class="material-icons-outlined chip-icon">warning</span>Outstanding</span>`;
  }
  return `<span class="chip chip-success">Cleared</span>`;
}

function allergyChip(a) {
  const cls = a.severity === "severe" ? "chip-error" : a.severity === "moderate" ? "chip-warning" : "chip-neutral";
  return `<span class="chip ${cls}">${a.label}</span>`;
}

function injuryRow(injury) {
  const barClass = injury.severity === "active" ? "bar-active" : "bar-resolved";
  return `
    <div class="injury-entry">
      <span class="injury-bar ${barClass}"></span>
      <div class="injury-text">
        <div class="injury-title">${injury.date} - ${injury.title}</div>
        <div class="injury-status">${injury.status}</div>
      </div>
    </div>
  `;
}

function renderRow(player, index) {
  const avatar = player.photo
    ? `<div class="avatar avatar-photo"></div>`
    : `<div class="avatar avatar-placeholder"><span class="material-icons-outlined">person</span></div>`;

  const injuries = player.injuries.length
    ? player.injuries.map(injuryRow).join("")
    : `<span class="cell-muted">No open injuries</span>`;

  const allergies = player.allergies.length
    ? player.allergies.map(allergyChip).join("")
    : `<span class="cell-muted">—</span>`;

  const note = player.latestNote
    ? `<div class="note-date">${player.latestNote.date} - ${player.latestNote.label}</div>
       <div class="note-text">${player.latestNote.text}</div>`
    : `<span class="cell-muted">—</span>`;

  return `
    <tr data-row-index="${index}">
      <td class="col-select"><input type="checkbox" class="row-select" data-row-index="${index}" aria-label="Select ${player.name}" /></td>
      <td class="col-player">
        <div class="player-cell">
          ${avatar}
          <div>
            <div class="player-name">${player.name}</div>
            <div class="player-position">${player.number ? player.number + " · " : ""}${player.position}</div>
          </div>
        </div>
      </td>
      <td class="col-injury">${injuries}</td>
      <td class="col-note">${note}</td>
      <td class="col-cardiac">${cardiacChip(player.cardiac)}</td>
      <td class="col-allergies">${allergies}</td>
      <td class="col-roster"><span class="chip chip-neutral">${player.roster}</span></td>
      <td class="col-menu">
        <div class="row-menu-wrap">
          <button class="icon-btn row-menu-btn" data-row-index="${index}" aria-haspopup="true" aria-expanded="false"><span class="material-icons-outlined">more_vert</span></button>
        </div>
      </td>
    </tr>
  `;
}

document.getElementById("roster-body").innerHTML = ROSTER_DATA.map(renderRow).join("");
