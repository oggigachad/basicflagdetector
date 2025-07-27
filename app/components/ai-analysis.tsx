"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Brain, AlertTriangle, CheckCircle, MessageCircle, TrendingUp } from "lucide-react"
import { analyzeRelationshipContent } from "@/lib/ai-analysis"

interface AnalysisResult {
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

export default function AIAnalysis() {
  const [content, setContent] = useState("")
  const [analysisType, setAnalysisType] = useState<"communication" | "behavior" | "relationship_pattern" | "general">(
    "general",
  )
  const [context, setContext] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!content.trim()) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const analysis = await analyzeRelationshipContent({
        content,
        analysisType,
        context: context || undefined,
      })
      setResult(analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "excellent":
        return "bg-green-500 text-white"
      case "strong":
        return "bg-green-100 text-green-700"
      case "good":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            AI-Powered Relationship Analysis
          </CardTitle>
          <p className="text-gray-600">
            Analyze conversations, messages, or behavioral descriptions to identify relationship patterns and insights
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Analysis Type</label>
              <Select value={analysisType} onValueChange={(value: any) => setAnalysisType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Relationship Analysis</SelectItem>
                  <SelectItem value="communication">Communication Patterns</SelectItem>
                  <SelectItem value="behavior">Behavioral Analysis</SelectItem>
                  <SelectItem value="relationship_pattern">Relationship Patterns</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Content to Analyze
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste chat messages, describe behaviors, or share relationship situations you'd like analyzed..."
                className="min-h-[120px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Context (Optional)</label>
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Provide any additional context about the relationship, situation, or specific concerns..."
                className="min-h-[80px]"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!content.trim() || isAnalyzing}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Content
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Overall Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Overall Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Relationship Health Score</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{result.overallAssessment.score}%</span>
                    <Badge
                      className={
                        result.overallAssessment.score >= 70
                          ? "bg-green-100 text-green-700"
                          : result.overallAssessment.score >= 50
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }
                    >
                      {result.overallAssessment.score >= 70
                        ? "Healthy"
                        : result.overallAssessment.score >= 50
                          ? "Needs Work"
                          : "Concerning"}
                    </Badge>
                  </div>
                </div>
                <Progress value={result.overallAssessment.score} className="h-3" />
                <p className="text-gray-600">{result.overallAssessment.summary}</p>

                {result.overallAssessment.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Key Recommendations:</h4>
                    <ul className="space-y-1">
                      {result.overallAssessment.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Communication Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Communication Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Emotional Intelligence</span>
                      <span className="text-sm">{result.communicationPatterns.emotionalIntelligence}%</span>
                    </div>
                    <Progress value={result.communicationPatterns.emotionalIntelligence} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Respect Level</span>
                      <span className="text-sm">{result.communicationPatterns.respectLevel}%</span>
                    </div>
                    <Progress value={result.communicationPatterns.respectLevel} className="h-2" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Communication Tone</span>
                    <Badge className="ml-2 capitalize">{result.communicationPatterns.tone}</Badge>
                  </div>

                  <div>
                    <span className="text-sm font-medium">Conflict Style</span>
                    <Badge className="ml-2 capitalize">{result.communicationPatterns.conflictStyle}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Red Flags */}
          {result.redFlags.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Areas of Concern ({result.redFlags.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.redFlags.map((flag, index) => (
                    <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-red-800">{flag.category}</h4>
                        <Badge className={getSeverityColor(flag.severity)}>{flag.severity}</Badge>
                      </div>
                      <p className="text-sm text-red-700 mb-2">{flag.description}</p>
                      <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
                        <strong>Evidence:</strong> {flag.evidence}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Green Flags */}
          {result.greenFlags.length > 0 && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Positive Indicators ({result.greenFlags.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.greenFlags.map((flag, index) => (
                    <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-green-800">{flag.category}</h4>
                        <Badge className={getStrengthColor(flag.strength)}>{flag.strength}</Badge>
                      </div>
                      <p className="text-sm text-green-700 mb-2">{flag.description}</p>
                      <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
                        <strong>Evidence:</strong> {flag.evidence}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
