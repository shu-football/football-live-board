// draw.js — 线上抽签逻辑

let drawState = {
  teams: [],
  groupA: [],
  groupB: [],
  animating: false
};

function generateSlots() {
  const raw = document.querySelector("#drawTeamInput").value.trim();
  const teams = raw.split(/\r?\n/).map((t) => t.trim()).filter(Boolean);
  if (teams.length < 4) {
    document.querySelector("#drawStatus").textContent = "请至少输入 4 支球队。";
    return false;
  }
  drawState.teams = teams;
  const half = Math.ceil(teams.length / 2);
  const countA = half;
  const countB = teams.length - half;

  const slotsA = document.querySelector("#slotsA");
  const slotsB = document.querySelector("#slotsB");
  slotsA.innerHTML = Array.from({ length: countA }, (_, i) =>
    `<div class="draw-slot empty" data-group="A" data-index="${i}">?</div>`
  ).join("");
  slotsB.innerHTML = Array.from({ length: countB }, (_, i) =>
    `<div class="draw-slot empty" data-group="B" data-index="${i}">?</div>`
  ).join("");

  document.querySelector("#drawResultSection").style.display = "none";
  document.querySelector("#drawStatus").textContent = `已就绪：${teams.length} 支球队，A 组 ${countA} 席，B 组 ${countB} 席。`;
  return true;
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function runDrawAnimation() {
  if (drawState.animating) return;
  drawState.animating = true;

  const btn = document.querySelector("#startDrawBtn");
  btn.disabled = true;
  document.querySelector("#drawStatus").textContent = "抽签进行中...";

  // Split with shuffle
  const { groupA, groupB } = ScheduleUtils.splitGroups(drawState.teams, true);
  drawState.groupA = groupA;
  drawState.groupB = groupB;

  const allSlots = [...document.querySelectorAll(".draw-slot")];
  const allNames = [...drawState.teams];
  const shuffledPool = [...allNames];

  allSlots.forEach((slot) => {
    slot.textContent = shuffledPool[Math.floor(Math.random() * shuffledPool.length)];
    slot.classList.add("animating");
    slot.classList.remove("empty", "revealed");
  });

  // Phase 1: Fast cycling (1.5s, 80ms interval)
  await cyclePhase(allSlots, shuffledPool, 1500, 80);
  // Phase 2: Medium cycling (1s, 200ms interval)
  await cyclePhase(allSlots, shuffledPool, 1000, 200);
  // Phase 3: Slow cycling (0.8s, 450ms interval)
  await cyclePhase(allSlots, shuffledPool, 800, 450);
  // Brief pause
  await sleep(300);

  // Reveal final results
  revealResults();

  drawState.animating = false;
  btn.disabled = false;
  document.querySelector("#drawStatus").textContent = "抽签完成！";
  document.querySelector("#drawResultSection").style.display = "block";
}

function cyclePhase(slots, pool, duration, interval) {
  return new Promise((resolve) => {
    const start = Date.now();
    const timer = setInterval(() => {
      // Shuffle pool and randomly assign
      ScheduleUtils.shuffle(pool);
      slots.forEach((slot, i) => {
        slot.textContent = pool[i % pool.length];
      });
      if (Date.now() - start >= duration) {
        clearInterval(timer);
        resolve();
      }
    }, interval);
  });
}

function revealResults() {
  const slotsA = document.querySelectorAll("#slotsA .draw-slot");
  const slotsB = document.querySelectorAll("#slotsB .draw-slot");

  // Reveal A group slots sequentially
  drawState.groupA.forEach((team, i) => {
    if (slotsA[i]) {
      setTimeout(() => {
        slotsA[i].textContent = team;
        slotsA[i].classList.remove("animating");
        slotsA[i].classList.add("revealed");
      }, i * 120);
    }
  });
  // Clear extra A slots if any
  for (let i = drawState.groupA.length; i < slotsA.length; i++) {
    if (slotsA[i]) {
      setTimeout(() => {
        slotsA[i].textContent = "";
        slotsA[i].classList.remove("animating");
        slotsA[i].style.opacity = "0";
      }, drawState.groupA.length * 120);
    }
  }

  // Reveal B group slots sequentially
  const delayB = drawState.groupA.length * 120 + 200;
  drawState.groupB.forEach((team, i) => {
    if (slotsB[i]) {
      setTimeout(() => {
        slotsB[i].textContent = team;
        slotsB[i].classList.remove("animating");
        slotsB[i].classList.add("revealed");
      }, delayB + i * 120);
    }
  });

  // Populate result lists
  const finalDelay = delayB + drawState.groupB.length * 120 + 300;
  setTimeout(() => {
    document.querySelector("#resultGroupA").innerHTML = drawState.groupA.map((t) => `<li>${t}</li>`).join("");
    document.querySelector("#resultGroupB").innerHTML = drawState.groupB.map((t) => `<li>${t}</li>`).join("");
  }, finalDelay);
}

function exportResult() {
  const lines = [
    "===== 抽签结果 =====",
    "",
    "A 组：",
    ...drawState.groupA.map((t, i) => `  ${i + 1}. ${t}`),
    "",
    "B 组：",
    ...drawState.groupB.map((t, i) => `  ${i + 1}. ${t}`),
    "",
    "===================="
  ];
  const text = lines.join("\n");
  navigator.clipboard.writeText(text).then(() => {
    document.querySelector("#drawStatus").textContent = "结果已复制到剪贴板。";
  }).catch(() => {
    document.querySelector("#drawStatus").textContent = "复制失败，请手动复制下方结果。";
  });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#drawTeamInput").addEventListener("input", generateSlots);
  generateSlots();

  document.querySelector("#startDrawBtn").addEventListener("click", () => {
    if (!generateSlots()) return;
    runDrawAnimation();
  });

  document.querySelector("#resetDrawBtn").addEventListener("click", () => {
    drawState.teams = [];
    drawState.groupA = [];
    drawState.groupB = [];
    document.querySelector("#slotsA").innerHTML = "";
    document.querySelector("#slotsB").innerHTML = "";
    document.querySelector("#drawResultSection").style.display = "none";
    document.querySelector("#drawStatus").textContent = "";
    document.querySelector("#drawTeamInput").value = "";
    document.querySelector("#drawTeamInput").focus();
  });

  document.querySelector("#exportResultBtn").addEventListener("click", exportResult);

  document.querySelector("#redrawBtn").addEventListener("click", () => {
    if (!generateSlots()) return;
    runDrawAnimation();
  });
});
