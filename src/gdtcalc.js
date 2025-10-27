/*
  gdtcalc.js — Modernized (Game Dev Tycoon 2020+ Balance) + Auto UI
  -----------------------------------------------------------------
  - Topics & Platforms (approximate modern additions)
  - Modern review formula (diminishing returns, tech/design bias)
  - Self-contained UI builder that creates controls if missing (no CSS required)
  - Outputs 0.0 - 10.0 review scores (one decimal)
  - DEBUG toggle for intermediate value logging
*/

// ---------------------------
//     Debug Config
// ---------------------------
const DEBUG = false;
function debug(...args) {
  if (DEBUG) console.log("[GDTCALC DEBUG]", ...args);
}

// ---------------------------
//     Genre Weight Model
// ---------------------------
const genreWeights = {
  "Action": { designWeight: 0.4, techWeight: 0.6 },
  "Adventure": { designWeight: 0.7, techWeight: 0.3 },
  "RPG": { designWeight: 0.8, techWeight: 0.2 },
  "Simulation": { designWeight: 0.3, techWeight: 0.7 },
  "Strategy": { designWeight: 0.4, techWeight: 0.6 },
  "Casual": { designWeight: 0.6, techWeight: 0.4 }
};

// ---------------------------
//     Topics
//     [Name, Action, Adventure, RPG, Simulation, Strategy, Casual, Young, Everyone, Mature]
// ---------------------------
var topics = [
  ["Airplane", 1.0, 0.6, 0.8, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9],
  ["Aliens", 1.0, 0.8, 1.0, 0.6, 0.9, 0.7, 0.9, 1.0, 1.0],
  ["Business", 0.6, 0.8, 0.8, 1.0, 1.0, 0.6, 0.9, 1.0, 0.7],
  ["City", 0.7, 0.6, 0.7, 1.0, 1.0, 0.7, 0.9, 1.0, 0.8],
  ["Comedy", 0.6, 1.0, 0.8, 0.6, 0.6, 1.0, 1.0, 1.0, 1.0],
  ["Crime", 1.0, 0.7, 0.8, 0.9, 0.7, 0.6, 0.6, 0.8, 1.0],
  ["Cyberpunk", 1.0, 0.8, 1.0, 0.8, 0.7, 0.6, 0.7, 0.9, 1.0],
  ["Detective", 0.6, 1.0, 1.0, 0.8, 0.6, 0.9, 0.9, 1.0, 0.8],
  ["Fantasy", 1.0, 1.0, 1.0, 0.8, 1.0, 0.6, 1.0, 1.0, 1.0],
  ["GameDev", 0.6, 0.7, 0.6, 1.0, 0.6, 0.8, 0.9, 1.0, 0.7],
  ["Horror", 1.0, 1.0, 0.8, 0.6, 0.7, 0.8, 0.6, 0.9, 1.0],
  ["Medieval", 1.0, 1.0, 1.0, 0.8, 1.0, 0.7, 1.0, 1.0, 1.0],
  ["Military", 1.0, 0.6, 0.8, 1.0, 1.0, 0.6, 0.7, 0.9, 1.0],
  ["Music", 1.0, 0.9, 0.6, 1.0, 0.6, 1.0, 1.0, 1.0, 1.0],
  ["Ninja", 1.0, 0.8, 0.8, 0.6, 0.8, 0.9, 1.0, 1.0, 1.0],
  ["Pirate", 0.8, 1.0, 0.8, 0.8, 0.7, 0.8, 1.0, 1.0, 1.0],
  ["Racing", 0.9, 0.6, 0.8, 1.0, 0.7, 1.0, 1.0, 1.0, 1.0],
  ["Sci-Fi", 1.0, 1.0, 1.0, 1.0, 1.0, 0.8, 1.0, 1.0, 1.0],
  ["Sports", 1.0, 0.6, 0.6, 1.0, 0.7, 1.0, 1.0, 1.0, 1.0],
  ["Superheroes", 1.0, 0.6, 0.9, 0.6, 0.6, 0.7, 1.0, 1.0, 1.0],
  ["Zombies", 1.0, 0.7, 0.9, 0.7, 0.8, 0.6, 0.6, 1.0, 1.0],
  ["Virtual Reality", 0.8, 0.7, 0.7, 1.0, 0.8, 0.5, 0.6, 0.9, 0.9],
  ["AI", 0.7, 0.8, 0.8, 1.0, 0.9, 0.6, 0.8, 1.0, 0.9],
  ["Politics", 0.6, 0.9, 0.8, 0.9, 1.0, 0.5, 0.5, 1.0, 0.8],
  ["Survival", 1.0, 0.7, 0.9, 0.8, 0.8, 0.6, 0.6, 1.0, 1.0],
  ["Retro", 0.8, 0.9, 0.7, 0.8, 0.8, 0.8, 0.9, 0.9, 0.8]
];

// ---------------------------
//     Platforms
//     [Name, Action, Adventure, RPG, Simulation, Strategy, Casual, Young, Everyone, Mature, TechLevel]
// ---------------------------
var platforms = [
  ["PC", 0.9, 1.0, 0.9, 1.0, 1.0, 0.6, 0.8, 0.9, 1.0, 0],
  ["G64", 0.9, 1.0, 0.9, 0.9, 1.0, 0.7, 0.8, 0.9, 1.0, 1],
  ["TES", 0.8, 0.7, 0.8, 0.8, 0.7, 1.0, 1.0, 0.9, 0.6, 2],
  ["PlaySystem 2", 1.0, 0.8, 1.0, 0.9, 0.7, 0.9, 0.9, 1.0, 0.8, 4],
  ["mBox", 1.0, 0.8, 0.9, 0.9, 0.7, 0.7, 0.8, 1.0, 0.9, 4],
  ["PlaySystem 3", 1.0, 0.9, 0.9, 1.0, 0.7, 0.8, 0.8, 1.0, 0.9, 5],
  ["mBox 360", 1.0, 0.9, 1.0, 0.9, 0.7, 0.9, 0.8, 0.9, 1.0, 4],
  ["PlaySystem 4", 1.0, 0.95, 0.95, 1.0, 0.85, 0.9, 0.8, 0.95, 1.0, 6],
  ["mBox One", 1.0, 0.95, 0.95, 1.0, 0.8, 0.95, 0.8, 0.95, 1.0, 6],
  ["Wuu", 0.9, 0.8, 0.85, 0.9, 0.8, 0.9, 0.85, 0.95, 0.8, 5],
  ["Oya", 0.8, 0.75, 0.7, 0.95, 0.75, 0.95, 0.9, 1.0, 0.7, 5],
  ["grPhone 2", 0.85, 0.85, 0.75, 0.95, 0.75, 1.0, 0.9, 1.0, 0.7, 5],
  ["grPad 2", 0.85, 0.9, 0.8, 0.95, 0.8, 1.0, 0.9, 1.0, 0.75, 5],
  ["GS Pro", 0.95, 0.95, 0.95, 0.95, 0.9, 0.95, 0.9, 0.95, 0.9, 6],
  ["PlaySystem 5", 1.0, 1.0, 1.0, 1.0, 1.0, 0.95, 0.8, 0.95, 1.0, 7],
  ["mBox Next", 1.0, 1.0, 1.0, 1.0, 0.95, 1.0, 0.85, 0.95, 1.0, 7],
  ["Handheld Pro", 0.85, 0.85, 0.8, 0.95, 0.8, 1.0, 0.95, 1.0, 0.75, 5]
];

// ---------------------------
//     Modern Score Formula
// ---------------------------
function calculateScore(topicName, genre, platformName, audience, gameLength = 1.0) {
  const topic = topics.find(t => t[0] === topicName);
  const platform = platforms.find(p => p[0] === platformName);
  const g = genreWeights[genre];

  if (!topic || !platform || !g) {
    console.warn("Invalid input to calculateScore:", topicName, genre, platformName);
    return 0.0;
  }

  // genre index mapping in arrays (1-based after name)
  const genreMap = { Action: 1, Adventure: 2, RPG: 3, Simulation: 4, Strategy: 5, Casual: 6 };
  const audienceMap = { Young: 7, Everyone: 8, Mature: 9 };

  const genreIndex = genreMap[genre];
  const topicGenreMatch = topic[genreIndex];
  const platformGenreMatch = platform[genreIndex];

  const audienceIndex = audienceMap[audience] || 8;
  const topicAudience = topic[audienceIndex];
  const platformAudience = platform[audienceIndex];
  const audienceMod = (topicAudience + platformAudience) / 2;

  const techLevel = platform[10] || 0;
  const techInfluence = 1.0 + techLevel * 0.05;

  const designTechBalance = g.designWeight * 0.6 + g.techWeight * 0.4;

  // baseScore before non-linearity
  let baseScore = ((topicGenreMatch + platformGenreMatch) / 2) *
                  audienceMod * techInfluence * designTechBalance;

  // scale by game length (small games <1, big games >1)
  baseScore *= (0.8 + 0.4 * Math.max(0.5, gameLength)); // clamp gameLength minimally

  // diminishing returns to mimic GDT review function
  baseScore = Math.pow(Math.max(0, baseScore), 0.7);

  // final review score 0..10
  const review = Math.min(baseScore * 10, 10);
  debug({
    topicName, genre, platformName, audience, gameLength,
    topicGenreMatch, platformGenreMatch, audienceMod, techLevel, techInfluence,
    designTechBalance, baseScore, review
  });
  return parseFloat(review.toFixed(1));
}

// ---------------------------
//     UI Helper: create minimal UI if not present
// ---------------------------

function createMinimalUI() {
  // If there is already a container with id 'gdtcalc-root', use that
  let root = document.getElementById("gdtcalc-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "gdtcalc-root";
    // Basic inline styling — visible without CSS
    root.style.fontFamily = "Arial, sans-serif";
    root.style.maxWidth = "820px";
    root.style.margin = "12px auto";
    root.style.padding = "12px";
    root.style.border = "1px solid #ddd";
    root.style.borderRadius = "6px";
    root.style.background = "#fafafa";
    root.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
    document.body.insertBefore(root, document.body.firstChild);
  }

  // Check if form exists
  if (!document.getElementById("gdtcalc-form")) {
    const form = document.createElement("div");
    form.id = "gdtcalc-form";
    form.innerHTML = `
      <h3 style="margin:0 0 8px 0">GDT Calculator (Modern)</h3>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px">
        <div style="flex:1 1 200px">
          <label style="display:block;font-size:12px">Topic</label>
          <select id="gdt-topic" style="width:100%;padding:6px"></select>
        </div>
        <div style="flex:1 1 150px">
          <label style="display:block;font-size:12px">Genre</label>
          <select id="gdt-genre" style="width:100%;padding:6px"></select>
        </div>
        <div style="flex:1 1 200px">
          <label style="display:block;font-size:12px">Platform</label>
          <select id="gdt-platform" style="width:100%;padding:6px"></select>
        </div>
        <div style="flex:1 1 120px">
          <label style="display:block;font-size:12px">Audience</label>
          <select id="gdt-audience" style="width:100%;padding:6px">
            <option value="Everyone">Everyone</option>
            <option value="Young">Young</option>
            <option value="Mature">Mature</option>
          </select>
        </div>
        <div style="flex:1 1 120px">
          <label style="display:block;font-size:12px">Game Length</label>
          <input id="gdt-length" type="number" min="0.5" step="0.1" value="1.0" style="width:100%;padding:6px"/>
        </div>
      </div>

      <div style="display:flex;gap:8px;align-items:center;">
        <button id="gdt-calc-btn" style="padding:8px 12px;background:#4caf50;color:white;border:none;border-radius:4px;cursor:pointer">Calculate</button>
        <button id="gdt-sample-btn" style="padding:8px 12px;background:#1976d2;color:white;border:none;border-radius:4px;cursor:pointer">Sample</button>
        <div id="gdt-result" style="margin-left:12px;font-weight:700;font-size:18px"></div>
      </div>

      <div id="gdt-debug" style="margin-top:10px;display:none;font-size:12px;color:#666"></div>
    `;
    root.appendChild(form);
  }
}

function populateUI() {
  // populate selects from topics & platforms
  const topicSel = document.getElementById("gdt-topic");
  const genreSel = document.getElementById("gdt-genre");
  const platformSel = document.getElementById("gdt-platform");
  const lengthIn = document.getElementById("gdt-length");
  const resultDiv = document.getElementById("gdt-result");
  const debugDiv = document.getElementById("gdt-debug");

  if (!topicSel || !genreSel || !platformSel || !lengthIn || !resultDiv) return;

  // topics
  topicSel.innerHTML = "";
  topics.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t[0];
    opt.innerText = t[0];
    topicSel.appendChild(opt);
  });

  // genres (use genreWeights keys)
  genreSel.innerHTML = "";
  Object.keys(genreWeights).forEach(g => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.innerText = g;
    genreSel.appendChild(opt);
  });

  // platforms
  platformSel.innerHTML = "";
  platforms.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p[0];
    opt.innerText = p[0];
    platformSel.appendChild(opt);
  });

  // bind buttons
  document.getElementById("gdt-calc-btn").onclick = function () {
    const topic = topicSel.value;
    const genre = genreSel.value;
    const platform = platformSel.value;
    const audience = document.getElementById("gdt-audience").value;
    const gameLength = parseFloat(lengthIn.value) || 1.0;
    const score = calculateScore(topic, genre, platform, audience, gameLength);
    resultDiv.innerText = `${score} / 10`;
    debugDiv.style.display = DEBUG ? "block" : "none";
    if (DEBUG) debugDiv.innerText = JSON.stringify({
      topic, genre, platform, audience, gameLength, score
    }, null, 2);
  };

  // sample button picks random good combos
  document.getElementById("gdt-sample-btn").onclick = function () {
    const rTopic = topics[Math.floor(Math.random() * topics.length)][0];
    const gKeys = Object.keys(genreWeights);
    const rGenre = gKeys[Math.floor(Math.random() * gKeys.length)];
    const rPlatform = platforms[Math.floor(Math.random() * platforms.length)][0];
    topicSel.value = rTopic;
    genreSel.value = rGenre;
    platformSel.value = rPlatform;
    document.getElementById("gdt-audience").value = "Everyone";
    lengthIn.value = (1 + Math.random()).toFixed(1);
    document.getElementById("gdt-calc-btn").click();
  };

  // initial sample result
  if (!resultDiv.innerText) {
    document.getElementById("gdt-sample-btn").click();
  }
}

// ---------------------------
//     Auto-init on DOM ready
// ---------------------------
function initGdtCalcUI() {
  try {
    createMinimalUI();
    populateUI();
    console.log("gdtcalc.js: UI ready — topics:", topics.length, "platforms:", platforms.length);
  } catch (e) {
    console.error("gdtcalc.js UI init error:", e);
  }
}

// If DOM is ready or later, init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGdtCalcUI);
} else {
  setTimeout(initGdtCalcUI, 0);
}

// Export for other scripts if desired
window.gdtcalc = window.gdtcalc || {};
window.gdtcalc.calculateScore = calculateScore;
window.gdtcalc.topics = topics;
window.gdtcalc.platforms = platforms;
window.gdtcalc.genreWeights = genreWeights;

