import generateOtp from "../../utilities/otpgenerator";
import prisma from "../../db";
import isValidPhone from "../../utilities/checkphone";

export const sendPhoneOtp = async (req, res) => {
  const { phone } = req.body;
  console.log(isValidPhone(phone));

  if (!phone || !isValidPhone(phone)) {
    return res.json({ created: false });
  }

  const currentDateTime = new Date();
  const expirationDateTime = new Date(currentDateTime.getTime() + 5 * 60000); // 5 minutes in milliseconds
  const code = generateOtp();
  try {
    const newPhoneOtp = await prisma.numberOtp.create({
      data: {
        number: phone,
        code,
        expiresAt: expirationDateTime, // Set the expiration time
      },
    });
    messageOtp({ phone, code });
  } catch (error) {
    return res.json({ created: false });
  }

  return res.json({ created: true });
};

async function messageOtp({ phone, code }) {
  const username = "amritacbticts";
  const password = "icts123";
  const sender = "AMRITA";
  const to = phone;
  const reqid = "0";
  const format = "text";
  const route_id = "760";
  const Template_ID = "1707169717211527654";
  const PE_ID = "1701159142685679586";
  const message = `${code}%20is%20your%20AOAP%20verification%20code.%20Amrita`;
  var smsUrl = `http://bulksmscochin.in/API/WebSMS/Http/v1.0a/index.php?username=${username}&password=${password}&sender=${sender}&to=${to}&reqid=${reqid}&format=${format}&route_id=${route_id}&message=${message}&Template_ID=${Template_ID}&PE_ID=${PE_ID}`;
  const successMessage = "Message+Sent+Successfully";
  try {
    const response = await fetch(smsUrl);

    if (response.ok) {
      const result = await response.text();
      console.log("SMS sent successfully. Response:", result);
    } else {
      console.error("Failed to send SMS. HTTP Status Code:", response.status);
    }
  } catch (error) {
    console.error("An error occurred while sending the SMS:", error);
  }
}
