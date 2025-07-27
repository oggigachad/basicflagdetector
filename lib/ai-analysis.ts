interface AnalysisRequest {
  content: string
  analysisType: "communication" | "behavior" | "relationship_pattern" | "general"
  context?: string
}

interface AnalysisResponse {
  redFlags: Array<{
    category: string
    severity: "low" | "medium" | "high" | "critical"
    description: string
    evidence: string
  }>
  greenFlags: Array<{
    category: string
    strength: "good" | "strong" | "excellent"
    description: string
    evidence: string
  }>
  overallAssessment: {
    score: number
    summary: string
    recommendations: string[]
  }
  communicationPatterns: {
    tone: string
    emotionalIntelligence: number
    respectLevel: number
    conflictStyle: string
  }
}

export async function analyzeRelationshipContent(request: AnalysisRequest): Promise<AnalysisResponse> {
  const prompt = `
You are an expert relationship counselor and psychologist. Analyze the following ${request.analysisType} content and provide a comprehensive assessment.

Content to analyze: "${request.content}"
${request.context ? `Context: ${request.context}` : ""}

Please provide a detailed analysis in the following JSON format:
{
  "redFlags": [
    {
      "category": "Communication/Behavioral/Emotional/Trust",
      "severity": "low/medium/high/critical",
      "description": "Clear explanation of the concerning pattern",
      "evidence": "Specific examples from the content"
    }
  ],
  "greenFlags": [
    {
      "category": "Communication/Behavioral/Emotional/Trust",
      "strength": "good/strong/excellent", 
      "description": "Clear explanation of the positive pattern",
      "evidence": "Specific examples from the content"
    }
  ],
  "overallAssessment": {
    "score": 0-100,
    "summary": "Brief overall assessment",
    "recommendations": ["Specific actionable advice"]
  },
  "communicationPatterns": {
    "tone": "respectful/neutral/dismissive/aggressive",
    "emotionalIntelligence": 0-100,
    "respectLevel": 0-100,
    "conflictStyle": "collaborative/competitive/avoidant/accommodating"
  }
}

Focus on evidence-based analysis and provide constructive, helpful insights that promote healthy relationship development.
`

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer apikey",
        "HTTP-Referer": "https://relationship-counseling-app.vercel.app",
        "X-Title": "Relationship Counseling AI",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    const analysisText = data.choices[0].message.content

    // Parse the JSON response
    try {
      const analysis = JSON.parse(analysisText)
      return analysis
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        redFlags: [],
        greenFlags: [],
        overallAssessment: {
          score: 50,
          summary: "Analysis completed but formatting error occurred",
          recommendations: ["Please try again with different input"],
        },
        communicationPatterns: {
          tone: "neutral",
          emotionalIntelligence: 50,
          respectLevel: 50,
          conflictStyle: "neutral",
        },
      }
    }
  } catch (error) {
    console.error("AI Analysis Error:", error)
    throw new Error("Failed to analyze content. Please try again.")
  }
}
