import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { verifyPhoneOtp, sendPhoneOtp } from "../../services/authService";

function OtpVerification({ phone, onBack, onVerified }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);

  const inputRefs = useRef([]);

  // Countdown
  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  function handleChange(index, value) {
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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

    const nextIndex = Math.min(pastedValue.length, 5);
    inputRefs.current[nextIndex]?.focus();
  }

  async function handleVerify(e) {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    //OTP Logic
    try {
      setError("");
      const formattedPhone = `+91${phone}`;
      await verifyPhoneOtp(formattedPhone, enteredOtp);
    } catch (error) {
      setError(error.message);
    }

    console.log("OTP entered:", enteredOtp);

    onVerified();
  }

  async function handleResend() {
    if (countdown > 0) return;

    try{
        await sendPhoneOtp(`+91${phone}`)
        setOtp(["", "", "", "", "", ""]);
        setError("");
        setCountdown(30);
        
        inputRefs.current[0]?.focus();
        
        console.log("OTP resent to:", phone);
    }catch(error){
        setError(error.message)
    }
  }

  const maskedPhone =
    phone.length >= 4 ? `+91 ******${phone.slice(-4)}` : `+91 ${phone}`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm text-text-secondary transition hover:text-primary"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          {/* Logo */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary">UniNest</h1>

            <p className="mt-1 text-sm text-text-secondary">
              Your Campus, Your Community
            </p>
          </div>

          {/* Icon */}
          <div className="mb-5 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 size={28} className="text-primary" />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-text-primary">
              Verify your phone
            </h2>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              We've sent a 6-digit OTP to
            </p>

            <p className="mt-1 text-sm font-semibold text-text-primary">
              {maskedPhone}
            </p>
          </div>

          <form onSubmit={handleVerify}>
            {/* OTP Inputs */}
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
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`h-12 w-11 rounded-xl border text-center text-lg font-semibold text-text-primary outline-none transition sm:h-14 sm:w-12 ${
                    error ? "border-danger" : "border-border"
                  } focus:border-primary focus:ring-2 focus:ring-primary/10`}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <p className="mt-4 text-center text-sm text-danger">{error}</p>
            )}

            {/* Verify */}
            <button
              type="submit"
              className="mt-7 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover active:scale-[0.99]"
            >
              Verify Phone
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            {countdown > 0 ? (
              <p className="text-sm text-text-secondary">
                Resend OTP in{" "}
                <span className="font-semibold text-text-primary">
                  {countdown}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm font-semibold text-primary hover:text-primary-hover"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;
