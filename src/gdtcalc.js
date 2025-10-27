// === Part 1: Data (topics, platforms, genreWeights) ===
// Paste this first.

(function(){ // IIFE to avoid polluting global scope until final export

// Minimal modernized data. You can expand items later if you want.
// Columns:
// topics: [Name, Action, Adventure, RPG, Simulation, Strategy, Casual, Young, Everyone, Mature]
// platforms: [Name, Action, Adventure, RPG, Simulation, Strategy, Casual, Young, Everyone, Mature, TechLevel]

// Genre weight model (design vs tech bias)
const genreWeights = {
  "Action": { designWeight: 0.45, techWeight: 0.55 },
  "Adventure": { designWeight: 0.75, techWeight: 0.25 },
  "RPG": { designWeight: 0.82, techWeight: 0.18 },
  "Simulation": { designWeight: 0.28, techWeight: 0.72 },
  "Strategy": { designWeight: 0.4, techWeight: 0.6 },
  "Casual": { designWeight: 0.65, techWeight: 0.35 }
};

// Topics (legacy + modern additions). Keep order consistent with columns noted above.
var topics = [
  ["Airplane", 1.0,0.6,0.8,1.0,1.0,1.0,1.0,1.0,0.9],
  ["Abstract",0.9,1.0,0.6,0.6,0.8,0.6,0.8,0.9,1.0],
  ["Aliens",1.0,0.8,1.0,0.6,0.9,0.7,0.9,1.0,1.0],
  ["Alternate History",1.0,0.8,1.0,0.8,0.9,0.6,0.6,1.0,1.0],
  ["Assasin",1.0,0.7,1.0,0.8,0.6,0.6,0.6,0.8,1.0],
  ["Business",0.6,0.8,0.8,1.0,1.0,0.6,0.9,1.0,0.7],
  ["City",0.7,0.6,0.7,1.0,1.0,0.7,0.9,1.0,0.8],
  ["Comedy",0.6,1.0,0.8,0.6,0.6,1.0,1.0,1.0,1.0],
  ["Cooking",0.9,0.7,0.8,1.0,0.7,1.0,0.8,0.9,1.0],
  ["Crime",1.0,0.7,0.8,0.9,0.7,0.6,0.6,0.8,1.0],
  ["Cyberpunk",1.0,0.8,1.0,0.8,0.7,0.6,0.7,0.9,1.0],
  ["Detective",0.6,1.0,1.0,0.8,0.6,0.9,0.9,1.0,0.8],
  ["Dungeon",1.0,0.8,1.0,1.0,1.0,0.6,0.8,1.0,1.0],
  ["Dystopia",0.8,0.9,0.8,1.0,0.9,0.6,0.6,0.8,1.0],
  ["Fantasy",1.0,1.0,1.0,0.8,1.0,0.6,1.0,1.0,1.0],
  ["Horror",1.0,1.0,0.8,0.6,0.7,0.8,0.6,0.9,1.0],
  ["Medieval",1.0,1.0,1.0,0.8,1.0,0.7,1.0,1.0,1.0],
  ["Sci-Fi",1.0,1.0,1.0,1.0,1.0,0.8,1.0,1.0,1.0],
  ["Racing",0.9,0.6,0.8,1.0,0.7,1.0,1.0,1.0,1.0],
  ["Romance",0.6,1.0,0.8,0.8,0.6,0.9,0.8,1.0,1.0],
  ["Space",1.0,0.8,0.6,1.0,1.0,0.7,1.0,1.0,1.0],
  ["Sports",1.0,0.6,0.6,1.0,0.7,1.0,1.0,1.0,1.0],
  ["Superheroes",1.0,0.6,0.9,0.6,0.6,0.7,1.0,1.0,1.0],
  ["Virtual Pet",0.6,0.8,0.6,1.0,0.9,1.0,1.0,0.8,0.7],
  ["Zombies",1.0,0.7,0.9,0.7,0.8,0.6,0.6,1.0,1.0],
  ["Virtual Reality",0.8,0.7,0.7,1.0,0.8,0.5,0.6,0.9,0.9],
  ["AI",0.7,0.8,0.8,1.0,0.9,0.6,0.8,1.0,0.9],
  ["Politics",0.6,0.9,0.8,0.9,1.0,0.5,0.5,1.0,0.8],
  ["Survival",1.0,0.7,0.9,0.8,0.8,0.6,0.6,1.0,1.0],
  ["Retro",0.8,0.9,0.7,0.8,0.8,0.8,0.9,0.9,0.8]
];

// Platforms (legacy + modern approximate additions)
var platforms = [
  ["PC",0.9,1.0,0.9,1.0,1.0,0.6,0.8,0.9,1.0,0],
  ["G64",0.9,1.0,0.9,0.9,1.0,0.7,0.8,0.9,1.0,1],
  ["TES",0.8,0.7,0.8,0.8,0.7,1.0,1.0,0.9,0.6,2],
  ["PlaySystem 2",1.0,0.8,1.0,0.9,0.7,0.9,0.9,1.0,0.8,4],
  ["mBox",1.0,0.8,0.9,0.9,0.7,0.7,0.8,1.0,0.9,4],
  ["PlaySystem 3",1.0,0.9,0.9,1.0,0.7,0.8,0.8,1.0,0.9,5],
  ["mBox 360",1.0,0.9,1.0,0.9,0.7,0.9,0.8,0.9,1.0,4],
  ["PlaySystem 4",1.0,0.95,0.95,1.0,0.85,0.9,0.8,0.95,1.0,6],
  ["mBox One",1.0,0.95,0.95,1.0,0.8,0.95,0.8,0.95,1.0,6],
  ["Wuu",0.9,0.8,0.85,0.9,0.8,0.9,0.85,0.95,0.8,5],
  ["Oya",0.8,0.75,0.7,0.95,0.75,0.95,0.9,1.0,0.7,5],
  ["grPhone 2",0.85,0.85,0.75,0.95,0.75,1.0,0.9,1.0,0.7,5],
  ["grPad 2",0.85,0.9,0.8,0.95,0.8,1.0,0.9,1.0,0.75,5],
  ["GS Pro",0.95,0.95,0.95,0.95,0.9,0.95,0.9,0.95,0.9,6],
  ["PlaySystem 5",1.0,1.0,1.0,1.0,1.0,0.95,0.8,0.95,1.0,7],
  ["mBox Next",1.0,1.0,1.0,1.0,0.95,1.0,0.85,0.95,1.0,7],
  ["Handheld Pro",0.85,0.85,0.8,0.95,0.8,1.0,0.95,1.0,0.75,5]
];

// Expose data to window.gdtcalc object at end of Part 3.
// We'll close the IIFE after Part 3 finishes wiring.
window.__gdtcalc_data = {
  genreWeights: genreWeights,
  topics: topics,
  platforms: platforms
};

})(); // end Part 1 IIFE






// === Part 2: UI builder (fixed with DOMContentLoaded wrapper) ===
document.addEventListener("DOMContentLoaded", function () {

  // Create root container with GitHub-style neutral theme
  function ensureRoot() {
    let root = document.getElementById("gdtcalc-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "gdtcalc-root";
      // safer append instead of insertBefore
      document.body.appendChild(root);
    }
    // minimal neutral styling (you can override in repo CSS)
    root.style.fontFamily = "'Segoe UI', Roboto, Arial, sans-serif";
    root.style.background = "#f4f5f7";
    root.style.color = "#222";
    root.style.padding = "12px";
    root.style.borderRadius = "6px";
    root.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
    root.style.maxWidth = "980px";
    root.style.margin = "16px auto";
    return root;
  }

  const root = ensureRoot();

  // If already present, bail (avoid duplicating)
  if (document.getElementById("gdtcalc")) {
    return;
  }

  // Build HTML structure (matches screenshot layout roughly, neutral style)
  const html = `
    <div id="gdtcalc" style="display:flex;gap:12px">
      <div id="gdt-left" style="flex:0 0 380px;background:#ffffff;border-radius:6px;padding:12px;border:1px solid #e1e4e8;">
        <h2 style="margin:0 0 8px 0;font-size:18px">Game Dev Tycoon Calculator</h2>

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
          <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="gdt-ingarage"> In Garage</label>
          <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="gdt-less100k"> &lt; 100k Fans</label>
          <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="gdt-sequel"> Sequel</label>
          <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="gdt-expansion"> Expansion</label>
          <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="gdt-mmo"> MMO</label>
          <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="gdt-newemp"> New Employee</label>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
          <div>
            <label style="font-size:12px">Platform</label>
            <select id="gdt-platform" style="width:100%;padding:6px;margin-top:4px"></select>
          </div>
          <div>
            <label style="font-size:12px">Topic</label>
            <select id="gdt-topic" style="width:100%;padding:6px;margin-top:4px"></select>
          </div>

          <div>
            <label style="font-size:12px">Genre 1</label>
            <select id="gdt-genre1" style="width:100%;padding:6px;margin-top:4px"></select>
          </div>
          <div>
            <label style="font-size:12px">Genre 2</label>
            <select id="gdt-genre2" style="width:100%;padding:6px;margin-top:4px"></select>
          </div>

          <div>
            <label style="font-size:12px">Audience</label>
            <select id="gdt-audience" style="width:100%;padding:6px;margin-top:4px">
              <option value="Everyone">Everyone</option>
              <option value="Young">Young</option>
              <option value="Mature">Mature</option>
            </select>
          </div>
          <div>
            <label style="font-size:12px">Game Size</label>
            <select id="gdt-gamesize" style="width:100%;padding:6px;margin-top:4px">
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="AAA">AAA</option>
            </select>
          </div>

          <div>
            <label style="font-size:12px">Year</label>
            <select id="gdt-year" style="width:100%;padding:6px;margin-top:4px">
              <option value="0">0-1</option>
              <option value="1">1-2</option>
              <option value="2">2-3</option>
              <option value="3">3-4</option>
              <option value="4">4-5</option>
              <option value="5">5-6</option>
              <option value="6">6+</option>
            </select>
          </div>

          <div>
            <label style="font-size:12px">Trend</label>
            <select id="gdt-trend" style="width:100%;padding:6px;margin-top:4px">
              <option value="none">Not On Trend</option>
              <option value="on">On Trend</option>
              <option value="hot">Hot</option>
            </select>
          </div>
        </div>

        <div style="margin-top:8px">
          <h4 style="margin:8px 0">Development Stages</h4>
          <div id="gdt-stages" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px"></div>
        </div>

        <div style="margin-top:10px;display:flex;gap:8px">
          <button id="gdt-calc-btn" style="padding:8px 12px;background:#2ea44f;color:white;border:none;border-radius:4px;cursor:pointer">Calculate</button>
          <button id="gdt-sample-btn" style="padding:8px 12px;background:#0366d6;color:white;border:none;border-radius:4px;cursor:pointer">Sample</button>
          <button id="gdt-save-btn" style="padding:8px 12px;background:#6f42c1;color:white;border:none;border-radius:4px;cursor:pointer">Save</button>
          <button id="gdt-load-btn" style="padding:8px 12px;background:#d73a49;color:white;border:none;border-radius:4px;cursor:pointer">Load</button>
        </div>
      </div>

      <div id="gdt-right" style="flex:1;background:#ffffff;border-radius:6px;padding:12px;border:1px solid #e1e4e8;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div>
            <div style="font-size:13px">Optimal T/D Ratio <span id="gdt-opt-td" style="font-weight:700">-</span></div>
            <div style="font-size:13px">Actual T/D Ratio <span id="gdt-actual-td" style="font-weight:700">-</span></div>
            <div style="font-size:13px">Game Quality <span id="gdt-game-quality" style="font-weight:700">-</span></div>
            <div style="font-size:13px">Sales Modifier <span id="gdt-sales-mod" style="font-weight:700">-</span></div>
          </div>
          <div>
            <div style="font-size:12px">Target Score <input id="gdt-target" type="number" style="width:84px;padding:6px;margin-left:6px"/></div>
            <div style="font-size:12px">Game Score <input id="gdt-game-score" type="number" style="width:84px;padding:6px;margin-left:6px"/></div>
            <div style="font-size:12px">Review Score <input id="gdt-review" type="text" disabled style="width:84px;padding:6px;margin-left:6px;background:#f6f8fa"/></div>
          </div>
        </div>

        <div style="display:flex;gap:12px">
          <div style="flex:1">
            <div style="height:220px;background:#e9f0ef;border:1px solid #d7dedb;border-radius:4px"></div>
            <div style="margin-top:8px;color:#555;font-size:13px">
              Tech <input id="gdt-tech" style="width:60px;margin-left:6px" readonly>
              Design <input id="gdt-design" style="width:60px;margin-left:6px" readonly>
              Bugs <input id="gdt-bugs" style="width:60px;margin-left:6px" readonly>
            </div>
          </div>

          <div style="width:240px">
            <div style="font-weight:700;margin-bottom:6px">Details</div>
            <div style="font-size:13px">Platform / Genre <span id="gdt-platform-genre" style="font-weight:700">-</span></div>
            <div style="font-size:13px">Topic / Audience <span id="gdt-topic-aud" style="font-weight:700">-</span></div>
            <div style="font-size:13px">Topic / Genre <span id="gdt-topic-genre" style="font-weight:700">-</span></div>
            <div style="font-size:13px;margin-top:8px">Trend Bonus <span id="gdt-trend-bonus" style="font-weight:700">-</span></div>
            <div style="font-size:13px;margin-top:8px">Modifiers: <span id="gdt-mod-list" style="font-weight:700">-</span></div>
          </div>
        </div>
      </div>
    </div>
  `;

  root.innerHTML = html;

  // Build stage sliders
  const stageContainer = document.getElementById("gdt-stages");
  const stageDefs = [
    { title: "Stage 1", items: ["Gameplay","Engine","Story"] },
    { title: "Stage 2", items: ["Dialogues","AI","Level Design"] },
    { title: "Stage 3", items: ["World Design","Graphics","Sound"] }
  ];

  stageDefs.forEach((stage, sidx) => {
    const col = document.createElement("div");
    col.style.padding = "6px";
    col.style.border = "1px solid #eef2f3";
    col.style.borderRadius = "4px";
    col.style.background = "#fafafa";
    col.innerHTML = `<div style="font-weight:700;margin-bottom:6px">${stage.title}</div>`;
    stage.items.forEach((it, idx) => {
      const id = `gdt-s${sidx+1}-${idx+1}`;
      const wrapper = document.createElement("div");
      wrapper.style.marginBottom = "8px";
      wrapper.innerHTML = `
        <div style="display:flex;justify-content:space-between">
          <label style="font-size:12px">${it}</label>
          <span id="${id}-val" style="font-weight:700">50</span>
        </div>
        <input id="${id}" type="range" min="0" max="100" value="50" style="width:100%"/>
      `;
      col.appendChild(wrapper);
      setTimeout(() => {
        const range = document.getElementById(id);
        const label = document.getElementById(id + "-val");
        range.addEventListener("input", () => (label.innerText = range.value));
      }, 0);
    });
    stageContainer.appendChild(col);
  });

}); // end DOMContentLoaded wrapper





// === Part 3: Logic & wiring (paste third) ===

(function(){
/* This part reads window.__gdtcalc_data from Part 1, wires up UI from Part 2,
   computes modern review scores, applies modifiers (garage, fans, sequel, expansion, mmo, new employee),
   supports second genre and trend/year effects, and provides Save/Load.
*/

const DEBUG = false;
function debug(...args){ if (DEBUG) console.log("[gdtcalc]", ...args); }

// load data from Part 1
const DATA = window.__gdtcalc_data || {};
const genreWeights = DATA.genreWeights || {};
const topics = DATA.topics || [];
const platforms = DATA.platforms || [];

// helpers
function $(id){ return document.getElementById(id); }
function fillSelect(sel, items, getLabel){
  sel.innerHTML = "";
  items.forEach(it => {
    const opt = document.createElement("option");
    opt.value = it[0];
    opt.text = getLabel ? getLabel(it) : it[0];
    sel.appendChild(opt);
  });
}

// populate selects
function populateSelectors(){
  fillSelect($("gdt-topic"), topics);
  fillSelect($("gdt-platform"), platforms);
  const gKeys = Object.keys(genreWeights);
  const genre1 = $("gdt-genre1"), genre2 = $("gdt-genre2");
  genre1.innerHTML = ""; genre2.innerHTML = "";
  gKeys.forEach(g => {
    const o1 = document.createElement("option"); o1.value = g; o1.innerText = g; genre1.appendChild(o1);
    const o2 = document.createElement("option"); o2.value = "None"; o2.innerText = "None"; genre2.appendChild(o2);
  });
  // after adding None, append real genres to genre2
  gKeys.forEach(g => {
    const o = document.createElement("option"); o.value = g; o.innerText = g; genre2.appendChild(o);
  });

  // set defaults
  genre1.value = "Action";
  genre2.value = "None";
  $("gdt-topic").value = topics[0] ? topics[0][0] : "";
  $("gdt-platform").value = platforms[0] ? platforms[0][0] : "";
}
populateSelectors();

// Utility: get index for genre column in arrays
const genreIndexMap = { Action:1, Adventure:2, RPG:3, Simulation:4, Strategy:5, Casual:6 };
const audienceIndexMap = { Young:7, Everyone:8, Mature:9 };

// Read sliders values as structured object
function readSliders(){
  // stage s1: gdt-s1-1..3, s2: gdt-s2-1..3, s3: gdt-s3-1..3
  const stages = [];
  for(let s=1;s<=3;s++){
    const arr = [];
    for(let i=1;i<=3;i++){
      const el = $(`gdt-s${s}-${i}`);
      arr.push(el ? parseInt(el.value,10) : 50);
    }
    stages.push(arr);
  }
  return stages; // [[s1a,s1b,s1c],[s2...],[s3...]]
}

// Convert Game Size dropdown to numeric "gameLength factor"
// We'll map Small=0.8, Medium=1.0, Large=1.2, AAA=1.5 (approx)
function gameSizeFactor(sizeLabel){
  switch(sizeLabel){
    case "Small": return 0.8;
    case "Medium": return 1.0;
    case "Large": return 1.2;
    case "AAA": return 1.5;
    default: return 1.0;
  }
}

// Trend bonus numeric multiplier approximations
function trendMultiplier(trend){
  if(trend === "on") return 1.05;
  if(trend === "hot") return 1.12;
  return 1.0;
}

// Year effect (older years = less tech, younger years = more tech market). We'll use minor modifier.
function yearModifier(yearIndex){
  // yearIndex 0..6 (0 earliest)
  return 0.98 + (yearIndex * 0.01); // increases slightly with time
}

// Combine sliders into design/tech bias
function computeDesignTechBias(stages){
  // Mapping slider positions to "design" vs "tech" roles:
  // Design sliders: Story, Dialogues, World Design, Gameplay contributes to design somewhat.
  // Tech sliders: Engine, AI, Graphics, Level Design contributes to tech somewhat.
  // We'll weight items approximately to reflect importance:
  const gameplay = stages[0][0], engine = stages[0][1], story = stages[0][2];
  const dialogues = stages[1][0], ai = stages[1][1], level = stages[1][2];
  const world = stages[2][0], graphics = stages[2][1], sound = stages[2][2];

  // aggregate design score (0-100) and tech score (0-100)
  const designScore = (gameplay*0.25 + story*0.25 + dialogues*0.2 + world*0.2 + sound*0.1);
  const techScore = (engine*0.3 + ai*0.25 + graphics*0.25 + level*0.2 + gameplay*0.1);

  // normalize to 0..1
  const designNorm = designScore / 100;
  const techNorm = techScore / 100;

  return { designNorm, techNorm, designScore, techScore };
}

// Primary modern calculation: returns review 0..10 and intermediate metrics
function calculateModernReview(opts){
  // opts: {topicName, genre1, genre2 (or 'None'), platformName, audience, gameSizeLabel, yearIndex, trend, flags:{ingarage,less100k,sequel,expansion,mmo,newemp}}
  const topic = topics.find(t=>t[0]===opts.topicName);
  const platform = platforms.find(p=>p[0]===opts.platformName);
  if(!topic || !platform){
    return { review:0, error:"missing topic/platform" };
  }
  const g1 = opts.genre1;
  const g2 = opts.genre2 && opts.genre2!=="None" ? opts.genre2 : null;
  const genreWeightPrimary = genreWeights[g1] || {designWeight:0.6,techWeight:0.4};

  // compute slider bias
  const stages = readSliders();
  const sliderBias = computeDesignTechBias(stages);
  // ratioBias in [-1,1] where + means design heavy
  const ratioBias = (sliderBias.designNorm - sliderBias.techNorm);

  // compute effective design/tech weight with slider influence
  // shift primary genre weights by ratioBias scaled factor
  const biasFactor = 0.15; // how much sliders can alter ideal weights
  const designWeight = Math.max(0.05, genreWeightPrimary.designWeight * (1 + ratioBias * biasFactor));
  const techWeight = Math.max(0.05, genreWeightPrimary.techWeight * (1 - ratioBias * biasFactor));

  // topic/genre match (value 0..1)
  const gIndex = genreIndexMap[g1];
  const topicGenreMatch = topic[gIndex] || 0.7;
  // platform/genre match
  const platformGenreMatch = platform[gIndex] || 0.75;

  // If second genre provided, blend matches (second genre usually weaker influence)
  let topicGenreMatchBlend = topicGenreMatch;
  let platformGenreMatchBlend = platformGenreMatch;
  if(g2){
    const g2Index = genreIndexMap[g2];
    const tgm2 = topic[g2Index] || topicGenreMatch;
    const pgm2 = platform[g2Index] || platformGenreMatch;
    // blend with small weight (0.45 primary, 0.55 secondary -> depends on user's choice; we'll use 0.7 primary)
    const primaryWeight = 0.7;
    topicGenreMatchBlend = topicGenreMatch * primaryWeight + tgm2 * (1-primaryWeight);
    platformGenreMatchBlend = platformGenreMatch * primaryWeight + pgm2 * (1-primaryWeight);
  }

  // audience modifier (average of topic and platform audience affinity)
  const aIndex = audienceIndexMap[opts.audience] || audienceIndexMap["Everyone"];
  const topicAudience = topic[aIndex] || 1.0;
  const platformAudience = platform[aIndex] || 1.0;
  const audienceAffinity = (topicAudience + platformAudience) / 2;

  // tech influence from platform tech level
  const techLevel = platform[10] || 0;
  const techInfluence = 1.0 + techLevel * 0.04; // smaller than previous; tuned

  // baseQuality before non-linearity
  // incorporate design/tech weighting: design matters more for some genres, tech for others
  const matchCombined = (topicGenreMatchBlend * designWeight + platformGenreMatchBlend * techWeight) / (designWeight + techWeight);

  // incorporate slider-driven ratio via multiply
  const sliderEffect = 1.0 + (sliderBias.designNorm - sliderBias.techNorm) * 0.08; // small effect

  // game size factor
  const gsFactor = gameSizeFactor(opts.gameSizeLabel);

  // trend and year modifiers
  const trendMult = trendMultiplier(opts.trend);
  const yearMult = yearModifier(opts.yearIndex);

  // Flags and special modifiers
  // We'll calculate a combined sales modifier separately; but some flags slightly affect quality
  let flagsQualityMult = 1.0;
  if(opts.flags.ingarage) flagsQualityMult *= 0.98; // in garage slightly limited resources
  if(opts.flags.less100k) flagsQualityMult *= 0.95; // less initial support
  if(opts.flags.newemp) flagsQualityMult *= 0.98; // inexperience slightly reduces
  // Sequel / expansion / MMO have quality implications: sequels often get a + or - depending on context; we'll assume neutral small boost
  if(opts.flags.sequel) flagsQualityMult *= 1.03;
  if(opts.flags.expansion) flagsQualityMult *= 1.02;
  if(opts.flags.mmo) flagsQualityMult *= 0.97; // harder to execute well

  // Now combine into base score
  let baseQuality = matchCombined * audienceAffinity * techInfluence * sliderEffect * gsFactor * flagsQualityMult * trendMult * yearMult;

  // scaling with diminishing returns (modern GDT uses exponent <1)
  baseQuality = Math.pow(Math.max(0, baseQuality), 0.70);

  // convert to 0-10 review
  const reviewScore = Math.min(10, baseQuality * 10);

  // compute Game Quality (normalized)
  const gameQuality = Math.min(3.0, baseQuality * 1.2); // heuristic to display game quality

  // compute optimal T/D ratio (theoretical)
  const optimalTD = (genreWeightPrimary.designWeight / (genreWeightPrimary.techWeight || 0.0001)).toFixed(2);
  const actualTD = ((sliderBias.designNorm*100) / ((sliderBias.techNorm*100)||1)).toFixed(2);

  // Sales modifier calculation: start from base 1 and apply flags + trend + size + fans
  let salesMod = 1.0;
  // base size multiplier
  switch(opts.gameSizeLabel){
    case "Small": salesMod *= 1.0; break;
    case "Medium": salesMod *= 1.1; break;
    case "Large": salesMod *= 1.25; break;
    case "AAA": salesMod *= 1.6; break;
  }
  // fans effect: less than 100k reduces initial sales (and maybe long-term)
  if(opts.flags.less100k) salesMod *= 0.9;
  // in garage reduces promotional reach
  if(opts.flags.ingarage) salesMod *= 0.88;
  // sequel / expansion often boost sales
  if(opts.flags.sequel) salesMod *= 1.18;
  if(opts.flags.expansion) salesMod *= 1.12;
  // mmorpgs are niche/costly, we set lower immediate multiplier
  if(opts.flags.mmo) salesMod *= 0.9;
  // new employee small negative on sales via initial performance (but could be neutral)
  if(opts.flags.newemp) salesMod *= 0.97;
  // trend boosts sales
  if(opts.trend === "on") salesMod *= 1.08;
  if(opts.trend === "hot") salesMod *= 1.22;
  // quality effect on sales (higher review increases sales)
  const qualitySalesFactor = 1 + (reviewScore/10 - 0.5) * 0.6; // -30% to +30% roughly
  salesMod *= qualitySalesFactor;

  // Compile modifiers list for display
  const modList = [];
  if(opts.flags.ingarage) modList.push("In Garage");
  if(opts.flags.less100k) modList.push("<100k Fans");
  if(opts.flags.sequel) modList.push("Sequel");
  if(opts.flags.expansion) modList.push("Expansion");
  if(opts.flags.mmo) modList.push("MMO");
  if(opts.flags.newemp) modList.push("NewEmployee");
  if(opts.trend !== "none") modList.push("Trend:"+opts.trend);

  // Tech vs Design numbers for display
  const techVal = Math.round(sliderBias.techScore);
  const designVal = Math.round(sliderBias.designScore);
  const bugsEstimate = Math.max(0, Math.round(10 - (baseQuality*10)/1.2)); // heuristic: better quality -> fewer final bugs

  // Return structured result
  return {
    review: parseFloat(reviewScore.toFixed(1)),
    gameQuality: parseFloat(gameQuality.toFixed(2)),
    optimalTD: parseFloat(optimalTD),
    actualTD: parseFloat(actualTD),
    salesMod: parseFloat(salesMod.toFixed(2)),
    mods: modList,
    topicGenreMatch: parseFloat(topicGenreMatchBlend.toFixed(3)),
    platformGenreMatch: parseFloat(platformGenreMatchBlend.toFixed(3)),
    audienceAffinity: parseFloat(audienceAffinity.toFixed(3)),
    techVal, designVal, bugsEstimate
  };
}

// Hook up calculate button and live wiring
function gatherOptionsFromUI(){
  const opts = {
    topicName: $("gdt-topic").value,
    genre1: $("gdt-genre1").value,
    genre2: $("gdt-genre2").value,
    platformName: $("gdt-platform").value,
    audience: $("gdt-audience").value,
    gameSizeLabel: $("gdt-gamesize").value,
    yearIndex: parseInt($("gdt-year").value,10) || 0,
    trend: $("gdt-trend").value,
    flags: {
      ingarage: $("gdt-ingarage").checked,
      less100k: $("gdt-less100k").checked,
      sequel: $("gdt-sequel").checked,
      expansion: $("gdt-expansion").checked,
      mmo: $("gdt-mmo").checked,
      newemp: $("gdt-newemp").checked
    }
  };
  return opts;
}

function updateUIWithResult(res){
  if(!res) return;
  $("gdt-review").value = res.review.toFixed(1);
  $("gdt-game-quality").innerText = res.gameQuality;
  $("gdt-opt-td").innerText = res.optimalTD;
  $("gdt-actual-td").innerText = res.actualTD;
  $("gdt-sales-mod").innerText = res.salesMod;
  $("gdt-platform-genre").innerText = res.platformGenreMatch;
  $("gdt-topic-aud").innerText = res.audienceAffinity;
  $("gdt-topic-genre").innerText = res.topicGenreMatch;
  $("gdt-trend-bonus").innerText = (res.mods.indexOf("Trend:on")>=0 ? "On" : (res.mods.indexOf("Trend:hot")>=0 ? "Hot":"None"));
  $("gdt-mod-list").innerText = res.mods.length ? res.mods.join(", ") : "None";
  $("gdt-tech").value = res.techVal;
  $("gdt-design").value = res.designVal;
  $("gdt-bugs").value = res.bugsEstimate;
}

// attach events
$("gdt-calc-btn").addEventListener("click", ()=>{
  const opts = gatherOptionsFromUI();
  const res = calculateModernReview(opts);
  updateUIWithResult(res);
});

// sample button
$("gdt-sample-btn").addEventListener("click", ()=>{
  // pick a decent sample combo
  $("gdt-platform").selectedIndex = Math.floor(Math.random()*platforms.length);
  $("gdt-topic").selectedIndex = Math.floor(Math.random()*topics.length);
  $("gdt-genre1").selectedIndex = Math.floor(Math.random()*Object.keys(genreWeights).length);
  $("gdt-genre2").value = "None";
  $("gdt-gamesize").value = ["Small","Medium","Large","AAA"][Math.floor(Math.random()*4)];
  $("gdt-year").value = Math.floor(Math.random()*7).toString();
  // randomize sliders a bit
  for(let s=1;s<=3;s++){
    for(let i=1;i<=3;i++){
      const el = $(`gdt-s${s}-${i}`);
      if(el) el.value = 40 + Math.floor(Math.random()*41); // 40..80
      const lbl = $(`gdt-s${s}-${i}-val`);
      if(lbl) lbl.innerText = el.value;
    }
  }
  $("gdt-calc-btn").click();
});

// Save / Load using localStorage (simple)
$("gdt-save-btn").addEventListener("click", ()=>{
  const state = {
    topic: $("gdt-topic").value,
    platform: $("gdt-platform").value,
    genre1: $("gdt-genre1").value,
    genre2: $("gdt-genre2").value,
    audience: $("gdt-audience").value,
    gamesize: $("gdt-gamesize").value,
    year: $("gdt-year").value,
    trend: $("gdt-trend").value,
    flags: {
      ingarage: $("gdt-ingarage").checked,
      less100k: $("gdt-less100k").checked,
      sequel: $("gdt-sequel").checked,
      expansion: $("gdt-expansion").checked,
      mmo: $("gdt-mmo").checked,
      newemp: $("gdt-newemp").checked
    },
    sliders: (()=>{ const arr=[]; for(let s=1;s<=3;s++){ for(let i=1;i<=3;i++){ arr.push($(`gdt-s${s}-${i}`).value); } } return arr; })()
  };
  localStorage.setItem("gdtcalc_saved", JSON.stringify(state));
  alert("Saved to localStorage");
});

$("gdt-load-btn").addEventListener("click", ()=>{
  const raw = localStorage.getItem("gdtcalc_saved");
  if(!raw){ alert("No saved state found"); return; }
  const state = JSON.parse(raw);
  $("gdt-topic").value = state.topic;
  $("gdt-platform").value = state.platform;
  $("gdt-genre1").value = state.genre1;
  $("gdt-genre2").value = state.genre2;
  $("gdt-audience").value = state.audience;
  $("gdt-gamesize").value = state.gamesize;
  $("gdt-year").value = state.year;
  $("gdt-trend").value = state.trend;
  $("gdt-ingarage").checked = state.flags.ingarage;
  $("gdt-less100k").checked = state.flags.less100k;
  $("gdt-sequel").checked = state.flags.sequel;
  $("gdt-expansion").checked = state.flags.expansion;
  $("gdt-mmo").checked = state.flags.mmo;
  $("gdt-newemp").checked = state.flags.newemp;
  // load sliders
  for(let s=1, idx=0;s<=3;s++){
    for(let i=1;i<=3;i++, idx++){
      const el = $(`gdt-s${s}-${i}`);
      if(el){ el.value = state.sliders[idx]; const lbl = $(`gdt-s${s}-${i}-val`); if(lbl) lbl.innerText = el.value; }
    }
  }
  $("gdt-calc-btn").click();
});

// Auto calculate on change of key inputs for better UX
["gdt-topic","gdt-platform","gdt-genre1","gdt-genre2","gdt-audience","gdt-gamesize","gdt-year","gdt-trend",
 "gdt-ingarage","gdt-less100k","gdt-sequel","gdt-expansion","gdt-mmo","gdt-newemp"].forEach(id=>{
  const el = $(id);
  if(!el) return;
  el.addEventListener("change", ()=> { /* don't spam; user presses calculate */ });
});

// Auto calculate when slider stops (on mouseup)
for(let s=1;s<=3;s++){
  for(let i=1;i<=3;i++){
    const el = $(`gdt-s${s}-${i}`);
    if(!el) continue;
    el.addEventListener("change", ()=>{ /* user adjusted slider */ });
  }
}

// initial sample run
setTimeout(()=>{ if($("gdt-topic")) $("gdt-sample-btn").click(); }, 120);

// Expose API to external scripts
window.gdtcalc = window.gdtcalc || {};
window.gdtcalc.calculateModernReview = calculateModernReview;

// Done
console.log("gdtcalc_full.js loaded — UI ready. Topics:", topics.length, "Platforms:", platforms.length);

})(); // end Part 3 IIFE
