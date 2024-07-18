import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    const cookieStore = cookies();
    cookieStore.delete("auth_session");
    return NextResponse.json("ok");
  } catch (error) {
    console.log(`SIGNOUT_POST:${error}`);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
};
