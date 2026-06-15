const STORAGE_KEY_PREFIX = "football_live_board_state_v4";
const SEASONS_LIST_KEY = "football_live_board_seasons";

function storageKey(season) { return `${STORAGE_KEY_PREFIX}_${season}`; }

function getKnownSeasons() {
  try {
    const raw = localStorage.getItem(SEASONS_LIST_KEY);
    return raw ? JSON.parse(raw) : ["2026"];
  } catch { return ["2026"]; }
}

function saveKnownSeasons(list) {
  localStorage.setItem(SEASONS_LIST_KEY, JSON.stringify(list));
}

function migrateV3toV4() {
  const oldData = localStorage.getItem("football_live_board_state_v3");
  if (!oldData) return;
  const newKey = storageKey("2026");
  if (localStorage.getItem(newKey)) return;
  localStorage.setItem(newKey, oldData);
}

// 1) 在 Supabase 项目 -> Settings -> API 里复制
// 2) 前端只放 anon key，不要放 service_role key
const SUPABASE_URL = "https://ptazgpifirvgadacirxe.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_EEcva3sroZE2Nd_5irNJUA_b6QLCdPI";
const ADMIN_EMAILS = ["w2564139064@163.com"]; // fallback for local mode

const TEAM_ALIASES = {
  文体法: "文法体",
  文法体: "文法体",
  国教: "国交",
  国交: "国交",
  延长联: "延长",
  悉商: "悉商"
};

const CONFIG = {
  groups: {
    A: ["材料", "计算机", "机自", "力工", "中欧", "延长", "悉商"],
    B: ["未来技术", "管外生", "文法体", "国交", "钱院", "通济", "理学院"]
  },
  knockoutMatches: [
    // 8进4
    { id: "QF1", round: "QF", homeSeed: "A1", awaySeed: "B4", date: "2026-05-11", score: null, penalty: null },
    { id: "QF2", round: "QF", homeSeed: "A3", awaySeed: "B2", date: "2026-05-12", score: null, penalty: null },
    { id: "QF3", round: "QF", homeSeed: "B1", awaySeed: "A4", date: "2026-05-13", score: null, penalty: null },
    { id: "QF4", round: "QF", homeSeed: "B3", awaySeed: "A2", date: "2026-05-14", score: null, penalty: null },
    // 半决赛
    { id: "SF1", round: "SF", homeFrom: "QF1-winner", awayFrom: "QF2-winner", date: "2026-05-18", score: null, penalty: null },
    { id: "SF2", round: "SF", homeFrom: "QF3-winner", awayFrom: "QF4-winner", date: "2026-05-20", score: null, penalty: null },
    // 季军赛
    { id: "Third", round: "Third", homeFrom: "SF1-loser", awayFrom: "SF2-loser", date: "2026-05-27", score: null, penalty: null },
    // 决赛
    { id: "Final", round: "Final", homeFrom: "SF1-winner", awayFrom: "SF2-winner", date: "2026-05-29", score: null, penalty: null }
  ],
  matches: [
    { id: "A-R1-1", date: "2026-03-23", round: 1, group: "A", home: "计算机", away: "悉商", score: [0, 3] },
    { id: "B-R1-1", date: "2026-03-23", round: 1, group: "B", home: "管外生", away: "文法体", score: [1, 7] },
    { id: "A-R1-2", date: "2026-03-25", round: 1, group: "A", home: "机自", away: "力工", score: [5, 0] },
    { id: "B-R1-2", date: "2026-03-25", round: 1, group: "B", home: "国交", away: "钱院", score: [0, 3] },
    { id: "A-R1-3", date: "2026-03-27", round: 1, group: "A", home: "中欧", away: "延长", score: [7, 0] },
    { id: "B-R1-3", date: "2026-03-27", round: 1, group: "B", home: "通济", away: "理学院", score: [0, 4] },
    { id: "A-R2-1", date: "2026-03-30", round: 2, group: "A", home: "材料", away: "计算机", score: [2, 0] },
    { id: "B-R2-1", date: "2026-03-30", round: 2, group: "B", home: "未来技术", away: "管外生", score: [0, 5] },
    { id: "A-R2-2", date: "2026-04-01", round: 2, group: "A", home: "悉商", away: "中欧", score: [1, 2] },
    { id: "B-R2-2", date: "2026-04-01", round: 2, group: "B", home: "文法体", away: "通济", score: [1, 1] },
    { id: "A-R2-3", date: "2026-04-02", round: 2, group: "A", home: "机自", away: "延长", score: [8, 0] },
    { id: "B-R2-3", date: "2026-04-03", round: 2, group: "B", home: "理学院", away: "国交", score: [0, 2] },
    { id: "A-R3-1", date: "2026-04-07", round: 3, group: "A", home: "材料", away: "力工", score: [1, 0] },
    { id: "B-R3-1", date: "2026-04-07", round: 3, group: "B", home: "未来技术", away: "钱院", score: [0, 2] },
    { id: "A-R3-2", date: "2026-04-08", round: 3, group: "A", home: "中欧", away: "计算机", score: null },
    { id: "B-R3-2", date: "2026-04-08", round: 3, group: "B", home: "管外生", away: "通济", score: null },
    { id: "A-R3-3", date: "2026-04-10", round: 3, group: "A", home: "悉商", away: "机自", score: null },
    { id: "B-R3-3", date: "2026-04-10", round: 3, group: "B", home: "文法体", away: "国交", score: null },
    { id: "A-R4-1", date: "2026-04-13", round: 4, group: "A", home: "材料", away: "中欧", score: null },
    { id: "B-R4-1", date: "2026-04-13", round: 4, group: "B", home: "未来技术", away: "通济", score: null },
    { id: "A-R4-2", date: "2026-04-15", round: 4, group: "A", home: "延长", away: "力工", score: null },
    { id: "B-R4-2", date: "2026-04-15", round: 4, group: "B", home: "理学院", away: "钱院", score: null },
    { id: "A-R4-3", date: "2026-04-17", round: 4, group: "A", home: "计算机", away: "机自", score: null },
    { id: "B-R4-3", date: "2026-04-17", round: 4, group: "B", home: "管外生", away: "国交", score: null },
    { id: "A-R5-1", date: "2026-04-20", round: 5, group: "A", home: "材料", away: "延长", score: null },
    { id: "B-R5-1", date: "2026-04-20", round: 5, group: "B", home: "未来技术", away: "理学院", score: null },
    { id: "A-R5-2", date: "2026-04-22", round: 5, group: "A", home: "机自", away: "中欧", score: null },
    { id: "B-R5-2", date: "2026-04-22", round: 5, group: "B", home: "国交", away: "通济", score: null },
    { id: "A-R5-3", date: "2026-04-24", round: 5, group: "A", home: "力工", away: "悉商", score: null },
    { id: "B-R5-3", date: "2026-04-24", round: 5, group: "B", home: "钱院", away: "文法体", score: null },
    { id: "A-R6-1", date: "2026-04-27", round: 6, group: "A", home: "机自", away: "材料", score: null },
    { id: "B-R6-1", date: "2026-04-27", round: 6, group: "B", home: "国交", away: "未来技术", score: null },
    { id: "A-R6-2", date: "2026-04-29", round: 6, group: "A", home: "延长", away: "悉商", score: null },
    { id: "B-R6-2", date: "2026-04-29", round: 6, group: "B", home: "文法体", away: "理学院", score: null },
    { id: "A-R6-3", date: "2026-04-30", round: 6, group: "A", home: "力工", away: "计算机", score: null },
    { id: "B-R6-3", date: "2026-04-30", round: 6, group: "B", home: "管外生", away: "钱院", score: null },
    { id: "A-R7-1", date: "2026-05-06", round: 7, group: "A", home: "材料", away: "悉商", score: null },
    { id: "B-R7-1", date: "2026-05-06", round: 7, group: "B", home: "未来技术", away: "文法体", score: null },
    { id: "A-R7-2", date: "2026-05-07", round: 7, group: "A", home: "延长", away: "计算机", score: null },
    { id: "B-R7-2", date: "2026-05-07", round: 7, group: "B", home: "理学院", away: "管外生", score: null },
    { id: "A-R7-3", date: "2026-05-08", round: 7, group: "A", home: "中欧", away: "力工", score: null },
    { id: "B-R7-3", date: "2026-05-08", round: 7, group: "B", home: "通济", away: "钱院", score: null }
  ]
};

const INITIAL_SCORERS = [
  { player: "张云颉", team: "悉商", goals: 1 }, { player: "侯翰青", team: "悉商", goals: 2 },
  { player: "胡雨昂", team: "悉商", goals: 1 }, { player: "依木兰尼", team: "管外生", goals: 2 },
  { player: "俞毅瑞", team: "文法体", goals: 2 }, { player: "艾力西尔", team: "文法体", goals: 3 },
  { player: "巴合卓力:胡尔曼别克", team: "文法体", goals: 1 }, { player: "麦热班", team: "文法体", goals: 1 },
  { player: "阿卜杜扎伊", team: "文法体", goals: 1 }, { player: "吴昊儒", team: "机自", goals: 6 },
  { player: "叶华", team: "机自", goals: 1 }, { player: "胡忠豪", team: "中欧", goals: 1 },
  { player: "金楚恒", team: "中欧", goals: 1 }, { player: "黄梓桓", team: "中欧", goals: 1 },
  { player: "ROBALO BAPTISTE PAUL VALE", team: "中欧", goals: 1 }, { player: "ISARTI ANAS", team: "中欧", goals: 1 },
  { player: "AMINE KHALIL", team: "中欧", goals: 2 }, { player: "郭仪城", team: "理学院", goals: 2 },
  { player: "陈俊希", team: "理学院", goals: 1 }, { player: "梁荣峰", team: "材料", goals: 2 },
  { player: "阿依哈尔", team: "管外生", goals: 1 }, { player: "陶涛", team: "管外生", goals: 2 },
  { player: "IGNACIO FERVANDEZ", team: "中欧", goals: 1 }, { player: "朱鑫磊", team: "中欧", goals: 1 },
  { player: "梁晓明", team: "通济", goals: 1 }, { player: "杨俊烨", team: "机自", goals: 2 },
  { player: "经童", team: "机自", goals: 1 }, { player: "张轩玮", team: "机自", goals: 1 },
  { player: "刘昀东", team: "机自", goals: 1 }, { player: "刘子尧", team: "机自", goals: 1 },
  { player: "Said", team: "国交", goals: 1 }, { player: "Alejandro", team: "国交", goals: 1 },
  { player: "金星光", team: "材料", goals: 1 }, { player: "王恩祈", team: "钱院", goals: 2 }
];

const INITIAL_CARDS = [
  { player: "张弛", team: "悉商", yellow: 1, red: 0, suspended: false }, { player: "依木兰尼", team: "管外生", yellow: 1, red: 0, suspended: false },
  { player: "许书豪", team: "文法体", yellow: 1, red: 0, suspended: false }, { player: "刘昀东", team: "机自", yellow: 1, red: 0, suspended: false },
  { player: "任锦瑞", team: "延长", yellow: 1, red: 0, suspended: false }, { player: "梁荣峰", team: "材料", yellow: 2, red: 0, suspended: false },
  { player: "ISARTI ANAS", team: "中欧", yellow: 1, red: 0, suspended: false }, { player: "黄梓桓", team: "中欧", yellow: 1, red: 0, suspended: false },
  { player: "Youssif", team: "国交", yellow: 1, red: 0, suspended: false }, { player: "金星光", team: "材料", yellow: 1, red: 0, suspended: false },
  { player: "童俊辉", team: "力工", yellow: 1, red: 0, suspended: false }, { player: "王博涵", team: "力工", yellow: 1, red: 0, suspended: false },
  { player: "王东瑞", team: "力工", yellow: 1, red: 0, suspended: false }
];

const state = {
  currentSeason: "2026",
  groupATeams: [...CONFIG.groups.A],
  groupBTeams: [...CONFIG.groups.B],
  matchSchedule: CONFIG.matches.map((m) => ({ ...m })),
  knockoutSchedule: CONFIG.knockoutMatches.map((m) => ({ ...m })),
  matches: CONFIG.matches.map((m) => ({ ...m })),
  knockoutMatches: CONFIG.knockoutMatches.map((m) => ({ ...m })),
  scorers: INITIAL_SCORERS.map((s) => ({ ...s, id: makeId() })),
  cards: INITIAL_CARDS.map((c) => ({ ...c, id: makeId() })),
  players: [],
  matchMedia: [],
  cardRules: { yellowThreshold: 2 },
  mode: "local",
  canEdit: false,
  isMediaOnly: false,
  supabase: null,
  adminUsers: [],
  adminRole: "",
  canManageAdmins: false,
  lastNoticeHash: "",
  parseInProgress: false
};

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeTeamName(raw) { return TEAM_ALIASES[raw?.trim()] || raw?.trim(); }
function normalizePlayerName(raw) { return raw.replace(/\s+/g, " ").trim(); }
function formatDate(dateStr) { const d = new Date(dateStr); return `${d.getMonth() + 1}月${d.getDate()}日`; }
function buildDateStr(m, d) { return `${state.currentSeason}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }

function loadLocal() {
  try {
    const raw = localStorage.getItem(storageKey(state.currentSeason));
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.matchSchedule)) state.matchSchedule = parsed.matchSchedule;
    if (Array.isArray(parsed.knockoutSchedule)) state.knockoutSchedule = parsed.knockoutSchedule;
    if (Array.isArray(parsed.groupATeams)) state.groupATeams = parsed.groupATeams;
    if (Array.isArray(parsed.groupBTeams)) state.groupBTeams = parsed.groupBTeams;
    if (Array.isArray(parsed.matches)) state.matches = parsed.matches;
    if (Array.isArray(parsed.knockoutMatches)) state.knockoutMatches = parsed.knockoutMatches;
    if (Array.isArray(parsed.scorers)) state.scorers = parsed.scorers;
    if (Array.isArray(parsed.cards)) state.cards = parsed.cards;
    if (Array.isArray(parsed.players)) state.players = parsed.players;
    if (parsed.cardRules) state.cardRules = parsed.cardRules;
    if (typeof parsed.lastNoticeHash === "string") state.lastNoticeHash = parsed.lastNoticeHash;
    if (Array.isArray(parsed.matchMedia)) state.matchMedia = parsed.matchMedia;
  } catch (e) { console.warn(e); }
}

function saveLocal() {
  localStorage.setItem(storageKey(state.currentSeason), JSON.stringify({
    matchSchedule: state.matchSchedule,
    knockoutSchedule: state.knockoutSchedule,
    groupATeams: state.groupATeams,
    groupBTeams: state.groupBTeams,
    matches: state.matches,
    knockoutMatches: state.knockoutMatches,
    scorers: state.scorers,
    cards: state.cards,
    players: state.players,
    matchMedia: state.matchMedia,
    cardRules: state.cardRules,
    lastNoticeHash: state.lastNoticeHash
  }));
}

async function switchSeason(newSeason) {
  saveLocal();
  state.currentSeason = newSeason;
  state.matches = [];
  state.knockoutMatches = [];
  state.scorers = [];
  state.cards = [];
  state.players = [];
  state.matchSchedule = [];
  state.knockoutSchedule = [];
  state.groupATeams = [];
  state.groupBTeams = [];
  state.matchMedia = [];
  state.lastNoticeHash = "";

  loadLocal();

  // If empty new season, use CONFIG defaults for 2026
  if (newSeason === "2026" && state.matchSchedule.length === 0) {
    state.groupATeams = [...CONFIG.groups.A];
    state.groupBTeams = [...CONFIG.groups.B];
    state.matchSchedule = CONFIG.matches.map((m) => ({ ...m }));
    state.knockoutSchedule = CONFIG.knockoutMatches.map((m) => ({ ...m }));
    state.matches = CONFIG.matches.map((m) => ({ ...m }));
    state.scorers = INITIAL_SCORERS.map((s) => ({ ...s, id: makeId() }));
    state.cards = INITIAL_CARDS.map((c) => ({ ...c, id: makeId() }));
  }

  if (state.mode === "cloud" && state.supabase) {
    try { await loadCloudData(); } catch (e) { console.warn(e); }
  }

  populateTeamSelects();
  renderAll();
}

function hashText(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) + hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

function dedupeScorers() {
  const map = new Map();
  state.scorers.forEach((s) => {
    const key = `${s.team}|${s.player}`;
    const goals = Number(s.goals) || 0;
    if (!map.has(key)) {
      map.set(key, { id: s.id || makeId(), team: s.team, player: s.player, goals });
    } else {
      // 去重时保留较大值，避免重复写入导致进球数翻倍
      map.get(key).goals = Math.max(map.get(key).goals, goals);
    }
  });
  state.scorers = [...map.values()];
}

function dedupeCards() {
  const map = new Map();
  state.cards.forEach((c) => {
    const key = `${c.team}|${c.player}`;
    const yellow = Number(c.yellow) || 0;
    const red = Number(c.red) || 0;
    const suspended = !!c.suspended;
    if (!map.has(key)) {
      map.set(key, { id: c.id || makeId(), team: c.team, player: c.player, yellow, red, suspended });
    } else {
      const row = map.get(key);
      row.yellow = Math.max(row.yellow, yellow);
      row.red = Math.max(row.red, red);
      row.suspended = row.suspended || suspended;
    }
  });
  state.cards = [...map.values()];
}

function normalizeState() {
  dedupeScorers();
  dedupeCards();
  autoUpdateSuspensions();
}

function updateModeUI() {
  const badge = document.querySelector("#modeBadge");
  const backendStatus = document.querySelector("#backendStatus");
  const adminOnly = document.querySelectorAll(".admin-only");
  const mediaEditorOnly = document.querySelectorAll(".media-editor-only");
  const adminManageForm = document.querySelector("#adminManageForm");
  const adminManageResult = document.querySelector("#adminManageResult");
  const email = state.currentUserEmail || "";
  const isFullAdmin = state.canEdit && !state.isMediaOnly;
  const label = state.isMediaOnly ? "媒体编辑模式" : "管理员模式";
  badge.textContent = state.canEdit ? `${label} (${email})` : "只读浏览模式";
  backendStatus.textContent = state.mode === "cloud"
    ? "后端状态：Supabase 已连接，数据全员共享。"
    : "后端状态：未配置 Supabase，当前使用本地数据。";
  adminOnly.forEach((el) => el.classList.toggle("hidden", !isFullAdmin));
  mediaEditorOnly.forEach((el) => el.classList.toggle("hidden", !state.canEdit));
  if (adminManageForm) adminManageForm.classList.toggle("hidden", !state.canManageAdmins || !isFullAdmin);
  if (adminManageResult && !state.canManageAdmins) adminManageResult.textContent = isFullAdmin ? "仅超级管理员可管理管理员名单。" : "";
}

function teamStats(groupCode) {
  const teams = groupCode === "A" ? state.groupATeams : state.groupBTeams;
  const map = Object.fromEntries(teams.map((t) => [t, { team: t, played: 0, win: 0, draw: 0, lose: 0, gf: 0, ga: 0, gd: 0, points: 0 }]));
  state.matches.filter((m) => m.group === groupCode && Array.isArray(m.score)).forEach((m) => {
    const [h, a] = m.score; const home = map[m.home]; const away = map[m.away];
    home.played += 1; away.played += 1; home.gf += h; home.ga += a; away.gf += a; away.ga += h;
    if (h > a) { home.win += 1; away.lose += 1; home.points += 3; }
    else if (h < a) { away.win += 1; home.lose += 1; away.points += 3; }
    else { home.draw += 1; away.draw += 1; home.points += 1; away.points += 1; }
  });
  return Object.values(map).map((x) => ({ ...x, gd: x.gf - x.ga }))
    .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team, "zh-CN"));
}

function renderStandings(groupCode, selector) {
  const tbody = document.querySelector(selector);
  tbody.innerHTML = teamStats(groupCode).map((r, i) => {
    const qualifyClass = i < 4 ? `qualify qualify-${i + 1}` : "";
    return `<tr class="${qualifyClass}">
    <td>${i + 1}</td><td>${r.team}</td><td>${r.played}</td><td>${r.win}</td><td>${r.draw}</td><td>${r.lose}</td>
    <td>${r.gf}</td><td>${r.ga}</td><td>${r.gd}</td><td>${r.points}</td>
  </tr>`;
  }).join("");
}

function isGroupComplete(groupCode) {
  const groupMatches = state.matches.filter((m) => m.group === groupCode);
  return groupMatches.length > 0 && groupMatches.every((m) => Array.isArray(m.score));
}

// ========== 淘汰赛核心逻辑 ==========

// 获取淘汰赛比赛的胜者和败者
function getMatchWinner(match) {
  if (!match || !Array.isArray(match.score)) return null;
  const [home, away] = match.score;
  if (home > away) return { winner: "home", loser: "away" };
  if (home < away) return { winner: "away", loser: "home" };
  // 平局看点球
  if (Array.isArray(match.penalty)) {
    const [pHome, pAway] = match.penalty;
    if (pHome > pAway) return { winner: "home", loser: "away" };
    if (pHome < pAway) return { winner: "away", loser: "home" };
  }
  return null; // 无法判断
}

// 获取淘汰赛比赛的实际队伍名
function getKnockoutMatchTeams(matchId) {
  const match = state.knockoutMatches.find((m) => m.id === matchId);
  if (!match) return { home: null, away: null };

  // QF 轮次：从小组排名获取
  if (match.round === "QF") {
    const aStats = teamStats("A");
    const bStats = teamStats("B");
    const seedMap = {
      "A1": aStats[0]?.team, "A2": aStats[1]?.team, "A3": aStats[2]?.team, "A4": aStats[3]?.team,
      "B1": bStats[0]?.team, "B2": bStats[1]?.team, "B3": bStats[2]?.team, "B4": bStats[3]?.team
    };
    return {
      home: seedMap[match.homeSeed] || null,
      away: seedMap[match.awaySeed] || null
    };
  }

  // SF/Third/Final 轮次：从前序比赛结果获取
  const resolveTeam = (fromRef) => {
    if (!fromRef) return null;
    const lastDash = fromRef.lastIndexOf("-");
    const fromMatchId = fromRef.slice(0, lastDash);
    const result = fromRef.slice(lastDash + 1);
    const fromMatch = state.knockoutMatches.find((m) => m.id === fromMatchId);
    if (!fromMatch) return null;

    const teams = getKnockoutMatchTeams(fromMatchId);
    const resultInfo = getMatchWinner(fromMatch);
    if (!teams.home || !teams.away) return null;
    if (!resultInfo) return null; // 前序比赛未结束或平局无法判断

    if (result === "winner") {
      return resultInfo.winner === "home" ? teams.home : teams.away;
    } else {
      return resultInfo.loser === "home" ? teams.home : teams.away;
    }
  };

  return {
    home: resolveTeam(match.homeFrom),
    away: resolveTeam(match.awayFrom)
  };
}

// 获取淘汰赛比赛的实际队伍（带缓存）
function resolveKnockoutTeam(fromRef) {
  const lastDash = fromRef.lastIndexOf("-");
  const matchId = fromRef.slice(0, lastDash);
  const result = fromRef.slice(lastDash + 1);
  const teams = getKnockoutMatchTeams(matchId);
  const match = state.knockoutMatches.find((m) => m.id === matchId);
  const resultInfo = getMatchWinner(match);

  if (!teams || !resultInfo) return null;
  if (result === "winner") {
    return resultInfo.winner === "home" ? teams.home : teams.away;
  }
  return resultInfo.loser === "home" ? teams.home : teams.away;
}

function setTextIfExists(selectorOrEl, text) {
  const el = typeof selectorOrEl === "string" ? document.querySelector(selectorOrEl) : selectorOrEl;
  if (!el) return;
  el.textContent = text;
}

function renderKnockout() {
  const aStats = teamStats("A");
  const bStats = teamStats("B");
  const aDone = isGroupComplete("A");
  const bDone = isGroupComplete("B");
  const canFill = aDone && bDone;

  const seedMap = {
    "A1": aStats[0]?.team, "A2": aStats[1]?.team, "A3": aStats[2]?.team, "A4": aStats[3]?.team,
    "B1": bStats[0]?.team, "B2": bStats[1]?.team, "B3": bStats[2]?.team, "B4": bStats[3]?.team
  };

  const formatScore = (match, teamType) => {
    if (!match || !Array.isArray(match.score)) return "—";
    const score = teamType === "home" ? match.score[0] : match.score[1];
    let text = String(score);
    if (Array.isArray(match.penalty)) {
      const pScore = teamType === "home" ? match.penalty[0] : match.penalty[1];
      text += `(${pScore})`;
    }
    return text;
  };

  const applyWinner = (rowId, teamType, match) => {
    const row = document.querySelector(`#${rowId}`);
    if (!row) return;
    row.classList.remove("ko-winner");
    if (match && Array.isArray(match.score)) {
      const result = getMatchWinner(match);
      if (result && result.winner === teamType) {
        row.classList.add("ko-winner");
      }
    }
  };

  // --- QF 卡片 (built from schedule) ---
  const qfOrder = state.knockoutSchedule.filter((m) => m.round === "QF");

  // 辅助: 队伍名 fallback —— 前序比赛已就绪但无结果时显示"待定"
  const teamFallback = (fromRef) => {
    if (!fromRef) return "—";
    const lastDash = fromRef.lastIndexOf("-");
    const fromMatchId = fromRef.slice(0, lastDash);
    const fromTeams = getKnockoutMatchTeams(fromMatchId);
    if (!fromTeams.home || !fromTeams.away) return "—";
    const fromMatch = state.knockoutMatches.find((m) => m.id === fromMatchId);
    if (!fromMatch || !Array.isArray(fromMatch.score)) return "待定";
    if (!getMatchWinner(fromMatch)) return "待定";
    return "—";
  };

  // 辅助: 设置比赛卡片状态样式
  const setCardState = (cardSelector, match, teams) => {
    const card = typeof cardSelector === "string" ? document.querySelector(cardSelector) : cardSelector;
    if (!card) return;
    card.classList.remove("ko-ready", "ko-done");
    if (!match || !Array.isArray(match.score)) {
      if (teams.home && teams.away) card.classList.add("ko-ready");
    } else {
      card.classList.add("ko-done");
    }
  };

  const qfConfigs = qfOrder.map((m, i) => ({
    id: m.id,
    homeSeed: m.homeSeed,
    awaySeed: m.awaySeed,
    homeRow: `qf${i + 1}-home`,
    awayRow: `qf${i + 1}-away`,
    seedHomeEl: `#seedQF${i + 1}Home`,
    seedAwayEl: `#seedQF${i + 1}Away`,
    cardSelector: `.qf${i + 1}`
  }));

  qfConfigs.forEach(({ id, homeSeed, awaySeed, homeRow, awayRow, seedHomeEl, seedAwayEl, cardSelector }) => {
    const match = state.knockoutMatches.find((m) => m.id === id);
    const homeTeam = seedMap[homeSeed];
    const awayTeam = seedMap[awaySeed];

    const homeNameEl = document.querySelector(`#${homeRow} .ko-team-name`);
    const awayNameEl = document.querySelector(`#${awayRow} .ko-team-name`);
    if (homeNameEl) homeNameEl.textContent = canFill && homeTeam ? homeTeam : (homeTeam || homeSeed);
    if (awayNameEl) awayNameEl.textContent = canFill && awayTeam ? awayTeam : (awayTeam || awaySeed);

    const homeScoreEl = document.querySelector(`#${homeRow} .ko-score`);
    const awayScoreEl = document.querySelector(`#${awayRow} .ko-score`);
    if (homeScoreEl) homeScoreEl.textContent = match && Array.isArray(match.score) ? formatScore(match, "home") : "—";
    if (awayScoreEl) awayScoreEl.textContent = match && Array.isArray(match.score) ? formatScore(match, "away") : "—";

    applyWinner(homeRow, "home", match);
    applyWinner(awayRow, "away", match);
    setCardState(cardSelector, match, { home: homeTeam, away: awayTeam });
  });

  // --- SF 卡片 (built from schedule) ---
  const sfOrder = state.knockoutSchedule.filter((m) => m.round === "SF");
  const sfConfigs = sfOrder.map((m, i) => ({
    id: m.id,
    homeRow: `sf${i + 1}-home`,
    awayRow: `sf${i + 1}-away`,
    seedHomeEl: `#seedSF${i + 1}Home`,
    seedAwayEl: `#seedSF${i + 1}Away`,
    cardSelector: `.sf${i + 1}`
  }));

  sfConfigs.forEach(({ id, homeRow, awayRow, seedHomeEl, seedAwayEl, cardSelector }) => {
    const match = state.knockoutMatches.find((m) => m.id === id);
    const teams = getKnockoutMatchTeams(id);

    const homeNameEl = document.querySelector(`#${homeRow} .ko-team-name`);
    const awayNameEl = document.querySelector(`#${awayRow} .ko-team-name`);
    if (homeNameEl) homeNameEl.textContent = teams.home || teamFallback(match?.homeFrom);
    if (awayNameEl) awayNameEl.textContent = teams.away || teamFallback(match?.awayFrom);
    const homeSeedEl = document.querySelector(seedHomeEl);
    const awaySeedEl = document.querySelector(seedAwayEl);
    if (homeSeedEl && teams.home) homeSeedEl.textContent = teams.home;
    if (awaySeedEl && teams.away) awaySeedEl.textContent = teams.away;

    const homeScoreEl = document.querySelector(`#${homeRow} .ko-score`);
    const awayScoreEl = document.querySelector(`#${awayRow} .ko-score`);
    if (homeScoreEl) homeScoreEl.textContent = match && Array.isArray(match.score) ? formatScore(match, "home") : "—";
    if (awayScoreEl) awayScoreEl.textContent = match && Array.isArray(match.score) ? formatScore(match, "away") : "—";

    applyWinner(homeRow, "home", match);
    applyWinner(awayRow, "away", match);
    setCardState(cardSelector, match, teams);
  });

  // --- 季军赛 ---
  const thirdId = state.knockoutSchedule.find((m) => m.round === "Third")?.id || "Third";
  const thirdMatch = state.knockoutMatches.find((m) => m.id === thirdId);
  const thirdTeams = getKnockoutMatchTeams(thirdId);
  ["third-home", "third-away"].forEach((rowId, i) => {
    const isHome = i === 0;
    const team = isHome ? thirdTeams.home : thirdTeams.away;
    const nameEl = document.querySelector(`#${rowId} .ko-team-name`);
    if (nameEl) nameEl.textContent = team || teamFallback(thirdMatch?.[isHome ? "homeFrom" : "awayFrom"]);
    const seedEl = document.querySelector(isHome ? "#seedThirdHome" : "#seedThirdAway");
    if (seedEl && team) seedEl.textContent = team;
    const scoreEl = document.querySelector(`#${rowId} .ko-score`);
    if (scoreEl) scoreEl.textContent = thirdMatch && Array.isArray(thirdMatch.score) ? formatScore(thirdMatch, isHome ? "home" : "away") : "—";
    applyWinner(rowId, isHome ? "home" : "away", thirdMatch);
  });
  const thirdPlaceEl = document.querySelector("#teamThirdPlace");
  if (thirdPlaceEl) {
    if (thirdMatch) {
      const result = getMatchWinner(thirdMatch);
      thirdPlaceEl.textContent = result ? (result.winner === "home" ? thirdTeams.home : thirdTeams.away) || "—" : "—";
    } else {
      thirdPlaceEl.textContent = "—";
    }
  }
  setCardState(".match-third", thirdMatch, thirdTeams);

  // --- 决赛 ---
  const finalId = state.knockoutSchedule.find((m) => m.round === "Final")?.id || "Final";
  const finalMatch = state.knockoutMatches.find((m) => m.id === finalId);
  const finalTeams = getKnockoutMatchTeams(finalId);
  ["final-home", "final-away"].forEach((rowId, i) => {
    const isHome = i === 0;
    const team = isHome ? finalTeams.home : finalTeams.away;
    const nameEl = document.querySelector(`#${rowId} .ko-team-name`);
    if (nameEl) nameEl.textContent = team || teamFallback(finalMatch?.[isHome ? "homeFrom" : "awayFrom"]);
    const seedEl = document.querySelector(isHome ? "#seedFinalHome" : "#seedFinalAway");
    if (seedEl && team) seedEl.textContent = team;
    const scoreEl = document.querySelector(`#${rowId} .ko-score`);
    if (scoreEl) scoreEl.textContent = finalMatch && Array.isArray(finalMatch.score) ? formatScore(finalMatch, isHome ? "home" : "away") : "—";
    applyWinner(rowId, isHome ? "home" : "away", finalMatch);
  });
  const championEl = document.querySelector("#teamChampion");
  if (championEl) {
    if (finalMatch) {
      const result = getMatchWinner(finalMatch);
      championEl.textContent = result ? (result.winner === "home" ? finalTeams.home : finalTeams.away) || "—" : "—";
    } else {
      championEl.textContent = "—";
    }
  }
  setCardState("#knockoutFinalCard", finalMatch, finalTeams);
}

function drawKnockoutArrows() {
  const root = document.querySelector("#knockoutSection");
  const svg = document.querySelector("#knockoutSvg");
  if (!root || !svg) return;

  // 小屏先不要画连接线，避免布局变化造成错位
  try {
    if (window.matchMedia && window.matchMedia("(max-width: 980px)").matches) return;
  } catch (_) {}

  const qf1 = document.querySelector(".qf1");
  const qf2 = document.querySelector(".qf2");
  const qf3 = document.querySelector(".qf3");
  const qf4 = document.querySelector(".qf4");
  const sf1 = document.querySelector(".sf1");
  const sf2 = document.querySelector(".sf2");
  const finalCard = document.querySelector("#knockoutFinalCard");
  if (!qf1 || !qf2 || !qf3 || !qf4 || !sf1 || !sf2 || !finalCard) return;

  const rootRect = root.getBoundingClientRect();
  const w = Math.max(1, Math.round(rootRect.width));
  const h = Math.max(1, Math.round(rootRect.height));

  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.setAttribute("width", w);
  svg.setAttribute("height", h);

  // 清空并重建（简单可靠）
  svg.innerHTML = `
    <defs>
      <marker id="knArrowHead" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1"></path>
      </marker>
    </defs>
  `;

  const NS = "http://www.w3.org/2000/svg";
  const mkPath = (fromEl, toEl) => {
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const fromX = (fromRect.left - rootRect.left) + fromRect.width / 2;
    const toX = (toRect.left - rootRect.left) + toRect.width / 2;

    const toAbove = toRect.top < fromRect.top;
    const startY = toAbove ? fromRect.top - rootRect.top : fromRect.bottom - rootRect.top;
    const endY = toAbove ? toRect.bottom - rootRect.top : toRect.top - rootRect.top;

    const dir = toAbove ? -1 : 1;
    const c1Y = startY + 40 * dir;
    const c2Y = endY - 40 * dir;

    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", `M ${fromX} ${startY} C ${fromX} ${c1Y}, ${toX} ${c2Y}, ${toX} ${endY}`);
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", "#cbd5e1");
    p.setAttribute("stroke-width", "2");
    p.setAttribute("marker-end", "url(#knArrowHead)");
    svg.appendChild(p);
  };

  mkPath(qf1, sf1);
  mkPath(qf2, sf1);
  mkPath(qf3, sf2);
  mkPath(qf4, sf2);
  mkPath(sf1, finalCard);
  mkPath(sf2, finalCard);
}

function renderMatches() {
  const container = document.querySelector("#matchInputList");
  const rows = [...state.matches].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  container.innerHTML = rows.map((m) => {
    const played = Array.isArray(m.score);
    const ops = state.canEdit
      ? `<button data-action="save-match" data-id="${m.id}">保存</button>
         <button class="secondary" data-action="clear-match" data-id="${m.id}">清除</button>`
      : `<span>只读</span>`;
    return `<div class="match-row">
      <div>${formatDate(m.date)}</div><div>第${m.round}轮 ${m.group}组</div><div>${m.home} vs ${m.away}</div>
      <input class="score-box" type="number" min="0" id="home-${m.id}" value="${played ? m.score[0] : ""}" ${state.canEdit ? "" : "disabled"} />
      <input class="score-box" type="number" min="0" id="away-${m.id}" value="${played ? m.score[1] : ""}" ${state.canEdit ? "" : "disabled"} />
      <div>${ops} <span class="${played ? "tag-played" : "tag-pending"}">${played ? "已录入" : "未开赛"}</span></div>
    </div>`;
  }).join("");
}

function renderUpcoming() {
  const tbody = document.querySelector("#upcomingTable tbody");
  tbody.innerHTML = state.matches.filter((m) => !Array.isArray(m.score))
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
    .map((m) => `<tr><td>${formatDate(m.date)}</td><td>第${m.round}轮</td><td>${m.group}组</td><td>${m.home} vs ${m.away}</td></tr>`).join("");
}

function renderMatchMedia() {
  const gallery = document.querySelector("#matchMediaGallery");
  const emptyHint = document.querySelector("#mediaEmptyHint");
  const dateFilter = document.querySelector("#mediaDateFilter");
  if (!gallery) return;

  if (!dateFilter.value) dateFilter.value = new Date().toISOString().slice(0, 10);
  const filterDate = dateFilter.value;

  const filtered = state.matchMedia.filter((m) => m.media_date === filterDate);
  if (filtered.length === 0) {
    emptyHint.style.display = "block";
    gallery.innerHTML = "";
  } else {
    emptyHint.style.display = "none";
  }
  gallery.innerHTML = filtered.map((m) => {
    const mediaEl = m.media_type === "video"
      ? `<video src="${m.public_url}" preload="metadata" controls></video>`
      : `<img src="${m.public_url}" alt="${m.description || ""}" loading="lazy" />`;
    const desc = m.description ? `<span class="media-card-desc">${m.description}</span>` : "";
    const delBtn = state.canEdit
      ? `<button class="media-delete-btn" data-action="delete-media" data-id="${m.id}">删除</button>`
      : "";
    return `<div class="media-card" data-media-id="${m.id}">
      ${mediaEl}
      <div class="media-card-body">
        ${desc}
        <span class="media-card-date">${m.media_date}</span>
        ${delBtn}
      </div>
    </div>`;
  }).join("");

  // Lightbox for images
  if (!gallery.dataset.bound) {
    gallery.dataset.bound = "1";
    gallery.addEventListener("click", (e) => {
      const img = e.target.closest("img");
      if (!img || img.closest(".media-delete-btn")) return;
      const overlay = document.createElement("div");
      overlay.className = "media-lightbox";
      const bigImg = document.createElement("img");
      bigImg.src = img.src;
      overlay.appendChild(bigImg);
      overlay.addEventListener("click", () => overlay.remove());
      document.body.appendChild(overlay);
    });
  }
}

async function uploadMatchMedia(file, mediaDate, description) {
  if (state.mode === "cloud" && state.supabase) {
    const ext = file.name.split(".").pop().toLowerCase();
    const mediaType = file.type.startsWith("video/") ? "video" : "image";
    const storagePath = `${state.currentSeason}/${mediaDate}/${makeId()}.${ext}`;

    const { error: uploadErr } = await state.supabase.storage
      .from("match-media")
      .upload(storagePath, file, { upsert: false });

    if (uploadErr) throw uploadErr;

    const { data: urlData } = state.supabase.storage
      .from("match-media")
      .getPublicUrl(storagePath);

    const record = {
      id: makeId(),
      season: state.currentSeason,
      media_date: mediaDate,
      media_type: mediaType,
      storage_path: storagePath,
      public_url: urlData.publicUrl,
      description: description || null
    };

    const { error: dbErr } = await state.supabase.from("match_media").insert(record);
    if (dbErr) throw dbErr;

    state.matchMedia.push(record);
    saveLocal();
    renderMatchMedia();
    return record;
  }

  // Local mode: read as data URL and store
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const mediaType = file.type.startsWith("video/") ? "video" : "image";
      const record = {
        id: makeId(),
        season: state.currentSeason,
        media_date: mediaDate,
        media_type: mediaType,
        storage_path: null,
        public_url: reader.result,
        description: description || null
      };
      state.matchMedia.push(record);
      saveLocal();
      renderMatchMedia();
      resolve(record);
    };
    reader.onerror = () => reject(new Error("文件读取失败"));
    reader.readAsDataURL(file);
  });
}

async function deleteMatchMedia(mediaId) {
  if (!confirm("确定删除这条媒体？")) return;
  const record = state.matchMedia.find((m) => m.id === mediaId);
  if (!record) return;

  if (state.mode === "cloud" && state.supabase && record.storage_path) {
    const { error: storageErr } = await state.supabase.storage
      .from("match-media")
      .remove([record.storage_path]);
    if (storageErr) console.warn("Storage delete failed:", storageErr);

    const { error: dbErr } = await state.supabase
      .from("match_media")
      .delete()
      .eq("id", mediaId)
      .eq("season", state.currentSeason);
    if (dbErr) console.warn("DB delete failed:", dbErr);
  }

  state.matchMedia = state.matchMedia.filter((m) => m.id !== mediaId);
  saveLocal();
  renderMatchMedia();
}

async function loadMatchMediaCloud() {
  if (state.mode !== "cloud" || !state.supabase) return;
  const { data, error } = await state.supabase
    .from("match_media")
    .select("*")
    .eq("season", state.currentSeason)
    .order("created_at", { ascending: false });
  if (error) { console.warn("loadMatchMediaCloud:", error); return; }
  state.matchMedia = data.map((r) => ({
    id: r.id,
    season: r.season,
    media_date: r.media_date,
    media_type: r.media_type,
    storage_path: r.storage_path,
    public_url: r.public_url,
    description: r.description
  }));
}

function renderKnockoutInputs() {
  const container = document.querySelector("#knockoutInputList");
  const roundOrder = ["QF", "SF", "Third", "Final"];
  const roundLabels = { QF: "8进4", SF: "4进2", Third: "季军赛", Final: "决赛" };
  const roundDates = { QF: "5月11-15日", SF: "5月18/20日", Third: "5月27日", Final: "5月29日" };
  const matchDateMap = {
    QF1: "5月11日", QF2: "5月12日", QF3: "5月13日", QF4: "5月14日",
    SF1: "5月18日", SF2: "5月20日", Third: "5月27日", Final: "5月29日"
  };
  const aStats = teamStats("A");
  const bStats = teamStats("B");
  const seedMap = {
    "A1": aStats[0]?.team, "A2": aStats[1]?.team, "A3": aStats[2]?.team, "A4": aStats[3]?.team,
    "B1": bStats[0]?.team, "B2": bStats[1]?.team, "B3": bStats[2]?.team, "B4": bStats[3]?.team
  };
  const sorted = [...state.knockoutMatches].sort((a, b) => roundOrder.indexOf(a.round) - roundOrder.indexOf(b.round));
  container.innerHTML = sorted.map((m) => {
    const label = roundLabels[m.round] || m.round;
    const dateLabel = matchDateMap[m.id] || roundDates[m.round] || "";
    const hasScore = Array.isArray(m.score);
    // 显示队伍名（从种子队映射）
    const homeTeam = m.homeSeed ? (seedMap[m.homeSeed] || m.homeSeed) : (m.homeFrom ? m.homeFrom.replace("-", " ") : "—");
    const awayTeam = m.awaySeed ? (seedMap[m.awaySeed] || m.awaySeed) : (m.awayFrom ? m.awayFrom.replace("-", " ") : "—");
    const ops = state.canEdit
      ? `<button data-action="save-ko" data-id="${m.id}">保存</button>
         <button class="secondary" data-action="clear-ko" data-id="${m.id}">清除</button>`
      : `<span>只读</span>`;
    return `<div class="match-row ko-input-row">
      <div class="ko-label">${label}<br/><span class="ko-date">${dateLabel}</span></div>
      <div class="ko-teams"><span>${homeTeam}</span><span class="vs">vs</span><span>${awayTeam}</span></div>
      <input class="score-box" type="number" min="0" id="ko-home-${m.id}" value="${hasScore ? m.score[0] : ""}" ${state.canEdit ? "" : "disabled"} />
      <input class="score-box" type="number" min="0" id="ko-away-${m.id}" value="${hasScore ? m.score[1] : ""}" ${state.canEdit ? "" : "disabled"} />
      <input class="score-box ko-penalty" type="number" min="0" id="ko-pen-home-${m.id}" value="${Array.isArray(m.penalty) ? m.penalty[0] : ""}" ${state.canEdit ? "" : "disabled"} placeholder="点球" />
      <input class="score-box ko-penalty" type="number" min="0" id="ko-pen-away-${m.id}" value="${Array.isArray(m.penalty) ? m.penalty[1] : ""}" ${state.canEdit ? "" : "disabled"} placeholder="点球" />
      <div>${ops} <span class="${hasScore ? "tag-played" : "tag-pending"}">${hasScore ? "已录入" : "未开赛"}</span></div>
    </div>`;
  }).join("");
}

function renderScorers() {
  const tbody = document.querySelector("#scorersTable tbody");
  const sorted = [...state.scorers].sort((a, b) => b.goals - a.goals || a.team.localeCompare(b.team, "zh-CN") || a.player.localeCompare(b.player, "zh-CN"));
  tbody.innerHTML = sorted.map((s, i) => `<tr>
    <td>${i + 1}</td><td>${s.player}</td><td>${s.team}</td><td>${s.goals}</td>
    <td>${state.canEdit ? `<button class="danger" data-action="remove-scorer" data-id="${s.id}">删除</button>` : "-"}</td>
  </tr>`).join("");
}

function renderCards() {
  const tbody = document.querySelector("#cardsTable tbody");
  const threshold = state.cardRules?.yellowThreshold || 2;
  const is2026 = state.currentSeason === "2026";
  const sorted = [...state.cards].sort((a, b) => b.red - a.red || b.yellow - a.yellow || a.player.localeCompare(b.player, "zh-CN"));
  tbody.innerHTML = sorted.map((c, i) => {
    let statusText;
    let rowClass = "";
    if (is2026) {
      // 2026: old style — just show yellow+red total
      statusText = c.yellow + c.red || "-";
    } else {
      // 2027+: suspension tracking
      if (c.red >= 1) {
        statusText = `🔴 红牌停赛${c.red}场`;
        rowClass = "row-suspended";
      } else if (c.suspended) {
        statusText = "⚠️ 停赛中（黄牌累计）";
        rowClass = "row-suspended";
      } else if (c.yellow >= threshold) {
        statusText = "⚠️ 已达阈值（下场停赛）";
        rowClass = "row-warning";
      } else if (c.yellow === threshold - 1) {
        statusText = `⚠️ ${c.yellow}黄 接近停赛`;
        rowClass = "row-warning";
      } else {
        statusText = "-";
      }
    }
    return `<tr class="${rowClass}">
      <td>${i + 1}</td><td>${c.player}</td><td>${c.team}</td><td>${c.yellow}</td><td>${c.red}</td><td>${statusText}</td>
      <td>${state.canEdit ? `<button class="danger" data-action="remove-card" data-id="${c.id}">删除</button>` : "-"}</td>
    </tr>`;
  }).join("");
}

// Auto-update suspension flags based on yellow count vs threshold
// Only enabled for new seasons (2027+), not 2026
function autoUpdateSuspensions() {
  if (state.currentSeason === "2026") return;
  const threshold = state.cardRules?.yellowThreshold || 2;
  state.cards.forEach((c) => {
    if (c.yellow >= threshold && !c.suspended) {
      c.suspended = true;
    }
  });
}

// Clear suspensions for players whose teams just played
// Only active for new seasons (2027+), not 2026
function clearSuspensionsForTeams(homeTeam, awayTeam) {
  if (state.currentSeason === "2026") return false;
  const threshold = state.cardRules?.yellowThreshold || 2;
  let changed = false;
  state.cards.forEach((c) => {
    if (c.suspended && (c.team === homeTeam || c.team === awayTeam)) {
      c.suspended = false;
      c.yellow = Math.max(0, c.yellow - threshold);
      changed = true;
    }
  });
  return changed;
}

function populateTeamSelects() {
  const allTeams = [...state.groupATeams, ...state.groupBTeams];
  const options = `<option value="">选择队伍</option>${allTeams.map((t) => `<option value="${t}">${t}</option>`).join("")}`;
  document.querySelector("#playerTeam").innerHTML = options;
  document.querySelector("#cardPlayerTeam").innerHTML = options;
  const qs = document.querySelector("#quickDeleteScorerTeam");
  const qc = document.querySelector("#quickDeleteCardTeam");
  if (qs) qs.innerHTML = options;
  if (qc) qc.innerHTML = options;
}

function renderSeasonSelector() {
  const sel = document.querySelector("#seasonSelector");
  if (!sel) return;
  const seasons = getKnownSeasons();
  sel.innerHTML = seasons.map((s) => `<option value="${s}" ${s === state.currentSeason ? "selected" : ""}>${s} 赛季</option>`).join("");
}

function renderAll() {
  normalizeState();
  renderStandings("A", "#tableA tbody");
  renderStandings("B", "#tableB tbody");
  renderKnockout();
  renderMatches();
  renderUpcoming();
  renderKnockoutInputs();
  renderScorers();
  renderCards();
  renderAdminUsers();
  renderPlayerPool();
  renderSeasonConfigLists();
  renderCardRulesUI();
  renderMatchMedia();
  updateModeUI();
}

function renderAdminUsers() {
  const tbody = document.querySelector("#adminUsersTable tbody");
  if (!tbody) return;
  const rows = [...state.adminUsers].sort((a, b) => a.email.localeCompare(b.email, "zh-CN"));
  const roleLabel = { owner: "超级管理员", admin: "管理员", media_editor: "媒体编辑" };
  tbody.innerHTML = rows.map((u) => {
    const isSelf = u.email === state.currentUserEmail;
    const action = u.is_active ? "禁用" : "启用";
    return `<tr>
      <td>${u.email}</td>
      <td>${roleLabel[u.role] || u.role || "管理员"}</td>
      <td>${u.is_active ? "启用" : "禁用"}</td>
      <td><button data-action="toggle-admin" data-email="${u.email}" ${isSelf || !state.canManageAdmins ? "disabled" : ""}>${action}</button></td>
    </tr>`;
  }).join("");
}

function bindIfExists(selector, eventName, handler) {
  const el = document.querySelector(selector);
  if (!el) {
    console.warn(`Missing element: ${selector}`);
    return;
  }
  el.addEventListener(eventName, handler);
}

async function saveCloudAll() {
  if (state.mode !== "cloud" || !state.canEdit) return;
  normalizeState();
  const s = state.supabase;
  const season = state.currentSeason;
  const matchRows = state.matches.map((m) => ({
    id: m.id, match_date: m.date, round_no: m.round, group_code: m.group, home_team: m.home, away_team: m.away,
    home_score: Array.isArray(m.score) ? m.score[0] : null, away_score: Array.isArray(m.score) ? m.score[1] : null,
    season
  }));
  const scorerRows = state.scorers.map((x) => ({ id: x.id, player_name: x.player, team_name: x.team, goals: x.goals, season }));
  const cardRows = state.cards.map((x) => ({ id: x.id, player_name: x.player, team_name: x.team, yellow_cards: x.yellow, red_cards: x.red, season }));
  const knockoutRows = state.knockoutMatches.map((m) => ({
    id: m.id, round: m.round,
    home_seed: m.homeSeed || null, away_seed: m.awaySeed || null,
    home_from: m.homeFrom || null, away_from: m.awayFrom || null,
    home_team: null, away_team: null,
    home_score: Array.isArray(m.score) ? m.score[0] : null,
    away_score: Array.isArray(m.score) ? m.score[1] : null,
    penalty: Array.isArray(m.penalty) ? m.penalty : null,
    season
  }));
  const playerRows = state.players.map((p) => ({ id: p.id, player_name: p.player_name, jersey_number: p.jersey_number, team_name: p.team_name, season }));

  const mUpsert = await s.from("matches").upsert(matchRows);
  if (mUpsert.error) throw mUpsert.error;

  const sDelete = await s.from("scorers").delete().eq("season", season).not("id", "is", null);
  if (sDelete.error) throw sDelete.error;
  if (scorerRows.length > 0) {
    const sInsert = await s.from("scorers").insert(scorerRows);
    if (sInsert.error) throw sInsert.error;
  }

  const cDelete = await s.from("cards").delete().eq("season", season).not("id", "is", null);
  if (cDelete.error) throw cDelete.error;
  if (cardRows.length > 0) {
    const cInsert = await s.from("cards").insert(cardRows);
    if (cInsert.error) throw cInsert.error;
  }

  const kUpsert = await s.from("knockout_matches").upsert(knockoutRows);
  if (kUpsert.error) throw kUpsert.error;

  const pDelete = await s.from("players").delete().eq("season", season).not("id", "is", null);
  if (pDelete.error) throw pDelete.error;
  if (playerRows.length > 0) {
    const pInsert = await s.from("players").insert(playerRows);
    if (pInsert.error) throw pInsert.error;
  }

  // Save season config
  const cfgUpsert = await s.from("season_config").upsert({
    season,
    group_a_teams: state.groupATeams,
    group_b_teams: state.groupBTeams,
    updated_at: new Date().toISOString()
  });
  if (cfgUpsert.error) throw cfgUpsert.error;
}

async function loadCloudData() {
  const s = state.supabase;
  const season = state.currentSeason;
  const [mRes, sRes, cRes, kRes, pRes, cfgRes] = await Promise.all([
    s.from("matches").select("*").eq("season", season),
    s.from("scorers").select("*").eq("season", season),
    s.from("cards").select("*").eq("season", season),
    s.from("knockout_matches").select("*").eq("season", season),
    s.from("players").select("*").eq("season", season),
    s.from("season_config").select("*").eq("season", season).maybeSingle()
  ]);
  if (mRes.error || sRes.error || cRes.error) throw new Error("云端表读取失败，请先执行 SQL 建表");

  // Load season config if available
  if (cfgRes.data) {
    state.groupATeams = cfgRes.data.group_a_teams || [];
    state.groupBTeams = cfgRes.data.group_b_teams || [];
    if (cfgRes.data.card_rules) state.cardRules = cfgRes.data.card_rules;
  }

  // If this is a fresh season with no config, use defaults for 2026
  if (season === "2026" && state.groupATeams.length === 0) {
    state.groupATeams = [...CONFIG.groups.A];
    state.groupBTeams = [...CONFIG.groups.B];
    state.matchSchedule = CONFIG.matches.map((m) => ({ ...m }));
    state.knockoutSchedule = CONFIG.knockoutMatches.map((m) => ({ ...m }));
  } else if (state.groupATeams.length > 0 && state.matchSchedule.length === 0) {
    // Rebuild schedule from stored team config if schedule is empty
    const cfg = ScheduleUtils.generateSeasonConfig([...state.groupATeams, ...state.groupBTeams], season);
    state.matchSchedule = cfg.matches;
    state.knockoutSchedule = cfg.knockoutMatches;
  }

  if (mRes.data.length > 0) {
    const cloudMap = Object.fromEntries(mRes.data.map((r) => [r.id, r]));
    state.matches = state.matchSchedule.map((base) => {
      const r = cloudMap[base.id];
      if (!r) return { ...base };
      return {
        id: r.id,
        date: r.match_date || base.date,
        round: r.round_no ?? base.round,
        group: r.group_code || base.group,
        home: r.home_team || base.home,
        away: r.away_team || base.away,
        score: r.home_score == null || r.away_score == null ? null : [r.home_score, r.away_score]
      };
    });
  } else {
    state.matches = state.matchSchedule.map((m) => ({ ...m }));
  }
  if (sRes.data.length > 0) state.scorers = sRes.data.map((r) => ({ id: r.id, player: r.player_name, team: r.team_name, goals: r.goals }));
  if (cRes.data.length > 0) state.cards = cRes.data.map((r) => ({ id: r.id, player: r.player_name, team: r.team_name, yellow: r.yellow_cards, red: r.red_cards }));
  autoUpdateSuspensions();
  if (pRes.data && pRes.data.length > 0) state.players = pRes.data.map((r) => ({ id: r.id, player_name: r.player_name, jersey_number: r.jersey_number, team_name: r.team_name }));
  if (kRes.data.length > 0) {
    const cloudKOMap = Object.fromEntries(kRes.data.map((r) => [r.id, r]));
    state.knockoutMatches = state.knockoutSchedule.map((base) => {
      const r = cloudKOMap[base.id];
      if (!r) return { ...base };
      return {
        id: r.id,
        round: r.round || base.round,
        homeSeed: r.home_seed || base.homeSeed,
        awaySeed: r.away_seed || base.awaySeed,
        homeFrom: r.home_from || base.homeFrom,
        awayFrom: r.away_from || base.awayFrom,
        score: (r.home_score == null || r.away_score == null) ? null : [r.home_score, r.away_score],
        penalty: Array.isArray(r.penalty) ? r.penalty : null
      };
    });
  } else {
    state.knockoutMatches = state.knockoutSchedule.map((m) => ({ ...m }));
  }
  await loadMatchMediaCloud();
  normalizeState();
}

async function loadAdminUsers() {
  if (state.mode !== "cloud" || !state.supabase) {
    state.adminUsers = [];
    return;
  }
  const { data, error } = await state.supabase
    .from("admin_users")
    .select("email,is_active,role");
  if (error) throw error;
  state.adminUsers = data || [];
}

function normalizeText(text) {
  return text.replace(/\r/g, "").replace(/[：]/g, ":").replace(/[（]/g, "(").replace(/[）]/g, ")").replace(/[／]/g, "/").replace(/[ \t]+/g, " ");
}

function parseTeamPlayerLine(line, onEntry) {
  const m = line.match(/^([^:]+):\s*(.+)$/);
  if (!m) return;
  const team = normalizeTeamName(m[1]);
  m[2].split("/").map((x) => x.trim()).filter(Boolean).forEach((p) => onEntry(team, p));
}

function upsertScorer(team, player, goals) {
  const row = state.scorers.find((s) => s.team === team && s.player === player);
  if (row) {
    row.goals += goals;
  } else {
    state.scorers.push({ id: makeId(), team, player, goals });
  }
}

function upsertCard(team, player, type, count) {
  let row = state.cards.find((c) => c.team === team && c.player === player);
  if (!row) {
    row = { id: makeId(), team, player, yellow: 0, red: 0, suspended: false };
    state.cards.push(row);
  }
  row[type] += count;
}

function parseNotice(raw) {
  const text = normalizeText(raw);
  // 按"小组赛（X月X日）"分段
  const ds = [...text.matchAll(/小组赛[（(](\d{1,2})月(\d{1,2})日[）)]/g)];
  const sections = ds.map((d, i) => ({
    date: buildDateStr(Number(d[1]), Number(d[2])),
    content: text.slice(d.index + d[0].length, i + 1 < ds.length ? ds[i + 1].index : text.length)
  }));
  const keyToId = Object.fromEntries(state.matches.map((m) => [`${normalizeTeamName(m.home)}|${normalizeTeamName(m.away)}`, m.id]));

  sections.forEach((sec) => {
    // --- 比分行 ---
    // 格式：队名A:队名B  比分  [队名A胜/队名B胜/平]  例：计算机:机自  0 : 2  机自胜
    // 支持场地前缀如"南二  "、"北一  "，以及比分中间的空格如"0 : 2"
    const matchRe = /(?:[东南西北]\S+\s+)?([^\s:，,。]+?)\s*:\s*([^\s:，,。]+?)\s+(\d+)\s*:\s*(\d+)/g;
    [...sec.content.matchAll(matchRe)].forEach((x) => {
      const teamA = normalizeTeamName(x[1]);
      const teamB = normalizeTeamName(x[2]);
      const id = keyToId[`${teamA}|${teamB}`] || keyToId[`${teamB}|${teamA}`];
      if (!id) return;
      const match = state.matches.find((m) => m.id === id);
      if (!match) return;
      // 如果 id 是以 B|A 顺序匹配的，说明主客队要交换
      const isReversed = keyToId[`${teamA}|${teamB}`] !== id;
      if (!isReversed) {
        match.score = [Number(x[3]), Number(x[4])];
      } else {
        match.score = [Number(x[4]), Number(x[3])];
      }
      match.date = sec.date;
    });

    // --- 进球 ---
    // 格式：队名：号码 名字 1球/ 号码 名字 1球  例：机自：24号  夏午  1球/ 41号  经童  1球
    const goalBlockRe = /(?:^|\n)([^:：]+?)[：:]\s*([\s\S]*?)(?=\n(?:黄牌|红牌|进球队员)|$)/gm;
    let goalMatch;
    while ((goalMatch = goalBlockRe.exec(sec.content)) !== null) {
      const block = goalMatch[2];
      const team = normalizeTeamName(goalMatch[1]);
      // 切割每个球员段：用 "/" 分隔
      const players = block.split(/\s*\/\s*/);
      players.forEach((piece) => {
        piece = piece.trim();
        if (!piece || piece.includes("乌龙")) return;
        // 例：24号  夏午  1球  或  7号 周易 1球
        const m = piece.match(/(\d+)\s*号\s+(\S+)\s+(\d+)\s*球/);
        if (!m) return;
        const player = normalizePlayerName(m[2]);
        const goals = Number(m[3]);
        if (goals > 0) upsertScorer(team, player, goals);
      });
    }

    // --- 黄牌 ---
    // 格式：队名：号码 名字 / 号码 名字  例：计算机：4号  胡荣珅
    const yellowRe = /(?:^|\n)黄牌[：:]\s*([\s\S]*?)(?=\n(?:红牌|进球队员)|$)/gm;
    let yMatch;
    while ((yMatch = yellowRe.exec(sec.content)) !== null) {
      const block = yMatch[1];
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      lines.forEach((line) => {
        const parts = line.split(/\s*\/\s*/);
        parts.forEach((piece) => {
          piece = piece.trim();
          if (!piece) return;
          // 例：计算机：4号  胡荣珅  或  机自：22号 杨俊烨 / 7号 吴昊儒
          const teamColon = piece.match(/^([^:：]+?)[：:]?\s*(\d+)\s*号\s+(.+)$/);
          if (!teamColon) return;
          const team = normalizeTeamName(teamColon[1]);
          const player = normalizePlayerName(teamColon[3]);
          upsertCard(team, player, "yellow", 1);
        });
      });
    }

    // --- 红牌 ---
    // 格式：同黄牌
    const redRe = /(?:^|\n)红牌[：:]\s*([\s\S]*?)(?=\n(?:黄牌|进球队员)|$)/gm;
    let rMatch;
    while ((rMatch = redRe.exec(sec.content)) !== null) {
      const block = rMatch[1];
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      lines.forEach((line) => {
        const parts = line.split(/\s*\/\s*/);
        parts.forEach((piece) => {
          piece = piece.trim();
          if (!piece) return;
          const teamColon = piece.match(/^([^:：]+?)[：:]?\s*(\d+)\s*号\s+(.+)$/);
          if (!teamColon) return;
          const team = normalizeTeamName(teamColon[1]);
          const player = normalizePlayerName(teamColon[3]);
          upsertCard(team, player, "red", 1);
        });
      });
    }
  });
}

function mustAdmin() {
  if (state.canEdit && !state.isMediaOnly) return true;
  if (state.isMediaOnly) alert("当前是媒体编辑模式，无法进行此操作。");
  else alert("当前是只读模式，请先用管理员账号登录。");
  return false;
}

function mustMediaEditor() {
  if (state.canEdit) return true;
  alert("当前是只读模式，请先用管理员账号登录。");
  return false;
}

async function persistChanges(errorPrefix = "保存失败") {
  try {
    saveLocal();
    await saveCloudAll();
    renderAll();
    return true;
  } catch (error) {
    alert(`${errorPrefix}：${error.message}`);
    return false;
  }
}

async function exportStandingsImage() {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "position:fixed;left:-9999px;top:0;background:#fff;padding:24px 28px;font-family:'Microsoft YaHei',Arial,sans-serif;";
  const title = `${state.currentSeason} 赛季 · 小组赛积分榜`;
  const dateStr = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });

  const groupTables = ["A", "B"].map((g) => {
    const stats = teamStats(g);
    const rows = stats.map((r, i) => {
      const cls = i < 4 ? "font-weight:700;" : "";
      return `<tr><td style="text-align:center;padding:6px 14px;border:1px solid #d1d5db;${cls}">${i + 1}</td>
        <td style="text-align:left;padding:6px 14px;border:1px solid #d1d5db;${cls}">${r.team}</td>
        <td style="text-align:center;padding:6px 10px;border:1px solid #d1d5db;${cls}">${r.played}</td>
        <td style="text-align:center;padding:6px 10px;border:1px solid #d1d5db;${cls}">${r.win}</td>
        <td style="text-align:center;padding:6px 10px;border:1px solid #d1d5db;${cls}">${r.draw}</td>
        <td style="text-align:center;padding:6px 10px;border:1px solid #d1d5db;${cls}">${r.lose}</td>
        <td style="text-align:center;padding:6px 10px;border:1px solid #d1d5db;${cls}">${r.gf}</td>
        <td style="text-align:center;padding:6px 10px;border:1px solid #d1d5db;${cls}">${r.ga}</td>
        <td style="text-align:center;padding:6px 10px;border:1px solid #d1d5db;${cls}">${r.gd}</td>
        <td style="text-align:center;padding:6px 10px;border:1px solid #d1d5db;${cls}">${r.points}</td></tr>`;
    }).join("");
    return `<div style="flex:1;min-width:340px;">
      <h3 style="margin:0 0 8px;font-size:17px;">${g} 组</h3>
      <table style="border-collapse:collapse;font-size:14px;width:100%;">
        <thead><tr style="background:#e8efff;">
          <th style="padding:6px 14px;border:1px solid #d1d5db;">排名</th><th style="padding:6px 14px;border:1px solid #d1d5db;">队伍</th>
          <th style="padding:6px 10px;border:1px solid #d1d5db;">场次</th><th style="padding:6px 10px;border:1px solid #d1d5db;">胜</th>
          <th style="padding:6px 10px;border:1px solid #d1d5db;">平</th><th style="padding:6px 10px;border:1px solid #d1d5db;">负</th>
          <th style="padding:6px 10px;border:1px solid #d1d5db;">进球</th><th style="padding:6px 10px;border:1px solid #d1d5db;">失球</th>
          <th style="padding:6px 10px;border:1px solid #d1d5db;">净胜</th><th style="padding:6px 10px;border:1px solid #d1d5db;">积分</th>
        </tr></thead><tbody>${rows}</tbody>
      </table></div>`;
  }).join("");

  wrapper.innerHTML = `
    <h2 style="margin:0 0 4px;font-size:22px;">${title}</h2>
    <p style="margin:0 0 20px;color:#6b7280;font-size:13px;">导出时间：${dateStr}</p>
    <div style="display:flex;gap:24px;align-items:flex-start;">${groupTables}</div>
  `;
  document.body.appendChild(wrapper);

  try {
    const canvas = await html2canvas(wrapper, { scale: 2, backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    link.download = `积分榜_${state.currentSeason}_${dateStr.replace(/\//g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    alert("导出失败：" + err.message);
  }
  document.body.removeChild(wrapper);
}

async function exportScorersImage() {
  const sorted = [...state.scorers].sort((a, b) => b.goals - a.goals || a.team.localeCompare(b.team, "zh-CN") || a.player.localeCompare(b.player, "zh-CN"));
  if (sorted.length === 0) return alert("射手榜暂无数据。");

  const wrapper = document.createElement("div");
  wrapper.style.cssText = "position:fixed;left:-9999px;top:0;background:#fff;padding:24px 28px;font-family:'Microsoft YaHei',Arial,sans-serif;";
  const dateStr = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });

  const rows = sorted.map((s, i) => {
    const top3 = i < 3 ? "font-weight:700;" : "";
    return `<tr><td style="text-align:center;padding:6px 14px;border:1px solid #d1d5db;${top3}">${i + 1}</td>
      <td style="text-align:left;padding:6px 14px;border:1px solid #d1d5db;${top3}">${s.player}</td>
      <td style="text-align:left;padding:6px 14px;border:1px solid #d1d5db;${top3}">${s.team}</td>
      <td style="text-align:center;padding:6px 14px;border:1px solid #d1d5db;${top3}">${s.goals}</td></tr>`;
  }).join("");

  wrapper.innerHTML = `
    <h2 style="margin:0 0 4px;font-size:22px;">${state.currentSeason} 赛季 · 射手榜</h2>
    <p style="margin:0 0 20px;color:#6b7280;font-size:13px;">导出时间：${dateStr}</p>
    <table style="border-collapse:collapse;font-size:14px;">
      <thead><tr style="background:#e8efff;">
        <th style="padding:6px 14px;border:1px solid #d1d5db;">排名</th>
        <th style="padding:6px 14px;border:1px solid #d1d5db;">球员</th>
        <th style="padding:6px 14px;border:1px solid #d1d5db;">队伍</th>
        <th style="padding:6px 14px;border:1px solid #d1d5db;">进球</th>
      </tr></thead><tbody>${rows}</tbody>
    </table>
  `;
  document.body.appendChild(wrapper);

  try {
    const canvas = await html2canvas(wrapper, { scale: 2, backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    link.download = `射手榜_${state.currentSeason}_${dateStr.replace(/\//g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    alert("导出失败：" + err.message);
  }
  document.body.removeChild(wrapper);
}

async function exportCardsImage() {
  const sorted = [...state.cards].sort((a, b) => b.red - a.red || b.yellow - a.yellow || a.player.localeCompare(b.player, "zh-CN"));
  if (sorted.length === 0) return alert("红黄牌榜暂无数据。");

  const wrapper = document.createElement("div");
  wrapper.style.cssText = "position:fixed;left:-9999px;top:0;background:#fff;padding:24px 28px;font-family:'Microsoft YaHei',Arial,sans-serif;";
  const dateStr = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });

  const rows = sorted.map((c, i) => {
    const total = c.yellow + c.red;
    const top3 = i < 3 ? "font-weight:700;" : "";
    return `<tr><td style="text-align:center;padding:6px 14px;border:1px solid #d1d5db;${top3}">${i + 1}</td>
      <td style="text-align:left;padding:6px 14px;border:1px solid #d1d5db;${top3}">${c.player}</td>
      <td style="text-align:left;padding:6px 14px;border:1px solid #d1d5db;${top3}">${c.team}</td>
      <td style="text-align:center;padding:6px 10px;border:1px solid #d1d5db;${top3}">${c.yellow}</td>
      <td style="text-align:center;padding:6px 10px;border:1px solid #d1d5db;${top3}">${c.red}</td>
      <td style="text-align:center;padding:6px 10px;border:1px solid #d1d5db;${top3}">${total}</td></tr>`;
  }).join("");

  wrapper.innerHTML = `
    <h2 style="margin:0 0 4px;font-size:22px;">${state.currentSeason} 赛季 · 红黄牌榜</h2>
    <p style="margin:0 0 20px;color:#6b7280;font-size:13px;">导出时间：${dateStr}</p>
    <table style="border-collapse:collapse;font-size:14px;">
      <thead><tr style="background:#fff3cd;">
        <th style="padding:6px 14px;border:1px solid #d1d5db;">排名</th>
        <th style="padding:6px 14px;border:1px solid #d1d5db;">球员</th>
        <th style="padding:6px 14px;border:1px solid #d1d5db;">队伍</th>
        <th style="padding:6px 10px;border:1px solid #d1d5db;">🟡 黄牌</th>
        <th style="padding:6px 10px;border:1px solid #d1d5db;">🔴 红牌</th>
        <th style="padding:6px 10px;border:1px solid #d1d5db;">总计</th>
      </tr></thead><tbody>${rows}</tbody>
    </table>
  `;
  document.body.appendChild(wrapper);

  try {
    const canvas = await html2canvas(wrapper, { scale: 2, backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    link.download = `红黄牌榜_${state.currentSeason}_${dateStr.replace(/\//g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    alert("导出失败：" + err.message);
  }
  document.body.removeChild(wrapper);
}

async function exportKnockoutImage() {
  const el = document.querySelector("#knockoutSection");
  if (!el) return;
  const clone = el.cloneNode(true);
  clone.style.cssText = "position:fixed;left:-9999px;top:0;background:#fff;padding:20px;font-family:'Microsoft YaHei',Arial,sans-serif;width:1100px;";
  // Remove the export button and SVG from clone
  const btn = clone.querySelector("button");
  if (btn) btn.remove();
  const svg = clone.querySelector("svg");
  if (svg) svg.remove();
  const title = document.createElement("h2");
  title.textContent = `${state.currentSeason} 赛季 · 淘汰赛对阵图`;
  title.style.cssText = "margin:0 0 16px;font-size:22px;";
  clone.insertBefore(title, clone.firstChild);
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, { scale: 2, backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    const dateStr = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
    link.download = `淘汰赛对阵图_${state.currentSeason}_${dateStr.replace(/\//g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    alert("导出失败：" + err.message);
  }
  document.body.removeChild(clone);
}

function generateMatchSummary(dateStr) {
  const dayMatches = state.matches.filter((m) => m.date === dateStr && Array.isArray(m.score));
  if (dayMatches.length === 0) return "所选日期没有已录入比分的比赛。";

  const d = new Date(dateStr + "T00:00:00");
  const title = `【${d.getMonth() + 1}月${d.getDate()}日赛果简报】`;

  const groupLines = [];
  ["A", "B"].forEach((g) => {
    const gm = dayMatches.filter((m) => m.group === g);
    if (gm.length === 0) return;
    groupLines.push(`\n${g}组：`);
    gm.forEach((m) => {
      groupLines.push(`  ${m.home} ${m.score[0]}:${m.score[1]} ${m.away}`);
    });
  });

  // Collect scorers for these matches - from state.scorers
  // We don't have per-match scorer data, so list all scorers
  const scorerLines = [];
  const sortedScorers = [...state.scorers].filter((s) => s.goals > 0).sort((a, b) => b.goals - a.goals);
  if (sortedScorers.length > 0) {
    scorerLines.push("\n射手榜：");
    sortedScorers.slice(0, 10).forEach((s, i) => {
      scorerLines.push(`  ${i + 1}. ${s.player}(${s.team}) ×${s.goals}`);
    });
  }

  // Cards for the day
  const cardLines = [];
  const yellows = state.cards.filter((c) => c.yellow > 0);
  const reds = state.cards.filter((c) => c.red > 0);
  if (yellows.length > 0) {
    cardLines.push(`\n黄牌：${yellows.map((c) => `${c.player}(${c.team}${c.yellow > 1 ? "×" + c.yellow : ""})`).join("、")}`);
  }
  if (reds.length > 0) {
    cardLines.push(`红牌：${reds.map((c) => `${c.player}(${c.team})`).join("、")}`);
  }

  return [title, ...groupLines, ...scorerLines, ...cardLines].join("\n");
}

function getBackupPayload() {
  return {
    version: 2,
    season: state.currentSeason,
    exportedAt: new Date().toISOString(),
    groupATeams: state.groupATeams,
    groupBTeams: state.groupBTeams,
    matchSchedule: state.matchSchedule,
    knockoutSchedule: state.knockoutSchedule,
    matches: state.matches,
    knockoutMatches: state.knockoutMatches,
    scorers: state.scorers,
    cards: state.cards,
    players: state.players
  };
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function applyBackupPayload(payload) {
  if (!payload || !Array.isArray(payload.matches) || !Array.isArray(payload.scorers) || !Array.isArray(payload.cards)) {
    throw new Error("备份文件结构不正确");
  }
  if (Array.isArray(payload.groupATeams)) state.groupATeams = payload.groupATeams;
  if (Array.isArray(payload.groupBTeams)) state.groupBTeams = payload.groupBTeams;
  if (Array.isArray(payload.matchSchedule)) state.matchSchedule = payload.matchSchedule;
  if (Array.isArray(payload.knockoutSchedule)) state.knockoutSchedule = payload.knockoutSchedule;
  state.matches = payload.matches;
  if (Array.isArray(payload.knockoutMatches)) state.knockoutMatches = payload.knockoutMatches;
  state.scorers = payload.scorers;
  state.cards = payload.cards;
  if (Array.isArray(payload.players)) state.players = payload.players;
}

function updatePlayerDatalist(teamSelectId, datalistId) {
  const team = document.querySelector(teamSelectId)?.value;
  const datalist = document.querySelector(datalistId);
  if (!datalist) return;
  if (!team) { datalist.innerHTML = ""; return; }
  const players = PlayerPool.getByTeam(state, team);
  datalist.innerHTML = players.map((p) => `<option value="${p.player_name}">`).join("");
}

function renderPlayerPool() {
  PlayerPool.render(state, "#playersTable");
  const teamSelect = document.querySelector("#newPlayerTeam");
  if (teamSelect) {
    const allTeams = [...state.groupATeams, ...state.groupBTeams];
    const poolTeams = PlayerPool.getTeams(state);
    const mergedTeams = [...new Set([...allTeams, ...poolTeams])].sort((a, b) => a.localeCompare(b, "zh-CN"));
    teamSelect.innerHTML = `<option value="">选择队伍</option>${mergedTeams.map((t) => `<option value="${t}">${t}</option>`).join("")}`;
  }
}

function renderCardRulesUI() {
  const is2026 = state.currentSeason === "2026";
  const thresholdLabel = document.querySelector("#yellowThresholdInput")?.closest("label");
  const resetBtn = document.querySelector("#resetYellowCardsBtn")?.closest(".form-row");
  if (thresholdLabel) thresholdLabel.style.display = is2026 ? "none" : "";
  if (resetBtn) resetBtn.style.display = is2026 ? "none" : "";
  const el = document.querySelector("#yellowThresholdInput");
  if (el) el.value = state.cardRules?.yellowThreshold || 2;
  // Update hint text for 2026
  const hint = document.querySelector("#panel-cards .hint.admin-only");
  if (hint) {
    hint.textContent = is2026
      ? "管理员登录后：表格每行右侧有「删除」；也可用下方按姓名删除。2026 赛季使用经典模式（总计=黄牌+红牌）。"
      : "管理员登录后：表格每行右侧有「删除」；也可用下方按姓名删除。修改阈值后自动保存。半决赛前点「清零黄牌」：未达阈值的清零，已达阈值的保留（继续停赛）。";
  }
}

function renderSeasonConfigLists() {
  const taA = document.querySelector("#teamNamesInputA");
  const taB = document.querySelector("#teamNamesInputB");
  if (taA) taA.value = state.groupATeams.join("\n");
  if (taB) taB.value = state.groupBTeams.join("\n");
}

function bindEvents() {
  // --- Season selector ---
  bindIfExists("#seasonSelector", "change", async (e) => {
    await switchSeason(e.target.value);
  });

  bindIfExists("#addSeasonBtn", "click", async () => {
    if (!mustAdmin()) return;
    const newSeason = prompt("请输入新赛季年份（如 2027）：");
    if (!newSeason || !/^\d{4}$/.test(newSeason)) return alert("请输入有效的四位年份。");
    const seasons = getKnownSeasons();
    if (seasons.includes(newSeason)) return alert("该赛季已存在。");
    seasons.push(newSeason);
    seasons.sort();
    saveKnownSeasons(seasons);
    renderSeasonSelector();
    document.querySelector("#seasonSelector").value = newSeason;
    await switchSeason(newSeason);
  });

  bindIfExists("#deleteSeasonBtn", "click", async () => {
    if (!mustAdmin()) return;
    const season = state.currentSeason;
    const seasons = getKnownSeasons();
    if (seasons.length <= 1) return alert("至少保留一个赛季，无法删除。");
    if (!window.confirm(`确定删除 ${season} 赛季的所有数据吗？\n\n此操作不可恢复！包括：比赛结果、射手榜、红黄牌、球员库、赛程配置。`)) return;

    // Remove localStorage data
    localStorage.removeItem(storageKey(season));
    // Remove from seasons list
    const updated = seasons.filter((s) => s !== season);
    saveKnownSeasons(updated);
    // Switch to first remaining season
    await switchSeason(updated[0]);
    renderSeasonSelector();
  });

  // --- Player pool events ---
  bindIfExists("#playerForm", "submit", async (e) => {
    e.preventDefault();
    if (!mustAdmin()) return;
    const name = document.querySelector("#newPlayerName").value.trim();
    const number = document.querySelector("#newPlayerNumber").value;
    const team = document.querySelector("#newPlayerTeam").value;
    if (!name || !team) return alert("请输入姓名和队伍。");
    PlayerPool.add(state, name, number || null, team);
    e.target.reset();
    await persistChanges("保存球员失败");
    renderPlayerPool();
  });

  bindIfExists("#playersTable", "click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn || !mustAdmin()) return;
    if (btn.dataset.action === "remove-player") {
      PlayerPool.remove(state, btn.dataset.id);
      await persistChanges("删除球员失败");
      renderPlayerPool();
    }
  });

  bindIfExists("#clearPlayersBtn", "click", async () => {
    if (!mustAdmin()) return;
    if (!window.confirm("确定清空当前赛季所有球员数据？")) return;
    state.players = [];
    await persistChanges("清空球员库失败");
    renderPlayerPool();
  });

  // Excel drop zone
  const dropZone = document.querySelector("#excelDropZone");
  if (dropZone) {
    dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.classList.add("drag-over"); });
    dropZone.addEventListener("dragleave", () => { dropZone.classList.remove("drag-over"); });
    dropZone.addEventListener("drop", async (e) => {
      e.preventDefault();
      dropZone.classList.remove("drag-over");
      if (!mustAdmin()) return;
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (!file.name.match(/\.xlsx?$/i)) return alert("请拖入 .xlsx 或 .xls 文件。");
      try {
        document.querySelector("#playerPoolResult").textContent = "正在解析 Excel...";
        const rows = await PlayerPool.parseExcelFile(file);
        if (!window.confirm(`解析到 ${rows.length} 名球员，确定导入？`)) return;
        rows.forEach((r) => PlayerPool.add(state, r.name, r.number, r.team));
        await persistChanges("导入球员失败");
        renderPlayerPool();
        document.querySelector("#playerPoolResult").textContent = `成功导入 ${rows.length} 名球员。`;
      } catch (err) {
        document.querySelector("#playerPoolResult").textContent = `导入失败：${err.message}`;
      }
    });
  }

  bindIfExists("#excelFileInput", "change", async (e) => {
    if (!mustAdmin()) return;
    const file = e.target.files[0];
    if (!file) return;
    try {
      document.querySelector("#playerPoolResult").textContent = "正在解析 Excel...";
      const rows = await PlayerPool.parseExcelFile(file);
      if (!window.confirm(`解析到 ${rows.length} 名球员，确定导入？`)) { e.target.value = ""; return; }
      rows.forEach((r) => PlayerPool.add(state, r.name, r.number, r.team));
      await persistChanges("导入球员失败");
      renderPlayerPool();
      document.querySelector("#playerPoolResult").textContent = `成功导入 ${rows.length} 名球员。`;
    } catch (err) {
      document.querySelector("#playerPoolResult").textContent = `导入失败：${err.message}`;
    }
    e.target.value = "";
  });

  bindIfExists("#parsePastePlayersBtn", "click", async () => {
    if (!mustAdmin()) return;
    const text = document.querySelector("#pastePlayersInput").value.trim();
    if (!text) return alert("请粘贴表格数据。");
    const rows = PlayerPool.parsePastedText(text);
    if (rows.length === 0) return alert("未能解析出球员数据，请检查格式。");
    if (!window.confirm(`解析到 ${rows.length} 名球员，确定导入？`)) return;
    rows.forEach((r) => PlayerPool.add(state, r.name, r.number, r.team));
    await persistChanges("导入球员失败");
    renderPlayerPool();
    document.querySelector("#pastePlayersInput").value = "";
    document.querySelector("#playerPoolResult").textContent = `成功导入 ${rows.length} 名球员。`;
  });

  // --- Season config events ---
  bindIfExists("#generateScheduleBtn", "click", async () => {
    if (!mustAdmin()) return;
    const rawA = document.querySelector("#teamNamesInputA").value.trim();
    const rawB = document.querySelector("#teamNamesInputB").value.trim();
    const teamsA = rawA.split(/\r?\n/).map((t) => t.trim()).filter(Boolean);
    const teamsB = rawB.split(/\r?\n/).map((t) => t.trim()).filter(Boolean);
    if (teamsA.length < 2 || teamsB.length < 2) return alert("每组至少需要 2 支球队。");
    const allTeams = [...teamsA, ...teamsB];
    // Check for duplicates
    const dupes = allTeams.filter((t, i) => allTeams.indexOf(t) !== i);
    if (dupes.length > 0) return alert(`以下球队重复出现：${[...new Set(dupes)].join("、")}`);
    const startDate = document.querySelector("#groupStartDate").value || `${state.currentSeason}-03-23`;

    const msg = `即将生成 ${state.currentSeason} 赛季配置：\n\nA 组（${teamsA.length} 队）：${teamsA.join("、")}\nB 组（${teamsB.length} 队）：${teamsB.join("、")}\n\n此操作将覆盖当前赛季所有数据，确定继续？`;
    if (!window.confirm(msg)) return;

    const matchesA = ScheduleUtils.generateRoundRobin(teamsA, "A", state.currentSeason, startDate);
    const matchesB = ScheduleUtils.generateRoundRobin(teamsB, "B", state.currentSeason, startDate);
    const knockoutMatches = ScheduleUtils.generateKnockoutBracket(state.currentSeason);

    state.groupATeams = teamsA;
    state.groupBTeams = teamsB;
    state.matchSchedule = [...matchesA, ...matchesB];
    state.knockoutSchedule = knockoutMatches;
    state.matches = [...matchesA, ...matchesB].map((m) => ({ ...m }));
    state.knockoutMatches = knockoutMatches.map((m) => ({ ...m }));
    state.scorers = [];
    state.cards = [];
    state.players = [];

    await persistChanges("保存赛季配置失败");
    populateTeamSelects();
    renderSeasonConfigLists();
    renderPlayerPool();
    document.querySelector("#seasonConfigResult").textContent = `赛季配置已生成：A 组 ${teamsA.length} 队，B 组 ${teamsB.length} 队，共 ${matchesA.length + matchesB.length} 场小组赛。`;
    drawKnockoutArrows();
  });

  bindIfExists("#resetSeasonBtn", "click", async () => {
    if (!mustAdmin()) return;
    if (!window.confirm("确定清空当前赛季所有数据（包括比分、射手、红黄牌、球员库、赛程配置）？")) return;
    state.matchSchedule = [];
    state.knockoutSchedule = [];
    state.matches = [];
    state.knockoutMatches = [];
    state.scorers = [];
    state.cards = [];
    state.players = [];
    state.groupATeams = [];
    state.groupBTeams = [];
    state.lastNoticeHash = "";
    await persistChanges("重置赛季数据失败");
    populateTeamSelects();
    renderSeasonConfigLists();
    renderPlayerPool();
    document.querySelector("#teamNamesInputA").value = "";
    document.querySelector("#teamNamesInputB").value = "";
    document.querySelector("#seasonConfigResult").textContent = "赛季数据已重置。";
    drawKnockoutArrows();
  });

  // --- Datalist update on team select ---
  ["#playerTeam", "#cardPlayerTeam", "#quickDeleteScorerTeam", "#quickDeleteCardTeam"].forEach((selId) => {
    const el = document.querySelector(selId);
    if (!el) return;
    el.addEventListener("change", () => {
      if (selId.includes("Scorer")) updatePlayerDatalist("#quickDeleteScorerTeam", "#quickDeleteScorerSuggestions");
      else if (selId.includes("Card")) updatePlayerDatalist("#quickDeleteCardTeam", "#quickDeleteCardSuggestions");
      else if (selId === "#playerTeam") updatePlayerDatalist("#playerTeam", "#playerNameSuggestions");
      else if (selId === "#cardPlayerTeam") updatePlayerDatalist("#cardPlayerTeam", "#cardPlayerNameSuggestions");
    });
  });

  // --- Match results ---
  bindIfExists("#matchInputList", "click", async (e) => {
    const btn = e.target.closest("button"); if (!btn || !mustAdmin()) return;
    const id = btn.dataset.id; const action = btn.dataset.action;
    const m = state.matches.find((x) => x.id === id); if (!m) return;
    if (action === "save-match") {
      const h = Number(document.querySelector(`#home-${id}`).value);
      const a = Number(document.querySelector(`#away-${id}`).value);
      if (!Number.isInteger(h) || !Number.isInteger(a) || h < 0 || a < 0) return alert("请输入合法比分");
      m.score = [h, a];
      // Auto-clear suspensions for players on these teams
      clearSuspensionsForTeams(m.home, m.away);
    }
    if (action === "clear-match") m.score = null;
    await persistChanges("保存比分失败");
  });

  bindIfExists("#scorerForm", "submit", async (e) => {
    e.preventDefault(); if (!mustAdmin()) return;
    const p = normalizePlayerName(document.querySelector("#playerName").value.trim());
    const t = document.querySelector("#playerTeam").value; const g = Number(document.querySelector("#playerGoals").value);
    if (!p || !t || !Number.isInteger(g) || g <= 0) return alert("请输入完整信息");
    const row = state.scorers.find((x) => x.player === p && x.team === t);
    if (row) row.goals += g; else state.scorers.push({ id: makeId(), player: p, team: t, goals: g });
    e.target.reset();
    await persistChanges("保存射手榜失败");
  });

  bindIfExists("#scorersTable", "click", async (e) => {
    const btn = e.target.closest("button"); if (!btn || !mustAdmin()) return;
    if (btn.dataset.action !== "remove-scorer") return;
    if (!window.confirm("确定删除该条射手记录？")) return;
    state.scorers = state.scorers.filter((x) => x.id !== btn.dataset.id);
    await persistChanges("删除射手失败");
  });

  bindIfExists("#quickDeleteScorerForm", "submit", async (e) => {
    e.preventDefault();
    if (!mustAdmin()) return;
    const t = document.querySelector("#quickDeleteScorerTeam").value;
    const p = normalizePlayerName(document.querySelector("#quickDeleteScorerName").value.trim());
    if (!t || !p) return alert("请选择队伍并填写球员姓名。");
    const before = state.scorers.length;
    state.scorers = state.scorers.filter((x) => !(x.team === t && x.player === p));
    if (state.scorers.length === before) return alert("未找到该球员记录。");
    e.target.reset();
    await persistChanges("删除射手失败");
  });

  bindIfExists("#cardForm", "submit", async (e) => {
    e.preventDefault(); if (!mustAdmin()) return;
    const p = normalizePlayerName(document.querySelector("#cardPlayerName").value.trim());
    const t = document.querySelector("#cardPlayerTeam").value;
    const ct = document.querySelector("#cardType").value;
    const c = Number(document.querySelector("#cardCount").value);
    if (!p || !t || !ct || !Number.isInteger(c) || c <= 0) return alert("请输入完整信息");
    let row = state.cards.find((x) => x.player === p && x.team === t);
    if (!row) { row = { id: makeId(), player: p, team: t, yellow: 0, red: 0, suspended: false }; state.cards.push(row); }
    row[ct] += c;
    e.target.reset();
    await persistChanges("保存红黄牌失败");
  });

  bindIfExists("#cardsTable", "click", async (e) => {
    const btn = e.target.closest("button"); if (!btn || !mustAdmin()) return;
    if (btn.dataset.action !== "remove-card") return;
    if (!window.confirm("确定删除该条红黄牌记录？")) return;
    state.cards = state.cards.filter((x) => x.id !== btn.dataset.id);
    await persistChanges("删除红黄牌失败");
  });

  bindIfExists("#quickDeleteCardForm", "submit", async (e) => {
    e.preventDefault();
    if (!mustAdmin()) return;
    const t = document.querySelector("#quickDeleteCardTeam").value;
    const p = normalizePlayerName(document.querySelector("#quickDeleteCardName").value.trim());
    if (!t || !p) return alert("请选择队伍并填写球员姓名。");
    const before = state.cards.length;
    state.cards = state.cards.filter((x) => !(x.team === t && x.player === p));
    if (state.cards.length === before) return alert("未找到该球员记录。");
    e.target.reset();
    await persistChanges("删除红黄牌失败");
  });

  bindIfExists("#parseNoticeBtn", "click", async () => {
    if (!mustAdmin()) return;
    if (state.parseInProgress) return;
    const text = document.querySelector("#noticeInput").value.trim();
    if (!text) return alert("请先粘贴公告");
    const noticeHash = hashText(text);
    const forceParse = document.querySelector("#forceParseNotice")?.checked;
    if (!forceParse && state.lastNoticeHash === noticeHash) {
      document.querySelector("#parseResult").textContent = "检测到与上次相同公告，已拦截重复解析。如需再解析一次，请勾选「强制重新解析」。";
      return;
    }
    try {
      state.parseInProgress = true;
      parseNotice(text);
      state.lastNoticeHash = noticeHash;
      document.querySelector("#parseResult").textContent = "解析完成（增量更新，不会清空未提及场次）。";
      await persistChanges("公告解析保存失败");
    } finally {
      state.parseInProgress = false;
    }
  });

  bindIfExists("#exportStandingsBtn", "click", async () => {
    await exportStandingsImage();
  });

  bindIfExists("#exportKnockoutBtn", "click", async () => {
    await exportKnockoutImage();
  });

  bindIfExists("#exportScorersBtn", "click", async () => {
    await exportScorersImage();
  });

  bindIfExists("#exportCardsBtn", "click", async () => {
    await exportCardsImage();
  });

  bindIfExists("#generateSummaryBtn", "click", () => {
    const dateEl = document.querySelector("#summaryDate");
    const dateStr = dateEl?.value;
    if (!dateStr) return alert("请先选择日期。");
    const text = generateMatchSummary(dateStr);
    navigator.clipboard.writeText(text).then(() => {
      alert("赛果简报已复制到剪贴板！\n\n" + text);
    }).catch(() => {
      alert(text);
    });
  });

  bindIfExists("#yellowThresholdInput", "change", async (e) => {
    if (!mustAdmin()) return;
    const val = Number(e.target.value);
    if (!Number.isInteger(val) || val < 1 || val > 5) return alert("阈值请设为 1-5 之间。");
    state.cardRules.yellowThreshold = val;
    await persistChanges("保存阈值失败");
    renderCards();
  });

  bindIfExists("#resetYellowCardsBtn", "click", async () => {
    if (!mustAdmin()) return;
    const threshold = state.cardRules?.yellowThreshold || 2;
    const cleared = state.cards.filter((c) => c.yellow < threshold && c.yellow > 0);
    const kept = state.cards.filter((c) => c.yellow >= threshold);
    if (cleared.length === 0) {
      return alert("没有需要清零的球员。所有有黄牌的球员均已达到停赛阈值。");
    }
    const msg = `即将执行半决赛前黄牌清零：\n\n阈值：${threshold} 张停赛\n清零球员（黄牌 < ${threshold}）：${cleared.length} 人\n${cleared.map((c) => `  ${c.player}(${c.team}) ${c.yellow}黄→0`).join("\n")}\n${kept.length > 0 ? `\n保留球员（已达阈值，继续停赛）：${kept.length} 人\n${kept.map((c) => `  ${c.player}(${c.team}) ${c.yellow}黄 — 停赛`).join("\n")}` : ""}\n\n此操作不可恢复，确定继续？`;
    if (!window.confirm(msg)) return;
    cleared.forEach((c) => { c.yellow = 0; });
    await persistChanges("清零黄牌失败");
  });

  bindIfExists("#resetResultsBtn", "click", async () => {
    if (!mustAdmin()) return;
    state.matches.forEach((m) => { m.score = null; });
    await persistChanges("清空比分失败");
  });

  bindIfExists("#clearScorersBtn", "click", async () => {
    if (!mustAdmin()) return;
    state.scorers = [];
    await persistChanges("清空射手榜失败");
  });
  bindIfExists("#clearCardsBtn", "click", async () => {
    if (!mustAdmin()) return;
    state.cards = [];
    await persistChanges("清空红黄牌榜失败");
  });

  bindIfExists("#knockoutInputList", "click", async (e) => {
    const btn = e.target.closest("button"); if (!btn || !mustAdmin()) return;
    const id = btn.dataset.id; const action = btn.dataset.action;
    const m = state.knockoutMatches.find((x) => x.id === id); if (!m) return;
    if (action === "save-ko") {
      const h = Number(document.querySelector(`#ko-home-${id}`).value);
      const a = Number(document.querySelector(`#ko-away-${id}`).value);
      const ph = document.querySelector(`#ko-pen-home-${id}`).value;
      const pa = document.querySelector(`#ko-pen-away-${id}`).value;
      if (!Number.isInteger(h) || !Number.isInteger(a) || h < 0 || a < 0) return alert("请输入合法比分");
      m.score = [h, a];
      m.penalty = (ph && pa) ? [Number(ph), Number(pa)] : null;
    }
    if (action === "clear-ko") { m.score = null; m.penalty = null; }
    await persistChanges("保存淘汰赛比分失败");
  });

  bindIfExists("#resetKnockoutBtn", "click", async () => {
    if (!mustAdmin()) return;
    state.knockoutMatches.forEach((m) => { m.score = null; m.penalty = null; });
    await persistChanges("清空淘汰赛比分失败");
  });

  bindIfExists("#adminLoginForm", "submit", async (e) => {
    e.preventDefault();
    if (state.mode !== "cloud") return alert("请先配置 Supabase 才能启用管理员登录。");
    const email = document.querySelector("#adminEmail").value.trim();
    const password = document.querySelector("#adminPassword").value;
    const { error } = await state.supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(`登录失败：${error.message}`);
    await refreshAuth();
  });

  bindIfExists("#adminLogoutBtn", "click", async () => {
    if (state.mode !== "cloud") return;
    await state.supabase.auth.signOut();
    await refreshAuth();
  });

  bindIfExists("#changePasswordForm", "submit", async (e) => {
    e.preventDefault();
    if (!mustAdmin()) return;
    if (state.mode !== "cloud") return alert("仅云端模式支持修改密码。");
    const newPassword = document.querySelector("#newPasswordInput").value;
    if (!newPassword || newPassword.length < 6) return alert("新密码至少 6 位。");
    const { error } = await state.supabase.auth.updateUser({ password: newPassword });
    if (error) return alert(`修改密码失败：${error.message}`);
    document.querySelector("#newPasswordInput").value = "";
    document.querySelector("#passwordManageResult").textContent = "密码修改成功。";
  });

  bindIfExists("#resetPasswordForm", "submit", async (e) => {
    e.preventDefault();
    if (!mustAdmin()) return;
    if (state.mode !== "cloud") return alert("仅云端模式支持密码重置邮件。");
    const inputEmail = document.querySelector("#resetEmailInput").value.trim().toLowerCase();
    const targetEmail = inputEmail || (state.currentUserEmail || "").toLowerCase();
    if (!targetEmail) return alert("请输入目标邮箱，或先登录账号。");
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const { error } = await state.supabase.auth.resetPasswordForEmail(targetEmail, { redirectTo });
    if (error) return alert(`发送失败：${error.message}`);
    document.querySelector("#resetEmailInput").value = "";
    document.querySelector("#passwordManageResult").textContent = `重置邮件已发送至：${targetEmail}`;
  });

  bindIfExists("#adminManageForm", "submit", async (e) => {
    e.preventDefault();
    if (!mustAdmin()) return;
    if (!state.canManageAdmins) return alert("仅超级管理员可添加管理员。");
    if (state.mode !== "cloud") return alert("仅云端模式可管理管理员。");
    const email = document.querySelector("#newAdminEmail").value.trim().toLowerCase();
    if (!email) return alert("请输入管理员邮箱。");
    const role = document.querySelector("#newAdminRole").value;
    const { error } = await state.supabase
      .from("admin_users")
      .upsert({ email, role, is_active: true }, { onConflict: "email" });
    if (error) return alert(`添加管理员失败：${error.message}`);
    document.querySelector("#newAdminEmail").value = "";
    await loadAdminUsers();
    renderAdminUsers();
    const roleLabel = role === "media_editor" ? "媒体编辑" : "管理员";
    document.querySelector("#adminManageResult").textContent = `已添加${roleLabel}：${email}`;
  });

  bindIfExists("#adminUsersTable", "click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (!mustAdmin()) return;
    if (!state.canManageAdmins) return alert("仅超级管理员可禁用/启用管理员。");
    if (state.mode !== "cloud") return alert("仅云端模式可管理管理员。");
    if (btn.dataset.action !== "toggle-admin") return;
    const email = btn.dataset.email;
    const row = state.adminUsers.find((u) => u.email === email);
    if (!row) return;
    if (email === state.currentUserEmail) return alert("不能禁用当前登录管理员。");
    const { error } = await state.supabase
      .from("admin_users")
      .update({ is_active: !row.is_active })
      .eq("email", email);
    if (error) return alert(`更新管理员状态失败：${error.message}`);
    await loadAdminUsers();
    renderAdminUsers();
    document.querySelector("#adminManageResult").textContent = `已${row.is_active ? "禁用" : "启用"}管理员：${email}`;
  });

  bindIfExists("#exportBackupBtn", "click", () => {
    if (!mustAdmin()) return;
    const now = new Date();
    const filename = `football-backup-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}.json`;
    downloadJson(filename, getBackupPayload());
    document.querySelector("#backupResult").textContent = "备份已导出。";
  });

  bindIfExists("#importBackupInput", "change", async (e) => {
    if (!mustAdmin()) return;
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      if (!window.confirm("将用该备份覆盖当前数据，确定继续吗？")) return;
      applyBackupPayload(payload);
      saveLocal();
      await saveCloudAll();
      renderAll();
      document.querySelector("#backupResult").textContent = "备份恢复成功。";
    } catch (error) {
      alert(`恢复失败：${error.message}`);
    } finally {
      e.target.value = "";
    }
  });

  bindIfExists("#reloadCloudBtn", "click", async () => {
    if (!mustAdmin()) return;
    if (state.mode !== "cloud") return alert("当前不是云端模式。");
    try {
      await loadCloudData();
      saveLocal();
      renderAll();
      document.querySelector("#backupResult").textContent = "已从云端重新读取。";
    } catch (error) {
      alert(`读取云端失败：${error.message}`);
    }
  });

  // Media upload
  bindIfExists("#mediaUploadForm", "submit", async (e) => {
    e.preventDefault();
    if (!mustMediaEditor()) return;
    const fileInput = document.querySelector("#mediaFileInput");
    const file = fileInput.files?.[0];
    if (!file) return alert("请选择文件。");
    const maxSize = file.type.startsWith("video/") ? 200 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxSize) return alert(`文件过大。${file.type.startsWith("video/") ? "视频" : "图片"}最大 ${maxSize / 1024 / 1024}MB。`);
    const dateEl = document.querySelector("#mediaUploadDate");
    if (!dateEl.value) dateEl.value = new Date().toISOString().slice(0, 10);
    const mediaDate = dateEl.value;
    const description = document.querySelector("#mediaDescription").value.trim();
    const resultEl = document.querySelector("#mediaUploadResult");
    resultEl.textContent = "上传中...";
    try {
      await uploadMatchMedia(file, mediaDate, description);
      fileInput.value = "";
      document.querySelector("#mediaDescription").value = "";
      resultEl.textContent = "上传成功！";
    } catch (err) {
      resultEl.textContent = `上传失败：${err.message}`;
    }
  });

  // Date filter
  bindIfExists("#mediaDateFilter", "change", () => renderMatchMedia());

  // Delete media
  bindIfExists("#matchMediaGallery", "click", (e) => {
    const btn = e.target.closest("[data-action='delete-media']");
    if (!btn) return;
    if (!mustMediaEditor()) return;
    deleteMatchMedia(btn.dataset.id);
  });

  // Init media upload date to today
  const mediaDateEl = document.querySelector("#mediaUploadDate");
  if (mediaDateEl) mediaDateEl.value = new Date().toISOString().slice(0, 10);
}

async function refreshAuth() {
  if (state.mode !== "cloud") {
    state.canEdit = true;
    state.currentUserEmail = "local-admin";
    state.adminRole = "owner";
    state.canManageAdmins = true;
    updateModeUI();
    return;
  }
  const { data } = await state.supabase.auth.getSession();
  const email = data?.session?.user?.email || "";
  state.currentUserEmail = email;
  if (!email) {
    state.canEdit = false;
    state.adminRole = "";
    state.canManageAdmins = false;
    updateModeUI();
    return;
  }

  // 优先从云端管理员表判断；失败时回退前端白名单
  try {
    const { data: adminRow, error } = await state.supabase
      .from("admin_users")
      .select("email,is_active,role")
      .eq("email", email)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw error;
    state.canEdit = !!adminRow;
    state.adminRole = adminRow?.role || "";
    state.isMediaOnly = state.adminRole === "media_editor";
    state.canManageAdmins = state.adminRole === "owner";
    if (state.canEdit) await loadAdminUsers();
  } catch (err) {
    console.warn("admin_users check failed, fallback ADMIN_EMAILS:", err);
    state.canEdit = ADMIN_EMAILS.includes(email);
    state.adminRole = state.canEdit ? "owner" : "";
    state.canManageAdmins = state.canEdit;
    state.adminUsers = [];
  }
  updateModeUI();
}

async function tryInitSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !window.supabase) {
    state.mode = "local";
    return;
  }
  try {
    state.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    state.mode = "cloud";
    await loadCloudData();
    await refreshAuth();
  } catch (e) {
    console.warn(e);
    state.mode = "local";
  }
}

async function init() {
  migrateV3toV4();
  loadLocal();

  // Ensure default 2026 config if empty
  if (state.currentSeason === "2026" && state.matchSchedule.length === 0) {
    state.groupATeams = [...CONFIG.groups.A];
    state.groupBTeams = [...CONFIG.groups.B];
    state.matchSchedule = CONFIG.matches.map((m) => ({ ...m }));
    state.knockoutSchedule = CONFIG.knockoutMatches.map((m) => ({ ...m }));
    state.matches = CONFIG.matches.map((m) => ({ ...m }));
    state.scorers = INITIAL_SCORERS.map((s) => ({ ...s, id: makeId() }));
    state.cards = INITIAL_CARDS.map((c) => ({ ...c, id: makeId() }));
  }

  populateTeamSelects();
  await tryInitSupabase();
  if (state.mode === "local") {
    state.canEdit = true;
    state.currentUserEmail = "local-admin";
  }
  // Set summary date to last match date or today
  const summaryDateEl = document.querySelector("#summaryDate");
  if (summaryDateEl) {
    const playedDates = state.matches.filter((m) => Array.isArray(m.score)).map((m) => m.date).sort();
    summaryDateEl.value = playedDates.length > 0 ? playedDates[playedDates.length - 1] : new Date().toISOString().slice(0, 10);
  }

  renderSeasonSelector();
  renderAll();
  bindEvents();
  initTabSwitch();
  drawKnockoutArrows();
  window.addEventListener("resize", () => drawKnockoutArrows());
}

function initTabSwitch() {
  const tabBar = document.querySelector(".tab-bar");
  if (!tabBar) return;
  tabBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    const tab = btn.dataset.tab;
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b === btn));
    document.querySelectorAll(".tab-panel").forEach((p) => {
      const isTarget = p.id === `panel-${tab}`;
      p.classList.toggle("hidden", !isTarget);
    });
  });
}

init();
