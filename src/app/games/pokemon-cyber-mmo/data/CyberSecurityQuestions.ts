// GREEN PHASE - Minimal CyberSecurityQuestions database to pass tests

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  explanation: string;
  damageMultiplier: number;
}

export interface QuestionDatabase {
  beginner: TriviaQuestion[];
  intermediate: TriviaQuestion[];
  advanced: TriviaQuestion[];
}

export class CyberSecurityQuestions {
  private static questionDatabase: QuestionDatabase = {
    beginner: [
      {
        id: 'b001',
        question: 'What does CIA stand for in cybersecurity?',
        options: [
          'Central Intelligence Agency',
          'Confidentiality, Integrity, Availability',
          'Computer Information Access',
          'Cybersecurity Implementation Architecture'
        ],
        correctAnswer: 1,
        difficulty: 'beginner',
        category: 'fundamentals',
        explanation: 'CIA Triad represents the three core principles of information security.',
        damageMultiplier: 1.0
      },
      {
        id: 'b002',
        question: 'What is a firewall used for?',
        options: [
          'Cooling computer systems',
          'Blocking unauthorized network access',
          'Encrypting files',
          'Creating backups'
        ],
        correctAnswer: 1,
        difficulty: 'beginner',
        category: 'networking',
        explanation: 'A firewall monitors and controls incoming and outgoing network traffic.',
        damageMultiplier: 1.0
      },
      {
        id: 'b003',
        question: 'What is encryption?',
        options: [
          'Deleting files permanently',
          'Converting data into a coded format',
          'Copying files to another location',
          'Compressing files to save space'
        ],
        correctAnswer: 1,
        difficulty: 'beginner',
        category: 'cryptography',
        explanation: 'Encryption converts readable data into an encoded format to protect it.',
        damageMultiplier: 1.0
      },
      // High-quality beginner cybersecurity questions with proper educational content
      {
        id: 'b004',
        question: 'What is the CIA Triad\'s "Availability" principle?',
        options: [
          'Data is always backed up',
          'Information is accessible when needed by authorized users',
          'All data is encrypted',
          'Systems are never turned off'
        ],
        correctAnswer: 1,
        difficulty: 'beginner' as const,
        category: 'fundamentals',
        explanation: 'Availability ensures that information and resources are accessible to authorized users when needed.',
        damageMultiplier: 1.0
      },
      {
        id: 'b005',
        question: 'What is a strong password characteristic?',
        options: [
          'Uses personal information like birthdate',
          'Contains a mix of letters, numbers, and symbols',
          'Is the same across all accounts',
          'Is easy to remember and share'
        ],
        correctAnswer: 1,
        difficulty: 'beginner' as const,
        category: 'security',
        explanation: 'Strong passwords use a combination of uppercase, lowercase, numbers, and special characters.',
        damageMultiplier: 1.0
      },
      {
        id: 'b006',
        question: 'What is phishing?',
        options: [
          'A type of computer virus',
          'A social engineering attack to steal credentials',
          'A method to improve network speed',
          'A programming language'
        ],
        correctAnswer: 1,
        difficulty: 'beginner' as const,
        category: 'security',
        explanation: 'Phishing uses deceptive emails or websites to trick users into revealing sensitive information.',
        damageMultiplier: 1.0
      },
      {
        id: 'b007',
        question: 'What does "two-factor authentication" provide?',
        options: [
          'Twice the password strength',
          'An additional layer of security beyond passwords',
          'Two different usernames',
          'Double encryption'
        ],
        correctAnswer: 1,
        difficulty: 'beginner' as const,
        category: 'security',
        explanation: 'Two-factor authentication requires a second verification method beyond just a password.',
        damageMultiplier: 1.0
      },
      {
        id: 'b008',
        question: 'What is malware?',
        options: [
          'A type of computer hardware',
          'Software designed to damage or gain unauthorized access',
          'A network protocol',
          'A programming framework'
        ],
        correctAnswer: 1,
        difficulty: 'beginner' as const,
        category: 'security',
        explanation: 'Malware is malicious software designed to harm, disrupt, or gain unauthorized access to systems.',
        damageMultiplier: 1.0
      },
      {
        id: 'b009',
        question: 'What career involves protecting organizations from cyber threats?',
        options: [
          'Web Designer',
          'Cybersecurity Analyst',
          'Database Administrator',
          'Software Tester'
        ],
        correctAnswer: 1,
        difficulty: 'beginner' as const,
        category: 'careers',
        explanation: 'Cybersecurity Analysts monitor networks and systems to prevent and respond to security threats.',
        damageMultiplier: 1.0
      },
      {
        id: 'b010',
        question: 'What is social engineering in cybersecurity?',
        options: [
          'Building secure networks',
          'Manipulating people to divulge confidential information',
          'Creating user-friendly interfaces',
          'Developing social media platforms'
        ],
        correctAnswer: 1,
        difficulty: 'beginner' as const,
        category: 'security',
        explanation: 'Social engineering exploits human psychology rather than technical vulnerabilities to gain access.',
        damageMultiplier: 1.0
      },
      {
        id: 'b011',
        question: 'What is the purpose of antivirus software?',
        options: [
          'Speed up computer performance',
          'Detect and remove malicious software',
          'Manage file storage',
          'Create backups'
        ],
        correctAnswer: 1,
        difficulty: 'beginner' as const,
        category: 'security',
        explanation: 'Antivirus software scans for, detects, and removes malicious software from computers.',
        damageMultiplier: 1.0
      },
      {
        id: 'b012',
        question: 'What is a computer network?',
        options: [
          'A single computer with multiple programs',
          'Multiple computers connected to share resources',
          'A type of operating system',
          'A programming language'
        ],
        correctAnswer: 1,
        difficulty: 'beginner' as const,
        category: 'networking',
        explanation: 'A computer network connects multiple devices to enable communication and resource sharing.',
        damageMultiplier: 1.0
      },
      {
        id: 'b013',
        question: 'What is cybersecurity ethics?',
        options: [
          'Programming rules',
          'Guidelines for responsible and legal cyber behavior',
          'Network protocols',
          'Hardware specifications'
        ],
        correctAnswer: 1,
        difficulty: 'beginner' as const,
        category: 'ethics',
        explanation: 'Cybersecurity ethics involves responsible behavior and legal compliance in digital environments.',
        damageMultiplier: 1.0
      },
      ...Array.from({ length: 11 }, (_, i) => ({
        id: `b0${i + 14}`,
        question: `What is ${['backup', 'update', 'patch', 'secure coding', 'incident response', 'risk assessment', 'access control', 'network monitoring', 'digital forensics', 'penetration testing', 'vulnerability scanning'][i]}?`,
        options: [
          'A type of malware',
          ['Creating copies of data for recovery', 'Installing latest software versions', 'Fixing security vulnerabilities', 'Writing safe, secure code', 'Responding to security breaches', 'Evaluating potential threats', 'Managing user permissions', 'Watching network traffic', 'Investigating cyber crimes', 'Testing system security', 'Finding system weaknesses'][i],
          'A programming language',
          'A network protocol'
        ],
        correctAnswer: 1,
        difficulty: 'beginner' as const,
        category: ['security', 'security', 'security', 'programming', 'security', 'security', 'security', 'networking', 'intelligence', 'security', 'security'][i],
        explanation: `${['Backups protect against data loss from attacks or failures', 'Updates include security improvements and bug fixes', 'Patches fix known security vulnerabilities in software', 'Secure coding prevents vulnerabilities during development', 'Incident response minimizes damage from security breaches', 'Risk assessment identifies and prioritizes potential threats', 'Access control ensures only authorized users access resources', 'Network monitoring detects suspicious activities and attacks', 'Digital forensics investigates and analyzes cyber crimes', 'Penetration testing simulates attacks to find weaknesses', 'Vulnerability scanning automatically finds security flaws'][i]}`,
        damageMultiplier: 1.0
      })),
      {
        id: 'b025',
        question: 'What is the main security risk of USB devices?',
        options: [
          'They consume too much power',
          'They can contain malware and be used for data theft',
          'They are too slow for modern computers',
          'They only work with specific operating systems'
        ],
        correctAnswer: 1,
        difficulty: 'beginner',
        category: 'hardware',
        explanation: 'USB devices can carry malware, steal data, or provide unauthorized access to systems.',
        damageMultiplier: 1.0
      },
      {
        id: 'b026',
        question: 'What does "physical security" mean in cybersecurity?',
        options: [
          'Protecting software from viruses',
          'Protecting physical access to computer systems and facilities',
          'Installing antivirus software',
          'Creating strong passwords'
        ],
        correctAnswer: 1,
        difficulty: 'beginner',
        category: 'hardware',
        explanation: 'Physical security involves protecting the physical components and access points of IT systems.',
        damageMultiplier: 1.0
      }
    ],
    intermediate: [
      {
        id: 'i001',
        question: 'What is the primary purpose of a VPN?',
        options: [
          'Speed up internet connection',
          'Create a secure tunnel for data transmission',
          'Block all network traffic',
          'Scan for viruses'
        ],
        correctAnswer: 1,
        difficulty: 'intermediate',
        category: 'networking',
        explanation: 'VPNs create encrypted tunnels to protect data in transit.',
        damageMultiplier: 1.3
      },
      {
        id: 'i002',
        question: 'What is SQL injection?',
        options: [
          'A type of database optimization',
          'A malicious code insertion attack',
          'A database backup method',
          'A data encryption technique'
        ],
        correctAnswer: 1,
        difficulty: 'intermediate',
        category: 'security',
        explanation: 'SQL injection involves inserting malicious SQL code into database queries.',
        damageMultiplier: 1.3
      },
      // High-quality intermediate cybersecurity questions
      {
        id: 'i003',
        question: 'What is the difference between symmetric and asymmetric encryption?',
        options: [
          'Symmetric is faster, asymmetric is more secure',
          'Symmetric uses one key, asymmetric uses two keys',
          'Symmetric is newer, asymmetric is older',
          'There is no difference'
        ],
        correctAnswer: 1,
        difficulty: 'intermediate' as const,
        category: 'cryptography',
        explanation: 'Symmetric encryption uses the same key for encryption and decryption, while asymmetric uses public/private key pairs.',
        damageMultiplier: 1.3
      },
      {
        id: 'i004',
        question: 'What is a DMZ in network security?',
        options: [
          'A demilitarized zone between internal and external networks',
          'A type of malware',
          'A programming language',
          'A database management system'
        ],
        correctAnswer: 0,
        difficulty: 'intermediate' as const,
        category: 'networking',
        explanation: 'A DMZ is a network segment that sits between internal networks and external networks, providing an additional security layer.',
        damageMultiplier: 1.3
      },
      {
        id: 'i005',
        question: 'What is penetration testing?',
        options: [
          'Testing network speed',
          'Authorized simulation of cyberattacks to find vulnerabilities',
          'Installing software updates',
          'Backing up data'
        ],
        correctAnswer: 1,
        difficulty: 'intermediate' as const,
        category: 'security',
        explanation: 'Penetration testing involves authorized attempts to breach systems to identify security weaknesses.',
        damageMultiplier: 1.3
      },
      {
        id: 'i006',
        question: 'What does HTTPS provide that HTTP does not?',
        options: [
          'Faster loading times',
          'Encryption and authentication',
          'Better graphics support',
          'Larger file transfers'
        ],
        correctAnswer: 1,
        difficulty: 'intermediate' as const,
        category: 'networking',
        explanation: 'HTTPS encrypts data in transit and authenticates the server, providing security that HTTP lacks.',
        damageMultiplier: 1.3
      },
      {
        id: 'i007',
        question: 'What is a hash function in cybersecurity?',
        options: [
          'A way to speed up computers',
          'A one-way function that creates a fixed-size output',
          'A type of network cable',
          'A programming loop'
        ],
        correctAnswer: 1,
        difficulty: 'intermediate' as const,
        category: 'cryptography',
        explanation: 'Hash functions create a fixed-size "fingerprint" of data that is virtually impossible to reverse.',
        damageMultiplier: 1.3
      },
      {
        id: 'i008',
        question: 'What is the principle of least privilege?',
        options: [
          'Everyone should have administrator access',
          'Users should only have the minimum access needed for their role',
          'Passwords should be as short as possible',
          'All data should be public'
        ],
        correctAnswer: 1,
        difficulty: 'intermediate' as const,
        category: 'security',
        explanation: 'Least privilege limits user access rights to only what is necessary for their legitimate purpose.',
        damageMultiplier: 1.3
      },
      {
        id: 'i009',
        question: 'What is a zero-day vulnerability?',
        options: [
          'A vulnerability that exists for zero days',
          'A security flaw unknown to the software vendor',
          'A patch released on day zero',
          'A system with no vulnerabilities'
        ],
        correctAnswer: 1,
        difficulty: 'intermediate' as const,
        category: 'security',
        explanation: 'Zero-day vulnerabilities are security flaws that are unknown to those who should be mitigating them.',
        damageMultiplier: 1.3
      },
      {
        id: 'i010',
        question: 'What is multi-factor authentication (MFA)?',
        options: [
          'Using multiple passwords',
          'Authentication using two or more verification factors',
          'Having multiple user accounts',
          'Logging in multiple times'
        ],
        correctAnswer: 1,
        difficulty: 'intermediate' as const,
        category: 'security',
        explanation: 'MFA combines multiple authentication factors like passwords, tokens, and biometrics for stronger security.',
        damageMultiplier: 1.3
      },
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `i0${i + 11}`,
        question: `What is ${['intrusion detection', 'digital certificate', 'virtual private network', 'access control list', 'public key infrastructure', 'security incident', 'vulnerability assessment', 'network segmentation'][i]}?`,
        options: [
          'A type of malware',
          ['System monitoring for unauthorized access', 'Digital document verifying identity', 'Secure tunnel over public networks', 'Rules defining network access permissions', 'Framework for managing digital certificates', 'Event compromising security', 'Process of identifying security weaknesses', 'Dividing networks into separate segments'][i],
          'A programming language',
          'A hardware component'
        ],
        correctAnswer: 1,
        difficulty: 'intermediate' as const,
        category: ['security', 'cryptography', 'networking', 'security', 'cryptography', 'security', 'security', 'networking'][i],
        explanation: `${['IDS monitors network traffic and system activities for malicious behavior', 'Digital certificates authenticate identity and enable secure communications', 'VPNs create encrypted connections over untrusted networks', 'ACLs specify which users or systems can access network resources', 'PKI manages the creation, distribution, and revocation of digital certificates', 'Security incidents are events that compromise confidentiality, integrity, or availability', 'Vulnerability assessments systematically identify and evaluate security weaknesses', 'Network segmentation isolates network sections to limit attack spread'][i]}`,
        damageMultiplier: 1.3
      }))
    ],
    advanced: [
      {
        id: 'a001',
        question: 'What is a zero-day vulnerability?',
        options: [
          'A vulnerability that takes zero days to patch',
          'A security flaw unknown to the vendor',
          'A vulnerability that occurs on day zero of deployment',
          'A bug that causes system crashes'
        ],
        correctAnswer: 1,
        difficulty: 'advanced',
        category: 'security',
        explanation: 'Zero-day vulnerabilities are security flaws unknown to those who should be interested in mitigating them.',
        damageMultiplier: 1.8
      },
      {
        id: 'a002',
        question: 'What is the difference between symmetric and asymmetric encryption?',
        options: [
          'Symmetric is faster, asymmetric uses same key for both operations',
          'Symmetric uses same key, asymmetric uses different keys',
          'Symmetric is more secure, asymmetric is less secure',
          'There is no difference'
        ],
        correctAnswer: 1,
        difficulty: 'advanced',
        category: 'cryptography',
        explanation: 'Symmetric encryption uses the same key for encryption/decryption, while asymmetric uses different keys.',
        damageMultiplier: 1.8
      },
      // High-quality advanced cybersecurity questions
      {
        id: 'a003',
        question: 'What is the primary goal of a side-channel attack?',
        options: [
          'Overload network bandwidth',
          'Extract information from physical implementation characteristics',
          'Install malware remotely',
          'Crash system processes'
        ],
        correctAnswer: 1,
        difficulty: 'advanced' as const,
        category: 'security',
        explanation: 'Side-channel attacks exploit information leaked through physical characteristics like power consumption or electromagnetic emissions.',
        damageMultiplier: 1.8
      },
      {
        id: 'a004',
        question: 'In the context of cryptography, what is perfect forward secrecy?',
        options: [
          'Encryption that never expires',
          'Past communications remain secure even if long-term keys are compromised',
          'Keys that are perfectly random',
          'Encryption with no computational overhead'
        ],
        correctAnswer: 1,
        difficulty: 'advanced' as const,
        category: 'cryptography',
        explanation: 'Perfect forward secrecy ensures that session keys are not compromised even if long-term keys are later compromised.',
        damageMultiplier: 1.8
      },
      {
        id: 'a005',
        question: 'What is a rainbow table attack?',
        options: [
          'Attack using colorful graphics',
          'Precomputed hash lookup attack against password hashes',
          'Network flooding with multicolored packets',
          'SQL injection with colored syntax'
        ],
        correctAnswer: 1,
        difficulty: 'advanced' as const,
        category: 'cryptography',
        explanation: 'Rainbow tables are precomputed tables of hash values used to crack password hashes quickly.',
        damageMultiplier: 1.8
      },
      {
        id: 'a006',
        question: 'What is the main security concern with SQL injection attacks?',
        options: [
          'Slow database performance',
          'Unauthorized database access and data manipulation',
          'High network traffic',
          'Excessive CPU usage'
        ],
        correctAnswer: 1,
        difficulty: 'advanced' as const,
        category: 'programming',
        explanation: 'SQL injection can allow attackers to access, modify, or delete database contents by manipulating SQL queries.',
        damageMultiplier: 1.8
      },
      {
        id: 'a007',
        question: 'What is advanced persistent threat (APT)?',
        options: [
          'A type of antivirus software',
          'Prolonged and targeted cyberattack by sophisticated adversaries',
          'A network protocol',
          'A programming framework'
        ],
        correctAnswer: 1,
        difficulty: 'advanced' as const,
        category: 'intelligence',
        explanation: 'APTs are sophisticated, long-term attacks that maintain persistent access to target networks.',
        damageMultiplier: 1.8
      },
      {
        id: 'a008',
        question: 'What is the purpose of security orchestration and automated response (SOAR)?',
        options: [
          'Manual incident handling',
          'Automated threat detection and response coordination',
          'Network performance monitoring',
          'Database optimization'
        ],
        correctAnswer: 1,
        difficulty: 'advanced' as const,
        category: 'security',
        explanation: 'SOAR platforms automate security operations and coordinate responses to security incidents.',
        damageMultiplier: 1.8
      },
      {
        id: 'a009',
        question: 'What is homomorphic encryption used for?',
        options: [
          'Faster data transmission',
          'Performing computations on encrypted data without decrypting it',
          'Compressing large files',
          'Creating digital signatures'
        ],
        correctAnswer: 1,
        difficulty: 'advanced' as const,
        category: 'cryptography',
        explanation: 'Homomorphic encryption allows computations to be performed on encrypted data while preserving privacy.',
        damageMultiplier: 1.8
      },
      ...Array.from({ length: 4 }, (_, i) => ({
        id: `a0${i + 10}`,
        question: `What is ${['threat hunting', 'behavioral analytics', 'quantum cryptography', 'zero trust architecture'][i]} in cybersecurity?`,
        options: [
          'A basic security tool',
          ['Proactive search for threats in networks', 'Analysis of user behavior patterns for anomalies', 'Cryptography using quantum mechanical properties', 'Security model that trusts no entity by default'][i],
          'A type of firewall',
          'A programming language'
        ],
        correctAnswer: 1,
        difficulty: 'advanced' as const,
        category: ['intelligence', 'security', 'cryptography', 'security'][i],
        explanation: `${['Threat hunting involves proactively searching for indicators of compromise in networks', 'Behavioral analytics uses machine learning to identify abnormal user behavior patterns', 'Quantum cryptography uses quantum mechanics principles for theoretically unbreakable encryption', 'Zero trust assumes no implicit trust and continuously validates every transaction'][i]}`,
        damageMultiplier: 1.8
      }))
    ]
  };

  static getAllQuestions(): QuestionDatabase {
    return this.questionDatabase;
  }

  static getByCategory(category: string): TriviaQuestion[] {
    const allQuestions = [
      ...this.questionDatabase.beginner,
      ...this.questionDatabase.intermediate,
      ...this.questionDatabase.advanced
    ];
    
    return allQuestions.filter(q => q.category === category);
  }

  static getRandomQuestion(difficulty: 'beginner' | 'intermediate' | 'advanced'): TriviaQuestion {
    const questions = this.questionDatabase[difficulty];
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }

  static getQuestionsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): TriviaQuestion[] {
    return this.questionDatabase[difficulty];
  }

  static getQuestionById(id: string): TriviaQuestion | undefined {
    const allQuestions = [
      ...this.questionDatabase.beginner,
      ...this.questionDatabase.intermediate,
      ...this.questionDatabase.advanced
    ];
    
    return allQuestions.find(q => q.id === id);
  }
}
