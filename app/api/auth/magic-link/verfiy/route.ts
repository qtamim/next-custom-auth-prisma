import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { decryptPro, encryptPro } from "@/utils/crypto_pro";
import { cookies } from "next/headers";

const prisma = new PrismaClient({});

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email, token } = body;

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        email: email,
      },
      orderBy: {
        id: "desc",
      },
    });

    if (verificationToken) {
      if (verificationToken?.expires > new Date()) {
        if (decryptPro(verificationToken?.token) == decryptPro(token)) {
          const user = await prisma.user.update({
            where: {
              email,
            },
            data: {
              isVerfied: true,
            },
          });
          let encrypted = encryptPro(user.id)


          cookies().set("auth_session", encrypted, { secure: true });

          return new NextResponse("تم التحقق بنجاح", { status: 200 });
        } else {
          return new NextResponse("يبدو أن الرمز غير صحيح, حاول مرة أخرى", {
            status: 500,
          });
        }
      } else {
        // const deleteVerificationToken = await prisma.verificationToken.delete({
        //   where: {
        //     id: verificationToken.id,
        //   },
        // });
        return new NextResponse("أنتهت صلاحية الرمز الخاص فيك", {
          status: 500,
        });
      }
    } else {
      return new NextResponse("توجد مشكلة ما", { status: 500 });
    }
  } catch (error) {
    console.log(`VERFIY_POST:${error}`);
    return new NextResponse(
      "لم يتم العثور على الرمز الخاص فيك, فد تكون مشكلة في الخادم",
      { status: 500 }
    );
  }
};
