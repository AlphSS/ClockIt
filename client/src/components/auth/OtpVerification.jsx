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

    console.log("OTP entered:", enteredOtp);
    console.log("Phone received:", phone);

    if (enteredOtp.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

      console.log("Phone sent to backend:", formattedPhone);

      const result = await verifyOtp(formattedPhone, enteredOtp);

      console.log("OTP verification result:", result);

      onVerified(result.registrationToken);
    } catch (error) {
      console.error("OTP verification failed:", error);

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
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center">
        <div className="w-full">
          {/* Back */}
          <button
            type="button"
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-primary"
          >
            <ArrowLeft size={17} />
            Change phone number
          </button>

          {/* Card */}
          <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm sm:p-9">
            {/* Icon */}
            <div className="mb-7 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <ShieldCheck size={32} className="text-primary" />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                Verify your phone
              </h1>

              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-text-secondary">
                Enter the 6-digit verification code sent to
              </p>

              <p className="mt-1 text-sm font-semibold text-text-primary">
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
                    className={`h-13 w-11 rounded-xl border bg-background text-center text-xl font-semibold text-text-primary outline-none transition sm:h-14 sm:w-12 ${
                      error
                        ? "border-danger"
                        : digit
                          ? "border-primary"
                          : "border-border"
                    } focus:border-primary focus:ring-4 focus:ring-primary/10`}
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>

              {/* Error */}
              {error && (
                <p className="mt-4 text-center text-sm font-medium text-danger">
                  {error}
                </p>
              )}

              {/* Verify */}
              <button
                type="submit"
                disabled={loading}
                className="mt-7 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
            </form>

            {/* Resend */}
            <div className="mt-6 text-center">
              <p className="text-sm text-text-secondary">
                Didn't receive the code?
              </p>

              {countdown > 0 ? (
                <p className="mt-2 text-sm">
                  <span className="text-text-secondary">
                    Resend available in{" "}
                  </span>

                  <span className="font-semibold text-text-primary">
                    {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                    {String(countdown % 60).padStart(2, "0")}
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="mt-2 text-sm font-semibold text-primary transition hover:text-primary-hover"
                >
                  Resend OTP
                </button>
              )}
            </div>

            {/* Development Notice */}
            <div className="mt-7 rounded-xl border border-border bg-surface-muted px-4 py-3 text-center">
              <p className="text-xs text-text-muted">
                Development mode: use OTP{" "}
                <span className="font-semibold text-text-primary">123456</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-text-muted">
            Your phone number helps keep your UniNest account secure.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;
