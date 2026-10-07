import { UserGrowthProgress, QuizSessionResult, SkillCategory } from '@/types/growth';

const STORAGE_KEY = 'tygn_growth_progress';

const INITIAL_PROGRESS: UserGrowthProgress = {
  currentStreak: 1,
  bestStreak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedChallenges: [],
  totalQuizSessions: 0,
  totalQuestionsAnswered: 0,
  categoryStats: {
    'verbal-manners': { correct: 4, total: 5 },
    'professional-tone': { correct: 3, total: 5 },
    'workplace-etiquette': { correct: 4, total: 5 },
    'interview-communication': { correct: 3, total: 5 },
    'active-listening': { correct: 4, total: 5 },
    'email-etiquette': { correct: 4, total: 5 },
    'conflict-handling': { correct: 3, total: 5 },
    'leadership-communication': { correct: 3, total: 5 },
    'speaking-professionally': { correct: 4, total: 5 },
    'meeting-etiquette': { correct: 4, total: 5 },
    'feedback-delivery': { correct: 3, total: 5 },
    'social-etiquette': { correct: 4, total: 5 },
  },
  xp: 350,
  levelName: 'Learner',
  levelNumber: 2,
  questionHistory: {},
  radarScores: {
    communication: 72,
    confidence: 65,
    etiquette: 78,
    criticalThinking: 82,
    technicalKnowledge: 75,
    leadership: 68,
    problemSolving: 80,
    presentation: 70
  }
};

const LEVELS = [
  { level: 1, name: 'Explorer', minXp: 0, maxXp: 200 },
  { level: 2, name: 'Learner', minXp: 201, maxXp: 500 },
  { level: 3, name: 'Builder', minXp: 501, maxXp: 1000 },
  { level: 4, name: 'Challenger', minXp: 1001, maxXp: 1800 },
  { level: 5, name: 'Communicator', minXp: 1801, maxXp: 2800 },
  { level: 6, name: 'Leader', minXp: 2801, maxXp: 4200 },
  { level: 7, name: 'TYGN Pro', minXp: 4201, maxXp: 99999 },
];

export class GrowthProgressStore {
  private progress: UserGrowthProgress;

  constructor() {
    this.progress = this.load();
    this.updateStreak();
  }

  private load(): UserGrowthProgress {
    if (typeof window === 'undefined') return INITIAL_PROGRESS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return { ...INITIAL_PROGRESS, ...parsed };
      }
    } catch (_) {}
    return INITIAL_PROGRESS;
  }

  private save(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
    } catch (_) {}
  }

  public getProgress(): UserGrowthProgress {
    return { ...this.progress };
  }

  public addXp(amount: number): { xp: number; newLevel: boolean; levelName: string; levelNumber: number } {
    this.progress.xp += amount;
    const currentLevelNum = this.progress.levelNumber;

    // Recalculate level
    const currentTier = LEVELS.find(l => this.progress.xp >= l.minXp && this.progress.xp <= l.maxXp) || LEVELS[LEVELS.length - 1];
    this.progress.levelNumber = currentTier.level;
    this.progress.levelName = currentTier.name;

    const newLevel = currentTier.level > currentLevelNum;
    this.save();
    return {
      xp: this.progress.xp,
      newLevel,
      levelName: this.progress.levelName,
      levelNumber: this.progress.levelNumber
    };
  }

  private updateStreak(): void {
    const today = new Date().toISOString().split('T')[0];
    const last = this.progress.lastActiveDate;

    if (last === today) return;

    const lastDate = new Date(last);
    const todayDate = new Date(today);
    const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      this.progress.currentStreak += 1;
      if (this.progress.currentStreak > this.progress.bestStreak) {
        this.progress.bestStreak = this.progress.currentStreak;
      }
    } else if (diffDays > 1) {
      this.progress.currentStreak = 1;
    }

    this.progress.lastActiveDate = today;
    this.save();
  }

  public completeDailyChallenge(challengeId: string, xpReward: number = 50): boolean {
    const today = new Date().toISOString().split('T')[0];
    if (this.progress.completedChallenges.includes(today)) {
      return false; // already completed today
    }

    this.progress.completedChallenges.push(today);
    this.addXp(xpReward);
    this.progress.radarScores.communication = Math.min(100, this.progress.radarScores.communication + 2);
    this.progress.radarScores.confidence = Math.min(100, this.progress.radarScores.confidence + 2);
    this.save();
    return true;
  }

  public recordQuizSession(result: QuizSessionResult): void {
    this.progress.totalQuizSessions += 1;
    this.progress.totalQuestionsAnswered += result.totalQuestions;

    // Award XP: 10 XP per correct question + 50 completion bonus
    const xpGained = result.score * 10 + 50;
    this.addXp(xpGained);

    // Update question history
    const now = new Date().toISOString();
    result.answers.forEach(ans => {
      const existing = this.progress.questionHistory[ans.questionId] || {
        lastAnswered: now,
        timesCorrect: 0,
        timesIncorrect: 0
      };
      existing.lastAnswered = now;
      if (ans.isCorrect) existing.timesCorrect += 1;
      else existing.timesIncorrect += 1;
      this.progress.questionHistory[ans.questionId] = existing;

      // Update category stats
      if (!this.progress.categoryStats[ans.category]) {
        this.progress.categoryStats[ans.category] = { correct: 0, total: 0 };
      }
      this.progress.categoryStats[ans.category].total += 1;
      if (ans.isCorrect) {
        this.progress.categoryStats[ans.category].correct += 1;
      }
    });

    // Update Radar Scores dynamically
    const scorePct = (result.score / 10) * 100;
    this.progress.radarScores.communication = Math.round((this.progress.radarScores.communication * 0.8) + (scorePct * 0.2));
    this.progress.radarScores.etiquette = Math.round((this.progress.radarScores.etiquette * 0.8) + (scorePct * 0.2));
    if (result.score >= 7) {
      this.progress.radarScores.confidence = Math.min(100, this.progress.radarScores.confidence + 3);
      this.progress.radarScores.criticalThinking = Math.min(100, this.progress.radarScores.criticalThinking + 2);
    }

    this.save();
  }

  public recordGamePlay(gameType: string, score: number, xpBonus: number = 25): void {
    this.addXp(xpBonus);
    if (gameType === 'say-it-better') {
      this.progress.radarScores.communication = Math.min(100, this.progress.radarScores.communication + 1);
    } else if (gameType === 'etiquette') {
      this.progress.radarScores.etiquette = Math.min(100, this.progress.radarScores.etiquette + 1);
    } else if (gameType === 'logic') {
      this.progress.radarScores.criticalThinking = Math.min(100, this.progress.radarScores.criticalThinking + 1);
    }
    this.save();
  }
}

export const growthProgressStore = new GrowthProgressStore();
