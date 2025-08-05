import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { authClient } from "@/auth/client";
import { useNavigate, NavLink } from "react-router-dom";
import { type ProviderIcon, type Provider } from "@daveyplate/better-auth-ui";
import reactLogo from "@/assets/react.svg"

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();

    return (
        <AuthUIProvider
            authClient={authClient}
            navigate={void navigate}
            credentials={false}
            genericOAuth={{

                providers: [{
                    provider: "pve-virws-dash",
                    name: "nuts"

                }],
            }}
            Link={
                NavLink as unknown as React.FC<{
                    href: string;
                    className?: string;
                    children: React.ReactNode;
                }>
            }
        >
            {children}
        </AuthUIProvider>
    );
}
