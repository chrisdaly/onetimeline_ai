"use client";

import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Sign In</h1>
        <p className="text-lg mb-8">Please sign in to continue.</p>
        <button className="btn btn-primary w-full" onClick={() => signIn("google")}>
          Sign In with Google
        </button>
      </div>
    </div>
  );
}
