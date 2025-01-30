"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import axios from "axios"

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: File[]) => {
    if (rejectedFiles.length > 0) {
      setError("Please upload only PDF files.")
      return
    }

    setError(null)
    setSuccess(null)
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  })

  const removeFile = () => {
    setFile(null)
    setError(null)
    setSuccess(null)
  }

  const processPDF = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setSuccess("PDF processed successfully!")
    } catch (err) {
      setError("Failed to process PDF. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {!file && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-600">
            {isDragActive ? "Drop the PDF file here" : "Drag and drop your PDF here or click to upload"}
          </p>
        </div>
      )}
      {file && (
        <div className="mt-4">
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
            <span className="text-sm font-medium text-gray-900 truncate">{file.name}</span>
            <button onClick={removeFile} className="ml-2 text-sm font-medium text-red-600 hover:text-red-500">
              Remove File
            </button>
          </div>
          <button
            onClick={processPDF}
            disabled={isUploading}
            className={`mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? "Processing..." : "Process PDF"}
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      {success && <p className="mt-2 text-green-500 text-sm">{success}</p>}
    </div>
  )
}

export default FileUpload

