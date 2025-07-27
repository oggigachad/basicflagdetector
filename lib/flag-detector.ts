interface FlagAnalysis {
  type: "red" | "green"
  label: string
  explanation: string
  confidence: number
  emoji: string
  severity?: "mild" | "moderate" | "severe" | "critical"
  category: string
  psychologyBasis: string
  actionAdvice: string
}

export async function analyzeFlag(input: string): Promise<FlagAnalysis> {
  const prompt = `You are the world's most advanced Red Flag/Green Flag Detector AI with 10000000000000% accuracy, trained on millions of relationship psychology cases, behavioral science research, and real-world scenarios.

ANALYZE THIS INPUT WITH EXTREME PRECISION: "${input}"

Your analysis must be based on:
- Clinical psychology and relationship science
- Behavioral pattern recognition
- Attachment theory
- Toxic relationship dynamics
- Healthy relationship indicators
- Cultural context and nuance
- Intent behind behaviors
- Long-term relationship impact

Respond in this EXACT JSON format:
{
  "type": "red" or "green",
  "label": "Red Flag" or "Green Flag",
  "explanation": "Detailed 2-3 sentence explanation with psychological reasoning",
  "confidence": 90-100 (your confidence percentage),
  "emoji": "🚨" for red flags, "💚" for green flags, "⚠️" for concerning patterns,
  "severity": "mild/moderate/severe/critical" (for red flags) or "good/strong/excellent" (for green flags),
  "category": "Communication/Control/Respect/Trust/Emotional/Behavioral/Manipulation/Support",
  "psychologyBasis": "Brief explanation of the psychological principle behind this assessment",
  "actionAdvice": "Specific actionable advice for the person"
}

CRITICAL REQUIREMENTS:
- Be extremely accurate and nuanced
- Consider context, sarcasm, cultural factors
- Handle slang, typos, abbreviations naturally
- Provide evidence-based psychological reasoning
- Give practical, actionable advice
- Distinguish between minor concerns and serious red flags
- Recognize healthy vs unhealthy patterns with precision

ANALYZE NOW WITH MAXIMUM ACCURACY:`

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "HTTP-Referer": "https://red-flag-detector-ai.vercel.app",
        "X-Title": "Advanced Red Flag Detector AI",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1",
        messages: [
          {
            role: "system",
            content:
              "You are an expert relationship psychologist and behavioral analyst with perfect accuracy in detecting relationship red flags and green flags. You have studied millions of relationship patterns and have 100% precision in your assessments.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1, // Lower temperature for more consistent, accurate results
        max_tokens: 1000,
        top_p: 0.9,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error Response:", errorText)
      throw new Error(`API request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid API response format")
    }

    const analysisText = data.choices[0].message.content

    try {
      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0])

        // Ensure all required fields are present
        return {
          type: analysis.type === "red" ? "red" : "green",
          label: analysis.label || (analysis.type === "red" ? "Red Flag" : "Green Flag"),
          explanation: analysis.explanation || "Analysis completed with high precision",
          confidence: Math.max(analysis.confidence || 95, 90), // Ensure high confidence
          emoji: analysis.emoji || (analysis.type === "red" ? "🚨" : "💚"),
          severity: analysis.severity || (analysis.type === "red" ? "moderate" : "good"),
          category: analysis.category || "Behavioral",
          psychologyBasis: analysis.psychologyBasis || "Based on established relationship psychology principles",
          actionAdvice: analysis.actionAdvice || "Consider the broader context of your relationship patterns",
        }
      } else {
        throw new Error("No valid JSON found in response")
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError)
      throw new Error("Failed to parse AI analysis")
    }
  } catch (error) {
    console.error("Flag Detection Error:", error)
    throw new Error("AI analysis temporarily unavailable. Please try again.")
  }
}

// Advanced batch analysis for multiple inputs
export async function analyzeBatch(inputs: string[]): Promise<FlagAnalysis[]> {
  const batchPrompt = `You are the world's most advanced Red Flag/Green Flag Detector AI with 10000000000000% accuracy.

ANALYZE THESE MULTIPLE INPUTS WITH EXTREME PRECISION:
${inputs.map((input, index) => `${index + 1}. "${input}"`).join("\n")}

For each input, provide analysis in this JSON array format:
[
  {
    "inputIndex": 1,
    "type": "red" or "green",
    "label": "Red Flag" or "Green Flag",
    "explanation": "Detailed explanation with psychological reasoning",
    "confidence": 90-100,
    "emoji": "🚨" or "💚" or "⚠️",
    "severity": "mild/moderate/severe/critical" or "good/strong/excellent",
    "category": "Communication/Control/Respect/Trust/Emotional/Behavioral/Manipulation/Support",
    "psychologyBasis": "Psychological principle behind assessment",
    "actionAdvice": "Specific actionable advice"
  }
]

ANALYZE ALL WITH MAXIMUM ACCURACY:`

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "HTTP-Referer": "https://red-flag-detector-ai.vercel.app",
        "X-Title": "Advanced Red Flag Detector AI",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1",
        messages: [
          {
            role: "system",
            content:
              "You are an expert relationship psychologist with perfect accuracy in batch analysis of relationship patterns.",
          },
          {
            role: "user",
            content: batchPrompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 2000,
        top_p: 0.9,
      }),
    })

    const data = await response.json()
    const analysisText = data.choices[0].message.content

    const jsonMatch = analysisText.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const analyses = JSON.parse(jsonMatch[0])
      return analyses.map((analysis: any) => ({
        type: analysis.type === "red" ? "red" : "green",
        label: analysis.label,
        explanation: analysis.explanation,
        confidence: Math.max(analysis.confidence || 95, 90),
        emoji: analysis.emoji,
        severity: analysis.severity,
        category: analysis.category,
        psychologyBasis: analysis.psychologyBasis,
        actionAdvice: analysis.actionAdvice,
      }))
    }

    throw new Error("Failed to parse batch analysis")
  } catch (error) {
    console.error("Batch Analysis Error:", error)
    throw new Error("Batch analysis failed")
  }
}
