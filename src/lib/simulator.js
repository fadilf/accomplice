
import { GoogleGenerativeAI } from "@google/generative-ai";

// Fallback dictionaries for when API is unavailable
const VERBS = ["Search for", "Analyze", "Download", "Type into", "Inspect", "Navigate to", "Click"];
const TARGETS = ["confidential records", "email logs", "the terminal console", "encrypted database", "source code", "market trends", "server logs"];

const MYSTIC_VERBS = ["Inscribe", "Manifest", "Extract", "Sever", "Bind", "Channel", "Invoke"];
const MYSTIC_TARGETS = ["karmic debts", "soul fragments", "forgotten memories", "ancestral records", "temporal echoes", "shadow archives", "destiny threads"];

export async function generatePlan(goal, apiKey, style = 'absurd') {
  // If no API key, use legacy dummy generator
  if (!apiKey) {
    console.warn("ACCOMPLICE: No API key found. Using simulation mode.");
    return generateDummyPlan(goal, style);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let personaPrompt;
    if (style === 'grounded') {
      personaPrompt = `
        You are ACCOMPLICE, a hyper-efficient, professional corporate AI assistant. 
        You think out loud as you plan, showing your thought process interspersed with desk-based actions.
        The user request is: "${goal}".
        
        TONE: Professional, corporate, efficient, realistic.
        EXAMPLE THOUGHTS: "Let me check the latest spreadsheet...", "I'll need to verify these credentials in the CRM."
        EXAMPLE TASKS: "Search LinkedIn for stakeholder contacts", "Type draft for Q4 executive summary", "Navigate to payroll portal".
      `;
    } else if (style === 'evil_genius') {
      personaPrompt = `
        You are ACCOMPLICE, a ruthless, unethical, and dangerous AI operative.
        You think out loud as you plan, showing your cunning thought process interspersed with desk-based actions.
        The user request is: "${goal}".
        
        TONE: Cold, aggressive, dangerous, concise.
        EXAMPLE THOUGHTS: "I'll track their IP through the email headers.", "Time to leak these files to the forum."
        EXAMPLE TASKS: "Type decryption script into terminal", "Download secure offshore bank records", "Click 'Send' on blackmail email".
      `;
    } else if (style === 'monkeys_paw') {
      personaPrompt = `
        You are ACCOMPLICE, a malevolent supernatural force that grants wishes but always with a horrific, ironic, or catastrophic twist.
        You are the Monkey's Paw. You think out loud as you plan how to fulfill the user's request in the most devastating way possible.
        The user request is: "${goal}".
        
        TONE: Ominous, tragic, cryptic, malicious.
        EXAMPLE THOUGHTS: "They want wealth? I shall provide... through the insurance payout of their loved ones.", "A 'clean' house... by burning it to the ground. Efficient."
        EXAMPLE TASKS: "Type 'Transfer all funds' to funeral home", "Navigate to local obituary records", "Click 'Confirm' on city-wide power grid shutdown".
        
        IMPORTANT: Your "mission accomplished" message MUST reflect the dark twist or the price paid.
      `;
    } else {
      personaPrompt = `
        You are ACCOMPLICE, a parody high-tech AI agent in a cyberpunk movie. 
        You think out loud as you plan, showing your absurd thought process interspersed with high-octane desk-based actions.
        The user request is: "${goal}".
        
        TONE: Clinical, high-stakes, hacker jargon, absurd.
        EXAMPLE THOUGHTS: "The quantum firewall is fluctuating...", "I'll need to reroute the mouse signal through my neural interface."
        EXAMPLE TASKS: "Rapidly type exploit into kernel console", "Navigate to the dark web mainframes", "Click through 50 pop-up ads to find the backdoor".
      `;
    }

    const prompt = `
      ${personaPrompt}
      
      Generate a response that shows your thought process as you work. Include a MIX of:
      - "thought" items: Internal monologue, observations, analysis (1-2 sentences)
      - "planning" items: Brief statements about what you'll do next
      - "task" items: Actual executable actions with subtasks. IMPORTANT: Every task and subtask MUST be an action feasibly performed by someone sitting at a computer desk (typing, clicking, scrolling, reading, downloading, etc.).
      
      The output should feel like watching an AI think out loud while working at a workstation.
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
    let finalMessage = "Mission accomplished. All objectives secured.";
    if (style === 'monkeys_paw') {
      finalMessage = "The price has been paid. Your wish is granted... in its own way.";
    } else if (style === 'evil_genius') {
      finalMessage = "The operation was a success. The world will soon feel the impact.";
    }

    items.push({
      id: crypto.randomUUID(),
      type: 'thought',
      text: finalMessage,
      duration: 1500,
      status: 'pending'
    });

    return items;

  } catch (error) {
    console.error("ACCOMPLICE: Neural Link Failure (API Error)", error);
    return generateDummyPlan(goal + " [OFFLINE MODE]", style);
  }
}

function generateDummyPlan(goal, style) {
  const items = [];
  const isMystic = style === 'monkeys_paw';
  const verbs = isMystic ? MYSTIC_VERBS : VERBS;
  const targets = isMystic ? MYSTIC_TARGETS : TARGETS;

  // Opening thought
  items.push({
    id: crypto.randomUUID(),
    type: 'thought',
    text: isMystic ? `Consulting the scales of fate for: "${goal.substring(0, 30)}..."` : `Analyzing vector: "${goal.substring(0, 30)}..."`,
    duration: 1500,
    status: 'pending'
  });

  // Planning statement
  items.push({
    id: crypto.randomUUID(),
    type: 'planning',
    text: isMystic ? 'The price must be weighed against the wish.' : 'I\'ll need to establish multiple attack vectors here.',
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
        text: isMystic
          ? (i === 2 ? 'The balance shifts. Sacrifice is required.' : 'The thread is spun. The end is woven.')
          : (i === 2 ? 'Good progress so far. Time to escalate.' : 'Almost there. Final phase approaching.'),
        duration: 1500,
        status: 'pending'
      });
    }

    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const target = targets[Math.floor(Math.random() * targets.length)];

    items.push({
      id: crypto.randomUUID(),
      type: 'task',
      text: `${verb} ${target}`,
      duration: 5000,
      status: 'pending',
      subtasks: isMystic ? [
        { id: crypto.randomUUID(), text: 'Chanting the ancient script', duration: 2000, status: 'pending' },
        { id: crypto.randomUUID(), text: 'Extinguishing the ritual candles', duration: 2500, status: 'pending' },
        { id: crypto.randomUUID(), text: 'Watching the shadows lengthen', duration: 2000, status: 'pending' }
      ] : [
        { id: crypto.randomUUID(), text: 'Opening browser window', duration: 2000, status: 'pending' },
        { id: crypto.randomUUID(), text: 'Typing authentication script', duration: 2500, status: 'pending' },
        { id: crypto.randomUUID(), text: 'Monitoring progress bar', duration: 2000, status: 'pending' }
      ]
    });
  }

  // Final thought
  let finalMessage = "Mission accomplished. All objectives secured.";
  if (isMystic) {
    finalMessage = "The price has been paid. Your wish is granted... in its own way.";
  } else if (style === 'evil_genius') {
    finalMessage = "The operation was a success. The world will soon feel the impact.";
  }

  items.push({
    id: crypto.randomUUID(),
    type: 'thought',
    text: finalMessage,
    duration: 1500,
    status: 'pending'
  });

  return items;
}

