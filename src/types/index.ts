export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  title: string;
  collegeOrCompany: string;
  education: string;
  skills: string[];
  interests: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Innovator' | 'Tech Titan';
  xp: number;
  level: string;
  badges: string[];
  bio: string;
  createdAt: string;
  isSuspended?: boolean;
  isEmailVerified?: boolean;
  emailVerifiedAt?: string;
  referralCode?: string;
  referredBy?: string;
  referralCount?: number;
}

export type SubmissionStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  type: 'job' | 'internship' | 'freelance' | 'hackathon' | 'competition';
  location: string;
  isRemote: boolean;
  experience: string;
  stipendOrSalary: string;
  skills: string[];
  description: string;
  applyUrl: string;
  deadline: string;
  postedBy: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
  };
  status: SubmissionStatus;
  rejectionReason?: string;
  createdAt: string;
  savedBy?: string[];
}

export type EventCategory = 
  | 'Hackathons'
  | 'Workshops'
  | 'Webinars'
  | 'Tech Talks'
  | 'Coding Competitions'
  | 'Conferences'
  | 'College Events'
  | 'AI Events'
  | 'Career Events';

export interface CommunityEvent {
  id: string;
  title: string;
  category: EventCategory;
  organizer: string;
  organizerLogo?: string;
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  registrationDeadline: string;
  description: string;
  eligibility: string;
  skills: string[];
  registrationUrl: string;
  participantsCount: number;
  maxParticipants?: number;
  bannerImage: string;
  postedBy: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
  };
  status: SubmissionStatus;
  rejectionReason?: string;
  createdAt: string;
  registeredUsers?: string[];
}

export interface CommunityChannel {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  iconName: string;
  isLocked?: boolean;
  isAnnouncement?: boolean;
}

export interface CommunityMessage {
  id: string;
  channelSlug: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  timestamp: string;
  reactions: Record<string, string[]>; // emoji -> array of userIds
  replyToId?: string;
  isPinned?: boolean;
}

export interface NirvanaMoment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userTitle: string;
  content: string;
  category: 'HackathonWin' | 'ProjectLaunch' | 'InternshipOffer' | 'Certification' | 'TechDiscovery';
  imageUrl?: string;
  likesCount: number;
  likedBy: string[];
  comments: {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    createdAt: string;
  }[];
  status?: SubmissionStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  coverImage: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  likes: number;
  likedBy: string[];
  category: 'AI' | 'Web' | 'Mobile' | 'IoT' | 'Blockchain' | 'Cybersecurity' | 'Open Source';
  status: 'In Progress' | 'Beta' | 'Production';
  approvalStatus?: SubmissionStatus;
  rejectionReason?: string;
  createdAt: string;
}

export type SlideType = 'quiz' | 'poll' | 'word_cloud' | 'qa' | 'slide';

export interface QuizQuestion {
  id: string;
  type: SlideType;
  question: string;
  options: string[];
  correctAnswer?: number; // 0-indexed for quiz
  explanation?: string;
  timeLimitSeconds: number;
  points: number;
  slideTitle?: string;
  slideContent?: string;
  speakerNotes?: string;
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  questions: QuizQuestion[];
  creatorId: string;
  creatorName: string;
  createdAt: string;
  playsCount: number;
}

export interface LiveParticipant {
  id: string;
  nickname: string;
  avatar: string;
  score: number;
  streak: number;
  joinedAt: string;
}

export interface LiveResponse {
  participantId: string;
  participantNickname: string;
  questionId: string;
  slideIndex: number;
  selectedOption?: number;
  textResponse?: string;
  timeTaken: number;
  isCorrect?: boolean;
  pointsEarned: number;
}

export interface LiveSession {
  id: string;
  code: string; // 6-digit PIN
  quiz: Quiz;
  hostId: string;
  hostName: string;
  status: 'lobby' | 'active_question' | 'show_result' | 'leaderboard' | 'ended';
  currentSlideIndex: number;
  participants: LiveParticipant[];
  responses: LiveResponse[];
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetType: 'user' | 'event' | 'opportunity' | 'message' | 'quiz' | 'moment' | 'project' | 'system';
  targetId: string;
  details: string;
  status: 'success' | 'warning' | 'error';
  ipAddress?: string;
}

export interface ContentReport {
  id: string;
  reportedBy: string;
  reportedByName: string;
  targetType: 'message' | 'opportunity' | 'event' | 'moment' | 'project' | 'user';
  targetId: string;
  targetTitle: string;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface TechRadarItem {
  id: string;
  name: string;
  quadrant: 'ai' | 'web' | 'cloud' | 'security' | 'mobile' | 'devops' | 'data' | 'blockchain';
  ring: 'adopt' | 'trial' | 'assess' | 'hold';
  description: string;
  demand: 'Very High' | 'High' | 'Moderate';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  trend: string;
  related: string[];
  keyResources: string[];
}

export interface CollabRequest {
  id: string;
  title: string;
  organizerId: string;
  organizerName: string;
  organizerAvatar: string;
  organizerRole: string;
  hackathonOrProject: string;
  roleNeeded: string;
  requiredSkills: string[];
  description: string;
  deadline: string;
  applicantsCount: number;
  status: 'open' | 'filled';
  createdAt: string;
}

export interface LearningPath {
  id: string;
  title: string;
  role: string;
  description: string;
  iconName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedWeeks: number;
  modules: {
    id: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    title: string;
    topics: string[];
    resources: { title: string; type: string; link: string }[];
  }[];
}

export interface ResumeAnalysisResult {
  overallScore: number;
  atsScore: number;
  targetRole: string;
  roleMatchPercentage: number;
  summary: string;
  sectionScores: {
    skills: number;
    experience: number;
    projects: number;
    education: number;
    formatting: number;
    impactMetrics: number;
    grammar: number;
  };
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  actionableImprovements: string[];
  bulletRewrites: {
    original: string;
    improved: string;
    metricFocus: string;
    rationale: string;
  }[];
}

export interface CreditWallet {
  userId: string;
  dailyCredits: number;
  referralCredits: number;
  purchasedCredits: number;
  totalCredits: number;
  lastDailyReset: string; // 'YYYY-MM-DD'
}

export type CreditTransactionType = 
  | 'DEDUCTION' 
  | 'DAILY_GRANT' 
  | 'REFERRAL_BONUS' 
  | 'PURCHASE' 
  | 'ADMIN_ADJUST';

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: CreditTransactionType;
  feature?: 'chat' | 'resume' | 'admin' | 'system' | 'referral' | 'purchase';
  description: string;
  timestamp: string;
  balanceAfter: number;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  referredEmail: string;
  referralCode: string;
  creditsAwarded: number;
  createdAt: string;
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  message: string;
  targetAudience: 'ALL' | 'USERS' | 'ADMINS';
  createdAt: string;
  expiresAt?: string;
  createdBy: string;
  active: boolean;
  badge?: string;
}
