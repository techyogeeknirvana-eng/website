export type SkillCategory = 
  | 'verbal-manners'
  | 'professional-tone'
  | 'workplace-etiquette'
  | 'interview-communication'
  | 'active-listening'
  | 'email-etiquette'
  | 'conflict-handling'
  | 'leadership-communication'
  | 'speaking-professionally'
  | 'meeting-etiquette'
  | 'feedback-delivery'
  | 'social-etiquette';

export type QuestionFormat = 
  | 'multiple-choice'
  | 'scenario-based'
  | 'choose-best-response'
  | 'identify-inappropriate'
  | 'complete-conversation'
  | 'situational-judgement';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export type CommunicationLevel = 
  | 'Beginner'
  | 'Developing'
  | 'Confident'
  | 'Professional'
  | 'Advanced';

export interface QuizQuestionItem {
  id: string;
  category: SkillCategory;
  categoryLabel: string;
  difficulty: DifficultyLevel;
  type: QuestionFormat;
  question: string;
  context?: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  betterApproach: string;
  keyTakeaway: string;
  skill: string;
  tags: string[];
}

export interface QuizAnswerRecord {
  questionId: string;
  category: SkillCategory;
  selectedAnswer: number;
  isCorrect: boolean;
  timestamp: string;
}

export interface QuizSessionResult {
  sessionId: string;
  date: string;
  score: number; // 0 to 10
  totalQuestions: 10;
  level: CommunicationLevel;
  categoryScores: Record<SkillCategory, { correct: number; total: number; percentage: number }>;
  strengths: string[];
  weaknesses: string[];
  focusArea: SkillCategory;
  focusAreaLabel: string;
  feedbackGood: string[];
  feedbackImprove: string[];
  answers: QuizAnswerRecord[];
}

export interface RecommendedResource {
  id: string;
  skill: SkillCategory;
  title: string;
  description: string;
  type: 'lesson' | 'scenario' | 'checklist' | 'exercise';
  readTime: string;
  keyPhrases: string[];
  practicePrompt: string;
}

export interface PracticeScenario {
  id: string;
  category: SkillCategory;
  title: string;
  situation: string;
  context: string;
  options: {
    id: string;
    text: string;
    isOptimal: boolean;
    effectiveness: 'Poor' | 'Average' | 'Good' | 'Best';
    analysis: string;
    toneScore: number;
    recommendedRewrite?: string;
  }[];
}

export interface ConversationTurn {
  speaker: string;
  role: string;
  avatar?: string;
  message: string;
  userPrompt: string;
  options: {
    text: string;
    feedback: string;
    score: number;
    nextDialogue?: string;
  }[];
}

export interface ConversationScenario {
  id: string;
  title: string;
  targetRole: string;
  difficulty: DifficultyLevel;
  description: string;
  turns: ConversationTurn[];
}

export interface DailyGrowthChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: SkillCategory;
  description: string;
  task: string;
  exampleGood: string;
  exampleAvoid: string;
  xpReward: number;
}

export interface UserGrowthProgress {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedChallenges: string[]; // dates of completed challenges
  totalQuizSessions: number;
  totalQuestionsAnswered: number;
  categoryStats: Record<SkillCategory, { correct: number; total: number }>;
  xp: number;
  levelName: string;
  levelNumber: number;
  questionHistory: Record<string, { lastAnswered: string; timesCorrect: number; timesIncorrect: number }>;
  radarScores: {
    communication: number;
    confidence: number;
    etiquette: number;
    criticalThinking: number;
    technicalKnowledge: number;
    leadership: number;
    problemSolving: number;
    presentation: number;
  };
}

export interface SayItBetterChallenge {
  id: string;
  originalText: string;
  context: string;
  optimalAnswer: string;
  options: {
    text: string;
    toneScore: number;
    professionalismScore: number;
    clarityScore: number;
    feedback: string;
  }[];
}
