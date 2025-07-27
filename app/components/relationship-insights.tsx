"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Lightbulb, TrendingUp, Heart, AlertCircle, CheckCircle, Users } from "lucide-react"

interface RelationshipInsightsProps {
  data: any
  scores: {
    emotional: number
    communication: number
    values: number
    goals: number
    conflict: number
    growth: number
  }
}

export default function RelationshipInsights({ data, scores }: RelationshipInsightsProps) {
  const insights = [
    {
      category: "Communication Strengths",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      items: [
        "Active listening during important conversations",
        "Respectful tone even during disagreements",
        "Regular check-ins about relationship satisfaction",
        "Open expression of appreciation and gratitude",
      ],
    },
    {
      category: "Growth Opportunities",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      items: [
        "Improve response time to emotional needs",
        "Develop shared conflict resolution strategies",
        "Create more structured time for deep conversations",
        "Practice expressing vulnerability more openly",
      ],
    },
    {
      category: "Emotional Connection",
      icon: Heart,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      items: [
        "Strong empathy and emotional validation",
        "Consistent support during challenging times",
        "Healthy balance of independence and togetherness",
        "Mutual celebration of achievements and milestones",
      ],
    },
    {
      category: "Areas Needing Attention",
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      items: [
        "Different communication styles during stress",
        "Misaligned expectations about future planning",
        "Need for clearer boundaries with extended family",
        "Different approaches to financial decision-making",
      ],
    },
  ]

  const compatibilityPredictions = [
    {
      area: "Long-term Compatibility",
      score: 82,
      description: "Strong foundation with shared values and mutual respect",
    },
    {
      area: "Conflict Resolution Potential",
      score: 75,
      description: "Good skills with room for improvement in stress management",
    },
    {
      area: "Emotional Intimacy Growth",
      score: 88,
      description: "Excellent capacity for deeper emotional connection",
    },
    {
      area: "Life Goals Alignment",
      score: 70,
      description: "Generally compatible with some areas to discuss further",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            Relationship Insights & Analysis
          </CardTitle>
          <p className="text-gray-600">Personalized insights based on your assessment responses</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <Card key={index} className={`${insight.bgColor} border-l-4 border-l-current`}>
                  <CardHeader className="pb-3">
                    <CardTitle className={`flex items-center gap-2 text-lg ${insight.color}`}>
                      <Icon className="h-5 w-5" />
                      {insight.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {insight.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Compatibility Predictions
          </CardTitle>
          <p className="text-gray-600">Future relationship potential based on current patterns</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {compatibilityPredictions.map((prediction, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{prediction.area}</h4>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {prediction.score}%
                  </Badge>
                </div>
                <Progress value={prediction.score} className="h-2" />
                <p className="text-sm text-gray-600">{prediction.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Relationship Timeline Projection</CardTitle>
          <p className="text-gray-600">Potential milestones and growth opportunities</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                1M
              </div>
              <div>
                <h4 className="font-medium">Next Month</h4>
                <p className="text-sm text-gray-600">Focus on improving daily communication patterns</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                3M
              </div>
              <div>
                <h4 className="font-medium">3 Months</h4>
                <p className="text-sm text-gray-600">Establish shared goals and future planning discussions</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                6M
              </div>
              <div>
                <h4 className="font-medium">6 Months</h4>
                <p className="text-sm text-gray-600">Reassess compatibility and celebrate growth achievements</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
