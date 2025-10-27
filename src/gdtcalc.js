/*
  gdtcalc.js — Modernized (Game Dev Tycoon 2020+ Balance)
  -------------------------------------------------------
  Updated by Code Companion (ChatGPT)
  - Includes new topics and platforms
  - Uses the modern review formula with diminishing returns
  - Outputs 0–10 style scores

  Columns:
    Topic/Genre: Action, Adventure, RPG, Simulation, Strategy, Casual, Young, Everyone, Mature
    Platform/Genre: Action, Adventure, RPG, Simulation, Strategy, Casual, Young, Everyone, Mature, TechLevel
*/

// ---------------------------
//     Debug Config
// ---------------------------
const DEBUG = false;
function debug(...args) {
  if (DEBUG) console.log("[DEBUG]", ...args);
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
// ---------------------------
// [Name, Action, Adventure, RPG, Simulation, Strategy, Casual, Young, Everyone, Mature]
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
// ---------------------------
// [Name, Action, Adventure, RPG, Simulation, Strategy, Casual, Young, Everyone, Mature, TechLevel]
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
    console.warn("Invalid input:", topicName, genre, platformName);
    return 0;
  }

  const genreIndex = ["Action", "Adventure", "RPG", "Simulation", "Strategy", "Casual"].indexOf(genre) + 1;
  const topicGenreMatch = topic[genreIndex];
  const platformGenreMatch = platform[genreIndex];
  const audienceIndex = { Young: 6, Everyone: 7, Mature: 8 }[audience] || 7;
  const audienceMod = (topic[audienceIndex] + platform[audienceIndex]) / 2;

  const techLevel = platform[9] || 0;
  const techInfluence = 1.0 + techLevel * 0.05;

  const designTechBalance = g.designWeight * 0.6 + g.techWeight * 0.4;

  let baseScore = ((topicGenreMatch + platformGenreMatch) / 2) *
                  audienceMod * techInfluence * designTechBalance;

  baseScore *= (0.8 + 0.4 * gameLength); // game size scaling
  baseScore = Math.pow(baseScore, 0.7); // diminishing returns

  const review = Math.min(baseScore * 10, 10);
  debug({
    topicGenreMatch, platformGenreMatch, audienceMod, techInfluence, designTechBalance, baseScore, review
  });
  return parseFloat(review.toFixed(1));
}

// Example usage:
// console.log(calculateScore("Fantasy", "RPG", "PlaySystem 4", "Everyone", 1.2));

console.log(
  `✅ gdtcalc.js loaded — Topics: ${topics.length}, Platforms: ${platforms.length}, Formula: Modern 2020+`
);
