import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, Check } from "lucide-react";

function SetPassword({ onBack, onComplete }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const strength = Object.values(requirements).filter(Boolean).length;

  function getStrengthText() {
    if (!password) return "";

    if (strength <= 2) return "Weak";
    if (strength <= 4) return "Medium";
    return "Strong";
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!requirements.uppercase) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!requirements.lowercase) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    if (!requirements.number) {
      setError("Password must contain at least one number.");
      return;
    }

    if (!requirements.special) {
      setError("Password must contain at least one special character.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    onComplete(password);
  }

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

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-text-primary">
              Create your password
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Choose a strong password to secure your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-11 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password Strength */}
            {password && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-text-secondary">
                    Password strength
                  </span>

                  <span
                    className={`text-xs font-semibold ${
                      strength <= 2
                        ? "text-danger"
                        : strength <= 4
                          ? "text-warning"
                          : "text-success"
                    }`}
                  >
                    {getStrengthText()}
                  </span>
                </div>

                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className={`h-1.5 flex-1 rounded-full ${
                        item <= strength
                          ? strength <= 2
                            ? "bg-danger"
                            : strength <= 4
                              ? "bg-warning"
                              : "bg-success"
                          : "bg-surface-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="rounded-xl bg-surface-muted p-4">
              <p className="mb-3 text-xs font-semibold text-text-primary">
                Password must contain:
              </p>

              <div className="space-y-2">
                <Requirement
                  valid={requirements.length}
                  text="At least 8 characters"
                />

                <Requirement
                  valid={requirements.uppercase}
                  text="One uppercase letter"
                />

                <Requirement
                  valid={requirements.lowercase}
                  text="One lowercase letter"
                />

                <Requirement valid={requirements.number} text="One number" />

                <Requirement
                  valid={requirements.special}
                  text="One special character"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-text-primary"
              >
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Re-enter your password"
                  className={`w-full rounded-xl border ${
                    confirmPassword && password !== confirmPassword
                      ? "border-danger"
                      : "border-border"
                  } bg-surface py-3 pl-10 pr-11 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-sm text-danger">{error}</p>}

            {/* Create Account */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover active:scale-[0.99]"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Requirement({ valid, text }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-full ${
          valid ? "bg-success text-white" : "border border-border"
        }`}
      >
        {valid && <Check size={10} />}
      </div>

      <span
        className={`text-xs ${valid ? "text-success" : "text-text-secondary"}`}
      >
        {text}
      </span>
    </div>
  );
}

export default SetPassword;
