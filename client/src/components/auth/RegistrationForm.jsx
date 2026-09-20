import { useState } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { sendOtp, registerUser } from "../../services/authApi";

import OtpVerification from "./OtpVerification";
import SetPassword from "./SetPassword";
import AccountCreated from "./AccountCreated";
import VerifyEmail from "./VerifyEmail";

function Register() {
  const navigate = useNavigate();

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
      await registerUser({
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        phone: `+91${formData.phone}`,
        password,
        registrationToken,
      });

      sessionStorage.setItem("registrationFullName", formData.fullName);
      sessionStorage.setItem("registrationEmail", formData.email);

      setStep(5);
    } catch (error) {
      alert(error.message);
    }
  }

  // OTP Verification
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

  // Password Setup
  if (step === 3) {
    return (
      <SetPassword
        onBack={() => setStep(2)}
        onComplete={handleAccountCreation}
      />
    );
  }

  // Account Created
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

  if (step === 5) {
    return <VerifyEmail email={formData.email} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ClockIt</h1>

          <p className="mt-2 text-sm text-gray-500">
            Your Campus, Your Community
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-gray-900">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Enter your details to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className={`w-full rounded-xl border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gray-200`}
                />
              </div>

              {errors.username && (
                <p className="mt-1.5 text-xs text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full rounded-xl border ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  } bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gray-200`}
                />
              </div>

              {errors.fullName && (
                <p className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full rounded-xl border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gray-200`}
              />

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>

              <div className="flex gap-2">
                <div className="flex items-center rounded-xl border border-gray-300 bg-gray-100 px-3 text-sm text-gray-500">
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
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gray-200`}
                />
              </div>

              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
              )}

              <p className="mt-2 text-xs text-gray-400">
                We'll send an OTP to verify your phone number.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99]"
            >
              Send OTP
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-gray-900 hover:underline"
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
