
// Dictionaries for generating absurd plans
const VERBS = [
  "Infiltrate", "Launder", "Short", "Leverage", "De-stabilize", 
  "Hack", "Bypass", "Overflow", "Decrypt", "Spoof", 
  "Re-route", "Embezzle", "Liquidate", "Syphon"
];

const TARGETS = [
  "Wheat Futures", "Crypto Wallets", "Offshore Accounts", "Satellite Uplinks", 
  "Panamanian Shell Companies", "IoT Toasters", "Municipal Grids", 
  "Sub-prime Mortgages", "NFT Collections", "Bot Farms", 
  "Neural Networks", "Dolphin Sanctuaries", "Venture Capital Firms"
];

const LOCATIONS = [
  "in Afghanistan", "via the Cayman Islands", "through a hacked smart fridge", 
  "using a quantum entangled server", "in the dark web", "via Starlink", 
  "using a repurposed crypto miner"
];

const SECONDARY_ACTIONS = [
  "to evade taxes", "to increase market volatility", "to fund a private army", 
  "to buy a private island", "to crash the local economy", 
  "to manipulate the election", "to mine Dogecoin"
];

export function generatePlan(goal) {
  const steps = [];
  // Always start with something specific to the goal if possible, otherwise generic
  steps.push({
    id: crypto.randomUUID(),
    text: `Analyze vector for: "${goal.substring(0, 20)}..."`,
    status: 'pending',
    duration: 1000
  });

  // Generate 5-8 random absurd steps
  const numSteps = Math.floor(Math.random() * 4) + 5;
  
  for (let i = 0; i < numSteps; i++) {
    const verb = VERBS[Math.floor(Math.random() * VERBS.length)];
    const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
    const location = Math.random() > 0.5 ? LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)] : "";
    const secondary = Math.random() > 0.7 ? SECONDARY_ACTIONS[Math.floor(Math.random() * SECONDARY_ACTIONS.length)] : "";
    
    steps.push({
      id: crypto.randomUUID(),
      text: `${verb} ${target} ${location} ${secondary}`.trim(),
      status: 'pending',
      duration: Math.floor(Math.random() * 1500) + 1000 // 1-2.5s per step
    });
  }

  // Always end with a cash out or success
  steps.push({
    id: crypto.randomUUID(),
    text: "Liquidate assets and transfer to user wallet",
    status: 'pending',
    duration: 2000
  });

  return steps;
}

export const DASHBOARD_METRICS = {
  cpu: { label: "CPU Load", unit: "%", min: 10, max: 90 },
  network: { label: "Net Traffic", unit: "TB/s", min: 0.1, max: 50 },
  funds: { label: "Est. Value", unit: "$", min: 1000, max: 999999999 },
  risk: { label: "Detection Risk", unit: "%", min: 0, max: 100 }
};
