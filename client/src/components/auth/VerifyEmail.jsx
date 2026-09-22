import { useNavigate } from "react-router-dom";

function VerifyEmail({ email }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">ClockIt</h1>

          <p className="mt-1 text-sm text-text-secondary">
            Your Campus, Your Community
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <span className="text-3xl">📧</span>
          </div>

          <h2 className="text-2xl font-bold text-text-primary">
            Verify your email
          </h2>

          <p className="mt-3 text-sm text-text-secondary">
            We've sent a verification link to
          </p>

          <p className="mt-1 font-medium text-text-primary">{email}</p>

          <p className="mt-4 text-sm text-text-secondary">
            Click the link in your email to verify your account. Once verified,
            you can continue to ClockIt.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
