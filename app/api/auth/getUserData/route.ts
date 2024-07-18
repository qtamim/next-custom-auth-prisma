import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decryptPro } from "@/utils/crypto_pro";

const prisma = new PrismaClient({});

export const GET = async (req: Request) => {
  try {
    const cookieStore = cookies();
    const authSession = cookieStore.get("auth_session");

    if (authSession) {
      const findUser = await prisma.user.findUnique({
        where: {
          id: decryptPro(authSession?.value),
        },
      });
      return NextResponse.json(findUser);
    } else {
      return NextResponse.json(false);
    }
  } catch (error) {
    console.log(`USERDATA_GET:${error}`);
    return new NextResponse(
      "لم يتم العثور على الرمز الخاص فيك, فد تكون مشكلة في الخادم",
      { status: 500 }
    );
  }
};
