import { getBaseUrl } from "@/lib/utils";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});

