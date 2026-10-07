import { RecommendedResource, PracticeScenario, ConversationScenario, DailyGrowthChallenge } from '@/types/growth';

export const GROWTH_RESOURCES: RecommendedResource[] = [
  {
    id: 'res-pt-01',
    skill: 'professional-tone',
    title: 'Executive Presence: Speaking with Clear Professional Polish',
    description: 'Learn how to transform casual student jargon into crisp, executive-grade technical communication without sounding robotic.',
    type: 'lesson',
    readTime: '4 min read',
    keyPhrases: [
      '"Could you clarify the expected timeline?" (instead of "When will this happen?")',
      '"I want to ensure we are aligned on requirements." (instead of "I don\'t get what you mean.")',
      '"Let us evaluate the architectural trade-offs." (instead of "Your way has problems.")'
    ],
    practicePrompt: 'Rewrite your last 3 WhatsApp or Slack messages to a peer using executive framing.'
  },
  {
    id: 'res-vm-01',
    skill: 'verbal-manners',
    title: 'The Art of Polite Interjection in Technical Discussions',
    description: 'Master the art of clarifying bugs, correcting errors, and adding vital context in fast-moving engineering standups without causing defensive friction.',
    type: 'scenario',
    readTime: '3 min read',
    keyPhrases: [
      '"Building on that point..."',
      '"If I may add a quick nuance on the database schema..."',
      '"That brings up an interesting edge case we should test..."'
    ],
    practicePrompt: 'Practice pausing for 2 seconds before speaking when you feel the urge to correct someone.'
  },
  {
    id: 'res-ic-01',
    skill: 'interview-communication',
    title: 'The STAR Method & Thinking Aloud During Live Technical Rounds',
    description: 'Deconstruct complex algorithm questions into verbal logic trees that prove your problem-solving depth even when you do not immediately know the solution.',
    type: 'exercise',
    readTime: '5 min read',
    keyPhrases: [
      '"Let me trace my initial brute-force intuition first..."',
      '"Given these constraints, an O(N) linear scan using a hash map might optimize lookup time..."',
      '"Could we confirm edge cases where input is empty or null?"'
    ],
    practicePrompt: 'Record yourself explaining a binary search algorithm in 90 seconds without filler words like "um" or "like".'
  },
  {
    id: 'res-al-01',
    skill: 'active-listening',
    title: 'Active Listening & The Power of Verifying Paraphrases',
    description: 'Prevent costly engineering misalignments by reflecting technical requirements back to teammates before writing a single line of code.',
    type: 'checklist',
    readTime: '3 min read',
    keyPhrases: [
      '"To verify I captured that accurately: our primary objective is..."',
      '"What is the highest priority constraint for this sprint?"',
      '"How will we know this feature is successful in production?"'
    ],
    practicePrompt: 'In your next team call, summarize the speaker\'s core point before presenting your own.'
  },
  {
    id: 'res-ch-01',
    skill: 'conflict-handling',
    title: 'High-Stakes Technical Disagreements & "Disagree and Commit"',
    description: 'How elite engineering teams at Google, Amazon, and leading startups argue constructively with data and align behind unified execution.',
    type: 'lesson',
    readTime: '4 min read',
    keyPhrases: [
      '"Let us look at our telemetry and benchmarks rather than personal opinions."',
      '"I hear your perspective on simplicity; here is the concurrency risk I am factoring in."',
      '"I voiced my reservations, but now that we have decided, I am 100% committed to shipping this."'
    ],
    practicePrompt: 'Identify a technical preference of yours and write out 3 strong counterarguments supporting the alternative.'
  },
  {
    id: 'res-ee-01',
    skill: 'email-etiquette',
    title: 'The 3-Paragraph High-Yield Cold Email Blueprint',
    description: 'How to write to industry speakers, open-source maintainers, and hiring managers with zero fluff and maximum response rates.',
    type: 'lesson',
    readTime: '4 min read',
    keyPhrases: [
      '"I loved your recent article on [Topic], especially your point regarding..."',
      '"I am building an open-source tool solving [Problem] and would deeply appreciate a 10-minute critique."',
      '"I know your schedule is demanding—no reply needed if timing is tight."'
    ],
    practicePrompt: 'Draft a 100-word cold outreach to a tech speaker you admire with a clear, polite CTA.'
  }
];

export const PRACTICE_SCENARIOS: PracticeScenario[] = [
  {
    id: 'ps-01',
    category: 'workplace-etiquette',
    title: 'Your Manager Inquires Why Your Sprint Feature is Behind Schedule',
    situation: 'Your team lead messages on Slack at 4 PM: "Hey, is the user auth module ready to deploy today as planned?"',
    context: 'You encountered an unexpected OAuth token refresh bug this morning that took 4 hours to trace.',
    options: [
      {
        id: 'opt-1',
        text: '"No, third-party libraries suck and broke everything."',
        isOptimal: false,
        effectiveness: 'Poor',
        analysis: 'Blaming tools and showing anger indicates low emotional composure and does not give the manager any forecast.',
        toneScore: 20
      },
      {
        id: 'opt-2',
        text: '"Hi [Lead], we encountered an unexpected OAuth token refresh edge case during integration testing. I have resolved the root issue and am finishing the automated test cases now. I will have it ready for review tomorrow morning by 10 AM. Apologies for the delay!"',
        isOptimal: true,
        effectiveness: 'Best',
        analysis: 'Clear root cause, reassurance that the solution is in progress, concrete updated deadline (tomorrow 10 AM), and courteous accountability.',
        toneScore: 98
      },
      {
        id: 'opt-3',
        text: '"Working on it."',
        isOptimal: false,
        effectiveness: 'Average',
        analysis: 'Terse and unhelpful. Leaves the manager guessing whether it is minutes away or days away.',
        toneScore: 40
      }
    ]
  },
  {
    id: 'ps-02',
    category: 'professional-tone',
    title: 'Requesting a Teammate to Rework a Component with Poor Code Quality',
    situation: 'A peer pushed 500 lines of spaghetti code into a single file without types or modular functions.',
    context: 'You are reviewing the Pull Request.',
    options: [
      {
        id: 'opt-1',
        text: '"This PR is unreadable. Learn how to code before submitting PRs."',
        isOptimal: false,
        effectiveness: 'Poor',
        analysis: 'Destructive, hostile, and violates healthy engineering code of conduct.',
        toneScore: 10
      },
      {
        id: 'opt-2',
        text: '"Thanks for pushing the core logic! To keep our codebase scalable and make future debugging easier, could we break this into 3 smaller sub-components and add TypeScript interfaces? I am happy to hop on a 10-min pair coding session if you want to scaffold them together."',
        isOptimal: true,
        effectiveness: 'Best',
        analysis: 'Affirms effort, explains architectural justification (maintainability), provides actionable structural guidance, and offers peer support.',
        toneScore: 96
      },
      {
        id: 'opt-3',
        text: '"LGTM (Looks Good To Me)" (approving it silently despite serious issues)',
        isOptimal: false,
        effectiveness: 'Average',
        analysis: 'Avoiding conflict by approving low-quality code hurts the entire engineering team long-term.',
        toneScore: 50
      }
    ]
  }
];

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [
  {
    id: 'cs-interview-01',
    title: 'Tech Hiring Manager Behavioral Screening',
    targetRole: 'Senior Engineering Manager',
    difficulty: 'medium',
    description: 'Navigate a live scenario question regarding handling tight deadlines, unexpected bugs, and peer collaboration.',
    turns: [
      {
        speaker: 'Alex Rivera',
        role: 'Engineering Lead at Tech Corp',
        message: 'Welcome! To kick things off: tell me about a time when your team was 24 hours away from a deadline, but a major bug appeared. What was your role?',
        userPrompt: 'Choose your opening behavioral response:',
        options: [
          {
            text: 'I stayed calm, gathered the team for a 5-minute triage to isolate whether the bug affected critical user flows, took ownership of reproducing the error in our local sandbox, and proposed descoping a non-essential animation to safeguard our core launch.',
            feedback: 'Outstanding: demonstrates crisis composure, triage methodology, and business-focused prioritization.',
            score: 95,
            nextDialogue: 'That is great triage instinct. How did you ensure the rest of the team did not panic while you were investigating?'
          },
          {
            text: 'I told everyone that it wasn\'t my fault because I only wrote the frontend part, so whoever wrote the backend had to pull an all-nighter to fix it.',
            feedback: 'Poor: shows silo mentality, finger-pointing, and complete lack of ownership.',
            score: 25,
            nextDialogue: 'I see. In our engineering culture, we emphasize shared team ownership over individual finger pointing.'
          },
          {
            text: 'We just pushed through and drank lots of energy drinks and wrote code until 5 AM.',
            feedback: 'Average: shows stamina, but lacks structured problem-solving or process maturity.',
            score: 55,
            nextDialogue: 'Hard work is appreciated, but sustainable software engineering relies on triage and risk assessment.'
          }
        ]
      }
    ]
  },
  {
    id: 'cs-professor-01',
    title: 'Approaching a College Professor for an Internship Recommendation',
    targetRole: 'Head of Computer Science Dept',
    difficulty: 'easy',
    description: 'Politely introduce your ambitions, highlight past academic accomplishments, and secure an advocacy letter.',
    turns: [
      {
        speaker: 'Dr. Sharma',
        role: 'Professor & Department Head',
        message: 'Yes, come in. What can I do for you today?',
        userPrompt: 'How do you open your request?',
        options: [
          {
            text: 'Good afternoon Dr. Sharma. Thank you for your time. I am applying for the Google Summer of Code / Techyogeek Fellowship program. I thoroughly enjoyed your Distributed Systems course last semester where I built the raft consensus project. I would be honored if you would consider writing a letter of recommendation for my application.',
            feedback: 'Flawless: polite greeting, specific course reference, clear project anchor, and respectful request format.',
            score: 98,
            nextDialogue: 'Ah yes, I remember your consensus implementation. Do you have your updated resume and the application criteria ready?'
          },
          {
            text: 'Hey sir, I need a rec letter by tomorrow morning for an internship. Can you write one fast?',
            feedback: 'Very poor: abrupt, disrespectful of their schedule, and gives zero advance notice.',
            score: 20,
            nextDialogue: 'Letters of recommendation require at least two weeks advance notice. I cannot do this overnight.'
          }
        ]
      }
    ]
  }
];

export const DAILY_CHALLENGES: DailyGrowthChallenge[] = [
  {
    id: 'dc-01',
    date: '2026-03-31',
    title: 'The 30-Second Elevator Pitch',
    category: 'speaking-professionally',
    description: 'Introduce who you are, what technology you build with, and what problem you are solving in 3 concise sentences without saying "um" or "like".',
    task: 'Draft your 3-sentence pitch: 1) Identity & Stack; 2) Problem you solve; 3) What you are building currently.',
    exampleGood: '"I am a full-stack student developer specializing in Next.js and Go. I build tools that democratize access to tech opportunities for college engineers. Right now, I am engineering an open-source collaboration engine on TYGN."',
    exampleAvoid: '"Um, so yeah, I am just a student, I do coding sometimes and like python, hire me."',
    xpReward: 50
  },
  {
    id: 'dc-02',
    date: '2026-04-01',
    title: 'Refactor a Blunt Slack Message',
    category: 'professional-tone',
    description: 'Transform: "This design looks ugly, change it." into constructive, collaborative UI feedback.',
    task: 'Write a 2-sentence review that compliments one positive aspect and offers actionable critique on typography or contrast.',
    exampleGood: '"I love the dynamic card layout here! Could we test increasing the contrast ratio on the secondary text to ensure it meets WCAG accessibility guidelines?"',
    exampleAvoid: '"This is bad, do it again."',
    xpReward: 50
  },
  {
    id: 'dc-03',
    date: '2026-04-02',
    title: 'The Graceful Technical Disagreement',
    category: 'conflict-handling',
    description: 'Practice phrasing a counter-proposal to an architectural decision using "I wonder if..." or "What if we explore..."',
    task: 'Propose using PostgreSQL instead of SQLite for a high-concurrency cloud backend.',
    exampleGood: '"I appreciate how fast SQLite got our prototype off the ground. As we forecast concurrent user growth for our live quiz rooms, what if we benchmark PostgreSQL connection pooling to avoid database write locking?"',
    exampleAvoid: '"SQLite is useless in production, anyone who uses it doesn\'t know backend."',
    xpReward: 50
  }
];
