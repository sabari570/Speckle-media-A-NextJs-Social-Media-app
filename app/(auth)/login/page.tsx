import Image from "next/image";
import Link from "next/link";
import React from "react";
import loginImage from "../../assets/login-image.jpg";
import LoginForm from "./LoginForm.component";
import { Metadata } from "next";

// Sets the page title to "Login"
// This will be rendered as: <title>Login</title>
export const metadata: Metadata = {
  title: "Login",
};

export default function page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="shadow-light flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card">
        <div className="w-full space-y-10 overflow-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Login to Speckle Media</h1>
          </div>

          <div className="sapce-y-5">
            <LoginForm />
            <Link
              href={"/signup"}
              className="mt-3 block text-center hover:underline"
            >
              Dont&apos;t have an account?{" "}
              <span className="text-blue-500">Sign up</span>
            </Link>
          </div>
        </div>
        <Image
          src={loginImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
