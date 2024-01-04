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

export const SlotBookingWelcome = ({
  name = "<Name>",
}: CandidateWelcomeProps) => (
  <Html>
    <Head />
    <Preview>
      Welcome to the Amrita Entrance Examination - Engineering 2024
    </Preview>
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
              Congratulations! We are pleased to inform you that your slot
              booking for Phase – I of AEEE 2024 has been successfully
              completed.
            </Text>
            <Text className="text-md text-black font-bold">
              Admit Card Download Information:{" "}
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              You will receive an email notification on 12th Jan to download the
              Admit Card.
            </Text>
            <Text className="text-md text-black font-bold">
              Important Instructions:{" "}
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              Upon downloading your Admit Card/Hall Ticket, please ensure that
              the details entered during the application/slot booking process
              match the information on the Admit Card.
            </Text>
            <Text className="text-md text-black font-bold">
              Reporting Discrepancies:{" "}
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              If you identify any discrepancies or errors in the Admit Card
              fields compared to the details submitted during the
              application/slot booking, please promptly notify us by sending an
              email to{" "}
              <Link
                href="mailto:btech@amrita.edu"
                className="text-pink-800 underline"
              >
                btech@amrita.edu
              </Link>{" "}
            </Text>
            <Text className="text-md text-black font-bold">
              Important Note:{" "}
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              Please be aware that changes in the date, slot, and venue for any
              reason will not be entertained.
            </Text>
            <Text className="text-md text-black font-bold">
              Examination Details:{" "}
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              You are required to appear for Phase-I of AEEE 2024 at the venue,
              date, and time specified in the Admit Card/Hall Ticket.
            </Text>
            <Text className="text-md text-black font-bold">
              Additional Information:{" "}
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              In the event that you do not download the Admit Card/Hall Ticket
              after slot booking or fail to appear for the examination after
              downloading your hall ticket, an additional payment of INR 600
              will be required for participation in Phase - II of AEEE 2024,
              proposed to be conducted in the second week of May 2024.
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              Should you have any queries, contact us at{" "}
              <Link
                href="mailto:btech@amrita.edu"
                className="text-pink-800 underline"
              >
                btech@amrita.edu
              </Link>{" "}
              / Call:044-462 76066
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

export default SlotBookingWelcome;
