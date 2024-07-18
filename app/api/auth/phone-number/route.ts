import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { encryptPro } from "@/utils/crypto_pro";
import twilio from "twilio";

const prisma = new PrismaClient({});

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { phone } = body;

    const accountSid = <string>process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = <string>process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, twilioToken);

    const findUser = await prisma.user.findUnique({
      where: {
        phoneNumber: phone,
      },
    });

    if (!findUser) {
      const user = await prisma.user.create({
        data: {
          phoneNumber: phone,
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
        phoneNumber: phone,
        token: encryptPro(token),
        expires,
      },
    });

    // هنا يتم إرسال رسالة القصيرة التي تحتوي على الرمز

    console.log(`your otp is: ${token}`)

    // await client.messages
    //   .create({
    //     body: `رمز الدخول الخاص فيك ${token}`,
    //     from: '+14786060593',
    //     to: phone,
    //   })
    //   .then((message) => {
    //     console.log(message)
    //     return new NextResponse("تم إرسال الرسالة بنجاح", { status: 200 });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     return new NextResponse("هناك خطأ ما", { status: 500 });
    //   });

    return NextResponse.json(findUser);
  } catch (error) {
    console.log(`LOGIN_POST:${error}`);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
};
