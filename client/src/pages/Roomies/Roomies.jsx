import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";

import "./Roomies.css";

import RoomieSearch from "../../components/roomies/RoomieSearch";
import FeaturedRoomies from "../../components/roomies/FeaturedRoomies";
import RoomieHowItWorks from "../../components/roomies/RoomieHowItWorks";
import RoomieCTA from "../../components/roomies/RoomieCTA";

import { getRoomieListings } from "../../services/roomieApi";
import { getProfile } from "../../services/profileApi";

function Roomies() {
  const navigate = useNavigate();

  const [roomies, setRoomies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
      loadProfile();
      loadRoomies();
  }, []);
  
  async function loadProfile() {
  try {
    const data = await getProfile();
    setProfile(data);
  } catch (err) {
    console.error("Profile loading error:", err);
  }
}

  async function loadRoomies(filters = {}) {
    try {
      setLoading(true);
      setError("");

      const listings = await getRoomieListings(filters);

      const mappedListings = listings.map((listing) => {
        const profile = listing.profiles;
        const college = profile?.colleges;

        const budget =
          listing.listing_type === "HAS_PLACE"
            ? listing.monthly_rent
            : listing.max_budget;

        const tags = [
          ...(listing.amenities || []),
          ...(listing.furnishing
            ? [listing.furnishing]
            : []),
        ];

        return {
          id: listing.id,

          name:
            profile?.full_name ||
            profile?.username ||
            "ClockIt User",

          age: null,

          role:
            listing.listing_type === "HAS_PLACE"
              ? "Roomie"
              : "Looking for a place",

          location: listing.location,

          college: college?.name || "",

          budget,

          moveIn: listing.available_from
            ? new Date(
                `${listing.available_from}T00:00:00`
              ).toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
              })
            : "Flexible",

          image: profile?.profile_picture,

          tags,

          description: listing.description,

          listingType: listing.listing_type,

          bhk: listing.bhk,

          furnishing: listing.furnishing,
        };
      });

      setRoomies(mappedListings);
    } catch (err) {
      console.error("Roomies loading error:", err);

      setError(
        err.message || "Unable to load roomies."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCreateListing() {
  if (!profile?.college_verified) {
    alert(
      "Please verify your college email before creating a listing."
    );

    return;
  }

  navigate("/roomies/create");
}

  return (
    <div className="roomies-page">

      <NavBar theme="roomies" />

      <main>

        <section className="roomies-hero">

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
              Discover compatible roommates, comfortable
              spaces, and people looking for a place to
              call home.
            </p>

            <div className="roomies-actions">

              <button
                className="roomies-primary-btn"
                onClick={() =>
                  document
                    .getElementById("roomie-search")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                Find a Roomie
              </button>

              <button
                className="roomies-secondary-btn"
                onClick={handleCreateListing}
              >
                Create a Listing
              </button>

            </div>

          </div>

          <div className="roomies-hero-visual">

            <div className="roomies-image-frame">

              <img
                src="/roomies-hero.jpg"
                alt="Friends spending time together"
                className="roomies-hero-image"
              />

              <div className="roomies-image-border"></div>

              <div className="roomies-image-label">
                ROOMIES
              </div>

            </div>

            <div className="roomies-handwritten">
              Better
              <br />
              Roomies
              <br />
              Brighter
              <br />
              Days ♡
            </div>

            <div className="roomies-leaf">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

          </div>

        </section>

        <section id="roomie-search">
          <RoomieSearch
            onSearch={loadRoomies}
          />
        </section>

        {loading && (
          <div className="roomies-loading">
            Loading roomies...
          </div>
        )}

        {error && (
          <div className="roomies-error">
            {error}
          </div>
        )}

        {!loading && !error && (
          <FeaturedRoomies roomies={roomies} />
        )}

        <RoomieHowItWorks />

        <RoomieCTA />

      </main>

      <Footer theme="roomies" />

    </div>
  );
}

export default Roomies;