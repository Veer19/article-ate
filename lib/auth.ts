import { type NextAuthOptions } from "next-auth";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";

export const authOptions: NextAuthOptions = {
	providers: [
		AzureADB2CProvider({
			tenantId: process.env.AZURE_AD_B2C_TENANT_NAME!,
			clientId: process.env.AZURE_AD_B2C_CLIENT_ID!,
			clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET!,
			primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW!,
			authorization: { params: { scope: "offline_access openid" } },
			checks: ["pkce"],
			profile(profile) {
				return {
					id: profile.sub,
					name: profile.name || profile.email?.split("@")[0],
					email: profile.email,
					image: null, // Since we're not using social providers
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub!;
				// @ts-ignore
				session.accessToken = token.accessToken;
			}
			return session;
		},
	},
	pages: {
		signIn: "/auth/signin",
		error: "/auth/error",
	},
};

// Extend next-auth session type
declare module "next-auth" {
	interface Session {
		accessToken?: string;
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}
}
