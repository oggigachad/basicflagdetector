"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"

interface AssessmentFormProps {
  onComplete: (data: any) => void
}

export default function AssessmentForm({ onComplete }: AssessmentFormProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})

  const sections = [
    {
      title: "Communication Patterns",
      questions: [
        {
          id: "listening",
          text: "How well does your partner listen when you share your thoughts and feelings?",
          type: "scale",
          options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
        },
        {
          id: "conflict_resolution",
          text: "When you disagree, how do you typically resolve conflicts?",
          type: "multiple",
          options: [
            "We discuss calmly and find solutions together",
            "One person usually gives in to avoid conflict",
            "We argue but eventually work it out",
            "Conflicts often go unresolved",
            "We avoid discussing disagreements",
          ],
        },
        {
          id: "communication_frequency",
          text: "How satisfied are you with the frequency and quality of your communication?",
          type: "scale",
          options: ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"],
        },
      ],
    },
    {
      title: "Emotional Connection",
      questions: [
        {
          id: "emotional_support",
          text: "How supported do you feel by your partner during difficult times?",
          type: "scale",
          options: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
        },
        {
          id: "empathy",
          text: "How well does your partner understand and validate your emotions?",
          type: "scale",
          options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
        },
        {
          id: "emotional_expression",
          text: "How comfortable do you feel expressing vulnerable emotions with your partner?",
          type: "scale",
          options: ["Very Uncomfortable", "Uncomfortable", "Neutral", "Comfortable", "Very Comfortable"],
        },
      ],
    },
    {
      title: "Values & Goals",
      questions: [
        {
          id: "core_values",
          text: "How aligned are your core values (family, career, lifestyle, etc.)?",
          type: "scale",
          options: ["Not aligned", "Slightly aligned", "Moderately aligned", "Well aligned", "Perfectly aligned"],
        },
        {
          id: "future_goals",
          text: "How compatible are your long-term life goals?",
          type: "scale",
          options: ["Incompatible", "Somewhat incompatible", "Neutral", "Compatible", "Very compatible"],
        },
        {
          id: "priorities",
          text: "What matters most to both of you in your relationship?",
          type: "text",
          placeholder: "Share your thoughts on shared priorities and values...",
        },
      ],
    },
  ]

  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0)
  const answeredQuestions = Object.keys(responses).length
  const progress = (answeredQuestions / totalQuestions) * 100

  const handleResponse = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))
  }

  const canProceed = () => {
    const currentQuestions = sections[currentSection].questions
    return currentQuestions.every((q) => responses[q.id])
  }

  const handleComplete = () => {
    onComplete(responses)
  }

  const currentSectionData = sections[currentSection]

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Relationship Assessment</CardTitle>
            <div className="text-sm text-gray-500">
              Section {currentSection + 1} of {sections.length}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-6 text-center">{currentSectionData.title}</h3>

            <div className="space-y-8">
              {currentSectionData.questions.map((question, index) => (
                <div key={question.id} className="space-y-4">
                  <h4 className="font-medium text-lg">
                    {index + 1}. {question.text}
                  </h4>

                  {question.type === "scale" && (
                    <RadioGroup
                      value={responses[question.id] || ""}
                      onValueChange={(value) => handleResponse(question.id, value)}
                      className="space-y-2"
                    >
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                          <Label htmlFor={`${question.id}-${optionIndex}`} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === "multiple" && (
                    <RadioGroup
                      value={responses[question.id] || ""}
                      onValueChange={(value) => handleResponse(question.id, value)}
                      className="space-y-2"
                    >
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                          <Label htmlFor={`${question.id}-${optionIndex}`} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === "text" && (
                    <Textarea
                      value={responses[question.id] || ""}
                      onChange={(e) => handleResponse(question.id, e.target.value)}
                      placeholder={question.placeholder}
                      className="min-h-[100px]"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentSection((prev) => prev - 1)}
              disabled={currentSection === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentSection < sections.length - 1 ? (
              <Button
                onClick={() => setCurrentSection((prev) => prev + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                Complete Assessment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
