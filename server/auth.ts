import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth } from "better-auth/plugins"
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@prisma/client";
import { config } from 'dotenv';
config(); // Loads .env variables into process.env

const prisma = new PrismaClient();
export const auth = betterAuth({
    trustedOrigins: ["http://localhost:3000", "http://localhost:5173"],
    database: prismaAdapter(prisma, {
        provider: "sqlite", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: false,
    },
    plugins: [
        genericOAuth({
            config: [
                {
                    providerId: process.env.OAUTH_PROVIDER_ID as string,
                    clientId: process.env.OAUTH_CLIENT_ID as string,
                    clientSecret: process.env.OAUTH_CLIENT_SECRET as string,
                    discoveryUrl: process.env.OAUTH_DISCOVERY_URL as string,
                    // ... other config options
                },
                // Add more providers as needed
            ]
        })
    ]
});
