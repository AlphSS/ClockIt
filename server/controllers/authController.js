import { supabaseAdmin } from "../config/supabase.js";
import {
  verifyRegistrationToken,
  consumeRegistrationToken,
} from "../services/otpService.js";

export async function registerUser(req, res) {
  try {
    const { username, fullName, email, phone, password, registrationToken } =
      req.body;

    // Basic validation
    if (
      !username ||
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !registrationToken
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Username validation
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: "Username can only contain letters, numbers and underscores.",
      });
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    // Check username
    const { data: existingProfile, error: usernameError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (usernameError) {
      console.error(usernameError);

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

    const verification = verifyRegistrationToken(registrationToken, phone);

    if (!verification.success) {
      return res.status(401).json(verification);
    }

    // Create Supabase Auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        phone,
        password,
        phone_confirm: true,
        email_confirm: true,
      });

    if (authError) {
      console.error(authError);

      return res.status(400).json({
        success: false,
        message: authError.message,
      });
    }

    const user = authData.user;

    // Create application profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: user.id,
        username,
        full_name: fullName,
        phone,
      })
      .select()
      .single();

    if (profileError) {
      console.error(profileError);

      // Roll back Auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(user.id);

      return res.status(500).json({
        success: false,
        message: "Unable to create user profile.",
      });
    }
    consumeRegistrationToken(registrationToken);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: user.id,
        username: profile.username,
        fullName: profile.full_name,
        phone: profile.phone,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Login through Supabase Auth
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);

      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: data.session,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}
