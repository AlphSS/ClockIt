import "./RoomieSearch.css";

function RoomieSearch() {
  return (
    <section className="roomie-search-section">

      {/* =========================
          SECTION INTRO
          ========================= */}

      <div className="roomie-search-header">

        <p className="roomie-search-eyebrow">
          FIND YOUR MATCH
        </p>

        <h2>
          Find someone
          <br />
          who fits your life.
        </h2>

        <p className="roomie-search-description">
          Tell us what you're looking for and discover people
          who match your location, budget, lifestyle, and
          living preferences.
        </p>

      </div>


      {/* =========================
          SEARCH BOX
          ========================= */}

      <div className="roomie-search-box">

        <div className="roomie-search-input-wrapper">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>

          <input
            type="text"
            placeholder="Search by city, college or locality"
          />

        </div>


        <button className="roomie-search-button">
          Search
        </button>

      </div>


      {/* =========================
          FILTERS
          ========================= */}

      <div className="roomie-filter-row">

        <button className="roomie-filter">
          <span>Location</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>


        <button className="roomie-filter">
          <span>Budget</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>


        <button className="roomie-filter">
          <span>Lifestyle</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>


        <button className="roomie-filter">
          <span>Move-in</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>


        <button className="roomie-filter">
          <span>Preferences</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

      </div>


      {/* =========================
          SMALL NOTE
          ========================= */}

      <div className="roomie-search-note">

        <span className="roomie-note-dot"></span>

        <p>
          Find people looking for the same kind of living experience.
        </p>

      </div>

    </section>
  );
}

export default RoomieSearch;