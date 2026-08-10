import { useEffect } from "react";
import confetti from "canvas-confetti";

function AccountCreated({ onContinue, name }) {
  useEffect(() => {
    const duration = 2500;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      // Left blaster
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: {
          x: 0,
          y: 0.7,
        },
      });

      // Right blaster
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: {
          x: 1,
          y: 0.7,
        },
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="w-full max-w-md text-center">
          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <span className="text-4xl">✓</span>
          </div>

          {/* Heading */}
          <h1 className="mt-7 text-3xl font-bold text-text-primary">
            Account Created!
          </h1>

          <p className="mt-3 text-text-secondary">
            Welcome to UniNest
            {name ? `, ${name}` : ""}! 👋
          </p>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-muted">
            Your campus community starts here.
          </p>

          {/* Continue */}
          <button
            type="button"
            onClick={onContinue}
            className="mt-8 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountCreated;
