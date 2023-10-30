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
          <Text className="mb-3 text-sm leading-5 text-gray-700">
            Dear {name},
          </Text>
          <Section style={paragraphContent}>
            <Hr style={hr} />
            <Text className="text-sm leading-6 text-gray-700">
              We hope this message finds you well. We are delighted to welcome
              you to the Amrita Entrance Examination Registration Portal and
              appreciate your efforts in completing your profile.
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
              <li>Sign in to your application dashboard on the portal.</li>
              <li>Click on “Complete Registration”.</li>
              <li>Follow the instructions to complete the payment securely.</li>
            </ol>
            <Text className="text-sm leading-6 text-gray-700">
              Once the payment is received and processed, you will be fully
              registered for the examination, and we will provide you with all
              the necessary details regarding the examination date, venue, and
              any additional information you may require.
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              If you encounter any issues or have questions regarding the
              registration fee payment or any other aspect of the registration
              process, please do not hesitate to reach out to our dedicated
              support team at{" "}
              <Link
                href="mailto:doa@amrita.edu"
                className="text-pink-800 underline"
              >
                doa@amrita.edu
              </Link>{" "}
              or call our helpline at . We are here to assist you every step of
              the way.
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
const main = {
  backgroundColor: "#dbddde",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const sectionLogo = {
  padding: "0 40px",
};

const headerBlue = {
  marginTop: "-1px",
};

const container = {
  margin: "30px auto",
  width: "610px",
  backgroundColor: "#fff",
  borderRadius: 5,
  overflow: "hidden",
};

const containerContact = {
  backgroundColor: "#f0fcff",
  width: "90%",
  borderRadius: "5px",
  overflow: "hidden",
  paddingLeft: "20px",
};

const heading = {
  fontSize: "14px",
  lineHeight: "26px",
  fontWeight: "700",
  color: "#004dcf",
};

const paragraphContent = {
  padding: "0 40px",
};

const paragraphList = {
  paddingLeft: 40,
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#3c4043",
};

const link = {
  ...paragraph,
  color: "#004dcf",
};

const hr = {
  borderColor: "#e8eaed",
  margin: "20px 0",
};

export default CandidateWelcome;
