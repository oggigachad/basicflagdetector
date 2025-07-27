interface FlagAnalysis {
  type: "red" | "green"
  label: string
  explanation: string
  confidence: number
  emoji: string
}

// Comprehensive offline analysis patterns
const redFlagPatterns = [
  // Control and manipulation
  {
    keywords: ["control", "controlling", "won't let", "forbid", "not allowed", "permission"],
    category: "Control",
    explanation: "Controlling behavior restricts your freedom and autonomy, which is unhealthy in relationships.",
    severity: 90,
  },
  {
    keywords: ["manipulate", "manipulating", "guilt trip", "emotional blackmail", "threatens"],
    category: "Manipulation",
    explanation: "Manipulation tactics are used to control your emotions and decisions, which is toxic behavior.",
    severity: 95,
  },

  // Communication issues
  {
    keywords: ["silent treatment", "ignores", "won't talk", "shuts down", "stonewalling"],
    category: "Communication",
    explanation: "Refusing to communicate or giving silent treatment is an unhealthy way to handle conflicts.",
    severity: 75,
  },
  {
    keywords: ["yells", "screams", "shouts", "aggressive", "hostile", "verbally abusive"],
    category: "Communication",
    explanation: "Aggressive communication and verbal abuse are serious red flags that indicate toxic behavior.",
    severity: 95,
  },

  // Jealousy and possessiveness
  {
    keywords: ["jealous", "possessive", "checks phone", "stalks", "follows", "suspicious"],
    category: "Jealousy",
    explanation: "Excessive jealousy and possessive behavior indicate insecurity and potential controlling tendencies.",
    severity: 85,
  },

  // Disrespect
  {
    keywords: ["disrespects", "puts down", "insults", "belittles", "humiliates", "embarrasses"],
    category: "Disrespect",
    explanation: "Disrespectful behavior and put-downs are harmful to self-esteem and relationship health.",
    severity: 90,
  },

  // Dishonesty
  {
    keywords: ["lies", "lying", "dishonest", "cheats", "cheating", "hides", "secretive"],
    category: "Dishonesty",
    explanation: "Dishonesty and deception break down trust, which is fundamental to healthy relationships.",
    severity: 85,
  },

  // Specific phrases
  {
    keywords: ["not like other girls", "you're different", "all my exes were crazy"],
    category: "Manipulation",
    explanation: "These phrases are classic manipulation tactics that put others down to make you feel special.",
    severity: 80,
  },
]

const greenFlagPatterns = [
  // Communication
  {
    keywords: ["listens", "listening", "asks questions", "remembers", "communicates", "talks openly"],
    category: "Communication",
    explanation: "Active listening and open communication are foundations of healthy relationships.",
    strength: 90,
  },
  {
    keywords: ["respects boundaries", "gives space", "understands", "patient", "supportive"],
    category: "Respect",
    explanation: "Respecting boundaries and being supportive shows emotional maturity and care.",
    strength: 95,
  },

  // Emotional support
  {
    keywords: ["supports", "encouraging", "celebrates", "proud", "believes in", "cheers"],
    category: "Support",
    explanation: "Being supportive and celebrating your achievements shows genuine care and partnership.",
    strength: 90,
  },
  {
    keywords: ["empathetic", "understanding", "validates", "comforts", "there for"],
    category: "Empathy",
    explanation: "Empathy and emotional validation are crucial for deep, meaningful connections.",
    strength: 95,
  },

  // Trust and honesty
  {
    keywords: ["honest", "truthful", "transparent", "trustworthy", "reliable", "consistent"],
    category: "Trust",
    explanation: "Honesty and reliability build the foundation of trust necessary for healthy relationships.",
    strength: 95,
  },

  // Growth and compromise
  {
    keywords: ["compromises", "works together", "grows", "learns", "apologizes", "changes"],
    category: "Growth",
    explanation: "Willingness to compromise and grow together shows maturity and commitment to the relationship.",
    strength: 85,
  },
]

export function analyzeOffline(input: string): FlagAnalysis {
  const lowerInput = input.toLowerCase()

  // Check for red flags
  let bestRedMatch = { score: 0, pattern: null as any }
  for (const pattern of redFlagPatterns) {
    const matches = pattern.keywords.filter((keyword) => lowerInput.includes(keyword))
    const score = matches.length * pattern.severity
    if (score > bestRedMatch.score) {
      bestRedMatch = { score, pattern }
    }
  }

  // Check for green flags
  let bestGreenMatch = { score: 0, pattern: null as any }
  for (const pattern of greenFlagPatterns) {
    const matches = pattern.keywords.filter((keyword) => lowerInput.includes(keyword))
    const score = matches.length * pattern.strength
    if (score > bestGreenMatch.score) {
      bestGreenMatch = { score, pattern }
    }
  }

  // Determine result
  if (bestRedMatch.score > bestGreenMatch.score && bestRedMatch.score > 0) {
    return {
      type: "red",
      label: "Red Flag",
      explanation: bestRedMatch.pattern.explanation,
      confidence: Math.min(bestRedMatch.pattern.severity, 95),
      emoji: "🚨",
    }
  } else if (bestGreenMatch.score > 0) {
    return {
      type: "green",
      label: "Green Flag",
      explanation: bestGreenMatch.pattern.explanation,
      confidence: Math.min(bestGreenMatch.pattern.strength, 95),
      emoji: "💚",
    }
  } else {
    // Neutral/unclear input
    const neutralPhrases = [
      "This behavior seems neutral - consider the broader context of your relationship.",
      "Without more context, this appears to be a normal relationship interaction.",
      "This seems like typical relationship communication - look for patterns over time.",
    ]

    return {
      type: "green",
      label: "Neutral/Unclear",
      explanation: neutralPhrases[Math.floor(Math.random() * neutralPhrases.length)],
      confidence: 60,
      emoji: "🤔",
    }
  }
}
