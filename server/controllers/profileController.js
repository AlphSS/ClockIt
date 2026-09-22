import bcrypt from "bcrypt";
import { supabaseAdmin } from "../config/supabase.js";
import { sendCollegeVerificationEmail } from "../utils/email.js";

export async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select(
        `
        *,
        colleges (
          id,
          name,
          college_domains (
            id,
            domain
          )
        )
      `,
      )
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Get profile error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch profile.",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;

    const { fullName, username, universityId, bio } = req.body;

    // Basic validation
    if (!fullName || !username) {
      return res.status(400).json({
        success: false,
        message: "Full name and username are required.",
      });
    }

    // Username validation
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: "Username can only contain letters, numbers and underscores.",
      });
    }

    // Check username belongs to another user
    const { data: existingProfile, error: usernameError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", userId)
      .maybeSingle();

    if (usernameError) {
      console.error("Username check error:", usernameError);

      return res.status(500).json({
        success: false,
        message: "Unable to check username.",
      });
    }

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Username is already taken.",
      });
    }

    // If universityId is provided, verify that the college exists
    if (universityId) {
      const { data: college, error: collegeError } = await supabaseAdmin
        .from("colleges")
        .select("id")
        .eq("id", universityId)
        .eq("is_active", true)
        .maybeSingle();

      if (collegeError) {
        console.error("College check error:", collegeError);

        return res.status(500).json({
          success: false,
          message: "Unable to verify university.",
        });
      }

      if (!college) {
        return res.status(400).json({
          success: false,
          message: "Invalid university selected.",
        });
      }
    }

    // Update profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: fullName,
        username,
        university_id: universityId || null,
        bio: bio || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select(
        `
        *,
        colleges (
          id,
          name,
          college_domains (
            id,
            domain
          )
        )
        `,
      )
      .single();

    if (profileError) {
      console.error("Update profile error:", profileError);

      return res.status(500).json({
        success: false,
        message: "Unable to update profile.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

export async function getColleges(req, res) {
  try {
    const { data: colleges, error } = await supabaseAdmin
      .from("colleges")
      .select(
        `
        id,
        name,
        college_domains (
          id,
          domain
        )
      `,
      )
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error("Get colleges error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch universities.",
      });
    }

    return res.status(200).json({
      success: true,
      colleges,
    });
  } catch (error) {
    console.error("Get colleges error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

export async function sendCollegeOtp(req, res) {
  try {
    const userId = req.user.id;
    const { collegeEmail } = req.body;

    if (!collegeEmail) {
      return res.status(400).json({
        success: false,
        message: "College email is required.",
      });
    }

    const email = collegeEmail.trim().toLowerCase();

    // Get the user's selected university
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("university_id")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    if (!profile.university_id) {
      return res.status(400).json({
        success: false,
        message: "Please select your university first.",
      });
    }

    // Get the allowed college domain
    const { data: collegeDomain, error: domainError } = await supabaseAdmin
      .from("college_domains")
      .select("domain")
      .eq("college_id", profile.university_id)
      .eq("is_active", true)
      .single();

    if (domainError || !collegeDomain) {
      return res.status(400).json({
        success: false,
        message: "No email domain is configured for your university.",
      });
    }

    const allowedDomain = collegeDomain.domain.toLowerCase();

    // Validate college email domain
    if (!email.endsWith(`@${allowedDomain}`)) {
      return res.status(400).json({
        success: false,
        message: `Please use your ${allowedDomain} email address.`,
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // OTP expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Remove previous OTPs for this user
    await supabaseAdmin
      .from("college_email_verifications")
      .delete()
      .eq("user_id", userId);

    // Store hashed OTP
    const { error: insertError } = await supabaseAdmin
      .from("college_email_verifications")
      .insert({
        user_id: userId,
        college_email: email,
        otp_hash: otpHash,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error("OTP storage error:", insertError);

      return res.status(500).json({
        success: false,
        message: "Unable to create verification request.",
      });
    }
    console.log(`College OTP for ${email}: ${otp}`);

    try {
      // await sendCollegeVerificationEmail(email, otp);
    } catch (emailError) {
      console.log("Email could not be sent. Continuing in development mode.");
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your college email.",
    });
  } catch (error) {
    console.error("Send college OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

export async function verifyCollegeOtp(req, res) {
  try {
    const userId = req.user.id;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Verification code is required.",
      });
    }

    // OTP must be exactly 6 digits
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Verification code must contain 6 digits.",
      });
    }

    // Get the pending verification
    const { data: verification, error: verificationError } = await supabaseAdmin
      .from("college_email_verifications")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (verificationError || !verification) {
      return res.status(400).json({
        success: false,
        message: "No active verification request found.",
      });
    }

    // Check expiration
    if (new Date(verification.expires_at) < new Date()) {
      await supabaseAdmin
        .from("college_email_verifications")
        .delete()
        .eq("id", verification.id);

      return res.status(400).json({
        success: false,
        message: "Verification code has expired.",
      });
    }

    // Maximum 5 attempts
    if (verification.attempts >= 5) {
      await supabaseAdmin
        .from("college_email_verifications")
        .delete()
        .eq("id", verification.id);

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new code.",
      });
    }

    // Compare OTP with stored hash
    const isValid = await bcrypt.compare(otp, verification.otp_hash);

    if (!isValid) {
      const newAttempts = verification.attempts + 1;

      await supabaseAdmin
        .from("college_email_verifications")
        .update({
          attempts: newAttempts,
        })
        .eq("id", verification.id);

      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    // OTP is valid → verify college email
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        college_email: verification.college_email,
        college_verified: true,
      })
      .eq("id", userId);

    if (updateError) {
      console.error("College verification update error:", updateError);

      return res.status(500).json({
        success: false,
        message: "Unable to verify college email.",
      });
    }

    // Delete OTP after successful verification
    await supabaseAdmin
      .from("college_email_verifications")
      .delete()
      .eq("id", verification.id);

    return res.status(200).json({
      success: true,
      message: "College email verified successfully.",
    });
  } catch (error) {
    console.error("Verify college OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

// ==========================================
// GET USER PREFERENCES
// ==========================================

export async function getPreferences(req, res) {
  try {
    const userId = req.user.id;

    const [flatResult, flatmateResult] = await Promise.all([
      supabaseAdmin
        .from("flat_preferences")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(),

      supabaseAdmin
        .from("flatmate_preferences")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(),
    ]);

    if (flatResult.error) {
      console.error("Get flat preferences error:", flatResult.error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch flat preferences.",
      });
    }

    if (flatmateResult.error) {
      console.error(
        "Get flatmate preferences error:",
        flatmateResult.error,
      );

      return res.status(500).json({
        success: false,
        message: "Unable to fetch flatmate preferences.",
      });
    }

    return res.status(200).json({
      success: true,
      flatPreferences: flatResult.data,
      flatmatePreferences: flatmateResult.data,
    });
  } catch (error) {
    console.error("Get preferences error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}


// ==========================================
// UPDATE USER PREFERENCES
// ==========================================

export async function updatePreferences(req, res) {
  try {
    const userId = req.user.id;

    const { flatPreferences, flatmatePreferences } = req.body;

    // Save flat preferences
    if (flatPreferences) {
      const { error: flatError } = await supabaseAdmin
        .from("flat_preferences")
        .upsert(
          {
            user_id: userId,
            ...flatPreferences,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          },
        );

      if (flatError) {
        console.error("Update flat preferences error:", flatError);

        return res.status(500).json({
          success: false,
          message: "Unable to update flat preferences.",
        });
      }
    }

    // Save flatmate preferences
    if (flatmatePreferences) {
      const { error: flatmateError } = await supabaseAdmin
        .from("flatmate_preferences")
        .upsert(
          {
            user_id: userId,
            ...flatmatePreferences,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          },
        );

      if (flatmateError) {
        console.error(
          "Update flatmate preferences error:",
          flatmateError,
        );

        return res.status(500).json({
          success: false,
          message: "Unable to update flatmate preferences.",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Preferences updated successfully.",
    });
  } catch (error) {
    console.error("Update preferences error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}
