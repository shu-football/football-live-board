// schedule-utils.js — 赛程生成工具
const ScheduleUtils = (() => {
  // Fisher-Yates shuffle
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Split teams into A/B groups. Equal split; A gets extra if odd.
  function splitGroups(teams, doShuffle) {
    if (doShuffle) teams = shuffle(teams);
    const half = Math.ceil(teams.length / 2);
    return {
      groupA: teams.slice(0, half),
      groupB: teams.slice(half)
    };
  }

  // Add days to a date string (YYYY-MM-DD)
  function addDays(dateStr, days) {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  // Generate single round-robin schedule. Uses circle method.
  // Returns array of { id, date, round, group, home, away }
  function generateRoundRobin(teams, groupCode, season, startDate) {
    const n = teams.length;
    if (n < 2) return [];

    const isOdd = n % 2 !== 0;
    const entries = isOdd ? [...teams, null] : [...teams]; // null = BYE
    const m = entries.length;
    const rounds = m - 1;
    const half = m / 2;
    const matches = [];
    let fixed = [...entries];

    for (let r = 0; r < rounds; r++) {
      const date = addDays(startDate, r * 2);
      let matchIdx = 0;
      for (let i = 0; i < half; i++) {
        const home = fixed[i];
        const away = fixed[m - 1 - i];
        if (home === null || away === null) continue; // skip BYE
        const id = `${season}-${groupCode}-R${r + 1}-${matchIdx + 1}`;
        matches.push({ id, date, round: r + 1, group: groupCode, home, away, score: null });
        matchIdx++;
      }
      // Rotate: keep fixed[0], shift right by 1
      const last = fixed.pop();
      fixed.splice(1, 0, last);
    }
    return matches;
  }

  // Generate knockout bracket. Fixed 8-match bracket: QF1-4, SF1-2, Third, Final.
  function generateKnockoutBracket(season) {
    return [
      { id: `${season}-QF1`, round: "QF", homeSeed: "A1", awaySeed: "B4", date: null, score: null, penalty: null },
      { id: `${season}-QF2`, round: "QF", homeSeed: "A3", awaySeed: "B2", date: null, score: null, penalty: null },
      { id: `${season}-QF3`, round: "QF", homeSeed: "B1", awaySeed: "A4", date: null, score: null, penalty: null },
      { id: `${season}-QF4`, round: "QF", homeSeed: "B3", awaySeed: "A2", date: null, score: null, penalty: null },
      { id: `${season}-SF1`, round: "SF", homeFrom: `${season}-QF1-winner`, awayFrom: `${season}-QF2-winner`, date: null, score: null, penalty: null },
      { id: `${season}-SF2`, round: "SF", homeFrom: `${season}-QF3-winner`, awayFrom: `${season}-QF4-winner`, date: null, score: null, penalty: null },
      { id: `${season}-Third`, round: "Third", homeFrom: `${season}-SF1-loser`, awayFrom: `${season}-SF2-loser`, date: null, score: null, penalty: null },
      { id: `${season}-Final`, round: "Final", homeFrom: `${season}-SF1-winner`, awayFrom: `${season}-SF2-winner`, date: null, score: null, penalty: null }
    ];
  }

  // Generate full season config: split, round-robin x2, knockout bracket
  function generateSeasonConfig(teams, season, startDate) {
    if (!startDate) startDate = `${season}-03-23`;
    const { groupA, groupB } = splitGroups(teams, false);
    return {
      groupATeams: groupA,
      groupBTeams: groupB,
      matches: [
        ...generateRoundRobin(groupA, "A", season, startDate),
        ...generateRoundRobin(groupB, "B", season, startDate)
      ],
      knockoutMatches: generateKnockoutBracket(season)
    };
  }

  return { shuffle, splitGroups, generateRoundRobin, generateKnockoutBracket, generateSeasonConfig };
})();
