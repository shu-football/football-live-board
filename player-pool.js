// player-pool.js — 球员库管理
const PlayerPool = (() => {
  function makeId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return `p-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  // Add a single player
  function add(state, name, number, team) {
    if (!name || !team) return null;
    const jersey_number = number ? Number(number) : null;
    const p = { id: makeId(), player_name: name.trim(), jersey_number, team_name: team };
    state.players.push(p);
    return p;
  }

  // Remove a player by ID
  function remove(state, id) {
    state.players = state.players.filter((p) => p.id !== id);
  }

  // Deduplicate by name+team
  function dedupe(state) {
    const seen = new Map();
    state.players.forEach((p) => {
      const key = `${p.team_name}|${p.player_name}`;
      if (!seen.has(key)) seen.set(key, p);
    });
    state.players = [...seen.values()];
  }

  // Get players for a specific team
  function getByTeam(state, team) {
    return state.players.filter((p) => p.team_name === team);
  }

  // Get all unique team names from the player pool
  function getTeams(state) {
    return [...new Set(state.players.map((p) => p.team_name))].sort((a, b) => a.localeCompare(b, "zh-CN"));
  }

  // Parse Excel file using SheetJS. Returns [{name, number, team}]
  function parseExcelFile(file) {
    return new Promise((resolve, reject) => {
      if (typeof XLSX === "undefined") return reject(new Error("XLSX 库未加载，请刷新页面后重试。"));
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target.result, { type: "array" });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          if (rows.length < 2) return reject(new Error("Excel 文件为空或只有表头。"));
          // Try to detect columns: look for name/number/team in header
          const header = rows[0].map((h) => String(h || "").trim());
          const colMap = { name: -1, number: -1, team: -1 };
          header.forEach((h, i) => {
            const lower = h.toLowerCase();
            if (lower.includes("姓名") || lower.includes("名字") || lower.includes("name") || lower.includes("球员")) colMap.name = i;
            if (lower.includes("号码") || lower.includes("编号") || lower.includes("号") || lower.includes("number") || lower.includes("no")) colMap.number = i;
            if (lower.includes("球队") || lower.includes("队伍") || lower.includes("team") || lower.includes("学院")) colMap.team = i;
          });
          // If header detection fails, assume columns: 0=name, 1=number, 2=team
          if (colMap.name < 0) colMap.name = 0;
          if (colMap.team < 0) colMap.team = colMap.name >= 0 ? 2 : 0;
          if (colMap.number < 0 && colMap.name === 0 && colMap.team === 2) colMap.number = 1;

          const parsed = [];
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.every((c) => !c)) continue;
            const name = String(row[colMap.name] || "").trim();
            const number = row[colMap.number] !== undefined ? Number(row[colMap.number]) || null : null;
            const team = String(row[colMap.team] || "").trim();
            if (name && team) parsed.push({ name, number, team });
          }
          resolve(parsed);
        } catch (err) { reject(err); }
      };
      reader.onerror = () => reject(new Error("文件读取失败。"));
      reader.readAsArrayBuffer(file);
    });
  }

  // Parse pasted text. Supports tab/comma/space separated and quoted values.
  function parsePastedText(text) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    const parsed = [];
    for (const line of lines) {
      // Try tab-separated first
      let parts = line.split("\t");
      if (parts.length < 3) parts = line.split(",");
      if (parts.length < 3) parts = line.split(/\s{2,}/);
      if (parts.length < 2) continue;
      const name = (parts[0] || "").trim().replace(/^["']|["']$/g, "");
      const numStr = (parts[1] || "").trim();
      const number = numStr && /^\d+$/.test(numStr) ? Number(numStr) : null;
      const team = (parts[2] || "").trim().replace(/^["']|["']$/g, "");
      // If number field looks like text and team is empty, shift
      if (number === null && team) {
        // parts[1] might be team, no number
        if (name && team) parsed.push({ name, number: null, team });
      } else if (number !== null) {
        if (name && team) parsed.push({ name, number, team });
        // If no explicit team, parts[2] might be missing — use parts[1] as team if it looks like text
        else if (name && number && !team) {
          parsed.push({ name, number: null, team: String(parts[1] || "").trim() });
        }
      } else {
        // name + team only (no number)
        if (name && numStr) parsed.push({ name, number: null, team: numStr });
      }
    }
    return parsed;
  }

  // Render player table
  function render(state, containerSelector) {
    const tbody = document.querySelector(`${containerSelector} tbody`);
    if (!tbody) return;
    dedupe(state);
    const sorted = [...state.players].sort((a, b) => a.team_name.localeCompare(b.team_name, "zh-CN") || a.player_name.localeCompare(b.player_name, "zh-CN"));
    tbody.innerHTML = sorted.map((p) => `<tr>
      <td>${p.player_name}</td><td>${p.jersey_number != null ? p.jersey_number : "-"}</td><td>${p.team_name}</td>
      <td><button class="danger" data-action="remove-player" data-id="${p.id}">删除</button></td>
    </tr>`).join("") || '<tr><td colspan="4" style="color:#94a3b8;">暂无球员数据</td></tr>';
  }

  // Convert to cloud rows
  function toCloudRows(state) {
    return state.players.map((p) => ({
      id: p.id, player_name: p.player_name, jersey_number: p.jersey_number, team_name: p.team_name, season: state.currentSeason
    }));
  }

  return { add, remove, dedupe, getByTeam, getTeams, parseExcelFile, parsePastedText, render, toCloudRows };
})();
