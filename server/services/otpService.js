import crypto from "crypto";

const DEV_OTP = "123456";

const otpStore = new Map();

const registrationTokenStore = new Map();

export function generateOtp(phone) {
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(phone, {
    otp: DEV_OTP,
    expiresAt,
    verified: false,
  });

  console.log(
    `Development OTP for ${phone}: ${DEV_OTP}`
  );

  return true;
}

export function verifyOtp(phone, enteredOtp) {
  const record = otpStore.get(phone);

  if (!record) {
    return {
      success: false,
      message: "OTP not found. Please request a new OTP.",
    };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone);

    return {
      success: false,
      message: "OTP has expired. Please request a new OTP.",
    };
  }

  if (record.otp !== enteredOtp) {
    return {
      success: false,
      message: "Invalid OTP.",
    };
  }

  record.verified = true;

  // Generate registration token
  const registrationToken = crypto.randomBytes(32).toString("hex");

  registrationTokenStore.set(registrationToken, {
    phone,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  // OTP should not be usable again
  otpStore.delete(phone);

  return {
    success: true,
    message: "Phone number verified successfully.",
    registrationToken,
  };
}

export function verifyRegistrationToken(
  registrationToken,
  phone
) {
  const record =
    registrationTokenStore.get(registrationToken);

  if (!record) {
    return {
      success: false,
      message: "Invalid registration token.",
    };
  }

  if (Date.now() > record.expiresAt) {
    registrationTokenStore.delete(
      registrationToken
    );

    return {
      success: false,
      message:
        "Registration session has expired. Please verify your phone again.",
    };
  }

  if (record.phone !== phone) {
    return {
      success: false,
      message:
        "Registration token does not match the phone number.",
    };
  }

  return {
    success: true,
    phone: record.phone,
  };
}

export function consumeRegistrationToken(
  registrationToken
) {
  registrationTokenStore.delete(
    registrationToken
  );
}