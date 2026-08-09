// Temporary development OTP
const DEV_OTP = "123456";

export async function sendPhoneOtp(phone) {
  console.log(`OTP sent to ${phone}`);
  console.log(`Development OTP: ${DEV_OTP}`);

  return {
    success: true,
  };
}

export async function verifyPhoneOtp(phone, token) {
  if (token !== DEV_OTP) {
    throw new Error("Invalid OTP. Please try again.");
  }

  return {
    success: true,
  };
}