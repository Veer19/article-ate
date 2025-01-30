import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">AI PDF Assistant</h1>
          <Link href="/" className="text-gray-600 hover:text-blue-600 flex items-center">
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">About AI PDF Assistant</h2>
        <p className="text-gray-600 mb-4">
          AI PDF Assistant is a powerful tool that combines the capabilities of artificial intelligence with PDF
          document analysis. Our application allows users to upload PDF documents and interact with them through an
          AI-powered chat interface.
        </p>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">How it works:</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
          <li>Upload your PDF document using our easy-to-use interface.</li>
          <li>Our AI processes and analyzes the content of your document.</li>
          <li>Ask questions about your document using natural language.</li>
          <li>Receive accurate and context-aware answers from our AI assistant.</li>
        </ol>
        <p className="text-gray-600">
          Whether you're a student, researcher, or professional, AI PDF Assistant can help you quickly extract valuable
          insights from your PDF documents.
        </p>
      </main>

      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          © 2025 AI PDF Assistant. All Rights Reserved.
          <Link href="https://github.com/yourusername/ai-pdf-assistant" className="ml-2 text-blue-600 hover:underline">
            GitHub
          </Link>
        </div>
      </footer>
    </div>
  )
}

