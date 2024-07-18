"use client";
import { useAuth } from "@/components/auth-provider";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { redirect, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyPage = () => {
  const params = useParams();

  const { user, loading } = useAuth();

  const email = decodeURIComponent(String(params.email));
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');  

  const [isLoading, setIsLoading] = useState(true);

  const [message, setMessage] = useState<string | null>(null);
  const [response, setResponseCode] = useState<number>();

  useEffect(() => {
    if (email && token) {
      axios
        .post(`/api/auth/magic-link/verfiy`, { email, token })
        .then((response) => {
          setResponseCode(response.status);
          setMessage(response.data);
        })
        .catch((error) => {
          setResponseCode(error.response.status);
          setMessage(String(error.response.data));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [email, token]);

  if (user && !loading) {
    redirect("/")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full py-24 sm:px-24 px-8">
      <div dir="rtl" className="mt-[20vh] space-y-8 ">
        {isLoading ? (
          <>
            <div className="p-2 text-center space-y-2">
              <h2 className="sm:text-3xl text-lg w-full my-2 text-center font-medium tracking-tight first:mt-0">
                جاري التحقق
              </h2>
              <p>إنتظر قليلاً فحسب.</p>
            </div>
            <LoaderCircle size={40} className="mx-auto animate-spin" />
          </>
        ) : (
          <div className="text-center ">
            <h2 className="sm:text-3xl text-lg w-full my-2 text-center font-medium tracking-tight first:mt-0">
              {message}
            </h2>
            {response == 200 ? (
              <Link href={"/"}>
                <p
                  className="p-1 hover:bg-muted w-fit rounded-md transition-all cursor-pointer mx-auto"
                >
                  يمكنك الدخول إلى الموقع الان.
                </p>
              </Link>
            ) : (
              <Link href={"/"}>
                <p
                  className="p-1 hover:bg-muted w-fit rounded-md transition-all cursor-pointer mx-auto"
                >
                  العودة للصفحة الرئيسية.
                </p>
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default VerifyPage;
