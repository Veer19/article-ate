"use client";

import { useState, FormEvent } from "react";
import URLInput from "./components/UrlInput";

export default function Home() {
	const [email, setEmail] = useState("");

	const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Add your subscription logic here
		console.log("Subscribing email:", email);
		setEmail("");
	};

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-6">
			<div className="md:pt-12 pb-24">
				<URLInput />

				{/* Newsletter Section */}
				{/* <div className="mt-24 bg-white rounded-2xl p-8 md:p-12">
					<div className="max-w-3xl mx-auto text-center">
						<h2 className="text-4xl font-bold mb-6 flex items-center justify-center">
							Subscribe to Updates
							<svg
								className="w-12 h-12 ml-4 text-[#91E3F8]"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
							>
								<path
									d="M21 3L3 21"
									strokeWidth="2"
									strokeLinecap="round"
								/>
								<path
									d="M21 3L14 3"
									strokeWidth="2"
									strokeLinecap="round"
								/>
								<path
									d="M21 3L21 10"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</svg>
						</h2>
						<p className="text-gray-600 mb-8">
							Get the latest updates about new features and
							improvements directly to your inbox.
						</p>
						<form
							onSubmit={handleSubscribe}
							className="flex gap-4 max-w-md mx-auto"
						>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Your email"
								className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#91E3F8]"
							/>
							<button
								type="submit"
								className="bg-[#91E3F8] hover:bg-[#7ad5ef] text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors"
							>
								Subscribe
							</button>
						</form>
						<p className="text-sm text-gray-500 mt-4">
							Join our growing community of 1,000+ users
						</p>
					</div>
				</div> */}
			</div>
		</div>
	);
}
