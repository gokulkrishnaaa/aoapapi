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
  baseurl: string;
}

export const NonSchWelcome = ({
  name = "<Name>",
  baseurl = "<url>",
}: CandidateWelcomeProps) => (
  <Html>
    <Head />
    <Preview>Welcome to the Amrita Admissions</Preview>
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
            <Text className="text-sm leading-6 text-gray-700 italic">
              Thank you!
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              We are pleased to see your interest in B.Tech programmes under
              Regular Fee (Non-Scholarship category). For more details, please
              contact{" "}
              <span className="font-bold">
                90470 84597 / 0422 -2685005 / Email ID:{" "}
                <Link
                  href="mailto:engg@amrita.edu"
                  className="text-pink-800 underline"
                >
                  engg@amrita.edu
                </Link>{" "}
              </span>
            </Text>
            <Text className="text-sm leading-6 text-gray-700 font-bold">
              You may opt your preferred branches and campuses while filling in
              the online application form.
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              Appearance in the Amrita Entrance Examination – Engineering (AEEE)
              or JEE Mains is mandatory for all the candidates.
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              Admissions are based on the marks secured in +2 (Maths / Physics /
              Chemistry).
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              Admission is subject to the candidate satisfying the eligibility
              norms fixed by the university and availability of seats
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              Please beware of fraudulent messages. Registration for Regular Fee
              (Non-Scholarship category) admission can be done only through this
              website link.
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              All Regular Fee (Non-Scholarship Category)/NRI admissions are
              conducted through the office of the Principal Director, CIR,
              Amrita Vishwa Vidyapeetham. We do not have any agents or
              representatives for admission. Students and parents are advised
              not to approach any middlemen but apply themselves directly.
            </Text>
            <Text className="text-sm leading-6 text-gray-700 font-bold">
              Please note: Candidates have to pay only the fee prescribed for
              the course/campus and nothing more.
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              Welcome to a world of possibilities. We look forward to meeting
              you in person.
            </Text>
            <Text className="text-sm leading-6 text-gray-700">
              To check your application status and profile, visit: {""}
              <Link href={baseurl} className="text-pink-800 underline">
                Amrita Online Application Portal (AOAP) managed by Directorate
                of Admissions.
              </Link>
            </Text>
          </Section>

          <Text>
            Thanks & Regards,
            <br /> <br />
            Admission Coordinator <br />
            Corporate & Industry Relations (CIR) <br />
            Amrita Vishwa Vidyapeetham <br />
            Amritanagar Post, Ettimadai <br />
            Coimbatore - 641 112 - Tamil Nadu - India
          </Text>
          <Hr />
          <Text>© Amrita Vishwa Vidyapeetham</Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default NonSchWelcome;
