"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      window.location.href = "/dashboard";
    } else {
      setError("Email or password is incorrect");
    }
  }

  return (
    <div className="min-h-scree pt-10">
      <h1 className="text-center text-3xl text-purple-600 font-extrabold mb-10">ben<strong className="text-zinc-950">co</strong></h1>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-3">
            Sign In
          </h2>
          <p className="text-center w-full text-gray-500 mb-6">Welcome back behnam</p>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                required
                value="behnamnabati0@gmail.com"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value="Behnam2443"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your password"
              />
            </div>
            <div>
              <input type="checkbox" />
              <span className="text-sm ml-2 text-zinc-400">Remember Password ?</span>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 mt-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
            >
              sign In
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Dont have an account?{" "}
              <Link href="/auth/register" className="text-purple-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
          <div className="text-center my-4">
            <span>OR</span>
          </div>

          {/* Error Message */}
          {error && (
            <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
