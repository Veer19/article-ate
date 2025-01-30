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
			// Validate URL
			new URL(url);
			router.push(`/results?url=${encodeURIComponent(url)}`);
		} catch (err) {
			console.error("Error processing URL:", err);
			if (err instanceof Error && err.message.includes("URL")) {
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
						summary that highlights the key points in seconds. From there, feel free to ask any questions
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
									{isProcessing
										? "Processing..."
										: "Articulate"}
								</span>
								<ArrowRight className="w-5 h-5" />
							</button>
						</form>

						{error && (
							<p className="text-red-500 text-sm">{error}</p>
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
