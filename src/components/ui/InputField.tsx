import { ChangeEvent } from "react";

interface InputFieldProps {
    label: string;
    placeholder?: string;
    value?: string;
    type?: string;
    large?: boolean;
    id?: string;
    className?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function InputField({
    label,
    placeholder,
    value,
    type,
    large,
    id,
    className = "",
    onChange,
}: InputFieldProps) {
    const baseClass = `w-full rounded-lg px-3 py-2.5 text-sm
        transition-all duration-200
        bg-[var(--bg-input)] border border-[var(--border)]
        text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
        focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[var(--accent-glow)]
        ${className}`;

    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={id}
                className="text-xs font-medium tracking-wider uppercase"
                style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
            >
                {label}
            </label>
            {large ? (
                <textarea
                    id={id}
                    className={`${baseClass} h-24 resize-y`}
                    placeholder={placeholder}
                    value={value || ""}
                    onChange={onChange}
                    style={{ fontFamily: "var(--font-mono)" }}
                />
            ) : (
                <input
                    id={id}
                    className={baseClass}
                    type={type}
                    placeholder={placeholder}
                    value={value || ""}
                    onChange={onChange}
                    style={{ fontFamily: "var(--font-mono)" }}
                />
            )}
        </div>
    );
}
