import "./RoomieCard.css";

function RoomieCard({
  name,
  age,
  role,
  location,
  college,
  budget,
  moveIn,
  image,
  tags = [],
  description,
}) {
  return (
    <article className="roomie-card">

      {/* =========================
          PROFILE IMAGE
          ========================= */}

      <div className="roomie-card-image-wrapper">

        {image ? (
          <img
            src={image}
            alt={`${name}'s profile`}
            className="roomie-card-image"
          />
        ) : (
          <div className="roomie-card-image-placeholder">
            {name?.charAt(0)}
          </div>
        )}

        {/* Availability Badge */}
        <span className="roomie-available-badge">
          Available
        </span>

      </div>


      {/* =========================
          CARD CONTENT
          ========================= */}

      <div className="roomie-card-content">

        {/* Name */}
        <div className="roomie-card-heading">

          <div>
            <h3>{name}</h3>

            <p>
              {age} · {role}
            </p>
          </div>

          {/* Small heart/favorite button */}
          <button
            className="roomie-favorite"
            aria-label={`Save ${name}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
          </button>

        </div>


        {/* =========================
            LOCATION
            ========================= */}

        <div className="roomie-card-location">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>

          <span>{location}</span>

        </div>


        {/* =========================
            COLLEGE / WORK
            ========================= */}

        <p className="roomie-card-college">
          {college}
        </p>


        {/* =========================
            DETAILS
            ========================= */}

        <div className="roomie-card-details">

          <div className="roomie-detail">

            <span className="roomie-detail-label">
              Budget
            </span>

            <strong>
              ₹{budget}/mo
            </strong>

          </div>


          <div className="roomie-detail">

            <span className="roomie-detail-label">
              Move-in
            </span>

            <strong>
              {moveIn}
            </strong>

          </div>

        </div>


        {/* =========================
            DESCRIPTION
            ========================= */}

        {description && (
          <p className="roomie-card-description">
            {description}
          </p>
        )}


        {/* =========================
            TAGS
            ========================= */}

        <div className="roomie-card-tags">

          {tags.map((tag, index) => (
            <span
              key={index}
              className="roomie-tag"
            >
              {tag}
            </span>
          ))}

        </div>


        {/* =========================
            ACTION
            ========================= */}

        <button className="roomie-view-button">
          View Profile

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
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

      </div>

    </article>
  );
}

export default RoomieCard;