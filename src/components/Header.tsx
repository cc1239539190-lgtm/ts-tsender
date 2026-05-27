"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";
import { RiMoonLine, RiSunLine } from "react-icons/ri";

export default function Header() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "light") {
            setIsDark(false);
            document.documentElement.setAttribute("data-theme", "light");
        }
    }, []);

    function toggleTheme() {
        const next = !isDark;
        setIsDark(next);
        localStorage.setItem("theme", next ? "dark" : "light");
        document.documentElement.setAttribute(
            "data-theme",
            next ? "dark" : "light"
        );
    }

    return (
        <header
            className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]"
            style={{
                background: "var(--bg-surface)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
            }}
        >
            <div className="flex items-center gap-3">
                <a
                    href="https://github.com/cc1239539190-lgtm?tab=repositories"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-70"
                    style={{ color: "var(--text-secondary)" }}
                >
                    <FaGithub size={22} />
                </a>
                <span
                    className="text-base font-semibold tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                >
                    TSender
                </span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={toggleTheme}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{
                        background: "var(--bg-input)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                    }}
                >
                    {isDark ? <RiSunLine size={16} /> : <RiMoonLine size={16} />}
                </button>
                <ConnectButton />
            </div>
        </header>
    );
}
