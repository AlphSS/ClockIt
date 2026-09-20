import { supabase } from "./supabase";

const API_URL = "http://localhost:5800/api";

export async function getProfile() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  // console.log("ACCESS TOKEN:", session?.access_token);

  if (sessionError) {
    throw new Error("Unable to get session.");
  }

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(`${API_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to fetch profile.");
  }

  return result.profile;
}

export async function getColleges() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error("Unable to get session.");
  }

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(`${API_URL}/profile/colleges`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to fetch colleges.");
  }

  return result.colleges;
}

export async function updateProfile(profileData) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error("Unable to get session.");
  }

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to update profile.");
  }

  return result.profile;
}

export async function sendCollegeOtp(collegeEmail) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(`${API_URL}/profile/college/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      collegeEmail,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to send verification code.");
  }

  return result;
}

export async function verifyCollegeOtp(otp) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(`${API_URL}/profile/college/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      otp,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to verify college email.");
  }

  return result;
}
