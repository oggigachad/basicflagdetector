"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Loader2, Zap, Brain, Target, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react"
import { analyzeFlag, analyzeBatch } from "@/lib/flag-detector"

interface FlagResult {
  type: "red" | "green"
  label: string
  explanation: string
  confidence: number
  emoji: string
  severity?: string
  category: string
  psychologyBasis: string
  actionAdvice: string
}

export default function RedFlagDetectorAI() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<FlagResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [history, setHistory] = useState<Array<{ input: string; result: FlagResult; timestamp: Date }>>([])
  const [batchMode, setBatchMode] = useState(false)
  const [batchInputs, setBatchInputs] = useState<string[]>([""])
  const [batchResults, setBatchResults] = useState<FlagResult[]>([])

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true"
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add("dark")
    }

    // Load history from localStorage
    const savedHistory = localStorage.getItem("flag-analysis-history")
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setHistory(
          parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })),
        )
      } catch (e) {
        console.error("Failed to load history:", e)
      }
    }
  }, [])

  const saveToHistory = (input: string, result: FlagResult) => {
    const newEntry = { input, result, timestamp: new Date() }
    const newHistory = [newEntry, ...history.slice(0, 9)] // Keep last 10
    setHistory(newHistory)
    localStorage.setItem("flag-analysis-history", JSON.stringify(newHistory))
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleAnalyze = async () => {
    if (!input.trim()) return

    setIsAnalyzing(true)
    setResult(null)

    try {
      const analysis = await analyzeFlag(input.trim())
      setResult(analysis)
      saveToHistory(input.trim(), analysis)
    } catch (err) {
      console.error("Analysis error:", err)
      setResult({
        type: "red",
        label: "Analysis Error",
        explanation: "Failed to analyze input. Please check your connection and try again.",
        confidence: 0,
        emoji: "⚠️",
        category: "System",
        psychologyBasis: "Technical error occurred",
        actionAdvice: "Please try again in a moment",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleBatchAnalyze = async () => {
    const validInputs = batchInputs.filter((input) => input.trim())
    if (validInputs.length === 0) return

    setIsAnalyzing(true)
    setBatchResults([])

    try {
      const analyses = await analyzeBatch(validInputs)
      setBatchResults(analyses)
    } catch (err) {
      console.error("Batch analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const addBatchInput = () => {
    setBatchInputs([...batchInputs, ""])
  }

  const updateBatchInput = (index: number, value: string) => {
    const newInputs = [...batchInputs]
    newInputs[index] = value
    setBatchInputs(newInputs)
  }

  const removeBatchInput = (index: number) => {
    if (batchInputs.length > 1) {
      setBatchInputs(batchInputs.filter((_, i) => i !== index))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      if (batchMode) {
        handleBatchAnalyze()
      } else {
        handleAnalyze()
      }
    }
  }

  const getSeverityColor = (severity: string, type: string) => {
    if (type === "red") {
      switch (severity) {
        case "critical":
          return "bg-red-600 text-white"
        case "severe":
          return "bg-red-500 text-white"
        case "moderate":
          return "bg-red-400 text-white"
        case "mild":
          return "bg-red-300 text-red-800"
        default:
          return "bg-red-400 text-white"
      }
    } else {
      switch (severity) {
        case "excellent":
          return "bg-green-600 text-white"
        case "strong":
          return "bg-green-500 text-white"
        case "good":
          return "bg-green-400 text-white"
        default:
          return "bg-green-400 text-white"
      }
    }
  }

  const exampleInputs = [
    "He said 'you're not like other girls' on our first date",
    "She doesn't reply for days but posts stories on social media",
    "They always communicate openly and respect my boundaries",
    "I don't like when my partner talks to their ex",
    "He always asks how I feel and genuinely listens to my responses",
    "She checks my phone when I'm sleeping and gets angry about my messages",
    "He remembers small details about my day and asks thoughtful follow-up questions",
    "They get visibly upset when I spend time with my friends without them",
    "She supports my career goals even when it means less time together",
    "He makes jokes that put me down in front of other people",
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Brain className="h-10 w-10 text-purple-600" />
              <Zap className="h-5 w-5 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <h1
              className={`text-5xl font-bold bg-gradient-to-r from-red-500 to-green-500 bg-clip-text text-transparent`}
            >
              AI Red Flag Detector
            </h1>
          </div>
          <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto mb-4`}>
            🚩✅ <strong>10000000000000% AI-Powered Accuracy</strong> - Advanced relationship psychology analysis with
            clinical precision
          </p>

          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              DeepSeek AI Powered
            </Badge>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              Clinical Psychology Based
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className={`${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800" : ""}`}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className={`flex rounded-lg p-1 ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
            <Button
              variant={!batchMode ? "default" : "ghost"}
              onClick={() => setBatchMode(false)}
              className="rounded-md"
            >
              Single Analysis
            </Button>
            <Button variant={batchMode ? "default" : "ghost"} onClick={() => setBatchMode(true)} className="rounded-md">
              Batch Analysis
            </Button>
          </div>
        </div>

        {/* Single Analysis Mode */}
        {!batchMode && (
          <Card className={`mb-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                    Enter behavior, statement, or situation for AI analysis:
                  </label>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="e.g., 'He always checks my phone when I'm not looking' or 'She remembers small details about my conversations'"
                    className={`min-h-[120px] text-base ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Press Ctrl+Enter for instant AI analysis
                  </p>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!input.trim() || isAnalyzing}
                  className={`w-full text-lg py-6 ${
                    isAnalyzing
                      ? "bg-gray-400"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  } text-white font-semibold`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      AI Analyzing with Maximum Precision...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      Analyze with AI (10000000000000% Accuracy)
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Batch Analysis Mode */}
        {batchMode && (
          <Card className={`mb-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className={`${darkMode ? "text-white" : "text-gray-900"}`}>Batch AI Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {batchInputs.map((input, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => updateBatchInput(index, e.target.value)}
                    placeholder={`Input ${index + 1}: Enter behavior or statement...`}
                    className={`flex-1 min-h-[80px] ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  {batchInputs.length > 1 && (
                    <Button variant="outline" onClick={() => removeBatchInput(index)} className="self-start">
                      ✕
                    </Button>
                  )}
                </div>
              ))}

              <div className="flex gap-2">
                <Button variant="outline" onClick={addBatchInput}>
                  + Add Input
                </Button>
                <Button
                  onClick={handleBatchAnalyze}
                  disabled={batchInputs.filter((i) => i.trim()).length === 0 || isAnalyzing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Batch...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analyze All
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Single Result Display */}
        {result && !batchMode && (
          <Card
            className={`mb-6 border-2 ${
              result.type === "red"
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-green-500 bg-green-50 dark:bg-green-900/20"
            }`}
          >
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="text-8xl">{result.emoji}</div>
                <div>
                  <h2
                    className={`text-3xl font-bold mb-2 ${
                      result.type === "red" ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"
                    }`}
                  >
                    {result.type === "red" ? "🟥" : "🟩"} {result.label}
                  </h2>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Badge className={getSeverityColor(result.severity || "", result.type)}>{result.severity}</Badge>
                    <Badge variant="outline" className="border-purple-300 text-purple-700">
                      {result.category}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700">{result.confidence}% Confidence</Badge>
                  </div>
                </div>

                <div className="space-y-4 text-left max-w-2xl mx-auto">
                  <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} border`}>
                    <h3
                      className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Analysis
                    </h3>
                    <p
                      className={`${result.type === "red" ? "text-red-800 dark:text-red-200" : "text-green-800 dark:text-green-200"}`}
                    >
                      {result.explanation}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} border`}>
                    <h3
                      className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      <Brain className="h-4 w-4" />
                      Psychology Basis
                    </h3>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>{result.psychologyBasis}</p>
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} border`}>
                    <h3
                      className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      <Lightbulb className="h-4 w-4" />
                      Action Advice
                    </h3>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>{result.actionAdvice}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Batch Results Display */}
        {batchResults.length > 0 && batchMode && (
          <div className="space-y-4 mb-6">
            <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Batch Analysis Results
            </h2>
            {batchResults.map((result, index) => (
              <Card
                key={index}
                className={`border-l-4 ${
                  result.type === "red"
                    ? "border-l-red-500 bg-red-50 dark:bg-red-900/10"
                    : "border-l-green-500 bg-green-50 dark:bg-green-900/10"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{result.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3
                          className={`text-lg font-bold ${result.type === "red" ? "text-red-700" : "text-green-700"}`}
                        >
                          {result.type === "red" ? "🟥" : "🟩"} {result.label}
                        </h3>
                        <Badge className={getSeverityColor(result.severity || "", result.type)}>
                          {result.severity}
                        </Badge>
                        <Badge variant="outline">{result.category}</Badge>
                      </div>
                      <p className={`mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <strong>Input:</strong> "{batchInputs[index]}"
                      </p>
                      <p
                        className={`${result.type === "red" ? "text-red-800 dark:text-red-200" : "text-green-800 dark:text-green-200"}`}
                      >
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Example Inputs */}
        {!result && !batchMode && (
          <Card className={`mb-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
            <CardContent className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                💭 Try these AI-optimized examples:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exampleInputs.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(example)}
                    className={`text-left p-3 rounded-lg border transition-colors hover:scale-105 transform ${
                      darkMode
                        ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis History */}
        {history.length > 0 && (
          <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                <TrendingUp className="h-5 w-5" />
                AI Analysis History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      darkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{item.result.emoji}</span>
                      <div className="flex-1">
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>"{item.input}"</p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(item.result.severity || "", item.result.type)}>
                            {item.result.type === "red" ? "🟥" : "🟩"} {item.result.label}
                          </Badge>
                          <Badge variant="outline">{item.result.category}</Badge>
                          <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {item.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {item.result.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className={`text-center mt-8 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          <p>🔥 Powered by DeepSeek AI • 10000000000000% Accuracy • Clinical Psychology Based</p>
          <p className="mt-1">💡 Advanced behavioral analysis • Always trust your instincts alongside AI insights</p>
        </div>
      </div>
    </div>
  )
}
