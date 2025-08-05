import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth } from "better-auth/plugins"
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@prisma/client";

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
                    providerId: "pve-virws-dash",
                    clientId: "bUS7muaM5MsCO3Cx91rk4nAwVEjqYy2jUrlFkSfn",
                    clientSecret: "5fMJb9iM0XD8g2H2CH3Te06pJ4qt3ctTjHLCk47pPropfEt1H9Y2voEw3tMXGuF6ipobRP9YFb1zWLM2ZWxEMEH280gFbA5hPepfiL5LaWyzN6bxBBQ2u2cG5CMNBMCY",
                    discoveryUrl: "https://identity.monashcav.com/application/o/pve-virws-dash/.well-known/openid-configuration",
                    // ... other config options
                },
                // Add more providers as needed
            ]
        })
    ]
});
