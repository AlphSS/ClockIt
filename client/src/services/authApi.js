const API_URL = "http://localhost:5800/api";

export async function sendOtp(phone) {
  const response = await fetch(`${API_URL}/auth/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to send OTP.");
  }

  return { data: data, status: response.status };
}

export async function verifyOtp(phone, otp) {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone,
      otp,
    }),
  });

  const data = await response.json();

  console.log("Verify OTP API response:", {
    status: response.status,
    data,
  });

  if (!response.ok) {
    throw new Error(data.message || "Invalid OTP.");
  }

  return data;
}

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed.");
  }

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch("http://localhost:5800/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed.");
  }

  return data;
}
