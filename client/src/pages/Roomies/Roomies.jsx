import NavBar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";
import "./Roomies.css";

import RoomieSearch from "../../components/roomies/RoomieSearch";
import FeaturedRoomies from "../../components/roomies/FeaturedRoomies";
import RoomieHowItWorks from "../../components/roomies/RoomieHowItWorks";
import RoomieCTA from "../../components/roomies/RoomieCTA";

function Roomies() {
  return (
    <div className="roomies-page">

      {/* ================= NAVBAR ================= */}
      <NavBar theme="roomies" />

      {/* ================= ROOMIES CONTENT ================= */}
      <main>

        {/* ================= HERO ================= */}
        <section className="roomies-hero">

          {/* LEFT SIDE */}
          <div className="roomies-hero-content">

            <p className="roomies-eyebrow">
              CLOCKIT • ROOMIES
            </p>

            <h1>
              Find a roomie
              <br />
              who feels like home.
            </h1>

            <p className="roomies-description">
              Discover compatible roommates, comfortable spaces,
              and people looking for a place to call home.
            </p>

            <div className="roomies-actions">

              <button className="roomies-primary-btn">
                Find a Roomie
              </button>

              <button className="roomies-secondary-btn">
                Create a Listing
              </button>

            </div>

          </div>

          {/* RIGHT SIDE — IMAGE */}
          <div className="roomies-hero-visual">

            <div className="roomies-image-frame">

              <img
                src="/roomies-hero.jpg"
                alt="Friends spending time together"
                className="roomies-hero-image"
              />

              {/* Inner border */}
              <div className="roomies-image-border"></div>

              {/* Bottom label */}
              <div className="roomies-image-label">
                ROOMIES
              </div>

            </div>

            {/* Decorative text */}
            <div className="roomies-handwritten">
              Better
              <br />
              Roomies
              <br />
              Brighter
              <br />
              Days ♡
            </div>

            {/* Decorative leaf */}
            <div className="roomies-leaf">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

          </div>

        </section>

        {/* ================= SEARCH ================= */}
        <RoomieSearch />

        {/* ================= FEATURED ROOMIES ================= */}
        <FeaturedRoomies />

        {/* ================= HOW IT WORKS ================= */}
        <RoomieHowItWorks />

        {/* ================= FINAL CTA ================= */}
        <RoomieCTA />

      </main>

      {/* ================= FOOTER ================= */}
      <Footer theme="roomies" />

    </div>
  );
}

export default Roomies;