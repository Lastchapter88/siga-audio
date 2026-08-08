"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  completeGoogleAdminRedirect,
  signUpAdminWithEmail,
  startGoogleAdminSignIn,
} from "@/lib/adminAuth";
import { ADMIN_EMAILS } from "@/lib/adminConfig";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const result = await completeGoogleAdminRedirect();
        if (cancelled || !result) return;
        if (!result.ok) {
          setError(result.message);
          return;
        }
        router.replace("/admin/dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const result = await signUpAdminWithEmail(email, password);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.replace("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      const result = await startGoogleAdminSignIn();
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.replace("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-4">
        <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 space-y-4">
          <h1 className="text-2xl font-bold">Create admin account</h1>
          <p className="text-sm text-gray-400">
            Use Google or set an email password. Only authorized Siga admin emails can register.
          </p>

          {error ? (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            disabled={loading}
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-100 transition disabled:opacity-50"
          >
            <GoogleIcon />
            {loading ? "Please wait…" : "Sign up with Google"}
          </button>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex-1 h-px bg-gray-800" />
            or email
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Admin email"
              className="input"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              required
              minLength={6}
              placeholder="Password (min 6 characters)"
              className="input"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              required
              minLength={6}
              placeholder="Confirm password"
              className="input"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <button className="btn disabled:opacity-50" type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="text-[11px] text-gray-500 text-center">
            Allowed: {ADMIN_EMAILS.join(" · ")}
          </p>
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/admin/login" className="text-sigaYellow hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.1 4 9.2 8.5 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.4 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-7.9l-6.5 5C9.1 39.4 15.9 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.5 5.6-6.5 7.1l.1.1 6.2 5.2C36.9 41.5 44 36 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}
