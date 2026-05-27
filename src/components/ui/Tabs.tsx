"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
    return ctx;
}

export function Tabs({
    defaultValue,
    value,
    onValueChange,
    children,
}: {
    defaultValue?: string;
    value?: string;
    onValueChange?: (v: string) => void;
    children: ReactNode;
}) {
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const currentValue = value ?? internalValue;
    const handleChange = onValueChange ?? setInternalValue;

    return (
        <TabsContext.Provider value={{ value: currentValue, onValueChange: handleChange }}>
            {children}
        </TabsContext.Provider>
    );
}

export function TabsList({ children }: { children: ReactNode }) {
    return (
        <div
            className="inline-flex rounded-lg p-0.5 gap-0.5"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}
        >
            {children}
        </div>
    );
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
    const { value: selectedValue, onValueChange } = useTabsContext();
    const isActive = value === selectedValue;

    return (
        <button
            type="button"
            onClick={() => onValueChange(value)}
            className="relative rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200"
            style={{
                color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                background: isActive ? "var(--bg-surface-raised)" : "transparent",
                boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
                fontFamily: "var(--font-sans)",
            }}
        >
            {children}
        </button>
    );
}
