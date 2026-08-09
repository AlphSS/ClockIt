import { CheckCircle2 } from "lucide-react";

function AccountCreated({ onContinue }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">

          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2
              size={44}
              className="text-success"
            />
          </div>

          {/* Logo */}
          <h1 className="text-3xl font-bold text-primary">
            UniNest
          </h1>

          {/* Heading */}
          <h2 className="mt-6 text-2xl font-bold text-text-primary">
            Account Created!
          </h2>

          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Welcome to UniNest. Your account has been
            created successfully.
          </p>

          <p className="mt-2 text-sm text-text-secondary">
            You can now explore deals, find roommates,
            and discover stays.
          </p>

          {/* Continue */}
          <button
            type="button"
            onClick={onContinue}
            className="mt-8 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover active:scale-[0.99]"
          >
            Go to Home
          </button>

        </div>

      </div>
    </div>
  );
}

export default AccountCreated;