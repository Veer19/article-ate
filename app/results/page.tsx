"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send } from "lucide-react"
import { useSearchParams } from "next/navigation"
import ReactMarkdown from 'react-markdown'

interface Message {
  type: "user" | "ai" | "system";
  content: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [articleContent, setArticleContent] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'summary' | 'chat'>('summary')
  const url = searchParams.get("url")

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        })
        const data = await response.json()
        if (data.content) {
          setArticleContent(data.content)
          setSuggestedQuestions(data.questions || [])
          setMessages([{ type: "ai", content: "Hi, you can ask me anything about the article." }])
        }
      } catch (error) {
        console.error("Error fetching content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [searchParams, url])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom, messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { type: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsChatLoading(true)

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input, content: articleContent }),
      })
      const data = await response.json()
      console.log(data)
      setMessages((prev) => [...prev, { type: "ai", content: data.message }])
    } catch (error) {
      console.error("Error querying API:", error)
      setMessages((prev) => [
        ...prev,
        { type: "system", content: "Error processing your request. Please try again." },
      ])
    } finally {
      setIsChatLoading(false)
    }
  }

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
      console.log(data)
      setMessages((prev) => [...prev, { type: "ai", content: data.message }])
    } catch (error) {
      console.error("Error querying API:", error)
      setMessages((prev) => [
        ...prev,
        { type: "system", content: "Error processing your request. Please try again." },
      ])
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
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-500'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === 'chat'
              ? 'text-orange-600 border-b-2 border-orange-600'
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
          <hr/>
          <div className="flex-1 p-6 h-full overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2">Loading...</p>
                </div>
              </div>
            ) : (
              <div>
                {articleContent && <div
                    className="prose whitespace-pre-wrap"
                  >
                    <ReactMarkdown>{articleContent}</ReactMarkdown>
                  </div>}
                {suggestedQuestions.length > 0 && (
                  <div className="mt-8">
                    <div className=" mb-3">Here are some questions you may be interested in:</div>
                    <div className="space-y-2">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            handleQuestionClick(question);
                            setActiveTab('chat');
                          }}
                          className="block w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Chat */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col h-[calc(100vh-180px)]">
          <div className="border-t border-gray-100 p-4 px-6">
            <h2 className="text-xl font-semibold">Chat</h2>
          </div>
          <hr/>
          <div className="flex-1 p-6 h-full overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                message.type === "user" ? (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-orange-100 ml-auto max-w-[80%]"
                  >
                    {message.content}
                  </div>
                ) : (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gray-100 max-w-[80%] prose"
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )
              ))}
              {isChatLoading && (
                <div className="p-4 rounded-lg bg-gray-100 max-w-[80%] flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about the article..."
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="bg-orange-500 px-4 text-white p-2 rounded-lg hover:bg-orange-600"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden bg-white">
        {activeTab === 'summary' && (
          <div className="rounded-lg shadow-sm flex flex-col h-[calc(100vh-150px)]">
            <div className="flex-1 p-6 h-full overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2">Loading...</p>
                  </div>
                </div>
              ) : (
                <div>
                  {articleContent && <div className="whitespace-pre-wrap">{articleContent}</div>}
                  {suggestedQuestions.length > 0 && (
                    <div className="mt-8">
                      <div className=" mb-3">Here are some questions you may be interested in:</div>
                      <div className="space-y-2">
                        {suggestedQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              handleQuestionClick(question);
                              setActiveTab('chat');
                            }}
                            className="block w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm transition-colors"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="rounded-lg shadow-sm flex flex-col h-[calc(100vh-150px)]">
            <div className="flex-1 p-6 h-full overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  message.type === "user" ? (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-orange-100 ml-auto max-w-[80%] text-sm"
                    >
                      {message.content}
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-gray-100 max-w-[80%] prose prose-sm"
                    >
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  )
                ))}
                {isChatLoading && (
                  <div className="p-4 rounded-lg bg-gray-100 max-w-[80%] flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about the article..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
