import Link from "next/link";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "gold" | "navy" | "outline" | "white" | "whatsapp" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  gold: "bg-gold-500 text-navy-900 hover:bg-gold-400 active:bg-gold-600 shadow-sm shadow-gold-500/30",
  navy: "bg-navy-900 text-cream-50 hover:bg-navy-800",
  outline: "border border-ink-900/15 bg-transparent text-ink-900 hover:border-gold-500 hover:text-gold-700",
  white: "bg-white text-navy-900 hover:bg-cream-100",
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-dark shadow-sm shadow-whatsapp/30",
  ghost: "bg-transparent text-ink-900 hover:bg-ink-900/5",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
};

export function buttonClasses(
  variant: ButtonVariant = "gold",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(
    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer whitespace-nowrap",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

interface LinkButtonProps extends BaseButtonProps {
  href: string;
  external?: boolean;
  children: ReactNode;
}

interface NativeButtonProps
  extends BaseButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  href?: undefined;
  children: ReactNode;
}

export type ButtonProps = LinkButtonProps | NativeButtonProps;

export function Button(props: ButtonProps) {
  if ("href" in props && props.href) {
    const { href, external, variant, size: _size, className, children } = props as LinkButtonProps;
    const cls = buttonClasses(variant, _size === "lg" ? "lg" : _size ?? "md", className);
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  const { variant, size, className, children, ...rest } = props as NativeButtonProps;
  return (
    <button type="button" className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "gold" | "green" | "amber" | "red" | "navy" | "cream";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-ink-900/5 text-ink-700",
    gold: "bg-gold-100 text-gold-700",
    green: "bg-success/10 text-success",
    amber: "bg-warning/10 text-warning",
    red: "bg-danger/10 text-danger",
    navy: "bg-navy-800 text-cream-50",
    cream: "bg-cream-100 text-navy-800",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Pill({
  children,
  active,
  onClick,
  tone = "cream",
  className,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  tone?: "cream" | "navy";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap",
        tone === "navy"
          ? active
            ? "border-gold-400 bg-gold-500 text-navy-900"
            : "border-white/15 bg-white/5 text-cream-50 hover:bg-white/10"
          : active
            ? "border-gold-500 bg-gold-500 text-navy-900 shadow-sm"
            : "border-ink-900/10 bg-white text-ink-700 hover:border-gold-500 hover:text-gold-700",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-xs font-bold tracking-[0.2em] uppercase",
            tone === "dark" ? "text-gold-300" : "text-gold-600",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-display text-3xl sm:text-4xl leading-tight tracking-tight text-balance",
          tone === "dark" ? "text-cream-50" : "text-navy-900",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            tone === "dark" ? "text-cream-50/70" : "text-ink-500",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[13px] font-semibold text-ink-700"
    >
      {children}
    </label>
  );
}

export function Field({
  label,
  hint,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="flex flex-col">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputBase, className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(inputBase, "appearance-none cursor-pointer", className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputBase, "min-h-28", className)} {...props} />;
}

export function StatCard({
  label,
  value,
  tone = "card",
  hint,
}: {
  label: string;
  value: ReactNode;
  tone?: "card" | "dark";
  hint?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 sm:p-6",
        tone === "dark" ? "texture-card text-cream-50" : "border border-ink-900/5 bg-white",
      )}
    >
      <p
        className={cn(
          "text-3xl sm:text-4xl font-display font-semibold tracking-tight",
          tone === "dark" ? "text-gold-300" : "text-navy-900",
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "mt-1 text-[13px] font-medium",
          tone === "dark" ? "text-cream-50/60" : "text-ink-500",
        )}
      >
        {label}
      </p>
      {hint ? <p className="mt-0.5 text-xs text-ink-400">{hint}</p> : null}
    </div>
  );
}