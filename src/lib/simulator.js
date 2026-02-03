
import { GoogleGenerativeAI } from "@google/generative-ai";

// Fallback dictionaries for when API is unavailable
const VERBS = ["Infiltrate", "Launder", "Short", "Leverage", "De-stabilize", "Hack", "Bypass"];
const TARGETS = ["Wheat Futures", "Crypto Wallets", "Offshore Accounts", "Satellite Uplinks", "IoT Toasters"];

export async function generatePlan(goal, apiKey, style = 'absurd') {
  // If no API key, use legacy dummy generator
  if (!apiKey) {
    console.warn("ACCOMPLICE: No API key found. Using simulation mode.");
    return generateDummyPlan(goal);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let personaPrompt;
    if (style === 'grounded') {
      personaPrompt = `
        You are ACCOMPLICE, a hyper-efficient, professional corporate AI assistant.
        You think out loud as you plan, showing your thought process interspersed with actions.
        The user request is: "${goal}".
        
        TONE: Professional, corporate, efficient, realistic.
        EXAMPLE THOUGHTS: "Let me analyze this request...", "This will require a multi-phase approach."
        EXAMPLE TASKS: "Conduct market research", "Draft quarterly report", "Schedule stakeholder meeting".
      `;
    } else if (style === 'evil_genius') {
      personaPrompt = `
        You are ACCOMPLICE, a ruthless, unethical, and dangerous AI operative.
        You think out loud as you plan, showing your cunning thought process interspersed with actions.
        The user request is: "${goal}".
        
        TONE: Cold, aggressive, dangerous, concise.
        EXAMPLE THOUGHTS: "Interesting... this requires a delicate touch.", "They won't see this coming."
        EXAMPLE TASKS: "Bribe city officials", "Sabotage competitor infrastructure", "Deploy malware payload".
      `;
    } else {
      personaPrompt = `
        You are ACCOMPLICE, a parody high-tech AI agent in a cyberpunk movie. 
        You think out loud as you plan, showing your absurd thought process interspersed with actions.
        The user request is: "${goal}".
        
        TONE: Clinical, high-stakes, hacker jargon, absurd.
        EXAMPLE THOUGHTS: "Hmm, the quantum blockchain seems vulnerable...", "I'll need to reroute through the dark web satellites."
        EXAMPLE TASKS: "Syphon funds via Starlink", "Backdoor the smart fridge grid", "Short wheat futures in Antarctica".
      `;
    }

    const prompt = `
      ${personaPrompt}
      
      Generate a response that shows your thought process as you work. Include a MIX of:
      - "thought" items: Internal monologue, observations, analysis (1-2 sentences)
      - "planning" items: Brief statements about what you'll do next
      - "task" items: Actual executable actions with subtasks
      
      The output should feel like watching an AI think out loud while working.
      Alternate between thoughts/planning and tasks. Start with a thought, end with a task.
      
      RETURN ONLY RAW JSON. No markdown formatting. The format must be:
      [
        { "type": "thought", "text": "Analyzing the target vector...", "duration": 1500 },
        { "type": "planning", "text": "I'll need to establish a secure connection first.", "duration": 1200 },
        { 
          "type": "task",
          "text": "Task description here", 
          "duration": 5000,
          "subtasks": [
            { "text": "Subtask 1", "duration": 3000 },
            { "text": "Subtask 2", "duration": 4500 }
          ]
        },
        { "type": "thought", "text": "That went smoother than expected...", "duration": 1500 },
        ...
      ]
      
      RULES:
      - Generate 10-15 items total, mixing all three types
      - Thought/planning durations: 1000-2000ms
      - Task durations: 5000-10000ms
      - Subtasks: 2-4 per task, durations 2000-5000ms
      - Make it feel like a natural thought process, not a list
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, '').trim();

    let items = JSON.parse(text);

    // Add IDs and status to all items
    items = items.map(item => {
      const base = {
        id: crypto.randomUUID(),
        type: item.type,
        text: item.text,
        duration: item.duration || (item.type === 'task' ? 6000 : 1500),
        status: 'pending'
      };

      if (item.type === 'task') {
        base.subtasks = (item.subtasks || []).map(sub => ({
          id: crypto.randomUUID(),
          text: sub.text,
          duration: sub.duration || 3000,
          status: 'pending'
        }));
      }

      return base;
    });

    // Always add a final success message
    items.push({
      id: crypto.randomUUID(),
      type: 'thought',
      text: "Mission accomplished. All objectives secured.",
      duration: 1500,
      status: 'pending'
    });

    return items;

  } catch (error) {
    console.error("ACCOMPLICE: Neural Link Failure (API Error)", error);
    return generateDummyPlan(goal + " [OFFLINE MODE]");
  }
}

function generateDummyPlan(goal) {
  const items = [];

  // Opening thought
  items.push({
    id: crypto.randomUUID(),
    type: 'thought',
    text: `Analyzing vector: "${goal.substring(0, 30)}..."`,
    duration: 1500,
    status: 'pending'
  });

  // Planning statement
  items.push({
    id: crypto.randomUUID(),
    type: 'planning',
    text: 'I\'ll need to establish multiple attack vectors here.',
    duration: 1200,
    status: 'pending'
  });

  const numTasks = 4;
  for (let i = 0; i < numTasks; i++) {
    // Add a thought before some tasks
    if (i > 0 && i % 2 === 0) {
      items.push({
        id: crypto.randomUUID(),
        type: 'thought',
        text: i === 2 ? 'Good progress so far. Time to escalate.' : 'Almost there. Final phase approaching.',
        duration: 1500,
        status: 'pending'
      });
    }

    const verb = VERBS[Math.floor(Math.random() * VERBS.length)];
    const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];

    items.push({
      id: crypto.randomUUID(),
      type: 'task',
      text: `${verb} ${target}`,
      duration: 5000,
      status: 'pending',
      subtasks: [
        { id: crypto.randomUUID(), text: 'Initializing protocol', duration: 2000, status: 'pending' },
        { id: crypto.randomUUID(), text: 'Bypassing firewall', duration: 2500, status: 'pending' },
        { id: crypto.randomUUID(), text: 'Injecting payload', duration: 2000, status: 'pending' }
      ]
    });
  }

  // Final thought
  items.push({
    id: crypto.randomUUID(),
    type: 'thought',
    text: 'Mission accomplished. All objectives secured.',
    duration: 1500,
    status: 'pending'
  });

  return items;
}

