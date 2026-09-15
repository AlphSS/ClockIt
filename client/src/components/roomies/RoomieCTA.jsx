import { useNavigate } from "react-router-dom";
import "./RoomieCTA.css";

function RoomieCTA() {
  const navigate = useNavigate();

  return (
    <section className="roomie-cta">

      {/* Decorative background elements */}
      <div className="roomie-cta-circle roomie-cta-circle-one"></div>
      <div className="roomie-cta-circle roomie-cta-circle-two"></div>


      {/* =========================
          CONTENT
          ========================= */}

      <div className="roomie-cta-content">

        <p className="roomie-cta-eyebrow">
          YOUR NEXT HOME STARTS HERE
        </p>

        <h2>
          Find the person
          <br />
          who makes it home.
        </h2>

        <p className="roomie-cta-description">
          Create your ClockIt profile, tell us what kind of
          living experience you're looking for, and start
          meeting people who fit your lifestyle.
        </p>


        {/* =========================
            ACTIONS
            ========================= */}

        <div className="roomie-cta-actions">

          <button
            className="roomie-cta-primary"
            onClick={() => navigate("/roomies")}
          >
            Find a Roomie

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>

          </button>


          <button
            className="roomie-cta-secondary"
            onClick={() => navigate("/profile")}
          >
            Create Your Profile
          </button>

        </div>

      </div>


      {/* =========================
          SMALL FOOTNOTE
          ========================= */}

      <div className="roomie-cta-bottom">

        <span></span>

        <p>
          A better roommate search starts with the right match.
        </p>

        <span></span>

      </div>

    </section>
  );
}

export default RoomieCTA;