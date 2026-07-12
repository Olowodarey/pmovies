"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation, useSignupMutation } from "@/app/_services/backendApi";

interface AuthFormProps {
  mode: "login" | "signup";
}

function getErrorMessage(error: unknown, mode: AuthFormProps["mode"]): string {
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
      <div className="w-full max-w-sm border-2 border-gray-800 rounded-md p-6">
        <h1 className="text-xl font-bold text-center mb-6">
          {isLogin ? "Log in" : "Create an account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (optional)"
              className="w-full p-2 border rounded-md text-sm"
            />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded-md text-sm"
          />
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded-md text-sm"
          />

          {error !== undefined && (
            <p className="text-sm text-red-500">{getErrorMessage(error, mode)}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 rounded-md py-2 text-white font-medium disabled:opacity-60"
          >
            {isLoading ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-400">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-500">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500">
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
