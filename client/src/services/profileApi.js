import { supabase } from "./supabase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5800/api";

export async function getProfile() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("Session expired. Please log in again.");
  }

  const response = await fetch(`${API_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch profile.");
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


// ==========================================
// PREFERENCES APIs
// ==========================================

export async function getPreferences() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You are not logged in.");
  }

  const [flatResult, flatmateResult] = await Promise.all([
    supabase
      .from("flat_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle(),

    supabase
      .from("flatmate_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  

  if (flatResult.error) {
    throw new Error(
      flatResult.error.message || "Unable to fetch flat preferences."
    );
  }

  if (flatmateResult.error) {
    throw new Error(
      flatmateResult.error.message || "Unable to fetch flatmate preferences."
    );
  }

  return {
    flatPreferences: flatResult.data,
    flatmatePreferences: flatmateResult.data,
  };
}

export async function updatePreferences(preferencesData) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You are not logged in.");
  }

  const results = [];

  if (preferencesData.flatPreferences) {
    const { data, error } = await supabase
      .from("flat_preferences")
      .upsert(
        {
          user_id: user.id,
          ...preferencesData.flatPreferences,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .single();

    if (error) {
      throw new Error(
        error.message || "Unable to save flat preferences."
      );
    }

    results.push({ flatPreferences: data });
  }

  if (preferencesData.flatmatePreferences) {
    const { data, error } = await supabase
      .from("flatmate_preferences")
      .upsert(
        {
          user_id: user.id,
          ...preferencesData.flatmatePreferences,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .single();

    if (error) {
      throw new Error(
        error.message || "Unable to save flatmate preferences."
      );
    }

    results.push({ flatmatePreferences: data });
  }

  return {
    success: true,
    results,
  };
}
