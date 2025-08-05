import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Settings, LogOut, User, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
    const navigate = useNavigate();

    const [theme, setTheme] = useState("light");

    // Initialize theme based on localStorage or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
            if (savedTheme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark");
            document.documentElement.classList.add("dark");
        }
    }, []);

    // Toggle theme function
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", newTheme);
    };

    return (
        <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-foreground">CloudSpark</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-xs text-primary-foreground">2</span>
                        </span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="relative"
                        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                    >
                        {theme === "light" ? (
                            <Moon className="h-5 w-5" />
                        ) : (
                            <Sun className="h-5 w-5" />
                        )}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="/placeholder.svg" alt="User avatar" />
                                    <AvatarFallback className="bg-primary text-primary-foreground">JS</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">John Smith</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        john.smith@example.com
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate("/settings")}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate("/auth/signOut")}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};
