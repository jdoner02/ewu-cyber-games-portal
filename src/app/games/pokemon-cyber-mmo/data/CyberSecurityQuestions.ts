// GREEN PHASE – Expanded CyberSecurityQuestions database with comprehensive content
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

interface BattleSession {
  sessionId: string;
  usedQuestionIds: string[];
  createdAt: number;
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
      },
      {
        id: 'b027',
        question: 'What is spam (in terms of cybersecurity)?',
        options: [
          'Unwanted or unsolicited bulk messages, often sent via email',
          'A type of food',
          'A computer virus',
          'A security software tool'
        ],
        correctAnswer: 0,
        difficulty: 'beginner' as const,
        category: 'security',
        explanation: 'Spam refers to unwanted, unsolicited messages (like junk email) sent out in bulk.',
        damageMultiplier: 1.0
      },
      {
        id: 'b028',
        question: 'What is an IP address?',
        options: [
          'A unique address that identifies a device on a network',
          'A memory chip inside a computer',
          'An internet service provider company',
          'A secret encryption code'
        ],
        correctAnswer: 0,
        difficulty: 'beginner' as const,
        category: 'networking',
        explanation: 'An IP address is a numerical label assigned to each device in a network to identify and locate it on the internet.',
        damageMultiplier: 1.0
      },
      {
        id: 'b029',
        question: 'What does a router do in a network?',
        options: [
          'Directs data between networks and connects devices to the internet',
          'Stores all the files for websites',
          'Protects a computer from viruses',
          'Prints documents over the network'
        ],
        correctAnswer: 0,
        difficulty: 'beginner' as const,
        category: 'networking',
        explanation: 'A router forwards data packets between networks, allowing multiple devices to share an internet connection.',
        damageMultiplier: 1.0
      },
      {
        id: 'b030',
        question: 'How can you tell if a website connection is secure?',
        options: [
          'The URL begins with "https://" and a padlock icon is shown in the address bar',
          'The website loads extremely fast',
          'The site asks you to download software to continue',
          'The page has a lot of images and videos'
        ],
        correctAnswer: 0,
        difficulty: 'beginner' as const,
        category: 'security',
        explanation: 'A secure website uses HTTPS, indicated by "https://" at the start of the URL and a padlock icon, meaning data is encrypted in transit.',
        damageMultiplier: 1.0
      },
      {
        id: 'b031',
        question: 'Which of the following is sensitive personal information that you should protect?',
        options: [
          'Your Social Security Number (SSN)',
          'Your favorite food',
          'The URL of a public website',
          'The name of your school mascot'
        ],
        correctAnswer: 0,
        difficulty: 'beginner' as const,
        category: 'ethics',
        explanation: 'Sensitive personal information like a Social Security Number can be misused for identity theft and should be kept private.',
        damageMultiplier: 1.0
      },
      {
        id: 'b032',
        question: 'What is cyberbullying?',
        options: [
          'Using digital devices to harass or intimidate someone repeatedly',
          'Stealing someone’s identity online',
          'A type of computer virus',
          'Friendly joking around on the internet'
        ],
        correctAnswer: 0,
        difficulty: 'beginner' as const,
        category: 'ethics',
        explanation: 'Cyberbullying is bullying that takes place using electronic technology (like social media, texts, or emails) to repeatedly harm or harass someone.',
        damageMultiplier: 1.0
      },
      {
        id: 'b033',
        question: 'What should you do if you are a victim of cyberbullying?',
        options: [
          'Tell a trusted adult and block or report the bully',
          'Respond with similar insults to defend yourself',
          'Share personal information with the bully to appease them',
          'Keep it secret and not tell anyone'
        ],
        correctAnswer: 0,
        difficulty: 'beginner' as const,
        category: 'ethics',
        explanation: 'If you experience cyberbullying, you should not retaliate. Save evidence, block/report the bully, and inform a trusted adult or authority.',
        damageMultiplier: 1.0
      },
      {
        id: 'b034',
        question: 'How can you protect your personal information on social media?',
        options: [
          'Use privacy settings so only trusted people can see your posts',
          'Accept every friend/follower request you receive',
          'Post as much personal info as possible so it’s backed up',
          'Share your passwords with close friends for safekeeping'
        ],
        correctAnswer: 0,
        difficulty: 'beginner' as const,
        category: 'ethics',
        explanation: 'On social media, enabling privacy settings limits who can see your personal information, helping protect your privacy.',
        damageMultiplier: 1.0
      },
      {
        id: 'b035',
        question: 'What does it mean to store files in "the cloud"?',
        options: [
          'Saving data on remote servers accessed via the internet',
          'Storing data on a local hard drive only',
          'Compressing files into a smaller size',
          'Uploading data into the computer’s memory'
        ],
        correctAnswer: 0,
        difficulty: 'beginner' as const,
        category: 'fundamentals',
        explanation: 'Storing files in the cloud means keeping data on online servers (maintained by a provider) so you can access it over the internet, rather than storing it locally.',
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
      })),
      {
        id: 'i019',
        question: 'What is a Denial-of-Service (DoS) attack?',
        options: [
          'An attack that overwhelms a target system with traffic to disrupt its service',
          'An attack that silently steals data without a trace',
          'A method of strengthening encryption keys',
          'A way to safely shut down servers'
        ],
        correctAnswer: 0,
        difficulty: 'intermediate' as const,
        category: 'security',
        explanation: 'A DoS attack floods a system (like a website or network service) with excessive requests or traffic, making it unavailable to legitimate users.',
        damageMultiplier: 1.3
      },
      {
        id: 'i020',
        question: 'What is ransomware?',
        options: [
          'Malware that encrypts your files and demands payment for decryption',
          'Software that optimizes system performance',
          'A network firewall device',
          'A type of data backup method'
        ],
        correctAnswer: 0,
        difficulty: 'intermediate' as const,
        category: 'security',
        explanation: 'Ransomware is malicious software that locks or encrypts a victim’s data and demands a ransom payment to restore access to the files.',
        damageMultiplier: 1.3
      },
      {
        id: 'i021',
        question: 'What is a Trojan horse in cybersecurity?',
        options: [
          'Malware disguised as legitimate software that tricks users into installing it',
          'A fast-spreading computer worm',
          'A security tool used by network administrators',
          'A firewall with a hidden backdoor'
        ],
        correctAnswer: 0,
        difficulty: 'intermediate' as const,
        category: 'security',
        explanation: 'A Trojan horse is malicious software that pretends to be a normal, useful program but actually contains harmful code.',
        damageMultiplier: 1.3
      },
      {
        id: 'i022',
        question: 'What is a computer worm?',
        options: [
          'Malware that self-replicates and spreads to other computers without human action',
          'A virus attached to a hardware device',
          'A program used to patch vulnerabilities',
          'Software for testing network speed'
        ],
        correctAnswer: 0,
        difficulty: 'intermediate' as const,
        category: 'security',
        explanation: 'A computer worm is a self-replicating malware that spreads across networks, often exploiting vulnerabilities to infect other systems without user intervention.',
        damageMultiplier: 1.3
      },
      {
        id: 'i023',
        question: 'What is cross-site scripting (XSS)?',
        options: [
          'A web attack where malicious scripts are injected into trusted websites',
          'A secure method of sharing data between websites',
          'A programming language for web design',
          'A form of strong data encryption'
        ],
        correctAnswer: 0,
        difficulty: 'intermediate' as const,
        category: 'security',
        explanation: 'Cross-site scripting (XSS) is a vulnerability that allows attackers to inject malicious code into webpages, which then executes in other users’ browsers.',
        damageMultiplier: 1.3
      },
      {
        id: 'i024',
        question: 'What best describes a white hat hacker?',
        options: [
          'An ethical hacker who legally helps organizations by finding vulnerabilities',
          'A hacker who only uses outdated techniques',
          'A hacker who attacks only at daytime',
          'A computer virus with a friendly appearance'
        ],
        correctAnswer: 0,
        difficulty: 'intermediate' as const,
        category: 'careers',
        explanation: 'White hat hackers (ethical hackers) are cybersecurity professionals who use their skills to find and fix security flaws with permission, rather than for malicious purposes.',
        damageMultiplier: 1.3
      },
      {
        id: 'i025',
        question: 'What best describes a black hat hacker?',
        options: [
          'A malicious hacker who illegally exploits systems for personal gain or to cause harm',
          'A hacker who only works at night',
          'A cybersecurity student in training',
          'A type of encryption tool'
        ],
        correctAnswer: 0,
        difficulty: 'intermediate' as const,
        category: 'security',
        explanation: 'Black hat hackers are individuals who break into computers or networks with malicious intent, often for personal gain, theft, or damage.',
        damageMultiplier: 1.3
      },
      {
        id: 'i026',
        question: 'In security, what is tailgating?',
        options: [
          'Following an authorized person into a secure area to gain unauthorized access',
          'Using a tail-mounted device to hack a computer',
          'Trailing a user’s online activity without them knowing',
          'Piggybacking on someone’s Wi-Fi signal from a car'
        ],
        correctAnswer: 0,
        difficulty: 'intermediate' as const,
        category: 'security',
        explanation: 'Tailgating is a physical security breach where an unauthorized person follows an authorized individual into a restricted area (like through a secure door) without permission.',
        damageMultiplier: 1.3
      },
      {
        id: 'i027',
        question: 'What does the Internet of Things (IoT) refer to?',
        options: [
          'A network of everyday devices (like appliances and cars) connected to the internet',
          'A social media trend for internet memes',
          'A hacking technique that targets websites',
          'An organization that regulates internet content'
        ],
        correctAnswer: 0,
        difficulty: 'intermediate' as const,
        category: 'networking',
        explanation: 'The Internet of Things (IoT) is the collection of smart devices and sensors (thermostats, refrigerators, wearables, etc.) that are connected online, allowing them to send and receive data.',
        damageMultiplier: 1.3
      },
      {
        id: 'i028',
        question: 'What is a brute force attack in cybersecurity?',
        options: [
          'Repeatedly trying many passwords or keys until the correct one is found',
          'Using brute strength to damage hardware',
          'Overloading a system with more data than it can handle at once',
          'Tricking a user into revealing their login credentials'
        ],
        correctAnswer: 0,
        difficulty: 'intermediate' as const,
        category: 'security',
        explanation: 'In a brute force attack, an attacker attempts to guess a password or encryption key by systematically trying all possible combinations until the correct one is discovered.',
        damageMultiplier: 1.3
      }
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
      })),
      {
        id: 'a014',
        question: 'What is the key difference between an IDS and an IPS?',
        options: [
          'An IDS alerts about intrusions, while an IPS can automatically block intrusions',
          'An IDS is software-based, whereas an IPS is a hardware device',
          'IDS and IPS are just different terms for the same thing',
          'IDS is used by hackers, and IPS is used by security professionals'
        ],
        correctAnswer: 0,
        difficulty: 'advanced' as const,
        category: 'security',
        explanation: 'An Intrusion Detection System (IDS) monitors and alerts on suspicious activity, whereas an Intrusion Prevention System (IPS) can actively block or prevent those threats.',
        damageMultiplier: 1.8
      },
      {
        id: 'a015',
        question: 'What is a buffer overflow attack?',
        options: [
          'Exploiting a program by sending it more data than it can handle, causing it to run malicious code',
          'Flooding a network buffer with traffic to cause a slowdown',
          'Physically tampering with a computer’s memory chips',
          'Taking advantage of an unencrypted network buffer'
        ],
        correctAnswer: 0,
        difficulty: 'advanced' as const,
        category: 'programming',
        explanation: 'A buffer overflow occurs when a program writes more data to a buffer than it can hold. Attackers can exploit buffer overflows to overwrite memory and execute malicious code.',
        damageMultiplier: 1.8
      },
      {
        id: 'a016',
        question: 'What is a "sandbox" in cybersecurity?',
        options: [
          'An isolated environment used to run or test untrusted programs safely',
          'A tool that removes malware from sand drives',
          'A network firewall technique for web traffic',
          'A secure password storage method'
        ],
        correctAnswer: 0,
        difficulty: 'advanced' as const,
        category: 'security',
        explanation: 'A sandbox is a controlled, isolated environment (often virtual) where suspicious or untrusted code can be executed without affecting the rest of the system.',
        damageMultiplier: 1.8
      },
      {
        id: 'a017',
        question: 'In cybersecurity, what is an exploit?',
        options: [
          'Code or technique that takes advantage of a security vulnerability',
          'A type of encryption algorithm',
          'A tool used solely for software updates',
          'A security policy document'
        ],
        correctAnswer: 0,
        difficulty: 'advanced' as const,
        category: 'security',
        explanation: 'An exploit is a piece of software, code, or sequence of commands that attackers use to take advantage of a vulnerability in a system.',
        damageMultiplier: 1.8
      },
      {
        id: 'a018',
        question: 'What is meant by "defense in depth"?',
        options: [
          'Using multiple layers of security controls to protect systems',
          'Using one extremely strong security measure instead of many',
          'Hiding critical servers deep underground',
          'Encrypting data with multiple encryption algorithms simultaneously'
        ],
        correctAnswer: 0,
        difficulty: 'advanced' as const,
        category: 'security',
        explanation: 'Defense in depth is a strategy that employs multiple layers of security (firewalls, intrusion detection, encryption, etc.) so that if one layer fails, others still provide protection.',
        damageMultiplier: 1.8
      },
      {
        id: 'a019',
        question: 'What is an insider threat?',
        options: [
          'A security risk originating from within an organization by someone with authorized access',
          'Malware planted inside an organization’s network',
          'A hacker outside who impersonates an insider',
          'An internal server misconfiguration'
        ],
        correctAnswer: 0,
        difficulty: 'advanced' as const,
        category: 'security',
        explanation: 'An insider threat is a threat to an organization that comes from people inside the organization, such as employees, former employees, or partners, who have inside information or access.',
        damageMultiplier: 1.8
      },
      {
        id: 'a020',
        question: 'What is a data breach?',
        options: [
          'An incident where sensitive data is accessed or disclosed without authorization',
          'A tool that breaks data encryption',
          'A backup procedure for databases',
          'The gap between two network firewalls'
        ],
        correctAnswer: 0,
        difficulty: 'advanced' as const,
        category: 'security',
        explanation: 'A data breach is a security incident in which confidential or protected information is accessed, stolen, or exposed by an unauthorized person.',
        damageMultiplier: 1.8
      },
      {
        id: 'a021',
        question: 'What is a supply chain attack?',
        options: [
          'An attack that targets a less-secure vendor or supplier in order to compromise a final target',
          'Physical theft of goods in a warehouse',
          'A denial-of-service attack on shipping companies',
          'A phishing scam targeting customer service representatives'
        ],
        correctAnswer: 0,
        difficulty: 'advanced' as const,
        category: 'security',
        explanation: 'In a supply chain attack, an adversary infiltrates a target by compromising an outside partner or provider (for example, tampering with software or hardware before it’s delivered to the target).',
        damageMultiplier: 1.8
      },
      {
        id: 'a022',
        question: 'What is spear phishing?',
        options: [
          'A highly targeted phishing attack aimed at a specific individual or organization',
          'A phishing email sent to as many people as possible',
          'Malware that spreads through fishing websites',
          'A fake antivirus pop-up'
        ],
        correctAnswer: 0,
        difficulty: 'advanced' as const,
        category: 'security',
        explanation: 'Spear phishing is a phishing attempt directed at a particular individual or company. These attacks are personalized to make the fraudulent messages appear more believable to the specific target.',
        damageMultiplier: 1.8
      },
      {
        id: 'a023',
        question: 'What is a Man-in-the-Middle (MITM) attack?',
        options: [
          'An attack where a malicious actor intercepts and possibly alters communication between two parties',
          'An attacker physically barricading the connection between two computers',
          'A social engineering scam involving three people',
          'A hardware failure that disrupts network traffic'
        ],
        correctAnswer: 0,
        difficulty: 'advanced' as const,
        category: 'security',
        explanation: 'In a MITM attack, an attacker positions themselves between two communicating parties (often without their knowledge) to eavesdrop on or modify the communication in transit.',
        damageMultiplier: 1.8
      }
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

  // Battle Session Storage
  private static battleSessions: Map<string, BattleSession> = new Map();

  static getRandomQuestion(difficulty: 'beginner' | 'intermediate' | 'advanced'): TriviaQuestion {
    const questions = this.questionDatabase[difficulty];
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }

  static getQuestionsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): TriviaQuestion[] {
    return this.questionDatabase[difficulty] || [];
  }

  static getQuestionById(id: string): TriviaQuestion | undefined {
    const allQuestions = [
      ...this.questionDatabase.beginner,
      ...this.questionDatabase.intermediate,
      ...this.questionDatabase.advanced
    ];
    return allQuestions.find(q => q.id === id);
  }

  // TDD Methods - Battle Session Management
  static getQuestionByLevelDifference(levelDifference: number): TriviaQuestion {
    let difficulty: 'beginner' | 'intermediate' | 'advanced';
    
    if (levelDifference >= 0) {
      difficulty = 'beginner'; // Player equal or stronger - easier questions
    } else if (levelDifference <= -5) {
      difficulty = 'advanced'; // Opponent stronger by 5+ levels - harder questions
    } else {
      difficulty = 'intermediate'; // Opponent slightly stronger (1-4 levels)
    }
    
    return this.getRandomQuestion(difficulty);
  }

  static createBattleSession(): { sessionId: string; usedQuestionIds: string[] } {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: BattleSession = {
      sessionId,
      usedQuestionIds: [],
      createdAt: Date.now()
    };
    this.battleSessions.set(sessionId, session);
    return {
      sessionId: session.sessionId,
      usedQuestionIds: [...session.usedQuestionIds]
    };
  }

  static getQuestionForBattleSession(sessionId: string, levelDifference: number): TriviaQuestion {
    const session = this.battleSessions.get(sessionId);
    if (!session) {
      throw new Error('Battle session not found');
    }

    const difficulty = this.getDifficultyFromLevelDifference(levelDifference);
    const availableQuestions = this.questionDatabase[difficulty].filter(
      q => !session.usedQuestionIds.includes(q.id)
    );

    let selectedQuestion: TriviaQuestion;
    let selectedDifficulty = difficulty;

    if (availableQuestions.length === 0) {
      // Smart fallback: try next difficulty level
      const fallbackDifficulties = this.getFallbackDifficulties(difficulty);
      let fallbackQuestion: TriviaQuestion | null = null;
      
      for (const fallbackDiff of fallbackDifficulties) {
        const fallbackAvailable = this.questionDatabase[fallbackDiff].filter(
          q => !session.usedQuestionIds.includes(q.id)
        );
        if (fallbackAvailable.length > 0) {
          const randomIndex = Math.floor(Math.random() * fallbackAvailable.length);
          fallbackQuestion = fallbackAvailable[randomIndex];
          selectedDifficulty = fallbackDiff;
          break;
        }
      }
      
      if (!fallbackQuestion) {
        // Last resort: return any question from original difficulty
        selectedQuestion = this.getRandomQuestion(difficulty);
      } else {
        selectedQuestion = fallbackQuestion;
      }
    } else {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      selectedQuestion = availableQuestions[randomIndex];
    }
    
    // Track the used question
    session.usedQuestionIds.push(selectedQuestion.id);
    
    return selectedQuestion;
  }

  private static getFallbackDifficulties(difficulty: 'beginner' | 'intermediate' | 'advanced'): ('beginner' | 'intermediate' | 'advanced')[] {
    switch (difficulty) {
      case 'beginner':
        return ['intermediate', 'advanced'];
      case 'intermediate':
        return ['beginner', 'advanced'];
      case 'advanced':
        return ['intermediate', 'beginner'];
    }
  }

  static getBattleSessionState(sessionId: string): { sessionId: string; usedQuestionIds: string[] } {
    const session = this.battleSessions.get(sessionId);
    if (!session) {
      throw new Error('Battle session not found');
    }
    return {
      sessionId: session.sessionId,
      usedQuestionIds: [...session.usedQuestionIds]
    };
  }

  static endBattleSession(sessionId: string): void {
    this.battleSessions.delete(sessionId);
  }

  private static getDifficultyFromLevelDifference(levelDifference: number): 'beginner' | 'intermediate' | 'advanced' {
    if (levelDifference >= 0) {
      return 'beginner'; // Player equal or stronger - easier questions
    } else if (levelDifference <= -5) {
      return 'advanced'; // Opponent stronger by 5+ levels - harder questions
    } else {
      return 'intermediate'; // Opponent slightly stronger (1-4 levels)
    }
  }

  static getOptimalQuestion(sessionId: string, playerLevel: number, opponentLevel: number): TriviaQuestion {
    const levelDifference = playerLevel - opponentLevel;
    return this.getQuestionForBattleSession(sessionId, levelDifference);
  }

  static recordQuestionResult(sessionId: string, questionId: string, correct: boolean): void {
    // Mock implementation - in real app would track performance for adaptive difficulty
  }

  static getAdaptiveQuestion(sessionId: string, playerLevel: number, opponentLevel: number): TriviaQuestion {
    // Mock implementation for adaptive difficulty based on player performance
    const levelDifference = playerLevel - opponentLevel;
    return this.getQuestionByLevelDifference(levelDifference);
  }
}
