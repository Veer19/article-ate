"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const FileUploader: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const processURL = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log("Server response:", data);
      
      // Store the processed content
      if (data.content) {
        localStorage.setItem("articleContent", data.content);
        router.push("/results");
      }
    } catch (err: any) {
      console.error("Error processing URL:", err);
      setError(err.message || "Failed to process URL");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative flex items-center">
        <Input
          type="url"
          placeholder="Enter url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full h-14 pl-6 pr-36 text-base rounded-full border-2 border-gray-200 focus:border-[#FF906D] focus:ring-2 focus:ring-[#FF906D] focus:ring-opacity-20"
        />
        <Button
          onClick={processURL}
          disabled={isLoading}
          className="absolute right-1 top-1 bottom-1 px-8 rounded-full bg-[#15151b] hover:bg-[#2a2a2f] text-white font-medium transition-colors disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Articulate"}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
      )}
    </div>
  );
};

export default FileUploader;
