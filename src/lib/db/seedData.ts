import { 
  User, 
  Opportunity, 
  CommunityEvent, 
  CommunityChannel, 
  CommunityMessage, 
  NirvanaMoment, 
  Project, 
  Quiz, 
  AuditLog, 
  ContentReport, 
  TechRadarItem, 
  CollabRequest,
  LearningPath 
} from '@/types';

export const SEED_USERS: User[] = [
  {
    id: 'user_lead_admin',
    name: 'TechYOGeek Nirvana',
    username: 'techyogeeknirvana',
    email: 'techyogeeknirvana@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=TechYOGeek+Nirvana&background=6366f1&color=fff&bold=true',
    role: 'ADMIN',
    title: 'Lead Platform Architect & Administrator',
    collegeOrCompany: 'Techyogeek Nirvana Core',
    education: 'B.Tech in Computer Science',
    skills: ['System Architecture', 'TypeScript', 'Next.js', 'Go', 'AI Systems', 'Cloud Native'],
    interests: ['Developer Tools', 'Open Source', 'Community Building', 'AI Agents'],
    github: 'https://github.com/techyogeek',
    linkedin: 'https://www.linkedin.com/in/techyogeek-nirvana-834b92309/',
    experienceLevel: 'Tech Titan',
    xp: 15400,
    level: 'Tech Titan',
    badges: ['🏆 Quiz Master', '💻 Developer', '🎤 Event Speaker', '🔥 Community Contributor', '🤖 AI Explorer'],
    bio: 'Ishpreet Singh is the platform architect and founder of Techyogeek Nirvana (B.Tech Student Community).',
    createdAt: '2025-01-01T08:00:00Z',
    isEmailVerified: true,
    referralCode: 'TYGN-ADMIN-LEAD',
    referralCount: 12,
  },
  {
    id: 'user_ishpreet',
    name: 'Ishpreet 823',
    username: 'ishpreet823',
    email: 'ishpreet823@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Ishpreet+823&background=0284c7&color=fff&bold=true',
    role: 'USER',
    title: 'Community Member & Developer',
    collegeOrCompany: 'Techyogeek Nirvana Core',
    education: 'B.Tech in Computer Science',
    skills: ['TypeScript', 'React', 'Next.js', 'Python', 'AI Systems'],
    interests: ['Community Building', 'Hackathons', 'Open Source'],
    github: 'https://github.com/techyogeek',
    linkedin: 'https://www.linkedin.com/in/techyogeek-nirvana-834b92309/',
    experienceLevel: 'Tech Titan',
    xp: 15400,
    level: 'Tech Titan',
    badges: ['🏆 Quiz Master', '💻 Developer', '🎤 Event Speaker', '🔥 Community Contributor'],
    bio: 'Ishpreet Singh is an active administrator of Techyogeek Nirvana.',
    createdAt: '2025-01-01T08:00:00Z',
    isEmailVerified: true,
    referralCode: 'TYGN-ISHPREET823',
    referralCount: 8,
  }
];

export const SEED_CHANNELS: CommunityChannel[] = [
  { id: 'c1', slug: 'general', name: 'general', description: 'Central hub for community chat, updates, and discussions', category: 'General', iconName: 'MessageSquare', isAnnouncement: false },
  { id: 'c2', slug: 'introductions', name: 'introductions', description: 'Say hello, share your background, and connect with fellow members', category: 'General', iconName: 'UserPlus' },
  { id: 'c3', slug: 'web-development', name: 'web-development', description: 'React, Next.js, Vue, CSS, Node, APIs, and modern web architecture', category: 'Development', iconName: 'Globe' },
  { id: 'c4', slug: 'ai-ml', name: 'ai-ml', description: 'LLMs, PyTorch, agents, machine learning, and neural networks', category: 'Development', iconName: 'Sparkles' },
  { id: 'c5', slug: 'cybersecurity', name: 'cybersecurity', description: 'CTFs, ethical hacking, appsec, and cryptography', category: 'Specializations', iconName: 'Shield' },
  { id: 'c6', slug: 'cloud', name: 'cloud', description: 'AWS, GCP, Azure, Kubernetes, Docker, and distributed infrastructure', category: 'Specializations', iconName: 'Cloud' },
  { id: 'c7', slug: 'competitive-programming', name: 'competitive-programming', description: 'LeetCode, Codeforces, algorithms, and contests', category: 'Coding', iconName: 'Code2' },
  { id: 'c8', slug: 'open-source', name: 'open-source', description: 'GSoC, Hacktoberfest, repo collaboration, and OSS contributions', category: 'Coding', iconName: 'GitBranch' },
  { id: 'c9', slug: 'career', name: 'career', description: 'Resume tips, interview prep, referrals, and salary guidance', category: 'Career', iconName: 'Briefcase' },
  { id: 'c10', slug: 'startups', name: 'startups', description: 'Founder discussions, pitch decks, and product launches', category: 'Career', iconName: 'Rocket' },
  { id: 'c11', slug: 'projects', name: 'projects', description: 'Show off what you are building, get feedback, and find contributors', category: 'Community', iconName: 'Layers' },
  { id: 'c12', slug: 'college-community', name: 'college-community', description: 'Campus hackathons, clubs, study sessions, and student life', category: 'Community', iconName: 'GraduationCap' }
];

export const SEED_MESSAGES: CommunityMessage[] = [
  {
    id: 'msg_welcome',
    channelSlug: 'general',
    userId: 'user_lead_admin',
    userName: 'Ishpreet Singh (Lead Admin)',
    userAvatar: 'https://ui-avatars.com/api/?name=TechYOGeek+Nirvana&background=6366f1&color=fff&bold=true',
    userRole: 'ADMIN',
    content: 'Welcome to Techyogeek Nirvana (TYGN)! 🚀 Explore our B.Tech Notes Drive, take live interactive quizzes, check out verified internships, and connect with fellow developers.',
    timestamp: '2026-03-01T10:00:00.000Z',
    reactions: {},
    isPinned: true
  }
];

export const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp_1',
    title: 'Software Engineering Fellow — Summer 2026',
    company: 'Microsoft',
    companyLogo: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=100&auto=format&fit=crop&q=80',
    type: 'internship',
    location: 'Bengaluru / Hyderabad, India (Hybrid)',
    isRemote: false,
    experience: 'B.Tech / Dual Degree students graduating 2026/2027',
    stipendOrSalary: '₹1,25,000 / month + Housing',
    skills: ['TypeScript', 'React', 'Python', 'Data Structures', 'Algorithms', 'System Design'],
    description: 'Join Microsoft engineering teams working on cloud scale, developer productivity, and AI-first consumer tools. Opportunity includes 1-on-1 mentorship, executive fireside chats, and potential Pre-Placement Offer (PPO).',
    applyUrl: 'https://careers.microsoft.com',
    deadline: '2026-10-15',
    postedBy: { id: 'user_lead_admin', name: 'Ishpreet Singh (Lead Admin)', avatar: 'https://ui-avatars.com/api/?name=TechYOGeek+Nirvana&background=6366f1&color=fff&bold=true', role: 'ADMIN' },
    status: 'approved',
    createdAt: '2026-03-01T09:00:00Z',
    savedBy: []
  }
];

export const SEED_EVENTS: CommunityEvent[] = [
  {
    id: 'event_1',
    title: 'Nirvana Global Hackathon 2026: Build the Future with AI',
    category: 'Hackathons',
    organizer: 'Techyogeek Nirvana & Ecosystem Partners',
    date: 'March 20 - 22, 2026',
    time: '48 Hours Continuous',
    location: 'Virtual / Global & Live Stage',
    isOnline: true,
    registrationDeadline: '2026-03-18',
    description: 'Join over 3,000 developers, designers, and student innovators building next-generation AI agents, decentralized applications, and developer productivity tools. $15,000 cash prize pool, cloud credits, and direct interview fast-tracks with hiring partners.',
    eligibility: 'Open to all B.Tech students, developers, and tech builders worldwide.',
    skills: ['AI/ML', 'Full Stack', 'Product Design', 'Next.js', 'APIs'],
    registrationUrl: 'https://nirvana.community/hackathon-2026',
    participantsCount: 1840,
    maxParticipants: 3000,
    bannerImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    postedBy: { id: 'user_lead_admin', name: 'Ishpreet Singh (Lead Admin)', avatar: 'https://ui-avatars.com/api/?name=TechYOGeek+Nirvana&background=6366f1&color=fff&bold=true', role: 'ADMIN' },
    status: 'approved',
    createdAt: '2026-03-01T10:00:00Z',
    registeredUsers: []
  }
];

export const SEED_MOMENTS: NirvanaMoment[] = [
  {
    id: 'moment_1',
    userId: 'user_lead_admin',
    userName: 'Ishpreet Singh (Lead Admin)',
    userAvatar: 'https://ui-avatars.com/api/?name=TechYOGeek+Nirvana&background=6366f1&color=fff&bold=true',
    userTitle: 'Lead Platform Architect & Administrator',
    content: '🚀 Techyogeek Nirvana 2.0 is live with real persistent database architecture, dual-ledger daily credit resets, and real-time community chat! Join in and start building!',
    category: 'ProjectLaunch',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    likesCount: 15,
    likedBy: [],
    comments: [],
    status: 'approved',
    createdAt: '2026-03-01T10:00:00Z'
  }
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    title: 'GitPulse — Intelligent Code Review Copilot',
    description: 'An automated GitHub Action that inspects PR diffs, detects security vulnerabilities and architectural anti-patterns, and generates benchmark test suites.',
    techStack: ['TypeScript', 'Next.js', 'GitHub API', 'FastAPI', 'PyTorch'],
    githubUrl: 'https://github.com/techyogeek/gitpulse',
    liveUrl: 'https://gitpulse.dev',
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80',
    authorId: 'user_lead_admin',
    authorName: 'Ishpreet Singh',
    authorAvatar: 'https://ui-avatars.com/api/?name=TechYOGeek+Nirvana&background=6366f1&color=fff&bold=true',
    likes: 64,
    likedBy: [],
    category: 'AI',
    status: 'Beta',
    approvalStatus: 'approved',
    createdAt: '2026-02-20T10:00:00Z'
  }
];

export const SEED_QUIZZES: Quiz[] = [
  {
    id: 'quiz_1',
    title: 'Full Stack & System Architecture Challenge',
    topic: 'Full Stack Engineering',
    difficulty: 'intermediate',
    description: 'Test your knowledge on React 19, Server Components, caching strategies, and database transaction isolation levels.',
    creatorId: 'user_lead_admin',
    creatorName: 'Ishpreet Singh (Lead Admin)',
    createdAt: '2026-03-01T10:00:00Z',
    playsCount: 1420,
    questions: [
      {
        id: 'q1',
        type: 'quiz',
        question: 'Which HTTP header is primarily used in Server-Sent Events (SSE) to maintain a streaming connection?',
        options: [
          'Content-Type: application/json',
          'Content-Type: text/event-stream',
          'Upgrade: websocket',
          'Transfer-Encoding: chunked-gzip'
        ],
        correctAnswer: 1,
        explanation: 'Server-Sent Events (SSE) require Content-Type: text/event-stream along with Cache-Control: no-cache.',
        timeLimitSeconds: 20,
        points: 1000
      },
      {
        id: 'q2',
        type: 'poll',
        question: 'What is your primary state management approach in React 18+ projects?',
        options: [
          'Zustand / Redux Toolkit',
          'React Context + useReducer',
          'Server State (TanStack Query / SWR)',
          'Local State Only'
        ],
        timeLimitSeconds: 15,
        points: 500
      },
      {
        id: 'q3',
        type: 'quiz',
        question: 'In relational databases, which isolation level prevents dirty reads, non-repeatable reads, and phantom reads?',
        options: [
          'Read Committed',
          'Repeatable Read',
          'Serializable',
          'Read Uncommitted'
        ],
        correctAnswer: 2,
        explanation: 'Serializable is the highest isolation level and prevents all three concurrency phenomena.',
        timeLimitSeconds: 20,
        points: 1000
      }
    ]
  },
  {
    id: 'quiz_2',
    title: 'Data Structures & Algorithms Sprint',
    topic: 'DSA & Algorithms',
    difficulty: 'advanced',
    description: 'High-speed challenges covering Trees, Graphs, Dynamic Programming, and optimal algorithmic complexities.',
    creatorId: 'user_lead_admin',
    creatorName: 'Ishpreet Singh (Lead Admin)',
    createdAt: '2026-03-02T12:00:00Z',
    playsCount: 980,
    questions: [
      {
        id: 'dsa_1',
        type: 'quiz',
        question: 'What is the amortized worst-case time complexity of inserting an element into a dynamic array (like std::vector or ArrayList)?',
        options: ['O(N)', 'O(log N)', 'O(1)', 'O(N^2)'],
        correctAnswer: 2,
        explanation: 'While individual resizing steps cost O(N), resizing by doubling array capacity guarantees O(1) amortized insertion cost.',
        timeLimitSeconds: 20,
        points: 1000
      },
      {
        id: 'dsa_2',
        type: 'quiz',
        question: 'Which algorithm finds single-source shortest paths on graphs with non-negative edge weights in O((V + E) log V) time?',
        options: ['Bellman-Ford', "Dijkstra's Algorithm", 'Floyd-Warshall', 'Breadth-First Search'],
        correctAnswer: 1,
        explanation: "Dijkstra's algorithm with a min-priority heap runs in O((V + E) log V) on graphs with non-negative weights.",
        timeLimitSeconds: 20,
        points: 1000
      },
      {
        id: 'dsa_3',
        type: 'poll',
        question: 'Which language do you prefer for LeetCode / competitive programming interviews?',
        options: ['C++', 'Java', 'Python', 'TypeScript / JavaScript'],
        timeLimitSeconds: 15,
        points: 500
      }
    ]
  },
  {
    id: 'quiz_3',
    title: 'AI & Machine Learning Foundations',
    topic: 'Artificial Intelligence',
    difficulty: 'beginner',
    description: 'Explore generative AI architectures, Attention mechanisms, vector databases, and prompt engineering.',
    creatorId: 'user_lead_admin',
    creatorName: 'Ishpreet Singh (Lead Admin)',
    createdAt: '2026-03-03T14:00:00Z',
    playsCount: 2130,
    questions: [
      {
        id: 'ai_1',
        type: 'quiz',
        question: 'What mathematical mechanism allows Transformers to weigh relationships between distant tokens simultaneously in parallel?',
        options: ['Recurrent Feedback Loop', 'Scaled Dot-Product Self-Attention', 'Convolutional Striding', 'Backpropagation through time'],
        correctAnswer: 1,
        explanation: 'Scaled Dot-Product Self-Attention enables transformer models to compute pairwise token interactions without sequential recursion.',
        timeLimitSeconds: 20,
        points: 1000
      },
      {
        id: 'ai_2',
        type: 'quiz',
        question: 'In Retrieval-Augmented Generation (RAG), which metric is commonly used to measure similarity between high-dimensional embeddings?',
        options: ['Hamming distance', 'Cosine Similarity', 'Levensthein distance', 'Jaccard Index'],
        correctAnswer: 1,
        explanation: 'Cosine similarity measures the cosine of the angle between two non-zero vectors, making it scale-invariant for dense text embeddings.',
        timeLimitSeconds: 20,
        points: 1000
      }
    ]
  }
];

export const SEED_TECH_RADAR: TechRadarItem[] = [
  {
    id: 'radar_1',
    name: 'Next.js 15 & Server Actions',
    quadrant: 'web',
    ring: 'adopt',
    description: 'The industry standard for full-stack React applications with hybrid SSR/SSG and streaming architectures.',
    demand: 'Very High',
    difficulty: 'Intermediate',
    trend: '+34%',
    related: ['React 19', 'TypeScript', 'Tailwind CSS'],
    keyResources: ['Next.js Official Docs', 'Server Actions Guide']
  }
];

export const SEED_COLLAB_REQUESTS: CollabRequest[] = [];

export const SEED_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'lp_fullstack',
    title: 'Full Stack & AI Engineer Roadmap',
    role: 'Full Stack Engineer',
    description: 'Master HTML5, CSS architecture, JavaScript ES2026, TypeScript, React 19, Next.js, and AI agents.',
    iconName: 'Layout',
    difficulty: 'Intermediate',
    estimatedWeeks: 14,
    modules: [
      {
        id: 'mod_1',
        level: 'Beginner',
        title: 'Core Web Foundations & CSS Architecture',
        topics: ['Semantic HTML & WCAG Accessibility', 'Flexbox & CSS Grid Mastery', 'Modern CSS Variables & Theming'],
        resources: [{ title: 'MDN Web Docs', type: 'Documentation', link: 'https://developer.mozilla.org' }]
      }
    ]
  }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [];
export const SEED_REPORTS: ContentReport[] = [];
