"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthError() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	return (
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-4">
			<div className="text-center space-y-4">
				<h1 className="text-2xl font-bold text-red-600">
					Authentication Error
				</h1>
				<p className="text-gray-600">
					{error === "AccessDenied"
						? "You do not have permission to sign in."
						: "There was a problem signing you in."}
				</p>
				<Button asChild>
					<Link href="/auth/signin">Try Again</Link>
				</Button>
			</div>
		</div>
	);
}
