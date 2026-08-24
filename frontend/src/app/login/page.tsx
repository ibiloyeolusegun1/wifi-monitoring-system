"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Wifi, Loader2 } from "lucide-react";
import { login } from "@/src/services/auth.service";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await login({
        username,
        password,
      });

      if (!response.success) {
        setError(response.message);
        return;
      }

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      router.push("/dashboard");
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Unable to connect to the server.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 text-white p-3 rounded-xl mb-4">
              <Wifi size={30} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Wi-Fi Monitoring System
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Network Administrator Login
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter username"
                required
                className="w-full rounded-lg border text-slate-500 border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                required
                className="w-full rounded-lg border text-slate-500 border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg py-3 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}

              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Wi-Fi Network Performance Monitoring and Recommendation System
        </p>
      </div>
    </main>
  );
}
