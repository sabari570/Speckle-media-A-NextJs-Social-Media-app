import { Metadata } from "next";
import React from "react";
import signupImage from "../../assets/signup-image.jpg";
import Image from "next/image";
import Link from "next/link";
import SignupForm from "./SignupForm.component";

export const metadata: Metadata = {
  title: "Signup",
};

export default function page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="shadow-light flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card">
        <div className="w-full space-y-10 overflow-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to Speckle Media</h1>
            <p className="text-muted-foreground">
              A place where even <span className="italic">you</span> can find a
              friend
            </p>
          </div>

          <div className="sapce-y-5">
            <SignupForm />
            <Link
              href={"/login"}
              className="mt-3 block text-center hover:underline"
            >
              Already have an account?{" "}
              <span className="text-blue-500">Log in</span>
            </Link>
          </div>
        </div>
        <Image
          src={signupImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
