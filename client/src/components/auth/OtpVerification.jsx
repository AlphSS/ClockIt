import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { verifyOtp, sendOtp } from "../../services/authApi";

function OtpVerification({ phone, onBack, onVerified }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  function handleChange(index, value) {
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }

      return;
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedValue.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    setError("");

    const focusIndex = Math.min(pastedValue.length, 5);

    inputRefs.current[focusIndex]?.focus();
  }

  async function handleVerify(e) {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

      const result = await verifyOtp(formattedPhone, enteredOtp);

      onVerified(result.registrationToken);
    } catch (error) {
      setError(error.message || "Unable to verify OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (countdown > 0) return;

    try {
      setError("");

      const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

      await sendOtp(formattedPhone);

      setOtp(["", "", "", "", "", ""]);
      setCountdown(30);

      inputRefs.current[0]?.focus();
    } catch (error) {
      setError(error.message || "Unable to resend OTP.");
    }
  }

  const maskedPhone =
    phone.length >= 4 ? `+91 ******${phone.slice(-4)}` : `+91 ${phone}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">ClockIt</h1>

          <p className="mt-2 text-sm text-gray-500">
            Your Campus, Your Community
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Back */}
          <button
            type="button"
            onClick={onBack}
            className="mb-7 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={17} />
            Change phone number
          </button>

          {/* Icon */}
          <div className="mb-7 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <ShieldCheck size={32} className="text-gray-900" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              Verify your phone
            </h2>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-gray-500">
              Enter the 6-digit verification code sent to
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
              {maskedPhone}
            </p>
          </div>

          {/* OTP */}
          <form onSubmit={handleVerify} className="mt-8">
            <div
              className="flex justify-center gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`h-13 w-11 rounded-xl border bg-white text-center text-xl font-semibold text-gray-900 outline-none transition sm:h-14 sm:w-12 ${
                    error
                      ? "border-red-500"
                      : digit
                        ? "border-black"
                        : "border-gray-300"
                  } focus:border-black focus:ring-4 focus:ring-gray-200`}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-center text-sm font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Verify */}
            <button
              type="submit"
              disabled={loading}
              className="mt-7 w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Didn't receive the code?</p>

            {countdown > 0 ? (
              <p className="mt-2 text-sm">
                <span className="text-gray-500">Resend available in </span>

                <span className="font-semibold text-gray-900">
                  {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                  {String(countdown % 60).padStart(2, "0")}
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="mt-2 text-sm font-semibold text-gray-900 transition hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>

          {/* Development Notice */}
          <div className="mt-7 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center">
            <p className="text-xs text-gray-500">
              Development mode: use OTP{" "}
              <span className="font-semibold text-gray-900">123456</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Your phone number helps keep your ClockIt account secure.
        </p>
      </div>
    </div>
  );
}

export default OtpVerification;
