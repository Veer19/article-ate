import "./globals.css";
import type React from "react";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
	title: "Articlate",
	description:
		"Digest web content faster with AI-powered summaries and interactive Q&A",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="min-h-screen bg-[#FDF8F8] flex flex-col">
				{/* Header */}
				<header className="py-6 px-4 md:px-6 bg-white border-b">
					<nav className="max-w-7xl mx-auto flex items-center justify-between">
						<Link href="/" className="flex items-center space-x-2">
							<span className="text-2xl font-bold text-[#FF906D]">
								Articlate
							</span>
						</Link>
						<div className="flex items-center space-x-8">
							<Link
								href="https://instagram.com/_u/notsoveer_"
								className="bg-[#FF906D] hover:bg-[#ff8055] text-white px-6 py-2 rounded-lg transition-colors"
							>
								Say Hi
							</Link>
						</div>
					</nav>
				</header>

				{/* Main Content */}
				<main className="flex-1">
					<div className="max-w-7xl mx-auto">
						<Suspense fallback={<div>Loading...</div>}>
							{children}
						</Suspense>
					</div>
				</main>
			</body>
		</html>
	);
}
