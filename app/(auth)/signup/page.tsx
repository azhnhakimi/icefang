"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      alert(data.error || "Something went wrong");
    }
  }

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div
        className="bg-[var(--primary-dark)] flex-1 h-full flex justify-center items-start flex-col gap-2 pl-24"
        style={{ clipPath: "polygon(0 0, 100% 0%, 80% 100%, 0% 100%)" }}
      >
        <p className="">Icefang</p>
        <p className="">Unify Your Day. Amplify Your Productivity.</p>
      </div>
      <div className="flex flex-col gap-2 justify-center items-center flex-1 h-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
          <h2 className="text-xl font-semibold text-center mb-2">Sign Up</h2>
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="bg-[var(--primary-dark)] text-white py-2 rounded hover:cursor-pointer hover:bg-[var(--primary-dark-hover)] transition-all"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-1">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
