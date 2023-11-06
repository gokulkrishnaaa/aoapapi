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
  Link,
} from "@react-email/components";
import * as React from "react";

interface CandidateWelcomeProps {
  name: string;
}

export const CandidateWelcome = ({
  name = "<Name>",
}: CandidateWelcomeProps) => (
  <Html>
    <Head />
    <Preview>Welcome to the Amrita Online Admission Portal (AOAP)</Preview>
    <Tailwind>
      <Body className="bg-white my-auto mx-auto font-sans">
        <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[600px]">
          <Img
            src="https://dt19wmazj2dns.cloudfront.net/wp-content/uploads/2023/10/logo-colored.svg"
            width="170"
            height="50"
            alt="Amrita Vishwa Vidyapeetham"
            className="mx-auto mb-6"
          />
          <Text className="mb-3 text-lg leading-5 text-gray-700 text-center font-bold">
            Directorate of Admissions
          </Text>
          <Text className="mb-3 text-sm leading-5 text-gray-700">
            Dear {name},
          </Text>
          <Section className="px-10">
            <Hr className="border-t border-b border-gray-300 my-5" />
            <Text className="text-sm leading-6 text-gray-700">
              We hope this message finds you well. We are delighted to see your
              application and appreciate your efforts in completing your
              profile.
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              While we're thrilled to have you as an applicant, we noticed that
              the registration fee payment is pending. To move forward with the
              registration process and secure your spot in the examination, we
              kindly request you to complete the payment of the registration fee
              as soon as possible.
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              Here's a quick guide to make the payment:
            </Text>
            <ol className="text-sm leading-6 text-gray-700">
              <li>
                Sign in to the portal and you can see the entrance examination.
              </li>
              <li>Click on “Complete Registration”.</li>
              <li>Follow the instructions to complete the payment securely.</li>
            </ol>
            <Text className="text-sm leading-6 text-gray-700">
              Once the payment is received and processed, you will be fully
              registered for the selected AEE, and we will provide you with all
              the necessary details regarding the examination date, venue, and
              any additional information you may require. Please note the
              application number that will be generated only after the
              successful payment.
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              If you encounter any issues or have questions regarding the
              registration fee payment or any other aspect of the registration
              process, please do not hesitate to reach out to our dedicated
              support team at{" "}
              <Link
                href="mailto:aeee@amrita.edu"
                className="text-pink-800 underline"
              >
                aeee@amrita.edu
              </Link>{" "}
              or call our helpline at{" "}
              <span className="font-bold">044-462 76066</span>. We are here to
              assist you every step of the way.
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              Help us to support you well. Request you to complete the following
              survey:{" "}
              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSfKC7wikqLeU93po-YBtf2pSkVh8nAarUHL1s9TDP335Ql7ew/viewform"
                className="text-pink-800 underline"
              >
                Click here for survey
              </Link>
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              Thank you for choosing Amrita Vishwa Vidyapeetham for your
              educational journey. We wish you the best of luck in your upcoming
              entrance examination.
            </Text>
          </Section>

          <Text>
            Warm regards,
            <br /> <br />
            Director (Admissions) <br />
            Directorate of Admissions <br />
            Amrita Vishwa Vidyapeetham
          </Text>
          <Hr />
          <Text>© Amrita Vishwa Vidyapeetham</Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default CandidateWelcome;
