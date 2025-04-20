"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LinkIcon } from "lucide-react";
import type React from "react";
import Image from "next/image";
import robotImage from "../assets/robot.jpg";

const URLInput: React.FC = () => {
	const [url, setUrl] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const router = useRouter();

	const processURL = async () => {
		if (!url) return;
		setIsProcessing(true);
		setError(null);

		try {
			// Validate URL format first
			const urlObject = new URL(url);

			// Check for required protocol (http or https)
			if (!["http:", "https:"].includes(urlObject.protocol)) {
				throw new Error("URL must start with http:// or https://");
			}

			// Check for valid hostname (at least 2 parts, e.g., example.com)
			const hostParts = urlObject.hostname.split(".");
			if (
				hostParts.length < 2 ||
				!hostParts.every((part) => part.length > 0)
			) {
				throw new Error("Invalid domain name");
			}

			// If validation passes, proceed with the API call
			const response = await fetch("/api/upload", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ url }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			localStorage.setItem("sessionId", data.sessionId);
			router.push(`/results`);
		} catch (err) {
			console.error("Error processing URL:", err);
			if (err instanceof Error) {
				setError("Please enter a valid URL");
			} else {
				setError("An unexpected error occurred");
			}
		} finally {
			setIsProcessing(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		processURL();
	};

	return (
		<div className="mx-auto">
			<div className="grid md:grid-cols-2 gap-12 items-center">
				{/* Robot Image */}
				<div className="bg-[#E2C7B1] rounded-full overflow-hidden md:h-full md:w-full h-44 w-44 mx-auto">
					<Image
						src={robotImage}
						alt="Article-ate Robot Assistant"
						className="w-full h-full"
					/>
				</div>

				{/* Content */}
				<div className="text-left">
					<h1 className="text-4xl font-bold mb-2">
						Welcome to Article-ate
					</h1>
					<p className="text-xl text-gray-600 mb-4">
						Eat up knowledge. Fast.
					</p>
					<p className="text-gray-600 mb-8">
						Paste the URL of any webpage, and you'll get a concise
						summary that highlights the key points in seconds. From
						there, feel free to ask any questions
					</p>

					<div className="space-y-4">
						<form
							onSubmit={handleSubmit}
							className="flex flex-col gap-4"
						>
							<div className="relative">
								<LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<input
									type="text"
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									placeholder="Enter url"
									className="w-full px-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF906D] focus:border-transparent pl-12"
								/>
							</div>

							<button
								type="submit"
								disabled={!url || isProcessing}
								className="w-full bg-[#FF906D] hover:bg-[#ff8055] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
							>
								<span>
									{isProcessing ? "Processing..." : "Process"}
								</span>
								<ArrowRight className="w-5 h-5" />
							</button>
						</form>

						{error && (
							<div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-red-500"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clipRule="evenodd"
									/>
								</svg>
								<p className="text-red-600 text-sm font-medium">
									{error}
								</p>
							</div>
						)}
					</div>

					<p className="text-sm text-gray-500 mt-8">
						Whether it's a blog, news article, or documentation,
						Article-ate helps you save time by delivering clear,
						clutter-free insights. Simplify your reading today!
					</p>
				</div>
			</div>
		</div>
	);
};

export default URLInput;
