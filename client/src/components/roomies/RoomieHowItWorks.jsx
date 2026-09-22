import "./RoomieHowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description:
      "Tell us about yourself, your lifestyle, budget, and the kind of home you're looking for.",
  },
  {
    number: "02",
    title: "Discover Your Match",
    description:
      "Browse people with similar preferences, locations, budgets, and living habits.",
  },
  {
    number: "03",
    title: "Connect & Move In",
    description:
      "Start a conversation, get to know your potential roomie, and find a place together.",
  },
];

function RoomieHowItWorks() {
  return (
    <section className="roomie-how-section">

      {/* =========================
          HEADER
          ========================= */}

      <div className="roomie-how-header">

        <p className="roomie-how-eyebrow">
          HOW IT WORKS
        </p>

        <h2>
          Finding a roomie
          <br />
          should feel simple.
        </h2>

        <p className="roomie-how-intro">
          From creating your profile to finding someone
          who fits your lifestyle, ClockIt keeps the process
          simple and personal.
        </p>

      </div>


      {/* =========================
          STEPS
          ========================= */}

      <div className="roomie-how-grid">

        {steps.map((step) => (
          <article
            className="roomie-how-card"
            key={step.number}
          >

            <span className="roomie-how-number">
              {step.number}
            </span>

            <div className="roomie-how-line" />

            <h3>
              {step.title}
            </h3>

            <p>
              {step.description}
            </p>

          </article>
        ))}

      </div>

    </section>
  );
}

export default RoomieHowItWorks;