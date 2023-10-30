import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface SimpleMailOTPProps {
  code: string;
}

export const OtpMail = ({ code = "345678" }: SimpleMailOTPProps) => (
  <Html>
    <Head />
    <Preview>Verification Code to login</Preview>
    <Tailwind>
      <Body className="bg-white my-auto mx-auto font-sans">
        <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
          <Img
            src="https://dt19wmazj2dns.cloudfront.net/wp-content/uploads/2023/10/logo-colored.svg"
            width="170"
            height="50"
            alt="Amrita Vishwa Vidyapeetham"
            className="mx-auto mb-6"
          />
          <Text className="mb-3 text-base leading-5 text-gray-700">
            Dear Prospective Amritian,
          </Text>
          <Text className="text-base leading-5 text-gray-700">
            Congratulations for showing interest in the undergraduate programmes
            offered by Amrita Vishwa Vidyapeetham.
          </Text>
          <Section className="my-6">
            <Text className="mb-2 text-base leading-5 text-gray-700">
              Your OTP is:{" "}
              <code className="mx-auto font-mono font-bold px-4 py-1 bg-gray-300 tracking-tight text-3xl rounded-lg text-gray-700">
                {code}
              </code>
            </Text>
            <Text className="mb-3 text-base leading-5 text-gray-700 italic">
              <span className="text-red-600">*</span> OTP is valid only for 3
              minutes
            </Text>
          </Section>

          <Text>
            Best regards,
            <br />
            Directorate of Admissions & Academic Outreach
          </Text>
          <Hr />
          <Text>© Amrita Vishwa Vidyapeetham</Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default OtpMail;
