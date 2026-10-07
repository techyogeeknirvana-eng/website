import { QuizQuestionItem } from '@/types/growth';

export const GROWTH_QUESTION_BANK: QuizQuestionItem[] = [
  // 1. VERBAL MANNERS (vm-001 to vm-006)
  {
    id: 'vm-001',
    category: 'verbal-manners',
    categoryLabel: 'Verbal Manners & Courtesies',
    difficulty: 'easy',
    type: 'choose-best-response',
    question: 'A teammate presents an idea during a standup that contains a minor factual mistake. How do you interject politely?',
    context: 'Team standup with 6 participants and team lead present.',
    options: [
      'Interrupt immediately saying, "That is completely wrong, you checked the wrong documentation."',
      'Wait until they finish their thought, then say: "Thanks for outlining that. If I may add a quick clarification on the API endpoint version..."',
      'Roll your eyes and message the team lead privately that this teammate is incompetent.',
      'Stay completely silent and let the mistake go unaddressed into production code.'
    ],
    correctAnswer: 1,
    explanation: 'Publicly attacking someone damages psychological safety. Waiting for a pause and framing the correction as a collaborative clarification preserves dignity while ensuring technical accuracy.',
    betterApproach: 'Acknowledge their contribution first, then introduce the correction gently with supportive wording.',
    keyTakeaway: 'Correct technical inaccuracies without diminishing the speaker.',
    skill: 'Polite Technical Clarification',
    tags: ['manners', 'teamwork', 'meetings']
  },
  {
    id: 'vm-002',
    category: 'verbal-manners',
    categoryLabel: 'Verbal Manners & Courtesies',
    difficulty: 'medium',
    type: 'scenario-based',
    question: 'You need to ask a busy senior engineer to review your pull request for a college project deadline. What is the most courteous approach?',
    context: 'Senior engineer is at their desk working with headphones on.',
    options: [
      'Tap their shoulder directly and say "Hey, review my PR now, it is urgent for my submission."',
      'Send an asynchronous Slack message: "Hi [Name], whenever you have 5 minutes, could you take a look at PR #42? No rush if you are deep in code—here is a 2-line summary of changes."',
      'Send multiple urgent ping notifications on Slack every 10 minutes until they respond.',
      'Complain to your professor or mentor that the senior is ignoring you.'
    ],
    correctAnswer: 1,
    explanation: 'Respecting cognitive focus by sending concise asynchronous context allows the senior to review when their schedule permits without breaking flow state.',
    betterApproach: 'Provide immediate context, estimated time required, and acknowledge their priorities.',
    keyTakeaway: 'Courteous requests provide context, link, and time expectation asynchronously.',
    skill: 'Asynchronous Courtesy',
    tags: ['manners', 'code-review', 'respect']
  },
  {
    id: 'vm-003',
    category: 'verbal-manners',
    categoryLabel: 'Verbal Manners & Courtesies',
    difficulty: 'easy',
    type: 'choose-best-response',
    question: 'Someone thanks you for giving an insightful workshop presentation at a TYGN college event. What is the most gracious verbal response?',
    context: 'Post-event informal networking in the auditorium.',
    options: [
      '"Yeah I know, I spent weeks on this, obviously it was great."',
      '"Thank you so much! I really enjoyed sharing it, and I am glad the demo resonated with you."',
      '"It was whatever, pretty basic stuff to be honest."',
      '"Do not bother thanking me unless you connect on LinkedIn."'
    ],
    correctAnswer: 1,
    explanation: 'Accepting appreciation with genuine warmth and humility validates the other person while reflecting personal confidence and maturity.',
    betterApproach: 'Acknowledge the compliment with gratitude and reflect mutual enthusiasm for learning.',
    keyTakeaway: 'Graciousness in receiving praise is as critical as delivering praise.',
    skill: 'Receiving Compliments with Grace',
    tags: ['manners', 'networking', 'humility']
  },
  {
    id: 'vm-004',
    category: 'verbal-manners',
    categoryLabel: 'Verbal Manners & Courtesies',
    difficulty: 'medium',
    type: 'identify-inappropriate',
    question: 'Which of the following phrases is LEAST appropriate when declining an invitation to join a student hackathon team?',
    context: 'A classmate invites you to their hackathon team for next weekend.',
    options: [
      '"Thank you for considering me! I have existing commitments this weekend, but I wish the team the best of luck."',
      '"I really appreciate the invite. Right now my schedule is full with coursework, but let us connect for the next event."',
      '"No way, your team has no chance of winning with those ideas."',
      '"Thanks for thinking of me! I will not be able to participate this time, but I am excited to see what you build."'
    ],
    correctAnswer: 2,
    explanation: 'Dismissing other students\' aspirations or ideas is rude and destroys future collaboration possibilities. A polite decline is appreciative, brief, and supportive.',
    betterApproach: 'Express gratitude for the invite, state your unavailability simply without negative judgements, and offer goodwill.',
    keyTakeaway: 'How you say "no" defines your professional reputation in the student developer community.',
    skill: 'Declining Invitations Professionally',
    tags: ['manners', 'hackathons', 'networking']
  },
  {
    id: 'vm-005',
    category: 'verbal-manners',
    categoryLabel: 'Verbal Manners & Courtesies',
    difficulty: 'hard',
    type: 'scenario-based',
    question: 'You accidentally talked over someone during an online group discussion on Google Meet. What should you do immediately?',
    context: 'Both you and a peer unmuted simultaneously to answer the speaker.',
    options: [
      'Speak louder and faster so your audio overrides their microphone feed.',
      'Stop immediately, smile, and say: "Pardon me, please go ahead! I will follow after you."',
      'Mute yourself and stay completely silent for the rest of the meeting out of embarrassment.',
      'Say: "Hey, I unmuted first, let me finish."'
    ],
    correctAnswer: 1,
    explanation: 'Yielding the floor gracefully demonstrates active courtesy, emotional intelligence, and respect for collective meeting flow.',
    betterApproach: 'Pause immediately and courteously invite the other person to speak first.',
    keyTakeaway: 'Yielding the floor elevates your perceived executive maturity.',
    skill: 'Meeting Floor Management',
    tags: ['manners', 'virtual-meetings', 'etiquette']
  },
  {
    id: 'vm-006',
    category: 'verbal-manners',
    categoryLabel: 'Verbal Manners & Courtesies',
    difficulty: 'medium',
    type: 'choose-best-response',
    question: 'A college junior asks a question during your workshop that seems very elementary to you. What is the best verbal manner to respond with?',
    context: 'Q&A session in front of 40 students.',
    options: [
      '"That is basic 101 stuff, you should have googled that before coming."',
      '"Great question—many people find that concept tricky when starting out. Let us break it down simply..."',
      '"I will not waste everyone\'s time on that, ask me offline."',
      '"Did you not pay attention in class?"'
    ],
    correctAnswer: 1,
    explanation: 'Validating questions encourages psychological safety and helps everyone learn. Belittling questions discourages participation and marks poor mentorship.',
    betterApproach: 'Normalize the question, validate the learner, and explain the core concept without condescension.',
    keyTakeaway: 'The mark of a true tech mentor is making complex ideas simple, never making beginners feel small.',
    skill: 'Mentorship Communication',
    tags: ['manners', 'teaching', 'workshops']
  },

  // 2. PROFESSIONAL TONE (pt-001 to pt-006)
  {
    id: 'pt-001',
    category: 'professional-tone',
    categoryLabel: 'Professional Tone & Polish',
    difficulty: 'easy',
    type: 'choose-best-response',
    question: 'How should you rewrite the message: "Give me the Figma design ASAP bro"?',
    context: 'Messaging a UI/UX design intern on Slack.',
    options: [
      '"Send Figma now or else."',
      '"Hi [Name], could you please share the latest Figma file link when you have a moment? We need it to finalize the frontend sprint."',
      '"Figma link. Fast."',
      '"Bro where is Figma, you are delaying everything."'
    ],
    correctAnswer: 1,
    explanation: 'The rewritten message includes polite greeting, clear justification (frontend sprint deadline), courteous request format, and respects workplace boundaries.',
    betterApproach: 'State what you need, why you need it, and provide a polite timeline.',
    keyTakeaway: 'Urgency does not excuse abandoning professional courtesy.',
    skill: 'Refining Casual Demands into Courteous Requests',
    tags: ['tone', 'workplace', 'slack']
  },
  {
    id: 'pt-002',
    category: 'professional-tone',
    categoryLabel: 'Professional Tone & Polish',
    difficulty: 'medium',
    type: 'scenario-based',
    question: 'Your code commit broke the staging server build. How should you communicate this in the tech team channel?',
    context: 'CI/CD pipeline failed after your merge.',
    options: [
      '"It worked fine on my machine, probably a bug with GitHub Actions or AWS."',
      '"Heads up team: my latest commit #912 broke the staging build due to a missing migration file. I have identified the root cause and am deploying the patch now."',
      'Delete the branch silently and hope nobody notices until tomorrow morning.',
      '"Whoever wrote the database schema messed up my code."'
    ],
    correctAnswer: 1,
    explanation: 'High-trust engineering cultures value swift ownership, clear context, and immediate action plans over deflection and defensive excuses.',
    betterApproach: 'Own the event transparently, explain what happened factually, and provide immediate timeline for resolution.',
    keyTakeaway: 'Accountability builds trust faster than perfection.',
    skill: 'Owning Technical Mistakes',
    tags: ['tone', 'engineering', 'incident-response']
  },
  {
    id: 'pt-003',
    category: 'professional-tone',
    categoryLabel: 'Professional Tone & Polish',
    difficulty: 'hard',
    type: 'choose-best-response',
    question: 'You disagree with a senior architect\'s decision to use MongoDB instead of PostgreSQL for a relational analytics dashboard. What tone is most constructive?',
    context: 'Technical architecture design review.',
    options: [
      '"Using Mongo here is an amateur choice. SQL is obviously superior and everyone knows that."',
      '"Could we walk through the relational query patterns for our analytics reports? Given the multi-table joins we will execute, PostgreSQL could provide higher consistency and simpler indexes here."',
      '"Whatever, but if it breaks under scale, remember I told you so."',
      '"MongoDB is complete trash for this use case."'
    ],
    correctAnswer: 1,
    explanation: 'Framing technical disagreement around architectural trade-offs, query requirements, and system trade-offs invites healthy discussion rather than ego battles.',
    betterApproach: 'Anchor discussions in functional requirements and data patterns rather than absolute opinions.',
    keyTakeaway: 'Challenge technical architectures with data and trade-offs, never personal attacks.',
    skill: 'Technical Disagreement with Senior Engineers',
    tags: ['tone', 'architecture', 'persuasion']
  },
  {
    id: 'pt-004',
    category: 'professional-tone',
    categoryLabel: 'Professional Tone & Polish',
    difficulty: 'medium',
    type: 'identify-inappropriate',
    question: 'Which of the following email sign-offs is LEAST appropriate when writing to an external hiring manager or guest speaker?',
    context: 'Formal inquiry email.',
    options: [
      '"Best regards,"',
      '"Sincerely,"',
      '"Peace out, catch you later,"',
      '"Warm regards,"'
    ],
    correctAnswer: 2,
    explanation: 'Slang sign-offs like "Peace out" undermine professional credibility in external communications.',
    betterApproach: 'Use standard executive sign-offs like "Best regards" or "Sincerely".',
    keyTakeaway: 'Align your closing tone with the context and professional distance of the recipient.',
    skill: 'Written Business Polish',
    tags: ['tone', 'email', 'formality']
  },
  {
    id: 'pt-005',
    category: 'professional-tone',
    categoryLabel: 'Professional Tone & Polish',
    difficulty: 'easy',
    type: 'choose-best-response',
    question: 'A client or project evaluator says: "This feature looks confusing." What is the best tone to reply with?',
    context: 'Client demo presentation.',
    options: [
      '"You just don\'t know how modern software works."',
      '"Thank you for pointing that out. Which specific part of the flow felt unintuitive? We would love to streamline it."',
      '"Well, nobody else had an issue with it."',
      '"It works according to the spec so it is fine."'
    ],
    correctAnswer: 1,
    explanation: 'Curiosity and openness in the face of feedback turn criticism into valuable user experience insights.',
    betterApproach: 'Thank them for user insight and invite specific clarity on the friction points.',
    keyTakeaway: 'Treat confusing feedback as UX discovery, not personal criticism.',
    skill: 'Receiving Client Feedback',
    tags: ['tone', 'client', 'ux']
  },
  {
    id: 'pt-006',
    category: 'professional-tone',
    categoryLabel: 'Professional Tone & Polish',
    difficulty: 'hard',
    type: 'scenario-based',
    question: 'You must deliver bad news: the project cannot be delivered by Friday due to third-party API downtime. How do you communicate this?',
    context: 'Status update to stakeholder.',
    options: [
      '"Not our fault, the external API died, nothing we can do, will ship whenever."',
      '"Hi Team, our integration testing revealed that Stripe\'s sandbox outages delayed webhook verification by 48 hours. To ensure data integrity, we are targeting delivery for Tuesday at 2 PM. Here are the completed milestones and remaining QA checks."',
      'Say nothing until Friday afternoon, then message "Can\'t do it."',
      '"Ask the vendor why their servers are so terrible."'
    ],
    correctAnswer: 1,
    explanation: 'Professional delay notifications communicate early, explain root cause without whining, present the revised ETA, and detail what is already secure.',
    betterApproach: 'Communicate early, be specific about impact, and provide a concrete contingency plan.',
    keyTakeaway: 'Bad news early is engineering professionalism; bad news late is a failure of communication.',
    skill: 'Proactive Delay Management',
    tags: ['tone', 'project-management', 'stakeholders']
  },

  // 3. WORKPLACE ETIQUETTE (we-001 to we-006)
  {
    id: 'we-001',
    category: 'workplace-etiquette',
    categoryLabel: 'Workplace & Internship Etiquette',
    difficulty: 'easy',
    type: 'scenario-based',
    question: 'It is your first week as a software engineering intern. What is the standard etiquette when stuck on a bug for more than 45 minutes?',
    context: 'Local environment setup bug.',
    options: [
      'Sit quietly for 6 hours trying random things and tell no one at end-of-day standup.',
      'Document what you tried, what error codes appeared, and reach out to your mentor: "Hi [Mentor], I have spent 45 minutes debugging this OAuth callback issue. I tried X and Y. Could you spare 5 minutes to point me in the right direction?"',
      'Ping the CEO directly asking them to debug your VS Code configuration.',
      'Complain publicly on Twitter/X that the company codebase is poorly written.'
    ],
    correctAnswer: 1,
    explanation: 'The 30-45 minute rule balances self-reliance with respect for team efficiency. Documenting what you tried proves you put in honest effort before asking.',
    betterApproach: 'Try independently first, document your attempts, then ask with targeted context.',
    keyTakeaway: 'Asking for help with proof of effort is a sign of high potential, not weakness.',
    skill: 'Stuck Protocol for Interns',
    tags: ['workplace', 'internships', 'asking-for-help']
  },
  {
    id: 'we-002',
    category: 'workplace-etiquette',
    categoryLabel: 'Workplace & Internship Etiquette',
    difficulty: 'medium',
    type: 'choose-best-response',
    question: 'You are on a Zoom meeting with 15 people and you are not currently speaking. What is the expected etiquette?',
    context: 'All-hands company or community meeting.',
    options: [
      'Keep your microphone unmuted with background television noise playing.',
      'Keep your microphone muted until you need to speak; use the "Raise Hand" feature or chat for questions.',
      'Play music through your microphone to entertain participants.',
      'Continuously interrupt speakers with unrelated comments.'
    ],
    correctAnswer: 1,
    explanation: 'Audio hygiene (muting when not speaking) prevents background interference and demonstrates respect for the entire group\'s time.',
    betterApproach: 'Stay on mute by default, use raise hand or chat to signal intent, and unmute smoothly.',
    keyTakeaway: 'Virtual meeting courtesy starts with intentional audio hygiene.',
    skill: 'Virtual Meeting Etiquette',
    tags: ['workplace', 'remote', 'meetings']
  },
  {
    id: 'we-003',
    category: 'workplace-etiquette',
    categoryLabel: 'Workplace & Internship Etiquette',
    difficulty: 'hard',
    type: 'scenario-based',
    question: 'You overhear sensitive feedback being given to another peer in an open workplace or college lab. What is proper etiquette?',
    context: 'Open lab or office space.',
    options: [
      'Record it with your phone and send it to your friends on WhatsApp.',
      'Discreetly put on your headphones or step away, maintaining total confidentiality and never gossiping about it.',
      'Join the conversation and chime in with your own complaints about that peer.',
      'Post the drama on the community Discord channel.'
    ],
    correctAnswer: 1,
    explanation: 'Discretion, privacy respect, and zero tolerance for gossip are hallmarks of high-integrity tech professionals.',
    betterApproach: 'Grant others privacy and actively ignore overheard confidential evaluations.',
    keyTakeaway: 'Integrity is what you do with information you were never meant to hear.',
    skill: 'Workplace Discretion & Confidentiality',
    tags: ['workplace', 'integrity', 'ethics']
  },
  {
    id: 'we-004',
    category: 'workplace-etiquette',
    categoryLabel: 'Workplace & Internship Etiquette',
    difficulty: 'easy',
    type: 'choose-best-response',
    question: 'When joining a remote team channel on Slack/Discord, what is the best introductory etiquette?',
    context: 'First day in a new tech community or company workspace.',
    options: [
      'Spam all channels with "@everyone hire me for freelancing".',
      'Post a friendly introduction in #introductions: your name, background, what you are excited to work on, and how you look forward to collaborating.',
      'Lurk silently forever and ignore all onboarding greetings.',
      'Immediately DM 20 people asking for referrals.'
    ],
    correctAnswer: 1,
    explanation: 'A warm, professional self-introduction establishes your identity and signals collegiality from day one.',
    betterApproach: 'Use designated channels to introduce yourself warmly and concisely.',
    keyTakeaway: 'A concise introduction plants the seeds of your peer network.',
    skill: 'Community Onboarding',
    tags: ['workplace', 'introductions', 'remote']
  },
  {
    id: 'we-005',
    category: 'workplace-etiquette',
    categoryLabel: 'Workplace & Internship Etiquette',
    difficulty: 'medium',
    type: 'choose-best-response',
    question: 'You need to take sick leave or personal emergency time during your internship. How should you notify your manager?',
    context: 'Morning of a workday.',
    options: [
      'Disappear completely and explain 3 days later when you return.',
      'Notify your manager and team channel as early as possible before working hours begin, mentioning who is covering any critical blockers.',
      'Send a Snapchat message to a coworker and assume word will spread.',
      'Just log into Slack as "Away" without any explanation.'
    ],
    correctAnswer: 1,
    explanation: 'Advance notice allows team leads to reassign critical dependencies and ensures client deliverables are protected.',
    betterApproach: 'Notify early, be brief about absence reason, and highlight coverage for urgent tasks.',
    keyTakeaway: 'Timely absence notification shows respect for teammates who depend on you.',
    skill: 'Leave & Absence Etiquette',
    tags: ['workplace', 'reliability', 'accountability']
  },
  {
    id: 'we-006',
    category: 'workplace-etiquette',
    categoryLabel: 'Workplace & Internship Etiquette',
    difficulty: 'hard',
    type: 'identify-inappropriate',
    question: 'Which behavior is considered unacceptable in a collaborative hackathon or workplace sprint?',
    context: 'Final 6 hours before hackathon submission.',
    options: [
      'Offering to test a teammate\'s code modules before deployment.',
      'Force pushing code directly to the `main` branch without peer review or communication.',
      'Bringing water and snacks for your team members.',
      'Documenting API endpoints so frontend and backend remain aligned.'
    ],
    correctAnswer: 1,
    explanation: 'Force pushing without consensus overwrites other teammates\' commits and can destroy hours of sprint work.',
    betterApproach: 'Maintain branch protection and communicate merges explicitly during high-pressure sprints.',
    keyTakeaway: 'Pressure test: good engineers communicate more, not less, when deadlines loom.',
    skill: 'Collaborative Engineering Discipline',
    tags: ['workplace', 'git', 'hackathons']
  },

  // 4. INTERVIEW COMMUNICATION (ic-001 to ic-006)
  {
    id: 'ic-001',
    category: 'interview-communication',
    categoryLabel: 'Interview Communication & Demeanor',
    difficulty: 'medium',
    type: 'scenario-based',
    question: 'During a technical interview, the interviewer asks a DSA question you have never seen before. What is the most impressive verbal response?',
    context: 'Live coding round.',
    options: [
      'Panic, freeze, and say: "I do not know this, can you give me another question?"',
      'Think out loud: "I haven\'t encountered this exact problem before, but looking at the constraints, it resembles a graph shortest path or dynamic programming problem. Let me first state my brute-force intuition..."',
      'Cheat using an LLM on a second screen while giving vague one-word answers.',
      'Argue that this question is obsolete and not used in modern web development.'
    ],
    correctAnswer: 1,
    explanation: 'Interviewers evaluate your thought process under ambiguity. Thinking out loud demonstrates problem decomposition, composure, and analytical resilience.',
    betterApproach: 'Acknowledge the novelty, identify analogous patterns, and reason aloud through initial brute-force approaches.',
    keyTakeaway: 'Interviewers hire problem solvers who communicate their reasoning under uncertainty.',
    skill: 'Thinking Aloud Under Pressure',
    tags: ['interviews', 'dsa', 'problem-solving']
  },
  {
    id: 'ic-002',
    category: 'interview-communication',
    categoryLabel: 'Interview Communication & Demeanor',
    difficulty: 'easy',
    type: 'choose-best-response',
    question: 'The interviewer asks: "Do you have any questions for us?" at the end of your interview. What should you ask?',
    context: 'Final 5 minutes of interview.',
    options: [
      '"Nope, I am good, when do I get paid?"',
      '"What are the biggest technical bottlenecks your engineering team is solving right now, and how does your team support continuous learning for new engineers?"',
      '"Can I work from home 100% of the time and skip meetings?"',
      '"How easy is it to get promoted here?"'
    ],
    correctAnswer: 1,
    explanation: 'Asking thoughtful questions about engineering challenges and team culture demonstrates authentic curiosity, ambition, and long-term mindset.',
    betterApproach: 'Ask about real engineering challenges, mentorship structure, or architectural roadmaps.',
    keyTakeaway: 'Your questions reveal your caliber as clearly as your answers.',
    skill: 'Reverse Interview Inquiries',
    tags: ['interviews', 'questions', 'curiosity']
  },
  {
    id: 'ic-003',
    category: 'interview-communication',
    categoryLabel: 'Interview Communication & Demeanor',
    difficulty: 'hard',
    type: 'scenario-based',
    question: 'The interviewer gives you a critical hint after your first algorithm attempt fails. How should you respond?',
    context: 'System design or live algorithm review.',
    options: [
      'Defend your broken approach aggressively and insist the interviewer is mistaken.',
      'Acknowledge the hint warmly: "Thank you for that hint—that makes complete sense. If we use a two-pointer approach as you noted, our time complexity drops from O(N^2) to O(N). Let me trace that..."',
      'Silently accept it with an eye roll and resume coding without speaking.',
      'Give up completely because you needed a hint.'
    ],
    correctAnswer: 1,
    explanation: 'Coaching receptivity is one of the highest weighted signals in software engineering interviews. Teams want engineers who listen, absorb feedback, and pivot.',
    betterApproach: 'Welcome the hint with gratitude, analyze the new trajectory aloud, and implement the optimization.',
    keyTakeaway: 'Hints are not penalties; they are tests of coachability and collaboration.',
    skill: 'Coachability & Hint Absorption',
    tags: ['interviews', 'coachability', 'dsa']
  },
  {
    id: 'ic-004',
    category: 'interview-communication',
    categoryLabel: 'Interview Communication & Demeanor',
    difficulty: 'medium',
    type: 'choose-best-response',
    question: 'How should you answer the behavioral question: "Tell me about a time a project failed"?',
    context: 'Behavioral HR / Hiring Manager interview.',
    options: [
      '"My projects never fail, I always do everything right."',
      '"Use the STAR method: describe the Situation, Task, what failed, take personal responsibility, and focus heavily on the concrete lessons learned and how you changed your approach."',
      '"It was completely my teammate\'s fault because they didn\'t show up."',
      '"I don\'t like talking about negative things."'
    ],
    correctAnswer: 1,
    explanation: 'Self-reflection and growth mindset turn past failures into proof of maturity and learning ability.',
    betterApproach: 'Own the challenge objectively, spotlight key takeaways, and demonstrate changed behavior.',
    keyTakeaway: 'The STAR method plus lessons learned turns vulnerability into strength.',
    skill: 'Behavioral Self-Awareness',
    tags: ['interviews', 'behavioral', 'star-method']
  },
  {
    id: 'ic-005',
    category: 'interview-communication',
    categoryLabel: 'Interview Communication & Demeanor',
    difficulty: 'easy',
    type: 'identify-inappropriate',
    question: 'Which behavior is considered detrimental during an online technical interview?',
    context: 'Camera and audio active on Google Meet.',
    options: [
      'Maintaining steady eye contact with the webcam and speaking clearly.',
      'Checking your phone continuously and typing responses with loud mechanical keys without explanation.',
      'Having a clean, well-lit background and quiet environment.',
      'Taking a 10-second breath before answering complex questions.'
    ],
    correctAnswer: 1,
    explanation: 'Distracted non-verbal behavior like checking your phone conveys disinterest and lack of focus.',
    betterApproach: 'Treat virtual interviews with the same undivided attention as an in-person boardroom meeting.',
    keyTakeaway: 'Presence and focus speak before you utter a single word.',
    skill: 'Virtual Interview Executive Presence',
    tags: ['interviews', 'body-language', 'presence']
  },
  {
    id: 'ic-006',
    category: 'interview-communication',
    categoryLabel: 'Interview Communication & Demeanor',
    difficulty: 'hard',
    type: 'choose-best-response',
    question: 'An interviewer asks about a technology listed on your resume that you only used once in a hackathon tutorial. How should you answer?',
    context: 'Resume deep-dive round.',
    options: [
      'Lie and claim you are an expert with production deployment experience.',
      'Be transparent: "I worked with Kubernetes during a 48-hour hackathon where we deployed microservices using Helm. I understand the fundamentals like Pods and Ingress, though I am eager to gain deeper production scale experience."',
      'Refuse to answer and redirect to another topic.',
      '"Why does that matter, anybody can google it."'
    ],
    correctAnswer: 1,
    explanation: 'Authentic boundary honesty beats false claims every time. Technical interviewers will easily sniff out exaggeration.',
    betterApproach: 'State your actual exposure honestly, share what you understand, and express eagerness to deepen your mastery.',
    keyTakeaway: 'Technical integrity is non-negotiable; never bluff on technologies you only scratched the surface of.',
    skill: 'Resume Authenticity & Technical Truth',
    tags: ['interviews', 'honesty', 'resume']
  },

  // 5. ACTIVE LISTENING (al-001 to al-006)
  {
    id: 'al-001',
    category: 'active-listening',
    categoryLabel: 'Active Listening & Comprehension',
    difficulty: 'easy',
    type: 'choose-best-response',
    question: 'Your project mentor spends 5 minutes explaining a complex backend caching strategy. What is the most effective active listening response?',
    context: 'One-on-one architectural guidance session.',
    options: [
      '"Got it." (and immediately change the subject to something else)',
      '"To make sure I understood: we are placing Redis in front of PostgreSQL for session data with a 15-minute TTL, while cache invalidation happens on user profile updates. Did I capture that correctly?"',
      '"I wasn\'t really listening, could you say all of that again?"',
      '"I already know all of this."'
    ],
    correctAnswer: 1,
    explanation: 'Paraphrasing and summarizing confirms mutual alignment, prevents costly architectural rework, and signals high engagement.',
    betterApproach: 'Paraphrase the core architecture and confirm alignment with a verification question.',
    keyTakeaway: 'Listening is demonstrated not by silence, but by accurate reflection of what was said.',
    skill: 'Paraphrasing & Verification',
    tags: ['listening', 'architecture', 'clarity']
  },
  {
    id: 'al-002',
    category: 'active-listening',
    categoryLabel: 'Active Listening & Comprehension',
    difficulty: 'medium',
    type: 'scenario-based',
    question: 'During a team retrospective, a junior designer expresses frustration that developers are ignoring spacing specifications. How should developers listen?',
    context: 'Sprint retrospective.',
    options: [
      'Immediately defend developers: "We have deadlines, pixel perfection doesn\'t matter."',
      'Listen fully without interrupting, validate the concern: "Thank you for raising this. We want our UI to honor the designs. How can we improve our design-to-code handoff or use Tailwind design tokens together?"',
      'Tell the designer to write the CSS themselves if they care so much.',
      'Look at your phone until the retro finishes.'
    ],
    correctAnswer: 1,
    explanation: 'Active listening requires suppressing the instinct to be defensive and instead collaborating on shared solutions.',
    betterApproach: 'Acknowledge the emotional impact and collaborate on systemic solutions.',
    keyTakeaway: 'Empathy in technical teams creates superior end products.',
    skill: 'Cross-Functional Empathy',
    tags: ['listening', 'design-handoff', 'teamwork']
  },
  {
    id: 'al-003',
    category: 'active-listening',
    categoryLabel: 'Active Listening & Comprehension',
    difficulty: 'easy',
    type: 'identify-inappropriate',
    question: 'Which of the following is a barrier to active listening?',
    context: 'Any communication exchange.',
    options: [
      'Mentally rehearsing your rebuttal while the other person is still speaking.',
      'Taking brief notes during a technical specification walk-through.',
      'Nodding and maintaining eye contact to signal attention.',
      'Asking clarifying questions when an acronym is unfamiliar.'
    ],
    correctAnswer: 0,
    explanation: 'Rehearsing your response occupies working memory and prevents you from actually hearing and processing what the other person is communicating.',
    betterApproach: 'Focus entirely on absorbing the speaker\'s thoughts before formulating your reply.',
    keyTakeaway: 'Listen to understand, not to reload your rebuttal.',
    skill: 'Overcoming Rebuttal Rehearsal',
    tags: ['listening', 'mindset', 'habits']
  },
  {
    id: 'al-004',
    category: 'active-listening',
    categoryLabel: 'Active Listening & Comprehension',
    difficulty: 'hard',
    type: 'choose-best-response',
    question: 'A speaker uses an industry acronym like "RAG" or "BFT" that you do not know. How should an active listener handle this?',
    context: 'Technical workshop.',
    options: [
      'Pretend you know it and nod aggressively so you look smart.',
      'Ask at an appropriate moment: "Could you briefly define RAG in this context? I want to ensure I follow the data flow accurately."',
      'Interrupt every 10 seconds asking for definitions of every word.',
      'Tune out completely because the speaker is using jargon.'
    ],
    correctAnswer: 1,
    explanation: 'Admitting a knowledge gap with confidence demonstrates maturity and often helps others in the room who were also hesitant to ask.',
    betterApproach: 'Ask for concise clarification anchored in understanding the core logic.',
    keyTakeaway: 'Asking for clarity is a mark of intelligence, never ignorance.',
    skill: 'Clarification Seeking',
    tags: ['listening', 'learning', 'acronyms']
  },
  {
    id: 'al-005',
    category: 'active-listening',
    categoryLabel: 'Active Listening & Comprehension',
    difficulty: 'medium',
    type: 'scenario-based',
    question: 'In a group project meeting, one quiet member hasn\'t spoken for 30 minutes. What should you do as an active listening leader?',
    context: 'Team planning meeting.',
    options: [
      'Keep dominating the conversation and assume they have nothing to add.',
      'Create space: "[Name], we would value your perspective on the database schema—how does this look from your experience with our backend models?"',
      'Call them out aggressively: "Why are you being so lazy and not talking?"',
      'Ignore them and make all decisions alone.'
    ],
    correctAnswer: 1,
    explanation: 'Inclusive leadership means listening to the quiet voices and creating safe invitations for introverted or hesitant team members.',
    betterApproach: 'Invite contribution gently with a specific domain question rather than put them on the spot.',
    keyTakeaway: 'Great communicators expand the circle of participation.',
    skill: 'Inclusive Floor Creation',
    tags: ['listening', 'leadership', 'inclusion']
  },
  {
    id: 'al-006',
    category: 'active-listening',
    categoryLabel: 'Active Listening & Comprehension',
    difficulty: 'hard',
    type: 'choose-best-response',
    question: 'When receiving critical feedback from a mentor regarding your code quality, what is the best non-verbal and verbal posture?',
    context: 'Code review 1-on-1.',
    options: [
      'Cross your arms, frown, and argue about each commented line of code.',
      'Take notes, maintain open posture, and say: "Thank you for highlighting these edge cases. Let me refactor the helper functions to match our linting standards."',
      'Laugh dismissively and say code style is subjective.',
      'Threaten to quit the team.'
    ],
    correctAnswer: 1,
    explanation: 'Receptivity to code critique is what separates amateur coders from professional software engineers.',
    betterApproach: 'Separate your ego from your code; treat feedback as a free masterclass in craft.',
    keyTakeaway: 'You are not your code. Better critique leads to better systems.',
    skill: 'Receiving Technical Critique',
    tags: ['listening', 'feedback', 'growth']
  },

  // 6. EMAIL ETIQUETTE (ee-001 to ee-006)
  {
    id: 'ee-001',
    category: 'email-etiquette',
    categoryLabel: 'Email & Written Etiquette',
    difficulty: 'easy',
    type: 'choose-best-response',
    question: 'What is the most effective subject line when emailing an industry guest speaker to invite them to a TYGN workshop?',
    context: 'Cold outreach email.',
    options: [
      '"Hey bro please reply"',
      '"Speaking Invitation: TYGN Student Tech Summit 2026 (Topic: Cloud & AI)"',
      '"Important!!!"',
      '"Do you want to talk to students?"'
    ],
    correctAnswer: 1,
    explanation: 'A descriptive subject line with clear categorization, event identity, and topic gets opened and respected by busy professionals.',
    betterApproach: 'Use brackets or clear headers: [Invitation] Event Name - Topic Focus.',
    keyTakeaway: 'The subject line is the gatekeeper of your professional outreach.',
    skill: 'High-Impact Subject Lines',
    tags: ['email', 'outreach', 'speakers']
  },
  {
    id: 'ee-002',
    category: 'email-etiquette',
    categoryLabel: 'Email & Written Etiquette',
    difficulty: 'medium',
    type: 'scenario-based',
    question: 'You are emailing a professor to ask for a letter of recommendation for an internship. What information must be included?',
    context: 'Formal academic email.',
    options: [
      'Just a 1-line email: "Give me a rec letter thanks."',
      'Your full name, student ID, specific classes you took with them (grades earned), the target opportunity link/deadline, and an attached updated resume and draft bullet points.',
      'A demand that it must be done in 2 hours.',
      'Forwarding an empty template from the internet.'
    ],
    correctAnswer: 1,
    explanation: 'Providing full context, past course records, and relevant materials minimizes the professor\'s cognitive load and results in a stronger recommendation.',
    betterApproach: 'Equip the recommender with all context, past coursework, and dates needed to write a high-impact letter.',
    keyTakeaway: 'Make it as effortless as possible for others to advocate for you.',
    skill: 'Academic Recommendation Requests',
    tags: ['email', 'professors', 'recommendations']
  },
  {
    id: 'ee-003',
    category: 'email-etiquette',
    categoryLabel: 'Email & Written Etiquette',
    difficulty: 'easy',
    type: 'identify-inappropriate',
    question: 'When is it appropriate to use "Reply All" on an email thread with 50 recipients?',
    context: 'Company or college wide broadcast.',
    options: [
      'When you want to say "Thank you!" or "Noted!" to everyone on the distribution list.',
      'Only when the information is strictly necessary and relevant for every single person on the thread.',
      'Whenever you want everyone to see you sent an email.',
      'To test your internet connection.'
    ],
    correctAnswer: 1,
    explanation: '"Reply All" storms pollute inboxes and waste cumulative hours of company time. Reserve Reply All for critical team-wide coordination.',
    betterApproach: 'Reply only to the sender unless your update genuinely alters the workflow of all recipients.',
    keyTakeaway: 'Respect inbox bandwidth by rationing Reply All.',
    skill: 'Reply All Discipline',
    tags: ['email', 'inbox-hygiene', 'efficiency']
  },
  {
    id: 'ee-004',
    category: 'email-etiquette',
    categoryLabel: 'Email & Written Etiquette',
    difficulty: 'hard',
    type: 'choose-best-response',
    question: 'You sent a job inquiry email 6 business days ago and haven\'t heard back. How should you follow up?',
    context: 'Follow-up email.',
    options: [
      'Reply angrily asking why they are ghosting qualified candidates.',
      'Reply on the same thread: "Hi [Name], following up gently on my note below regarding the frontend role. I understand you are busy, but would love to reiterate my excitement. Hope you are having a productive week!"',
      'Create 5 fake email addresses to spam them.',
      'Find the recruiter\'s personal Instagram and message them there.'
    ],
    correctAnswer: 1,
    explanation: 'A polite, gentle follow-up on the original thread maintains email trail context while demonstrating persistence with grace.',
    betterApproach: 'Reply on the original thread, keep it short, polite, and value-focused.',
    keyTakeaway: 'Professional persistence is gentle, contextual, and appreciative.',
    skill: 'Gentle Professional Follow-Ups',
    tags: ['email', 'follow-up', 'recruiting']
  },
  {
    id: 'ee-005',
    category: 'email-etiquette',
    categoryLabel: 'Email & Written Etiquette',
    difficulty: 'medium',
    type: 'choose-best-response',
    question: 'How should you structure an email requesting sponsorship for a student hackathon?',
    context: 'Corporate sponsor outreach.',
    options: [
      'Write a 10-page dense block of text without paragraphs or formatting.',
      'Use the 3-paragraph executive format: 1) Who TYGN is and event reach; 2) Concrete value for the sponsor (developer branding, talent access); 3) Clear call to action (15-min call link + attached deck).',
      'Demand money upfront without explaining what the sponsor gets.',
      'Send a meme and hope they donate.'
    ],
    correctAnswer: 1,
    explanation: 'Executive readability requires concise value propositions, clear audience reach statistics, and a zero-friction next step.',
    betterApproach: 'State identity, quantify mutual value, and provide a clear, low-friction next step.',
    keyTakeaway: 'Sponsorship pitches must answer: "What is in it for them?" in the first 10 seconds.',
    skill: 'Partnership Outreach Structure',
    tags: ['email', 'sponsorship', 'business']
  },
  {
    id: 'ee-006',
    category: 'email-etiquette',
    categoryLabel: 'Email & Written Etiquette',
    difficulty: 'hard',
    type: 'scenario-based',
    question: 'You receive an emotionally charged, accusatory email from an upset project collaborator. What is the most mature response?',
    context: 'Dispute over workload division.',
    options: [
      'Reply in all caps matching their anger and insulting their work ethics.',
      'Step back, do not reply immediately while angry, then send a calm de-escalation: "Thanks for expressing your concerns. I want to make sure we resolve this constructively. Let us jump on a brief 10-minute call this afternoon to re-align on tasks."',
      'Forward the email to the entire college batch to publicly humiliate them.',
      'Block their email address and abandon the project.'
    ],
    correctAnswer: 1,
    explanation: 'Never respond to emotional emails while triggered. Moving heated written arguments to a short verbal call dissolves 90% of misunderstandings.',
    betterApproach: 'Pause, de-escalate in tone, and propose a synchronous verbal check-in to clear air.',
    keyTakeaway: 'Written email is the worst medium for emotional conflict resolution.',
    skill: 'De-escalating Heated Written Exchanges',
    tags: ['email', 'conflict', 'de-escalation']
  },

  // 7. CONFLICT HANDLING (ch-001 to ch-006)
  {
    id: 'ch-001',
    category: 'conflict-handling',
    categoryLabel: 'Conflict Handling & Resolution',
    difficulty: 'medium',
    type: 'scenario-based',
    question: 'Two teammates in your hackathon group are screaming at each other over whether to build in Next.js or Flutter. How do you intervene?',
    context: 'Hackathon team room at hour 12.',
    options: [
      'Pick a side and scream at the other person so the majority wins.',
      'Calmly pause the debate: "Hey team, let us take a 5-minute breather. Both frameworks have merits. Let us look at our hackathon rubric: we have 24 hours left, which framework does our team have 3 developers already fluent in?"',
      'Walk out and let the project disintegrate.',
      'Tell them both that they are ruining everything.'
    ],
    correctAnswer: 1,
    explanation: 'Refocusing high-stress debates around shared objective criteria (rubric, timeline, team fluency) removes personal ego and restores pragmatic consensus.',
    betterApproach: 'Introduce emotional calm, anchor in objective team constraints, and prioritize delivery feasibility.',
    keyTakeaway: 'Mediate conflicts by switching from subjective preference to objective constraints.',
    skill: 'Hackathon Conflict Mediation',
    tags: ['conflict', 'mediation', 'hackathons']
  },
  {
    id: 'ch-002',
    category: 'conflict-handling',
    categoryLabel: 'Conflict Handling & Resolution',
    difficulty: 'easy',
    type: 'choose-best-response',
    question: 'A peer takes credit for a feature you designed and implemented during an oral presentation. How do you address it?',
    context: 'College capstone project evaluation.',
    options: [
      'Punch them in the face during the presentation.',
      'During your section of the presentation, seamlessly clarify: "Building on the auth architecture I implemented, [Peer] and I worked on connecting the UI..." and address it privately with them afterwards.',
      'Interrupt the professor screaming that your peer is a fraud.',
      'Say nothing, but harbor resentment forever.'
    ],
    correctAnswer: 1,
    explanation: 'Preserving professional composure during public evaluations while calmly clarifying factual ownership protects your reputation and prevents public scenes.',
    betterApproach: 'Clarify ownership gracefully during your speaking slot and address boundaries privately.',
    keyTakeaway: 'Defend your intellectual contributions with poise, not public drama.',
    skill: 'Navigating Stolen Credit Professionally',
    tags: ['conflict', 'presentation', 'credit']
  },
  {
    id: 'ch-003',
    category: 'conflict-handling',
    categoryLabel: 'Conflict Handling & Resolution',
    difficulty: 'hard',
    type: 'choose-best-response',
    question: 'You have a fundamental disagreement with your team lead on an algorithmic approach. What is the "Disagree and Commit" principle in high-performing tech teams?',
    context: 'Engineering decision meeting.',
    options: [
      'Pretend to agree in the meeting, then secretly sabotage the codebase later.',
      'Vigorously voice your concerns and data points during deliberation; once the final decision is made, execute the chosen direction with 100% commitment and no passive-aggressive whining.',
      'Keep arguing endlessly until everyone gives up and picks your way.',
      'Refuse to work on tasks related to that decision.'
    ],
    correctAnswer: 1,
    explanation: '"Disagree and commit" (Amazon/Intel engineering principle) ensures teams move fast without lingering dissent or sabotage.',
    betterApproach: 'Argue your case with data beforehand, but once decided, unite fully behind execution.',
    keyTakeaway: 'Great engineers argue passionately in planning, and execute unified in production.',
    skill: 'Disagree and Commit',
    tags: ['conflict', 'leadership', 'teamwork']
  },
  {
    id: 'ch-004',
    category: 'conflict-handling',
    categoryLabel: 'Conflict Handling & Resolution',
    difficulty: 'medium',
    type: 'identify-inappropriate',
    question: 'Which of the following is considered "toxic conflict behavior" in code reviews?',
    context: 'Pull Request comments.',
    options: [
      '"Nit: consider using Array.prototype.reduce here for readability."',
      '"Why did you write this garbage? Did a toddler code this?"',
      '"Could you explain the memory footprint of this loop?"',
      '"Please add unit tests for the edge case where array is empty."'
    ],
    correctAnswer: 1,
    explanation: 'Ad-hominem personal attacks and contempt in code reviews poison engineering culture and produce defensive, unhappy teams.',
    betterApproach: 'Review the code objectively, never judge the intelligence or worth of the author.',
    keyTakeaway: 'Critique the code, never the person.',
    skill: 'Healthy Code Review Culture',
    tags: ['conflict', 'code-review', 'toxic-behavior']
  },
  {
    id: 'ch-005',
    category: 'conflict-handling',
    categoryLabel: 'Conflict Handling & Resolution',
    difficulty: 'hard',
    type: 'scenario-based',
    question: 'A teammate consistently misses deadlines, forcing you to stay up all night completing their share. How do you communicate this?',
    context: 'Private one-on-one meeting.',
    options: [
      'Ghost the teammate and delete their name from the project paper.',
      'Use "I" statements in private: "When tasks are submitted late without warning, it forces me to work overnight and puts our team grade at risk. How can we restructure tasks so deadlines are realistic for you?"',
      'Yell at them in the campus cafeteria.',
      'Tell the professor without ever talking to the teammate first.'
    ],
    correctAnswer: 1,
    explanation: '"I" statements focus on factual impact and shared solutions rather than accusatory "You" attacks that trigger immediate defensiveness.',
    betterApproach: 'Focus on observable behavior, explain tangible impact on your workload, and invite collaborative adjustment.',
    keyTakeaway: 'Attack the problem and the workload distribution, not the character.',
    skill: 'Difficult Accountability Conversations',
    tags: ['conflict', 'accountability', 'teamwork']
  },
  {
    id: 'ch-006',
    category: 'conflict-handling',
    categoryLabel: 'Conflict Handling & Resolution',
    difficulty: 'easy',
    type: 'choose-best-response',
    question: 'What is the golden rule when resolving a miscommunication between engineering teammates?',
    context: 'Team collaboration.',
    options: [
      'Assume malicious intent and assume everyone wants to sabotage you.',
      'Assume positive intent: believe teammates want the project to succeed, and clarify misunderstandings with calm curiosity.',
      'Complain to HR immediately.',
      'Never speak to each other again.'
    ],
    correctAnswer: 1,
    explanation: 'Assuming positive intent is the bedrock of high-performing technical teams. Most blunders stem from misalignment, not malice.',
    betterApproach: 'Default to generous interpretations and verify facts before reacting.',
    keyTakeaway: 'Assume positive intent until proven otherwise.',
    skill: 'Presuming Good Intent',
    tags: ['conflict', 'mindset', 'culture']
  },

  // 8. LEADERSHIP & SPEAKING (ls-001 to ls-006)
  {
    id: 'ls-001',
    category: 'leadership-communication',
    categoryLabel: 'Leadership & Influence',
    difficulty: 'medium',
    type: 'scenario-based',
    question: 'You are the student lead of a TYGN campus hackathon team. The project falls behind schedule with 4 hours left. How do you lead verbally?',
    context: 'Critical crunch time.',
    options: [
      'Start shouting in panic: "We are going to lose, you guys are too slow!"',
      'Gather the team for 60 seconds: "Take a deep breath team. We have 4 hours. We are scoping down features: we will polish our core user authentication and hero demo, cut the extra 3 tabs, and make our presentation bulletproof. Let us execute."',
      'Leave the venue and go to sleep.',
      'Blame the event organizers for giving unfair time constraints.'
    ],
    correctAnswer: 1,
    explanation: 'Leadership in crises is about emotional composure, ruthless feature prioritization, and injecting clarity into chaotic situations.',
    betterApproach: 'Project calm, descope to essential core value, and direct team energy onto winning the presentation.',
    keyTakeaway: 'Leaders provide clarity when panic threatens to derail execution.',
    skill: 'Crisis Scoping & Leadership Composure',
    tags: ['leadership', 'hackathons', 'crisis']
  },
  {
    id: 'ls-002',
    category: 'speaking-professionally',
    categoryLabel: 'Speaking Professionally & Presentation',
    difficulty: 'easy',
    type: 'choose-best-response',
    question: 'You are pitching your tech startup project to a panel of judges in 3 minutes. What is the most effective presentation structure?',
    context: '3-minute pitch competition.',
    options: [
      'Spend 2.5 minutes explaining your database schema and 30 seconds rushing through slides.',
      'Problem & Pain Point &rarr; Solution & Live Demo &rarr; Technical Architecture / Differentiation &rarr; Market Impact & Team.',
      'Read every single word from your slides with your back turned to the audience.',
      'Show only funny memes and avoid discussing technology.'
    ],
    correctAnswer: 1,
    explanation: 'Executive pitch structures hook the listener with real pain points, prove viability with a live working demo, and seal confidence with architecture.',
    betterApproach: 'Anchor in human problem, demonstrate working software, and state impact clearly.',
    keyTakeaway: 'Ditch slide reading; tell the story of the problem and demonstrate the solution.',
    skill: 'Technical Pitch Architecture',
    tags: ['speaking', 'pitching', 'demo']
  },
  {
    id: 'ls-003',
    category: 'meeting-etiquette',
    categoryLabel: 'Meeting & Discussion Etiquette',
    difficulty: 'medium',
    type: 'choose-best-response',
    question: 'You are organizing a 30-minute sprint planning meeting. What preparation is required before the meeting starts?',
    context: 'Agile team sprint kickoff.',
    options: [
      'Send a calendar invite with no title, no agenda, and no documents.',
      'Send an agenda with clear objectives: target backlog items to estimate, sprint goal definition, and pre-read links at least 4 hours in advance.',
      'Wait for people to join and then ask: "So what are we doing today?"',
      'Invite 50 unrelated people to make the meeting look important.'
    ],
    correctAnswer: 1,
    explanation: 'No agenda, no meeting. Providing pre-reads and concrete goals respects participants\' time and ensures the meeting ends early or on time.',
    betterApproach: 'Set clear objectives, pre-read links, and defined success outcomes in the invite.',
    keyTakeaway: 'Great meetings are won in the preparation before the call starts.',
    skill: 'Meeting Governance',
    tags: ['meetings', 'agile', 'productivity']
  },
  {
    id: 'ls-004',
    category: 'feedback-delivery',
    categoryLabel: 'Feedback Delivery & Critique',
    difficulty: 'hard',
    type: 'scenario-based',
    question: 'How should you deliver constructive feedback to a teammate who consistently writes unformatted code without comments?',
    context: 'Peer development feedback.',
    options: [
      'Insult their intelligence in front of the whole club.',
      'Anchor in team standards: "Hey [Name], our code reviews will move 2x faster if we automate Prettier and ESLint in our VS Code setup. Let us spend 10 minutes setting up the pre-commit hook together so we don\'t have to worry about manual styling."',
      'Silently reformat their code every night without telling them.',
      'Complain to everyone else on the team behind their back.'
    ],
    correctAnswer: 1,
    explanation: 'Constructive feedback automates the solution, frames it as a shared team speed boost, and offers hands-on assistance rather than shame.',
    betterApproach: 'Focus on tooling and shared standards rather than personal deficits.',
    keyTakeaway: 'Transform behavioral complaints into automated system improvements.',
    skill: 'Systemic Feedback Framing',
    tags: ['feedback', 'tooling', 'code-quality']
  },
  {
    id: 'ls-005',
    category: 'social-etiquette',
    categoryLabel: 'Social & Networking Etiquette',
    difficulty: 'easy',
    type: 'choose-best-response',
    question: 'You meet an engineering leader at a tech conference or TYGN summit. What is the most memorable, professional way to introduce yourself?',
    context: 'Networking hall during tea break.',
    options: [
      'Hand them your resume and say "Give me a job right now please."',
      '"Hi [Name], I loved your keynote on distributed systems, particularly how you handled edge caching. I am Prabh, a student builder working on Next.js edge runtimes. Could I ask your quick take on..."',
      'Follow them into the restroom asking for an internship.',
      'Stare at them from across the room without saying hello.'
    ],
    correctAnswer: 1,
    explanation: 'Authentic engagement with their specific talk combined with a concise 15-second builder identity creates immediate rapport and conversational value.',
    betterApproach: 'Reference their work specifically, state your builder identity briefly, and ask a high-yield question.',
    keyTakeaway: 'Networking is about sharing mutual curiosity, never transactional begging.',
    skill: 'Conference Networking Mastery',
    tags: ['networking', 'conferences', 'presence']
  },
  {
    id: 'ls-006',
    category: 'leadership-communication',
    categoryLabel: 'Leadership & Influence',
    difficulty: 'hard',
    type: 'choose-best-response',
    question: 'What is the primary indicator of high psychological safety fostered by a student community leader?',
    context: 'Community leadership culture.',
    options: [
      'Nobody ever disagrees with the leader and everyone agrees silently.',
      'Members feel completely comfortable asking basic questions, proposing bold experiments, and admitting mistakes without fear of ridicule or punishment.',
      'The leader controls all decisions and takes all spotlight.',
      'Strict punishments for members who don\'t attend meetings.'
    ],
    correctAnswer: 1,
    explanation: 'Psychological safety—the shared belief that a team is safe for interpersonal risk-taking—is the single highest predictor of team excellence (Google Aristotle Project).',
    betterApproach: 'Celebrate curiosity, normalize learning from errors, and reward honest questions.',
    keyTakeaway: 'The strength of a community is measured by how safe beginners feel to ask and learn.',
    skill: 'Building Psychological Safety',
    tags: ['leadership', 'culture', 'community']
  }
];
