import { 
  QuizQuestionItem, 
  SkillCategory, 
  QuizSessionResult, 
  QuizAnswerRecord,
  CommunicationLevel 
} from '@/types/growth';
import { GROWTH_QUESTION_BANK } from '@/data/growthQuestions';
import { growthProgressStore } from './progressStore';

const CATEGORY_NAMES: Record<SkillCategory, string> = {
  'verbal-manners': 'Verbal Manners & Courtesies',
  'professional-tone': 'Professional Tone & Polish',
  'workplace-etiquette': 'Workplace & Internship Etiquette',
  'interview-communication': 'Interview Communication',
  'active-listening': 'Active Listening & Comprehension',
  'email-etiquette': 'Email & Written Etiquette',
  'conflict-handling': 'Conflict Handling & Resolution',
  'leadership-communication': 'Leadership & Influence',
  'speaking-professionally': 'Speaking Professionally',
  'meeting-etiquette': 'Meeting & Discussion Etiquette',
  'feedback-delivery': 'Feedback Delivery & Critique',
  'social-etiquette': 'Social & Networking Etiquette'
};

export class QuizEngine {
  /**
   * Generates exactly 10 questions intelligently adapting to user history and weak categories.
   */
  public generateSessionQuestions(): QuizQuestionItem[] {
    const progress = growthProgressStore.getProgress();
    const history = progress.questionHistory || {};

    // 1. Identify weak categories
    const categoryAccuracy: Record<string, number> = {};
    const categories: SkillCategory[] = [
      'verbal-manners',
      'professional-tone',
      'workplace-etiquette',
      'interview-communication',
      'active-listening',
      'email-etiquette',
      'conflict-handling',
      'leadership-communication',
      'speaking-professionally',
      'meeting-etiquette',
      'feedback-delivery',
      'social-etiquette'
    ];

    categories.forEach(cat => {
      const stat = progress.categoryStats[cat];
      if (stat && stat.total > 0) {
        categoryAccuracy[cat] = (stat.correct / stat.total) * 100;
      } else {
        categoryAccuracy[cat] = 70; // default baseline for unexplored categories
      }
    });

    // Sort categories from weakest to strongest
    const weakCategories = [...categories].sort((a, b) => categoryAccuracy[a] - categoryAccuracy[b]);
    const topWeakCategories = new Set(weakCategories.slice(0, 4));

    // 2. Score questions based on:
    // - Not answered recently (high priority)
    // - Belongs to a weak category (boost weight)
    // - Incorrect in the past (boost weight)
    const now = Date.now();
    const scoredQuestions = GROWTH_QUESTION_BANK.map(q => {
      let weight = 100;
      const qHist = history[q.id];

      if (qHist) {
        const lastAnsweredMs = new Date(qHist.lastAnswered).getTime();
        const hoursAgo = (now - lastAnsweredMs) / (1000 * 60 * 60);

        // Heavy penalty for questions answered in the last 24 hours
        if (hoursAgo < 24) weight -= 80;
        else if (hoursAgo < 72) weight -= 40;

        // Boost if user missed it in the past
        if (qHist.timesIncorrect > qHist.timesCorrect) weight += 50;
      } else {
        // Boost completely new, unattempted questions
        weight += 60;
      }

      // Boost if category is weak for user
      if (topWeakCategories.has(q.category)) {
        weight += 45;
      }

      // Small jitter to prevent deterministic ordering
      weight += Math.random() * 20;

      return { question: q, weight };
    });

    // 3. Sort by weight descending
    scoredQuestions.sort((a, b) => b.weight - a.weight);

    // 4. Pick 10 questions with category diversity (max 2 per category per session)
    const selected: QuizQuestionItem[] = [];
    const categoryCount: Record<string, number> = {};

    for (const item of scoredQuestions) {
      const cat = item.question.category;
      if ((categoryCount[cat] || 0) < 2) {
        selected.push(item.question);
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        if (selected.length === 10) break;
      }
    }

    // If still short of 10, fill from remainder
    if (selected.length < 10) {
      for (const item of scoredQuestions) {
        if (!selected.find(s => s.id === item.question.id)) {
          selected.push(item.question);
          if (selected.length === 10) break;
        }
      }
    }

    // Shuffle the final 10 so weak questions aren't strictly upfront
    return selected.sort(() => Math.random() - 0.5);
  }

  /**
   * Calculates comprehensive session score, communication level, and personalized feedback.
   */
  public evaluateSession(
    questions: QuizQuestionItem[], 
    answers: Record<string, number>
  ): QuizSessionResult {
    let score = 0;
    const records: QuizAnswerRecord[] = [];
    const categoryBreakdown: Record<string, { correct: number; total: number; percentage: number }> = {};

    questions.forEach(q => {
      const userChoice = answers[q.id];
      const isCorrect = userChoice === q.correctAnswer;
      if (isCorrect) score += 1;

      records.push({
        questionId: q.id,
        category: q.category,
        selectedAnswer: userChoice,
        isCorrect,
        timestamp: new Date().toISOString()
      });

      if (!categoryBreakdown[q.category]) {
        categoryBreakdown[q.category] = { correct: 0, total: 0, percentage: 0 };
      }
      categoryBreakdown[q.category].total += 1;
      if (isCorrect) categoryBreakdown[q.category].correct += 1;
    });

    // Calculate percentages
    Object.keys(categoryBreakdown).forEach(cat => {
      const item = categoryBreakdown[cat];
      item.percentage = Math.round((item.correct / item.total) * 100);
    });

    // Determine Communication Level
    let level: CommunicationLevel = 'Beginner';
    if (score >= 9) level = 'Advanced';
    else if (score >= 7) level = 'Professional';
    else if (score >= 5) level = 'Confident';
    else if (score >= 3) level = 'Developing';

    // Strengths & Weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    let lowestCat: SkillCategory = 'professional-tone';
    let lowestPct = 101;

    Object.entries(categoryBreakdown).forEach(([cat, data]) => {
      const label = CATEGORY_NAMES[cat as SkillCategory] || cat;
      if (data.percentage >= 80) {
        strengths.push(`Consistent strength in ${label} (${data.percentage}%)`);
      } else if (data.percentage <= 50) {
        weaknesses.push(`Needs attention in ${label} (${data.percentage}%)`);
      }

      if (data.percentage < lowestPct) {
        lowestPct = data.percentage;
        lowestCat = cat as SkillCategory;
      }
    });

    // Generate Educational Feedback
    const feedbackGood: string[] = [];
    const feedbackImprove: string[] = [];

    if (score >= 8) {
      feedbackGood.push('You consistently choose collaborative, non-defensive phrasings.');
      feedbackGood.push('You demonstrated high emotional intelligence in conflict scenarios.');
    } else if (score >= 5) {
      feedbackGood.push('You handled baseline workplace etiquette scenarios well.');
      feedbackGood.push('You showed good awareness of meeting audio and respect protocols.');
    } else {
      feedbackGood.push('You initiated your personal growth journey—awareness is the first step.');
    }

    if (score < 10) {
      feedbackImprove.push(`Focus on refining your phrasing in ${CATEGORY_NAMES[lowestCat]}.`);
      feedbackImprove.push('Remember: aim for educational de-escalation rather than direct defensive rebuttal.');
      feedbackImprove.push('In technical disagreements, anchor in objective benchmarks rather than personal opinions.');
    }

    const result: QuizSessionResult = {
      sessionId: 'session_' + Date.now(),
      date: new Date().toISOString(),
      score,
      totalQuestions: 10,
      level,
      categoryScores: categoryBreakdown as any,
      strengths: strengths.length ? strengths : ['Baseline communication foundations established'],
      weaknesses: weaknesses.length ? weaknesses : ['Minor polish in edge-case technical discussions'],
      focusArea: lowestCat,
      focusAreaLabel: CATEGORY_NAMES[lowestCat],
      feedbackGood,
      feedbackImprove,
      answers: records
    };

    // Record session in progress store
    growthProgressStore.recordQuizSession(result);

    return result;
  }
}

export const quizEngine = new QuizEngine();
