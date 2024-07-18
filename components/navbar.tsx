"use client"
import React, { useState } from "react";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";
import Link from "next/link";
import { LoadingButton } from "./loading-button";
import axios from "axios";
import { useAuth } from "./auth-provider";

export default function Navbar() {
  const [isSignOutLoading, setIsSignOutLoading] = useState<boolean>(false);
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    setIsSignOutLoading(true);
    const res = axios
      .post("/api/auth/signout")
      .then(() => {
        window.location.reload();
      })
      .finally(() => {
        setIsSignOutLoading(false);
      });
  };
  const authSession = document.cookie.split('; ').find(row => row.startsWith('auth_session='));

  return (
    <div className="fixed top-0 left-0 right-0 z-10 backdrop-blur-md border-b h-16 flex items-center justify-between px-12 py-4 gap-4">
      <div className="flex items-center gap-6">
        <Link href={"/"}>
          <Image
            src={"/vercel.svg"}
            alt={"logo"}
            width={100}
            height={34}
            className="cursor-pointer bg-white p-2 rounded-sm"
          />
        </Link>
        <ModeToggle />
      </div>
      {user && authSession && (
      <LoadingButton
            loading={isSignOutLoading}
            onClick={handleSignOut}
            size="sm"
          >
            تسجيل الخروج
          </LoadingButton>
      )}
    </div>
  );
}
