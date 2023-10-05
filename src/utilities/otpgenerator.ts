export default function generateOtp() {
  // Generate a random 6-digit number
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Ensure the OTP is exactly 6 digits long (pad with leading zeros if necessary)
  return otp.toString().padStart(6, "0");
}
