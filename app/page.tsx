"use client";
import { useAuth } from "@/components/auth-provider";
import SignInForm from "@/components/auth/SignInForm";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();

  const authSession = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth_session="));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full py-24">
      {loading ? (
        <div dir="rtl" className="mt-[25vh]">
          <LoaderCircle size={40} className="mx-auto animate-spin" />
        </div>
      ) : user ? (
        <div dir="rtl" className="mt-[15vh]">
          <h1 className="text-xl font-semibold">حياك الله,</h1>
          <div dir="ltr">
            <p>name: {user?.name}</p>
            {user?.email && <p>email: {user?.email}</p>}
            {user?.phoneNumber && <p>phone: {user?.phoneNumber}</p>}
            <p>user_uid: {user?.id}</p>
          </div>
          <br />
          <Link href={"/test"}>
            <Button
              variant={"link"}
              className="text-center mx-auto flex justify-center"
            >
              الذهاب لصفحة تجريب الشفرات
            </Button>
          </Link>
        </div>
      ) : (
        !authSession && <SignInForm />
      )}
    </main>
  );
}
