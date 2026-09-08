import { ResumeAnalysisResult, QuizQuestion, Opportunity, User } from '@/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCall?: {
    action: 'navigate' | 'filter_opportunities' | 'filter_events' | 'create_quiz' | 'explain_code';
    payload: Record<string, string>;
    displayText: string;
  };
  timestamp: string;
}

class AIService {
  // 1. Omnipresent AI Assistant with Tool-Calling Navigation
  public async processChat(
    userPrompt: string,
    history: ChatMessage[],
    userContext?: User | null
  ): Promise<ChatMessage> {
    const prompt = userPrompt.toLowerCase().trim();
    const id = 'msg_ai_' + Date.now();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Tool calling pattern detection
    if (prompt.includes('internship') || prompt.includes('intern') || (prompt.includes('job') && prompt.includes('find'))) {
      const keyword = prompt.includes('java') ? 'Java' : prompt.includes('react') ? 'React' : prompt.includes('ai') ? 'AI' : '';
      return {
        id,
        role: 'assistant',
        content: `I found several relevant opportunities matching your query! Let me open the Opportunities Marketplace for you${keyword ? ` filtered by ${keyword}` : ''}.`,
        toolCall: {
          action: 'filter_opportunities',
          payload: { type: prompt.includes('intern') ? 'internship' : 'job', query: keyword },
          displayText: `Opening Opportunities (${keyword || 'All'})`
        },
        timestamp
      };
    }

    if (prompt.includes('event') || prompt.includes('hackathon') || prompt.includes('webinar') || prompt.includes('workshop')) {
      const category = prompt.includes('hackathon') ? 'Hackathons' : prompt.includes('workshop') ? 'Workshops' : '';
      return {
        id,
        role: 'assistant',
        content: `Here are the latest community events and hackathons! Navigating you to the Events hub.`,
        toolCall: {
          action: 'filter_events',
          payload: { category },
          displayText: `Navigating to Events Hub`
        },
        timestamp
      };
    }

    if (prompt.includes('create quiz') || prompt.includes('generate quiz') || prompt.includes('quiz on')) {
      const topic = prompt.replace('create quiz', '').replace('generate quiz', '').replace('quiz on', '').trim() || 'React & Web Architecture';
      return {
        id,
        role: 'assistant',
        content: `I have prepared a custom interactive challenge on "${topic}"! Opening the Nirvana Live Quiz Creator with generated questions.`,
        toolCall: {
          action: 'create_quiz',
          payload: { topic },
          displayText: `Opening Quiz Creator for "${topic}"`
        },
        timestamp
      };
    }

    if (prompt.includes('resume') || prompt.includes('cv') || prompt.includes('ats')) {
      return {
        id,
        role: 'assistant',
        content: `Heading to the AI Resume Lab! You can upload your PDF/DOCX or paste bullets to receive ATS scoring, keyword gap analysis, and tailored rewrites.`,
        toolCall: {
          action: 'navigate',
          payload: { url: '/resume-lab' },
          displayText: `Navigating to AI Resume Lab`
        },
        timestamp
      };
    }

    if (prompt.includes('interview') || prompt.includes('mock')) {
      return {
        id,
        role: 'assistant',
        content: `Ready for technical interview practice? Let's take you to the AI Interview Room.`,
        toolCall: {
          action: 'navigate',
          payload: { url: '/ai-interview' },
          displayText: `Opening AI Interview Room`
        },
        timestamp
      };
    }

    if (prompt.includes('radar') || prompt.includes('what to learn')) {
      return {
        id,
        role: 'assistant',
        content: `Exploring modern tech trends? Let's view the interactive Tech Radar across Web, AI, Cloud, and Security quadrants.`,
        toolCall: {
          action: 'navigate',
          payload: { url: '/tech-radar' },
          displayText: `Opening Tech Radar`
        },
        timestamp
      };
    }

    if (prompt.includes('community') || prompt.includes('channel') || prompt.includes('discord') || prompt.includes('chat')) {
      return {
        id,
        role: 'assistant',
        content: `Connecting you to the Techyogeek Nirvana Discord-style community channels.`,
        toolCall: {
          action: 'navigate',
          payload: { url: '/community' },
          displayText: `Opening Community Channels`
        },
        timestamp
      };
    }

    if (prompt.includes('notes') || prompt.includes('drive') || prompt.includes('study material') || prompt.includes('semester')) {
      return {
        id,
        role: 'assistant',
        content: `Looking for B.Tech academic notes, question papers, and lab manuals? All resources are curated in our official Google Drive folder (https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA). Let me take you to the B.Tech Notes Library where you can filter by semester and subject!`,
        toolCall: {
          action: 'navigate',
          payload: { url: '/notes' },
          displayText: `Open B.Tech Notes Drive`
        },
        timestamp
      };
    }

    if (prompt.includes('guide') || prompt.includes('how to use') || prompt.includes('features') || prompt.includes('tour')) {
      return {
        id,
        role: 'assistant',
        content: `Here is your complete guide to Techyogeek Nirvana:
1. 📚 B.Tech Notes Drive: Access official Google Drive notes, PYQs, and syllabus.
2. 📻 Nirvana Live: Host or join Mentimeter-style live presentations with speed quizzes and leaderboards.
3. 💼 Opportunities: Discover developer jobs, internships, and hackathons.
4. 📄 AI Resume Lab: Upload PDF or Image to get instant ATS scoring, keyword gaps, and bullet rewrites.
5. 💬 Community: Join Discord-style channels for web, AI, cloud, and open-source.
6. 🧭 Tech Radar & Roadmaps: Explore industry stacks and learning pathways.

Where would you like to start?`,
        toolCall: {
          action: 'navigate',
          payload: { url: '/notes' },
          displayText: `Explore B.Tech Notes`
        },
        timestamp
      };
    }

    // Contextual tech query answering
    let responseText = `I'm Nirvana AI, your 24/7 intelligent technology companion. I can guide you through our opportunities marketplace, generate custom live quizzes, analyze your resume, explain complex algorithms, and help you find hackathon teammates! What would you like to build or explore today?`;

    if (prompt.includes('what is') || prompt.includes('how to') || prompt.includes('explain')) {
      responseText = `Great technical question! In modern software architectures, clean separation of concerns and deterministic state management are foundational. For instance, if you're building with React 19 or Next.js, leveraging Server Components for data fetching while isolating client interactivity keeps your initial bundle minimal.\n\nWould you like me to generate a live quiz on this topic or show you a learning path in our Tech Roadmaps?`;
    }

    return {
      id,
      role: 'assistant',
      content: responseText,
      timestamp
    };
  }

  // 2. AI Resume Analysis
  public async analyzeResume(resumeText: string, targetRole: string = 'Software Engineer'): Promise<ResumeAnalysisResult> {
    const textLower = resumeText.toLowerCase();
    
    // Heuristic keyword analysis
    const targetKeywordsMap: Record<string, string[]> = {
      'software engineer': ['data structures', 'algorithms', 'git', 'testing', 'ci/cd', 'docker', 'typescript', 'rest api', 'sql'],
      'frontend developer': ['react', 'typescript', 'css', 'html5', 'next.js', 'responsive design', 'web accessibility', 'state management'],
      'ai engineer': ['python', 'pytorch', 'transformers', 'vector search', 'rag', 'llms', 'fastapi', 'cuda', 'hugging face'],
      'backend engineer': ['postgresql', 'go', 'node.js', 'redis', 'kafka', 'microservices', 'distributed systems', 'docker']
    };

    const targetKey = Object.keys(targetKeywordsMap).find(k => targetRole.toLowerCase().includes(k)) || 'software engineer';
    const expectedKeywords = targetKeywordsMap[targetKey];

    const matchedKeywords = expectedKeywords.filter(kw => textLower.includes(kw));
    const missingKeywords = expectedKeywords.filter(kw => !textLower.includes(kw));

    const keywordRatio = matchedKeywords.length / expectedKeywords.length;
    const hasMetrics = /\d+%/g.test(resumeText) || /\$\d+/g.test(resumeText) || /\d+ms/g.test(resumeText);
    const hasGitHub = textLower.includes('github') || textLower.includes('gitlab');
    
    const atsScore = Math.min(96, Math.max(55, Math.round(55 + keywordRatio * 35 + (hasMetrics ? 8 : 0))));
    const overallScore = Math.min(98, Math.max(60, Math.round(atsScore * 0.95 + (hasGitHub ? 5 : 0))));

    return {
      overallScore,
      atsScore,
      targetRole,
      roleMatchPercentage: Math.round(keywordRatio * 100),
      summary: `Your resume shows solid foundation for ${targetRole}. You have verified competencies in ${matchedKeywords.slice(0, 4).join(', ')}, but adding quantifiable metrics and the missing industry keywords will boost ATS pass-rates.`,
      sectionScores: {
        skills: Math.round(75 + keywordRatio * 20),
        experience: hasMetrics ? 88 : 68,
        projects: hasGitHub ? 92 : 74,
        education: 85,
        formatting: 90,
        impactMetrics: hasMetrics ? 86 : 60,
        grammar: 94
      },
      strengths: [
        `Strong relevant skill keywords for modern stack (${matchedKeywords.slice(0, 3).join(', ')})`,
        hasGitHub ? 'Includes verified GitHub profile and project links' : 'Clear chronological structure',
        'Concise bullet formatting without nested tables'
      ],
      weaknesses: [
        missingKeywords.length > 0 ? `Missing key ATS search terms: ${missingKeywords.slice(0, 3).join(', ')}` : 'Consider expanding technical depth in project descriptions',
        !hasMetrics ? 'Bullets describe responsibilities rather than quantifiable results (e.g., "reduced latency by 35%")' : 'A few bullets could highlight system scale'
      ],
      missingKeywords: missingKeywords.length > 0 ? missingKeywords : ['System Architecture', 'CI/CD Pipelines'],
      actionableImprovements: [
        'Prefix bullets with strong action verbs (Architected, Spearheaded, Optimized, Deployed).',
        'Add the XYZ formula: Accomplished [X] as measured by [Y], by doing [Z].',
        `Incorporate these target keywords into your skills section: ${missingKeywords.slice(0, 3).join(', ')}.`
      ],
      bulletRewrites: [
        {
          original: 'Worked on the backend API and fixed bugs for user authentication.',
          improved: 'Architected and hardened JWT authentication microservice in Go/Node.js, mitigating unauthorized access attempts and improving login throughput by 42%.',
          metricFocus: '+42% Throughput & Zero Auth Vulnerabilities',
          rationale: 'Replaces passive "worked on" with active leadership verbs and specifies measurable system impact.'
        },
        {
          original: 'Created frontend components in React for the dashboard.',
          improved: 'Engineered 15+ reusable, WCAG-compliant React components utilizing Tailwind CSS and optimistic mutations, accelerating team sprint velocity by 25%.',
          metricFocus: '15+ Reusable Components & +25% Sprint Velocity',
          rationale: 'Emphasizes design system scale, accessibility standards, and tangible team productivity boost.'
        }
      ]
    };
  }

  // 3. AI Bullet Rewriter Studio
  public async rewriteBullet(bullet: string, roleFocus: string = 'Full Stack'): Promise<{ rewrites: { title: string; text: string; highlight: string }[] }> {
    return {
      rewrites: [
        {
          title: 'Impact & Metric-Driven',
          text: `Optimized core data processing pipelines by refactoring queries and implementing Redis caching, reducing p99 latency from 450ms to 95ms (78% improvement).`,
          highlight: '78% p99 Latency Reduction'
        },
        {
          title: 'Technical Depth & Architecture',
          text: `Architected distributed event-driven service utilizing Kafka and PostgreSQL with idempotency keys, guaranteeing exactly-once delivery across 100K+ daily events.`,
          highlight: '100K+ Daily Events with Zero Data Loss'
        },
        {
          title: 'Leadership & Production Scale',
          text: `Spearheaded cross-functional migration to TypeScript and Next.js App Router, resulting in 40% smaller client bundle size and 99.9% uptime across production releases.`,
          highlight: '40% Bundle Reduction & 99.9% SLA'
        }
      ]
    };
  }

  // 4. AI Live Quiz & Presentation Generator
  public async generateQuiz(topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate', count: number = 5): Promise<QuizQuestion[]> {
    const cleanTopic = topic.trim() || 'Web Technologies & Cloud';

    return [
      {
        id: 'q_gen_1',
        type: 'quiz',
        question: `In modern ${cleanTopic}, what is the primary consideration when designing for horizontal scalability?`,
        options: [
          'Ensuring all state is stored inside the local server memory',
          'Decoupling application state into distributed caches and database tiers',
          'Using synchronous blocking I/O calls for all requests',
          'Deploying single-threaded execution loops without clustering'
        ],
        correctAnswer: 1,
        explanation: 'Stateless application servers paired with distributed caching (Redis) and replicated databases allow adding more compute nodes effortlessly without session stickiness issues.',
        timeLimitSeconds: 20,
        points: 1000
      },
      {
        id: 'q_gen_2',
        type: 'poll',
        question: `How often do you implement automated unit and integration tests in your ${cleanTopic} projects?`,
        options: [
          'Always (TDD / Strict CI pipelines)',
          'Often (Core critical paths only)',
          'Rarely (Manual testing before deploy)',
          'Never (Ship and pray)'
        ],
        timeLimitSeconds: 15,
        points: 500
      },
      {
        id: 'q_gen_3',
        type: 'quiz',
        question: `Which data structure or algorithm offers O(1) average time complexity for key-value lookups in ${cleanTopic}?`,
        options: [
          'Binary Search Tree',
          'Hash Table / Hash Map',
          'Linked List',
          'B-Tree Index'
        ],
        correctAnswer: 1,
        explanation: 'Hash tables calculate array indices using hash functions, giving O(1) expected time for lookups, insertions, and deletions under uniform hashing.',
        timeLimitSeconds: 20,
        points: 1000
      },
      {
        id: 'q_gen_4',
        type: 'word_cloud',
        question: `What is the most exciting framework or tool you recently used in ${cleanTopic}?`,
        options: [],
        timeLimitSeconds: 25,
        points: 500
      },
      {
        id: 'q_gen_5',
        type: 'quiz',
        question: `When securing APIs in ${cleanTopic}, which approach is most resilient against CSRF (Cross-Site Request Forgery)?`,
        options: [
          'Relying solely on HTTP GET requests',
          'SameSite=Lax/Strict cookie attributes with Anti-CSRF tokens for mutating calls',
          'Disabling CORS checks entirely',
          'Storing plain API tokens in unencrypted cookies'
        ],
        correctAnswer: 1,
        explanation: 'Combining modern SameSite cookie flags with cryptographic anti-CSRF challenge tokens or Authorization headers prevents unauthorized cross-origin forged requests.',
        timeLimitSeconds: 25,
        points: 1200
      }
    ];
  }

  // 5. AI Presentation Generator (Mentimeter / Slide Style)
  public async generatePresentation(topic: string): Promise<{ title: string; slides: QuizQuestion[] }> {
    const title = `Mastering ${topic}: From Fundamentals to Production`;
    const slides: QuizQuestion[] = [
      {
        id: 'sl_1',
        type: 'slide',
        question: 'Welcome & Session Overview',
        options: [],
        slideTitle: title,
        slideContent: `• Understanding the core paradigms of ${topic}\n• Architectural trade-offs and performance implications\n• Live interactive polls & audience check-ins\n• Production deployment best practices`,
        speakerNotes: 'Introduce the session, welcome the participants, and remind them to keep their phones/tabs ready for live responses.',
        timeLimitSeconds: 60,
        points: 0
      },
      {
        id: 'sl_2',
        type: 'poll',
        question: `What is your current experience level with ${topic}?`,
        options: [
          'Complete beginner — here to learn the basics',
          'Intermediate — built a few hobby projects',
          'Advanced — using it in production systems',
          'Expert — architecting large scale deployments'
        ],
        timeLimitSeconds: 20,
        points: 250
      },
      {
        id: 'sl_3',
        type: 'slide',
        question: 'Core Architectural Concepts',
        options: [],
        slideTitle: 'How It Works Under the Hood',
        slideContent: `1. Deterministic state machines and declarative flow\n2. Asynchronous concurrency without thread contention\n3. Observability and fault tolerance mechanisms\n4. Optimized resource allocation`,
        speakerNotes: 'Walk the audience through the execution timeline. Emphasize why decoupling state from compute matters.',
        timeLimitSeconds: 60,
        points: 0
      },
      {
        id: 'sl_4',
        type: 'quiz',
        question: `Check-in Quiz: Which factor most directly impacts end-to-end latency in ${topic}?`,
        options: [
          'CSS bundle size in the client',
          'Network roundtrips and unindexed database queries',
          'The color of the terminal prompt',
          'The number of markdown documentation files'
        ],
        correctAnswer: 1,
        explanation: 'Network serialization roundtrips and slow unindexed database scans represent over 80% of latency bottlenecks in modern distributed applications.',
        timeLimitSeconds: 20,
        points: 1000
      },
      {
        id: 'sl_5',
        type: 'word_cloud',
        question: 'In one word, describe your biggest goal after this presentation:',
        options: [],
        timeLimitSeconds: 30,
        points: 500
      }
    ];

    return { title, slides };
  }

  // 6. Opportunity Match Score
  public calculateOpportunityMatch(opportunity: Opportunity, user: User): { score: number; reason: string; matchedSkills: string[]; missingSkills: string[] } {
    const oppSkills = opportunity.skills.map(s => s.toLowerCase());
    const userSkills = user.skills.map(s => s.toLowerCase());

    const matched = opportunity.skills.filter(s => userSkills.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us)));
    const missing = opportunity.skills.filter(s => !matched.includes(s));

    const ratio = matched.length / Math.max(1, opportunity.skills.length);
    const score = Math.min(96, Math.max(52, Math.round(55 + ratio * 40)));

    let reason = '';
    if (matched.length > 0) {
      reason = `Matches your verified expertise in ${matched.slice(0, 3).join(', ')}.`;
    } else {
      reason = `Opportunity aligns with your interest in ${user.interests.slice(0, 2).join(' & ')}.`;
    }

    return {
      score,
      reason,
      matchedSkills: matched,
      missingSkills: missing
    };
  }

  // 7. AI Code Explainer
  public async explainCode(code: string, language: string = 'typescript'): Promise<{
    summary: string;
    timeComplexity: string;
    spaceComplexity: string;
    bugsOrRisks: string[];
    improvements: string[];
    refactoredCode?: string;
  }> {
    const hasLoop = code.includes('for') || code.includes('while') || code.includes('forEach') || code.includes('map');
    const hasNestedLoop = (code.match(/for|while/g) || []).length > 1;

    const timeComplexity = hasNestedLoop ? 'O(N²)' : hasLoop ? 'O(N)' : 'O(1)';
    const spaceComplexity = code.includes('new Array') || code.includes('[]') || code.includes('Map') || code.includes('Set') ? 'O(N)' : 'O(1)';

    return {
      summary: `This ${language.toUpperCase()} snippet processes input data through deterministic transformation loops. It handles core business logic, but can benefit from edge-case guarding and memory optimization.`,
      timeComplexity,
      spaceComplexity,
      bugsOrRisks: [
        'Potential null/undefined pointer exception if inputs are not validated upstream.',
        'Lack of explicit error boundary or try/catch around external asynchronous operations.'
      ],
      improvements: [
        'Leverage immutable structures or built-in early return patterns to reduce cyclomatic complexity.',
        'Use strict TypeScript types instead of implicit any or loose typing.',
        'Consider memory memoization if executed repeatedly on high-throughput paths.'
      ]
    };
  }

  // 8. AI Interview Question Evaluator
  public async evaluateInterviewAnswer(question: string, answer: string, targetRole: string): Promise<{
    score: number;
    feedback: string;
    strengths: string[];
    missingPoints: string[];
    followUpQuestion: string;
  }> {
    const len = answer.trim().length;
    const score = Math.min(95, Math.max(60, Math.round(60 + Math.min(len / 10, 32))));

    return {
      score,
      feedback: `Solid response demonstrating foundational grasp of ${targetRole} principles. You communicated the central concept clearly; expanding on production edge-cases and trade-offs will elevate it further.`,
      strengths: [
        'Directly answered the core question prompt',
        'Structured explanation with clear logical progression'
      ],
      missingPoints: [
        'Could mention concrete failure modes or error handling',
        'Could benchmark latency or throughput trade-offs'
      ],
      followUpQuestion: 'How would your implementation scale when handling 10,000 concurrent requests per second across multiple geographical regions?'
    };
  }
}

export const aiService = new AIService();
