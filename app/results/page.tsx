"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { Message } from "../types"
import { SummarySection } from "../components/SummarySection"
import { ChatSection } from "../components/ChatSection"
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const router = useRouter();
  const [articleContent, setArticleContent] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'summary' | 'chat'>('summary')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const fetchContent = async () => {
      const url = localStorage.getItem("url")
      if (!url) {
        router.push(`/`);
      }

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setArticleContent(data.content)
        setSuggestedQuestions(data.questions || [])
        setMessages([{ type: "ai", content: "Hi, you can ask me anything about the article." }])
      } catch (error) {
        console.error("Error fetching content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [])

  const handleQuery = async (message: string) => {
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, content: articleContent }),
      })
      const data = await response.json()
      setMessages((prev) => [...prev, { type: "ai", content: data.message }])
    } catch (error) {
      console.error("Error querying API:", error)
      setMessages((prev) => [
        ...prev,
        { type: "system", content: "Error processing your request. Please try again." },
      ])
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { type: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsChatLoading(true)

    try {
      await handleQuery(input)
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleQuestionClick = async (question: string) => {
    setMessages((prev) => [...prev, { type: "user", content: question }])
    setIsChatLoading(true)
    try {
      await handleQuery(question)
    } finally {
      setIsChatLoading(false)
    }
  }

  return (
    <div>
      {/* Mobile Tabs */}
      <div className="md:hidden bg-white flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === 'summary'
              ? 'text-[#FF906D] border-b-2 border-[#FF906D]'
              : 'text-gray-500'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === 'chat'
              ? 'text-[#FF906D] border-b-2 border-[#FF906D]'
              : 'text-gray-500'
          }`}
        >
          Chat
        </button>
      </div>

      {/* Content */}
      <div className="hidden md:grid md:grid-cols-2 gap-6 pt-4">
        {/* Left side - Summary */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col h-[calc(100vh-180px)]">
          <div className="border-t border-gray-100 p-4 px-6">
            <h2 className="text-xl font-semibold">Summary</h2>
          </div>
          <SummarySection
            isLoading={isLoading}
            articleContent={articleContent}
            suggestedQuestions={suggestedQuestions}
            onQuestionClick={(question) => {
              handleQuestionClick(question);
              setActiveTab('chat');
            }}
          />
        </div>

        {/* Right side - Chat */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col h-[calc(100vh-180px)]">
          <div className="border-t border-gray-100 p-4 px-6">
            <h2 className="text-xl font-semibold">Chat</h2>
          </div>
          <ChatSection
            messages={messages}
            isLoading={isChatLoading}
            input={input}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            messagesEndRef={messagesEndRef}
          />
        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden bg-white">
        {activeTab === 'summary' && (
          <div className="rounded-lg shadow-sm flex flex-col h-[calc(100vh-150px)]">
            <SummarySection
              isLoading={isLoading}
              articleContent={articleContent}
              suggestedQuestions={suggestedQuestions}
              onQuestionClick={(question) => {
                handleQuestionClick(question);
                setActiveTab('chat');
              }}
              isSmall={true}
            />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="rounded-lg shadow-sm flex flex-col h-[calc(100vh-150px)]">
            <ChatSection
              messages={messages}
              isLoading={isChatLoading}
              input={input}
              onInputChange={setInput}
              onSubmit={handleSubmit}
              messagesEndRef={messagesEndRef}
              isSmall={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}
