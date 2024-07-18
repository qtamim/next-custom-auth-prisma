import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  // @ts-ignore
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface EmailConfirmProps {
  email?: string;
  link?: string;
}

export const EmailConfirm = ({ link }: EmailConfirmProps) => {
  const previewText = `Confirm your email`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`https://taysira.com/TaysiraFav.png`}
                width="40"
                height="37"
                alt="Taysira Logo"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              التحقق من البريد الإلكتروني
            </Heading>
            <Text
              dir="rtl"
              className="text-black text-right text-[14px] leading-[24px]"
            >
              نشكرك على تسجيل دخولك معنا في منصة <strong>تيسيرة</strong>{" "} 
              نريد التحقق من هويتك. يمكنك التحقق أدناه.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#2c61d1] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3 "
                href={link}
              >
                تـحقق الان
              </Button>
            </Section>
            <Text dir="rtl" className="text-black text-[14px] leading-[24px]">
              أو انسخ عنوان URL هذا والصقه في متصفحك:{" "}
            </Text>
            <Text className="text-[14px] leading-[24px]">
              <Link
                href={link}
                className="text-blue-600 text-left no-underline"
              >
                {link}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text
              className="text-[#666666] text-[12px] leading-[24px]"
              dir="rtl"
            >
              إذا لم تقم بتقديم هذا الطلب، فيمكنك تجاهل هذه الرسالة الإلكترونية.{" "}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailConfirm;
