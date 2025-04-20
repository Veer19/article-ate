"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function SignIn() {
	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-180px)]">
			<Card className="w-[400px]">
				<CardHeader className="text-center">
					<CardTitle>Welcome to Articlate</CardTitle>
					<CardDescription>
						Sign in or create an account to continue
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						onClick={() =>
							signIn("azure-ad-b2c", { callbackUrl: "/" })
						}
						className="w-full flex items-center justify-center gap-2 bg-[#FF906D] hover:bg-[#ff8055]"
					>
						<Mail className="h-5 w-5" />
						Continue with Email
					</Button>
					<p className="mt-4 text-center text-sm text-muted-foreground">
						By continuing, you agree to our Terms of Service and
						Privacy Policy.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
