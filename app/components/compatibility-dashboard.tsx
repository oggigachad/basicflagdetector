"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Target, Users, Zap, TrendingUp } from "lucide-react"

interface CompatibilityScores {
  emotional: number
  communication: number
  values: number
  goals: number
  conflict: number
  growth: number
}

interface CompatibilityDashboardProps {
  scores: CompatibilityScores
}

export default function CompatibilityDashboard({ scores }: CompatibilityDashboardProps) {
  const categories = [
    {
      key: "emotional",
      label: "Emotional Connection",
      icon: Heart,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
    },
    {
      key: "communication",
      label: "Communication",
      icon: MessageCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      key: "values",
      label: "Values Alignment",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      key: "goals",
      label: "Life Goals",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      key: "conflict",
      label: "Conflict Resolution",
      icon: Users,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      key: "growth",
      label: "Growth Potential",
      icon: Zap,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
  ]

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "bg-green-500" }
    if (score >= 70) return { label: "Good", color: "bg-blue-500" }
    if (score >= 60) return { label: "Fair", color: "bg-yellow-500" }
    return { label: "Needs Work", color: "bg-red-500" }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Compatibility Analysis</CardTitle>
          <p className="text-center text-gray-600">Comprehensive assessment across key relationship dimensions</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const score = scores[category.key as keyof CompatibilityScores]
              const level = getScoreLevel(score)
              const Icon = category.icon

              return (
                <Card key={category.key} className={`${category.bgColor} ${category.borderColor}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className={`flex items-center gap-2 text-lg ${category.color}`}>
                      <Icon className="h-5 w-5" />
                      {category.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{score}%</span>
                        <Badge className={`${level.color} text-white`}>{level.label}</Badge>
                      </div>
                      <Progress value={score} className="h-2" />
                      <div className="text-sm text-gray-600">
                        {score >= 80 && "Strong compatibility in this area"}
                        {score >= 70 && score < 80 && "Good foundation with room for growth"}
                        {score >= 60 && score < 70 && "Some challenges to work through"}
                        {score < 60 && "Significant attention needed"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Relationship Health Timeline</CardTitle>
          <p className="text-gray-600">Track your progress over time</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Communication Breakthrough</p>
                  <p className="text-sm text-gray-600">Improved active listening skills</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">2 weeks ago</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Values Alignment Session</p>
                  <p className="text-sm text-gray-600">Discussed future goals and priorities</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">1 month ago</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Initial Assessment</p>
                  <p className="text-sm text-gray-600">Baseline compatibility evaluation</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">2 months ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
