"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { LoadingButton } from "../loading-button";
import axios from "axios";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";

export default function SignInForm() {
  const [currentLoginMethod, setCurrentLoginMethod] = useState("phone");

  // email

  const [isEmailPending, setIsEmailPending] = useState<boolean>(false);
  const [emailCountdown, setEmailCountdown] = useState(0);

  const [isSendEmail, setIsSendEmail] = useState<boolean>(false);

  // phone

  const [isPhonePending, setIsPhonePending] = useState<boolean>(false);
  const [phoneCountdown, setPhoneCountdown] = useState(0);

  const [isSendSMS, setIsSendSMS] = useState<boolean>(false);

  const [otp, setOtp] = useState();

  const [message, setMessage] = useState<string | null>(null);
  const [response, setResponseCode] = useState<number>();

  // inputs states
  const [emailInput, setEmailInput] = useState<string>("");
  const [phoneInput, setPhoneInput] = useState<string>("");

  const authSession = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth_session="));

  useEffect(() => {
    if (authSession) {
      setTimeout(() => {
        window.location.reload();
      }, 3500);
    }
  }, [authSession]);

  // email

  const MagicLinkSubmit = (e: any) => {
    e.preventDefault();
    setIsEmailPending(true);

    axios
      .post("/api/auth/magic-link", {
        email: emailInput,
      })
      .then(function (response) {
        setIsEmailPending(false);
        setIsSendEmail(true);
        setEmailCountdown(60);
      })
      .catch(function (error) {
        console.log(error);
        setIsEmailPending(false);
      });
  };

  useEffect(() => {
    if (emailCountdown > 0) {
      const timer = setTimeout(
        () => setEmailCountdown(emailCountdown - 1),
        1000
      );
      return () => clearTimeout(timer);
    } else {
      setIsEmailPending(false); // إعادة تفعيل الزر بعد انتهاء العد التنازلي
    }
  }, [emailCountdown]);

  // phone

  function getNumberLength(num: number): number {
    return num.toString().length;
  }

  useEffect(() => {
    if (getNumberLength(Number(otp)) == 6 && phoneInput) {
      setIsPhonePending(true);

      axios
        .post(`/api/auth/phone-number/verfiy`, {
          phone: phoneInput,
          token: otp,
        })
        .then((response) => {
          console.log(response);
          setPhoneCountdown(60);
          setResponseCode(response.status);
          setMessage(response.data);
        })
        .catch((error) => {
          console.log(error);
          setResponseCode(error.response.status);
          setMessage(String(error.response.data));
        })
        .finally(() => {
          setIsPhonePending(false);
        });
    }
  }, [otp, phoneInput]);

  const PhoneSubmit = (e?: any) => {
    e?.preventDefault();
    if (phoneInput.length == 13) {
      setIsPhonePending(true);

      axios
        .post("/api/auth/phone-number", {
          phone: phoneInput,
        })
        .then(function (response) {
          setIsPhonePending(false);
          setIsSendSMS(true);
          setPhoneCountdown(60);
        })
        .catch(function (error) {
          console.log(error);
          setIsPhonePending(false);
        });
    }
  };

  useEffect(() => {
    if (phoneCountdown > 0) {
      const timer = setTimeout(
        () => setPhoneCountdown(phoneCountdown - 1),
        1000
      );
      return () => clearTimeout(timer);
    } else {
      setIsPhonePending(false); // إعادة تفعيل الزر بعد انتهاء العد التنازلي
    }
  }, [phoneCountdown]);

  // switch login method

  const switchLoginMethod = () => {
    if (currentLoginMethod == "phone") {
      setCurrentLoginMethod("email");
    } else {
      setCurrentLoginMethod("phone");
    }
  };

  return (
    <div className="sm:w-[500px] w-[350px]  mx-auto mt-[20vh]" dir="rtl">
      <h2 className="scroll-m-20 pb-2 text-3xl text-center my-6 font-semibold tracking-tight first:mt-0">
        تسجيل الدخول
      </h2>
      {currentLoginMethod == "email" ? (
        isSendEmail ? (
          <form
            dir="rtl"
            className="space-y-5"
            onSubmit={emailCountdown == 0 ? MagicLinkSubmit : () => {}}
          >
            <p className="text-center h-10 border rounded-md p-2">
              لقد تم إرسال بريد التأكيد بنجاح, يرجى التأكيد للاستمرار
            </p>
            <LoadingButton
              loading={isEmailPending}
              type="submit"
              className="w-full mt-5"
              disabled={emailCountdown !== 0 || isEmailPending}
            >
              {isSendEmail && emailCountdown !== 0
                ? `إنتظر ${emailCountdown} ثانية للإرسال بريد أخر`
                : "إعادة الإرسال"}
            </LoadingButton>
          </form>
        ) : (
          <form
            dir="rtl"
            className="space-y-5"
            onSubmit={MagicLinkSubmit}
          >
            <Input
              required
              onChange={(e) => {
                setEmailInput(e.target.value);
              }}
              disabled={isEmailPending}
              type="email"
              placeholder="البريد الإلكتروني"
            />
            <LoadingButton
              loading={isEmailPending}
              onClick={MagicLinkSubmit}
              type="submit"
              className="w-full mt-5"
            >
              تسجيل الدخول
            </LoadingButton>
          </form>
        )
      ) : isSendSMS ? (
        <form
          dir="rtl"
          className="space-y-5"
          onSubmit={phoneCountdown == 0 ? PhoneSubmit : () => {}}
        >
          <div dir="ltr" className="mx-auto flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              disabled={isPhonePending}
              onChange={(value: any) => {
                setOtp(value);
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <LoadingButton
            loading={isPhonePending}
            type="submit"
            className="w-full mt-5"
            disabled={phoneCountdown !== 0 || isPhonePending}
          >
            {isSendSMS && phoneCountdown !== 0
              ? `إنتظر ${phoneCountdown} ثانية`
              : "إعادة الإرسال"}
          </LoadingButton>
          <p
            className={`my-2 text-base ${
              response == 200 ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        </form>
      ) : (
        <form dir="rtl" className="space-y-5" onSubmit={PhoneSubmit}>
          <div dir="ltr">
            <PhoneInput
              defaultCountry="sa"
              value={phoneInput}
              disabled={isPhonePending}
              onChange={(e) => {
                setPhoneInput(e);
              }}
              placeholder="رقم الهاتف"
              required
              name="phone"
              className={`flex ${
                isPhonePending && "opacity-75 cursor-not-allowed"
              } h-10 w-full rounded-md border border-input bg-background px-0 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground 
        [&>input]:outline-none`}
            />
          </div>
          <LoadingButton
        dir="rtl"
            type="submit"
            onClick={PhoneSubmit}
            disabled={phoneInput.length != 13 || isPhonePending}
            loading={isPhonePending}
            className="w-full mt-5"
          >
            تسجيل الدخول
          </LoadingButton>
        </form>
      )}
      <p className="text-center p-6">أو</p>
      <Button
        dir="rtl"
        variant={"outline"}
        className="w-full"
        onClick={switchLoginMethod}
      >
        {currentLoginMethod == "phone"
          ? "تسجيل بأستخدام البريد الإلكتروني ✨"
          : "تسجيل بأستخدام رقم الهاتف"}
      </Button>
    </div>
  );
}
