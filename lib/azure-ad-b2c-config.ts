export const b2cPolicies = {
	names: {
		signUpSignIn: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
		forgotPassword: "B2C_1_reset",
		editProfile: "B2C_1_edit_profile",
	},
	authorities: {
		signUpSignIn: {
			authority: `https://${process.env.AZURE_AD_B2C_TENANT_NAME}.b2clogin.com/${process.env.AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/${process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW}`,
		},
		forgotPassword: {
			authority: `https://${process.env.AZURE_AD_B2C_TENANT_NAME}.b2clogin.com/${process.env.AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/B2C_1_reset`,
		},
		editProfile: {
			authority: `https://${process.env.AZURE_AD_B2C_TENANT_NAME}.b2clogin.com/${process.env.AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/B2C_1_edit_profile`,
		},
	},
	authorityDomain: `${process.env.AZURE_AD_B2C_TENANT_NAME}.b2clogin.com`,
};

export const msalConfig = {
	auth: {
		clientId: process.env.AZURE_AD_B2C_CLIENT_ID!,
		authority: b2cPolicies.authorities.signUpSignIn.authority,
		knownAuthorities: [b2cPolicies.authorityDomain],
		redirectUri: "/",
		postLogoutRedirectUri: "/",
		navigateToLoginRequestUrl: true,
	},
	cache: {
		cacheLocation: "sessionStorage",
		storeAuthStateInCookie: false,
	},
};
