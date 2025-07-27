"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Target, BookOpen, Users, MessageCircle, Heart } from "lucide-react"
import { useState } from "react"

interface ActionPlanProps {
  scores: {
    emotional: number
    communication: number
    values: number
    goals: number
    conflict: number
    growth: number
  }
  flags: {
    green: string[]
    red: string[]
  }
}

export default function ActionPlan({ scores, flags }: ActionPlanProps) {
  const [completedActions, setCompletedActions] = useState<string[]>([])

  const toggleAction = (actionId: string) => {
    setCompletedActions((prev) =>
      prev.includes(actionId) ? prev.filter((id) => id !== actionId) : [...prev, actionId],
    )
  }

  const actionCategories = [
    {
      title: "Immediate Actions (This Week)",
      icon: Target,
      color: "text-red-600",
      bgColor: "bg-red-50",
      actions: [
        {
          id: "daily-checkin",
          title: "Daily Emotional Check-ins",
          description: "Spend 10 minutes each evening sharing how you felt during the day",
          priority: "High",
          timeframe: "7 days",
        },
        {
          id: "active-listening",
          title: "Practice Active Listening",
          description: "Focus on listening without planning your response during conversations",
          priority: "High",
          timeframe: "Ongoing",
        },
        {
          id: "appreciation-exercise",
          title: "Daily Appreciation",
          description: "Share one specific thing you appreciate about your partner each day",
          priority: "Medium",
          timeframe: "7 days",
        },
      ],
    },
    {
      title: "Short-term Goals (This Month)",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      actions: [
        {
          id: "conflict-strategy",
          title: "Develop Conflict Resolution Strategy",
          description: "Create agreed-upon rules for handling disagreements constructively",
          priority: "High",
          timeframe: "2 weeks",
        },
        {
          id: "future-planning",
          title: "Future Planning Session",
          description: "Schedule dedicated time to discuss long-term goals and dreams",
          priority: "Medium",
          timeframe: "3 weeks",
        },
        {
          id: "communication-workshop",
          title: "Communication Skills Workshop",
          description: "Attend a couples communication workshop or online course together",
          priority: "Medium",
          timeframe: "4 weeks",
        },
      ],
    },
    {
      title: "Long-term Development (Next 3 Months)",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
      actions: [
        {
          id: "relationship-book",
          title: "Read Relationship Book Together",
          description: "Choose and discuss a relationship development book chapter by chapter",
          priority: "Medium",
          timeframe: "8 weeks",
        },
        {
          id: "couples-therapy",
          title: "Consider Couples Counseling",
          description: "Explore professional guidance for continued growth and development",
          priority: "Low",
          timeframe: "12 weeks",
        },
        {
          id: "relationship-rituals",
          title: "Establish Relationship Rituals",
          description: "Create meaningful traditions and regular connection practices",
          priority: "Medium",
          timeframe: "6 weeks",
        },
      ],
    },
  ]

  const resources = [
    {
      title: "Communication Guides",
      icon: MessageCircle,
      items: [
        "The 5 Love Languages Assessment",
        "Nonviolent Communication Techniques",
        "Active Listening Exercises",
        "Conflict Resolution Scripts",
      ],
    },
    {
      title: "Relationship Building",
      icon: Heart,
      items: [
        "Weekly Date Night Ideas",
        "Intimacy Building Exercises",
        "Trust Building Activities",
        "Emotional Connection Games",
      ],
    },
    {
      title: "Professional Support",
      icon: Users,
      items: [
        "Find Local Couples Therapists",
        "Online Relationship Courses",
        "Support Group Resources",
        "Relationship Coaching Options",
      ],
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700"
      case "Medium":
        return "bg-yellow-100 text-yellow-700"
      case "Low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Personalized Action Plan</CardTitle>
          <p className="text-gray-600">Structured steps to strengthen your relationship based on your assessment</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {actionCategories.reduce((sum, cat) => sum + cat.actions.length, 0)}
              </div>
              <div className="text-sm text-blue-600">Total Actions</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedActions.length}</div>
              <div className="text-sm text-green-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(
                  (completedActions.length / actionCategories.reduce((sum, cat) => sum + cat.actions.length, 0)) * 100,
                ) || 0}
                %
              </div>
              <div className="text-sm text-purple-600">Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {actionCategories.map((category, categoryIndex) => {
        const Icon = category.icon
        return (
          <Card key={categoryIndex} className={`${category.bgColor} border-l-4 border-l-current`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${category.color}`}>
                <Icon className="h-5 w-5" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.actions.map((action) => (
                  <div key={action.id} className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                    <Checkbox
                      checked={completedActions.includes(action.id)}
                      onCheckedChange={() => toggleAction(action.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{action.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(action.priority)}>{action.priority}</Badge>
                          <Badge variant="outline">{action.timeframe}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <p className="text-gray-600">Helpful tools and materials to support your relationship journey</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => {
              const Icon = resource.icon
              return (
                <Card key={index} className="bg-gray-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className="h-5 w-5" />
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resource.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
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

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Ready to Get Started?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Remember, building a strong relationship is a journey, not a destination. Take these actions one step at a
              time and celebrate your progress along the way.
            </p>
            <div className="flex justify-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">Schedule First Action</Button>
              <Button variant="outline">Download Action Plan</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
