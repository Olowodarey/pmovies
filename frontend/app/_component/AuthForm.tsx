"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useLoginMutation, useSignupMutation } from "@/app/_services/backendApi";

const GOOGLE_AUTH_URL = "/api/backend/auth/google";

interface AuthFormProps {
  mode: "login" | "signup";
}

// Password rules — kept in one place so frontend and backend stay in sync.
const RULES = [
  { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { label: "One uppercase letter (A–Z)", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter (a–z)", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number or special character", test: (p: string) => /[\d\W]/.test(p) },
];

function passwordStrength(password: string): 0 | 1 | 2 | 3 {
  const passed = RULES.filter((r) => r.test(password)).length;
  if (passed <= 1) return 0;
  if (passed === 2) return 1;
  if (passed === 3) return 2;
  return 3;
}

const strengthLabel = ["Weak", "Fair", "Good", "Strong"] as const;
const strengthColor = [
  "bg-red-500",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-green-500",
] as const;

function getErrorMessage(error: unknown, mode: AuthFormProps["mode"]): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: { message?: string | string[] } }).data;
    if (Array.isArray(data?.message)) return data.message[0];
    if (data?.message) return data.message;
  }
  if (error && typeof error === "object" && "status" in error) {
    const status = (error as { status: number | string }).status;
    if (status === 409) return "An account with this email already exists.";
    if (status === 401) return "Invalid email or password.";
    if (status === 400) return "Please check your details and try again.";
  }
  return mode === "login"
    ? "Couldn't log in. Please try again."
    : "Couldn't create your account. Please try again.";
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [login, loginState] = useLoginMutation();
  const [signup, signupState] = useSignupMutation();

  const isLogin = mode === "login";
  const { isLoading, error } = isLogin ? loginState : signupState;

  const strength = useMemo(() => passwordStrength(password), [password]);
  const allRulesPassed = RULES.every((r) => r.test(password));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({ email, password }).unwrap();
      } else {
        await signup({ email, password, name: name || undefined }).unwrap();
      }
      router.push("/profile");
    } catch {
      // error is surfaced via loginState/signupState.error
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-5">
      <div className="w-full max-w-sm bg-surface border border-edge rounded-lg shadow-sm p-6">
        <h1 className="text-xl font-bold text-center mb-6 text-ink">
          {isLogin ? "Log in" : "Create an account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (optional)"
              className="w-full p-2 border border-edge rounded-md text-sm bg-surface text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-brand"
            />
          )}

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border border-edge rounded-md text-sm bg-surface text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-brand"
          />

          <div className="space-y-2">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              placeholder="Password"
              className="w-full p-2 border border-edge rounded-md text-sm bg-surface text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-brand"
            />

            {/* Strength bar + checklist — only visible on signup after typing */}
            {!isLogin && password.length > 0 && (
              <div className="space-y-2">
                {/* Segmented strength bar */}
                <div className="flex gap-1 h-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-colors duration-300 ${
                        i <= strength ? strengthColor[strength] : "bg-edge"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-medium ${
                  strength === 3 ? "text-green-600 dark:text-green-400" :
                  strength === 2 ? "text-yellow-600 dark:text-yellow-400" :
                  strength === 1 ? "text-orange-500" : "text-red-500"
                }`}>
                  {strengthLabel[strength]}
                </p>

                {/* Rule checklist — shown when touched or any rule fails */}
                {(passwordTouched || !allRulesPassed) && (
                  <ul className="space-y-1">
                    {RULES.map((rule) => {
                      const ok = rule.test(password);
                      return (
                        <li key={rule.label} className="flex items-center gap-1.5 text-xs">
                          <span className={ok ? "text-green-500" : "text-ink-muted"}>
                            {ok ? "✓" : "○"}
                          </span>
                          <span className={ok ? "text-ink line-through decoration-green-500/50" : "text-ink-muted"}>
                            {rule.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>

          {error !== undefined && (
            <p className="text-sm text-danger">{getErrorMessage(error, mode)}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || (!isLogin && !allRulesPassed)}
            className="w-full bg-brand text-brand-contrast rounded-md py-2 font-medium hover:bg-brand-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Please wait…" : isLogin ? "Log in" : "Sign up"}
          </button>
        </form>

        <div className="flex items-center gap-3 mt-5">
          <span className="h-px flex-1 bg-edge" />
          <span className="text-xs text-ink-muted">or</span>
          <span className="h-px flex-1 bg-edge" />
        </div>

        <a
          href={GOOGLE_AUTH_URL}
          className="mt-5 w-full flex items-center justify-center gap-2 border border-edge rounded-md py-2 text-sm font-medium text-ink hover:bg-surface-hover transition-colors"
        >
          <FcGoogle className="h-5 w-5" />
          Continue with Google
        </a>

        <p className="mt-4 text-sm text-center text-ink-muted">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-brand">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-brand">
                Log in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
