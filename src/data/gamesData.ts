import { SayItBetterChallenge } from '@/types/growth';

export const SAY_IT_BETTER_CHALLENGES: SayItBetterChallenge[] = [
  {
    id: 'sib-01',
    originalText: 'Send me the file ASAP.',
    context: 'Direct message to a teammate working on a design sprint.',
    optimalAnswer: 'Could you please share the file at your earliest convenience? We need it to finalize the sprint assets.',
    options: [
      {
        text: 'Send me the file right this second or we will miss the deadline.',
        toneScore: 25,
        professionalismScore: 30,
        clarityScore: 70,
        feedback: 'Aggressive and stressful. Demanding urgency without politeness strains peer relationships.'
      },
      {
        text: 'Could you please share the file at your earliest convenience? We need it to finalize the sprint assets.',
        toneScore: 98,
        professionalismScore: 96,
        clarityScore: 95,
        feedback: 'Superb! Courteous, states urgency gracefully, and provides clear project rationale.'
      },
      {
        text: 'File please.',
        toneScore: 35,
        professionalismScore: 40,
        clarityScore: 50,
        feedback: 'Terse and robotic. Lacks context and warmth.'
      },
      {
        text: 'Hey bro give the file when you wake up.',
        toneScore: 50,
        professionalismScore: 30,
        clarityScore: 60,
        feedback: 'Overly casual and passive-aggressive.'
      }
    ]
  },
  {
    id: 'sib-02',
    originalText: 'I don\'t understand what you mean, that makes no sense.',
    context: 'Technical architecture call with a project partner.',
    optimalAnswer: 'Could you help me understand that from another angle? I want to make sure I am fully grasping how that data flow works.',
    options: [
      {
        text: 'Could you help me understand that from another angle? I want to make sure I am fully grasping how that data flow works.',
        toneScore: 96,
        professionalismScore: 95,
        clarityScore: 92,
        feedback: 'Excellent: assumes responsibility for comprehension and invites collaborative clarification without defensive friction.'
      },
      {
        text: 'You are explaining this poorly, try again.',
        toneScore: 10,
        professionalismScore: 15,
        clarityScore: 60,
        feedback: 'Directly insults the speaker and shuts down psychological safety.'
      },
      {
        text: 'Whatever, I will just write it my way.',
        toneScore: 15,
        professionalismScore: 20,
        clarityScore: 40,
        feedback: 'Disrespectful and dismissive of collaborative team decision making.'
      },
      {
        text: 'Can you repeat? I did not follow.',
        toneScore: 70,
        professionalismScore: 75,
        clarityScore: 80,
        feedback: 'Decent and concise, though a warmer framing creates stronger rapport.'
      }
    ]
  },
  {
    id: 'sib-03',
    originalText: 'That is not my job, ask someone else.',
    context: 'A coworker asks for assistance with a task outside your immediate sprint scope.',
    optimalAnswer: 'That falls slightly outside my current sprint scope, but [Name] is leading that initiative and will be best equipped to help you.',
    options: [
      {
        text: 'That falls slightly outside my current sprint scope, but [Name] is leading that initiative and will be best equipped to help you.',
        toneScore: 95,
        professionalismScore: 98,
        clarityScore: 95,
        feedback: 'Perfect: sets clear professional boundaries while providing a helpful bridge to the right resource.'
      },
      {
        text: 'Not my problem.',
        toneScore: 5,
        professionalismScore: 10,
        clarityScore: 60,
        feedback: 'Extremely blunt and damages teamwork reputation.'
      },
      {
        text: 'Sure, I will do it (and secretly complain later).',
        toneScore: 60,
        professionalismScore: 40,
        clarityScore: 30,
        feedback: 'People-pleasing without boundary leads to burnout and missed primary commitments.'
      },
      {
        text: 'Why are you asking me when you know I don\'t do backend?',
        toneScore: 20,
        professionalismScore: 25,
        clarityScore: 50,
        feedback: 'Defensive and antagonistic.'
      }
    ]
  },
  {
    id: 'sib-04',
    originalText: 'Why did you change my code? It was fine.',
    context: 'Reviewing a commit on GitHub where a peer refactored your function.',
    optimalAnswer: 'I noticed your refactor in the latest commit. Could you walk me through the performance or architectural gains you were targeting?',
    options: [
      {
        text: 'I noticed your refactor in the latest commit. Could you walk me through the performance or architectural gains you were targeting?',
        toneScore: 97,
        professionalismScore: 95,
        clarityScore: 94,
        feedback: 'Brilliant: approaches code modifications with intellectual curiosity rather than defensive ego.'
      },
      {
        text: 'Undo that commit immediately.',
        toneScore: 20,
        professionalismScore: 30,
        clarityScore: 70,
        feedback: 'Authoritarian and escalates minor technical differences into interpersonal conflict.'
      },
      {
        text: 'You broke my work on purpose.',
        toneScore: 5,
        professionalismScore: 10,
        clarityScore: 20,
        feedback: 'Paranoid and highly unprofessional.'
      },
      {
        text: 'What did you change and why?',
        toneScore: 65,
        professionalismScore: 70,
        clarityScore: 80,
        feedback: 'Direct, but slightly sharp. Adding collaborative framing improves tone.'
      }
    ]
  }
];

export interface EtiquetteDilemma {
  id: string;
  category: string;
  situation: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
    xp: number;
  }[];
}

export const ETIQUETTE_DILEMMAS: EtiquetteDilemma[] = [
  {
    id: 'ed-01',
    category: 'Virtual Meetings',
    situation: 'You are presenting your screen during a technical demo when a personal WhatsApp or notification pops up. What is the best immediate response?',
    options: [
      {
        text: 'Quickly mute the notification, say calmly: "Excuse me for that interruption, let us continue with the database demo," and keep going smoothly.',
        isCorrect: true,
        explanation: 'Poise and composure in the face of minor technical hiccups projects executive maturity.',
        xp: 30
      },
      {
        text: 'Start screaming and close your laptop in sheer embarrassment.',
        isCorrect: false,
        explanation: 'Overreacting turns a 2-second blip into a memorable disaster.',
        xp: 5
      },
      {
        text: 'Pretend nothing happened while the notification stays visible for 5 minutes.',
        isCorrect: false,
        explanation: 'Failing to close personal windows compromises privacy and distracts the audience.',
        xp: 10
      }
    ]
  },
  {
    id: 'ed-02',
    category: 'Hackathon Collaboration',
    situation: 'At 3 AM during a 24-hour hackathon, one teammate is exhausted and falling asleep at their keyboard. What should a leader do?',
    options: [
      {
        text: 'Insist they take a 90-minute sleep cycle or power nap so they can code effectively during final morning testing.',
        isCorrect: true,
        explanation: 'Exhausted coders write bugs that cost 3x longer to debug. Strategic rest preserves delivery quality.',
        xp: 30
      },
      {
        text: 'Pour cold water on them and demand they keep typing.',
        isCorrect: false,
        explanation: 'Unhealthy and damages teammate well-being.',
        xp: 5
      },
      {
        text: 'Kick them off the team immediately.',
        isCorrect: false,
        explanation: 'Destroys morale and teamwork.',
        xp: 5
      }
    ]
  }
];

export interface VocabularyWord {
  id: string;
  informalPhrase: string;
  executiveAlternative: string;
  exampleSentence: string;
  options: string[];
  correctIndex: number;
}

export const VOCABULARY_CHALLENGES: VocabularyWord[] = [
  {
    id: 'voc-01',
    informalPhrase: 'Fix this mistake',
    executiveAlternative: 'Rectify this discrepancy',
    exampleSentence: 'We have updated our telemetry to rectify this discrepancy.',
    options: ['Rectify this discrepancy', 'Cancel this junk', 'Delete this failure', 'Restart everything'],
    correctIndex: 0
  },
  {
    id: 'voc-02',
    informalPhrase: 'Make it bigger so it can handle more users',
    executiveAlternative: 'Scale the architecture to support higher concurrency',
    exampleSentence: 'We need to scale the architecture to support higher concurrency during live quiz events.',
    options: ['Add more hard drives', 'Scale the architecture to support higher concurrency', 'Make it huge', 'Overclock the server'],
    correctIndex: 1
  },
  {
    id: 'voc-03',
    informalPhrase: 'Work together on this',
    executiveAlternative: 'Collaborate cross-functionally',
    exampleSentence: 'Frontend and backend engineers must collaborate cross-functionally on schema contracts.',
    options: ['Hang out in voice chat', 'Collaborate cross-functionally', 'Do double work', 'Merge branches fast'],
    correctIndex: 1
  }
];
