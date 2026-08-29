import { useState } from "react";
import { User, Phone } from "lucide-react";
import { sendOtp } from "../../services/authApi";

import OtpVerification from "./OtpVerification";
import SetPassword from "./SetPassword";
import AccountCreated from "./AccountCreated";
import { registerUser } from "../../services/authApi";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
  });
  const [registrationToken, setRegistrationToken] = useState(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error for this field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  function validate() {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must contain at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers and underscores";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (!/^[a-zA-Z ]+$/.test(formData.fullName)) {
      newErrors.fullName = "Name can only contain letters and spaces";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      return;
    }
    try {
      const formattedPhone = `+91${formData.phone}`;
      await sendOtp(formattedPhone);
      setStep(2);
    } catch (error) {
      setErrors({
        phone: error.message || "Unable to send OTP",
      });
    }
  }

  async function handleAccountCreation(password) {
    try {
      const result = await registerUser({
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        phone: `+91${formData.phone}`,
        password,
        registrationToken,
      });

      console.log("Account created:", result);

      setStep(4);
    } catch (error) {
      console.error(error);

      alert(error.message);
    }
  }

  if (step === 2) {
    return (
      <OtpVerification
        phone={formData.phone}
        onBack={() => setStep(1)}
        onVerified={(token) => {
          setRegistrationToken(token);
          setStep(3);
        }}
      />
    );
  }
  if (step === 3) {
    return (
      <SetPassword
        onBack={() => setStep(2)}
        onComplete={handleAccountCreation}
      />
    );
  }
  if (step === 4) {
    return (
      <AccountCreated
        name={formData.fullName}
        onContinue={() => {
          window.location.href = "/";
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">UniNest</h1>

          <p className="mt-1 text-sm text-text-secondary">
            Your Campus, Your Community
          </p>
        </div>

        {/* Registration Card */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-text-primary">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Enter your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Username
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className={`w-full rounded-xl border ${
                    errors.username ? "border-danger" : "border-border"
                  } bg-surface py-3 pl-10 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10`}
                />
              </div>

              {errors.username && (
                <p className="mt-1.5 text-xs text-danger">{errors.username}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full rounded-xl border ${
                    errors.fullName ? "border-danger" : "border-border"
                  } bg-surface py-3 pl-10 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10`}
                />
              </div>

              {errors.fullName && (
                <p className="mt-1.5 text-xs text-danger">{errors.fullName}</p>
              )}
            </div>

            {/* Email ID */}
            <div>
              <label className="block text-sm font-medium text-text-primary">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none focus:border-primary"
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Phone Number
              </label>

              <div className="flex gap-2">
                <div className="flex items-center rounded-xl border border-border bg-surface-muted px-3 text-sm text-text-secondary">
                  +91
                </div>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  className={`min-w-0 flex-1 rounded-xl border ${
                    errors.phone ? "border-danger" : "border-border"
                  } bg-surface py-3 px-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10`}
                />
              </div>

              {errors.phone && (
                <p className="mt-1.5 text-xs text-danger">{errors.phone}</p>
              )}

              <p className="mt-2 text-xs text-text-muted">
                We'll send an OTP to verify your phone number.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover active:scale-[0.99]"
            >
              Send OTP
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <button
              type="button"
              className="font-semibold text-primary hover:text-primary-hover"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
