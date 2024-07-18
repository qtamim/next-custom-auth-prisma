"use client";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { encryptPro, decryptPro } from "@/utils/crypto_pro";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function TestPage() {
  const { user, loading } = useAuth();

  const [number, setNumber] = useState<string>("");
  const [encrypted, setEncrypted] = useState<string | null>(null);
  const [decrypted, setDecrypted] = useState<string | null>(null);

  const handleEncrypt = () => {
    const encryptedText = encryptPro(number);
    
    setEncrypted(encryptedText);
  };

  const handleDecrypt = () => {
    if (encrypted) {
      console.log(encrypted)
      // const decryptedText = ;
      setDecrypted(decryptPro(encrypted));
    }
  };

  if (user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between w-full py-24 sm:px-24 px-8">
        <div dir="rtl" className="space-y-5 mt-[15vh] w-full sm:max-w-[500px]">
          <h1 className="text-xl font-medium text-center my-4">
            تشفير وفك تشفير رقم
          </h1>
          <Input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="أدخل رقم"
          />
          <Button size={"sm"} className="w-full" onClick={handleEncrypt}>
            تشفير
          </Button>
          {encrypted && (
            <>
              <p>النص المشفر:</p>
              <ScrollArea className="w-full h-16 whitespace-nowrap rounded-md" dir="ltr">
                <div className="font-mono text-center p-2 border shadow-sm rounded-md">
                  {encrypted}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <Button size={"sm"} onClick={handleDecrypt} className="w-full">
                فك التشفير
              </Button>
            </>
          )}
          {decrypted && <p>النص المفكوك: {decrypted}</p>}
        </div>
      </main>
    );
  } else {
    redirect("/");
  }
}
