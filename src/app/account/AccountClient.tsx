"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  completeCustomerGoogleRedirect,
  sendCustomerPasswordReset,
  signInCustomerWithEmail,
  signUpCustomerWithEmail,
  startCustomerGoogleSignIn,
} from "@/lib/customerAuth";

export default function AccountPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/book";
  const modeParam = params.get("mode");

  const [mode, setMode] = useState<"signin" | "signup">(modeParam === "signup" ? "signup" : "signin");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const result = await completeCustomerGoogleRedirect();
        if (cancelled || !result) return;
        if (!result.ok) {
          setError(result.message);
          return;
        }
        router.replace(next);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, next]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const result =
        mode === "signup"
          ? await signUpCustomerWithEmail({ name, phone, email, password })
          : await signInCustomerWithEmail(email, password);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.replace(next);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      const result = await startCustomerGoogleSignIn();
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.replace(next);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot() {
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const result = await sendCustomerPasswordReset(email);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setInfo("Password reset email sent. Check your inbox.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-background min-h-screen text-white">
      <Navbar />
      <section className="py-14 px-6 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">{mode === "signup" ? "Create account" : "Sign in"}</h1>
        <p className="text-gray-400 text-sm mb-8">
          Sign up to book installations. We&apos;ll use your phone number for WhatsApp confirmation and payment
          reference.
        </p>

        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 space-y-4">
          {error ? (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</div>
          ) : null}
          {info ? (
            <div className="text-sm text-sigaYellow bg-sigaYellow/10 border border-sigaYellow/30 rounded-lg px-3 py-2">
              {info}
            </div>
          ) : null}

          <button
            type="button"
            disabled={loading}
            onClick={handleGoogle}
            className="w-full bg-white text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-100 disabled:opacity-50"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex-1 h-px bg-gray-800" />
            or email
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" ? (
              <>
                <input
                  className="input"
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="input"
                  required
                  placeholder="WhatsApp / phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </>
            ) : null}
            <input
              className="input"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input"
              type="password"
              required
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {mode === "signin" ? (
              <button type="button" onClick={handleForgot} className="text-xs text-sigaYellow hover:underline">
                Forgot password?
              </button>
            ) : null}
            <button type="submit" disabled={loading} className="btn disabled:opacity-50">
              {loading ? "Please wait…" : mode === "signup" ? "Create account & continue" : "Sign in & continue"}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button type="button" className="text-sigaYellow hover:underline" onClick={() => setMode("signin")}>
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button type="button" className="text-sigaYellow hover:underline" onClick={() => setMode("signup")}>
                  Sign up to book
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Admin team?{" "}
          <Link href="/admin/login" className="text-gray-400 hover:text-sigaYellow">
            Admin sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
