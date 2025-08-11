"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const fixedEmail = "admin@findmytutor.com";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fixedEmail, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/admin");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 via-yellow-100 to-orange-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 space-y-8 border border-yellow-300"
      >
        <h1 className="text-4xl font-extrabold text-center text-yellow-700 mb-6 select-none">
          🔐 Admin Login
        </h1>

        {/* Email input (readonly) */}
        <label className="relative block">
          <span className="text-yellow-800 font-semibold mb-2 block select-none">
            Email
          </span>
          <div className="absolute mt-8 inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-yellow-500">
            <Mail size={22} />
          </div>
          <input
            type="email"
            value={fixedEmail}
            readOnly
            className="pl-12 w-full rounded-xl border  border-yellow-300 bg-yellow-50 text-yellow-800 font-semibold p-3 cursor-not-allowed select-text"
          />
        </label>

        {/* Password input */}
        <label className="relative block">
          <span className="text-yellow-800 font-semibold mb-2 block">
            Password
          </span>
          <div className="absolute inset-y-0 left-0 pl-4 mt-8 flex items-center text-yellow-500">
            <Lock size={22} />
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="pl-12 w-full rounded-xl border border-yellow-300 p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
          />
        </label>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm font-medium text-center select-none">
            {error}
          </p>
        )}

        {/* Login button */}
        <button
          type="submit"
          className="w-full bg-yellow-600 cursor-pointer hover:bg-yellow-700 text-white font-semibold py-3 rounded-xl shadow-lg transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
