import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import EmailConfirm from "@/emails/email_confirm";
import { encryptPro } from "@/utils/crypto_pro";

const prisma = new PrismaClient({});
const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email } = body;

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!findUser) {
      const user = await prisma.user.create({
        data: {
          email,
        },
      });
    }

    const generateRandomCode = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const token = generateRandomCode();

    // تشفير التوكين

    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const verificationToken = await prisma.verificationToken.create({
      data: {
        email,
        token: encryptPro(token),
        expires,
      },
    });

    await resend.emails.send({
      from: "noreply@taysira.com",
      to: [`${email}`],
      subject: "التحقق من البريد الإلكتروني",
      react: EmailConfirm({
        link: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${email}?token=${encryptPro(token)}`,
      }),
    });

    return NextResponse.json(findUser);
  } catch (error) {
    console.log(`LOGIN_POST:${error}`);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
};
