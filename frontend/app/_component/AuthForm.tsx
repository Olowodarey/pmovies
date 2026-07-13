"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useLoginMutation, useSignupMutation } from "@/app/_services/backendApi";

// Google OAuth is routed through /api/backend so the auth cookie set by the
// callback is first-party on the frontend origin (not third-party from Railway).
const GOOGLE_AUTH_URL = "/api/backend/auth/google";

interface AuthFormProps {
  mode: "login" | "signup";
}

function getErrorMessage(error: unknown, mode: AuthFormProps["mode"]): string {
  if (error && typeof error === "object" && "data" in error) {
    // Backend sends a specific message (e.g., "This email is registered with
    // Google.") — surface it directly so users understand which flow to use.
    const data = (error as { data?: { message?: string } }).data;
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

  const [login, loginState] = useLoginMutation();
  const [signup, signupState] = useSignupMutation();

  const isLogin = mode === "login";
  const { isLoading, error } = isLogin ? loginState : signupState;

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
      // error state is already surfaced via loginState/signupState.error
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
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border border-edge rounded-md text-sm bg-surface text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-brand"
          />

          {error !== undefined && (
            <p className="text-sm text-danger">{getErrorMessage(error, mode)}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand text-brand-contrast rounded-md py-2 font-medium hover:bg-brand-hover transition-colors disabled:opacity-60"
          >
            {isLoading ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
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
