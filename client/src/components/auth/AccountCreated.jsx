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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">ClockIt</h1>

          <p className="mt-2 text-sm text-gray-500">
            Your Campus, Your Community
          </p>
        </div>

        {/* Success Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <span className="text-4xl text-green-600">✓</span>
          </div>

          {/* Heading */}
          <h2 className="mt-7 text-3xl font-bold text-gray-900">
            Account Created!
          </h2>

          <p className="mt-3 text-gray-500">
            Welcome to ClockIt
            {name ? `, ${name}` : ""}! 👋
          </p>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
            Your campus community starts here.
          </p>

          {/* Continue */}
          <button
            type="button"
            onClick={onContinue}
            className="mt-8 w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99]"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountCreated;
