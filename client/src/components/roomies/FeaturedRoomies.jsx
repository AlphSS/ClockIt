import RoomieCard from "./RoomieCard";
import "./FeaturedRoomies.css";

const roomies = [
  {
    id: 1,
    name: "Ananya",
    age: 21,
    role: "Student",
    location: "Kothrud, Pune",
    college: "Computer Science Student",
    budget: "12,000",
    moveIn: "June 2026",
    tags: ["Quiet", "Clean", "Non-smoker"],
    description:
      "Looking for a friendly and respectful roommate who enjoys a peaceful home.",
  },
  {
    id: 2,
    name: "Riya",
    age: 22,
    role: "Student",
    location: "Viman Nagar, Pune",
    college: "Design Student",
    budget: "10,000",
    moveIn: "July 2026",
    tags: ["Social", "Organized", "Vegetarian"],
    description:
      "Looking for someone easygoing who enjoys good conversations and shared spaces.",
  },
  {
    id: 3,
    name: "Meera",
    age: 23,
    role: "Working",
    location: "Baner, Pune",
    college: "UX Designer",
    budget: "15,000",
    moveIn: "August 2026",
    tags: ["Clean", "Pet-friendly", "Early riser"],
    description:
      "Looking for a responsible roommate who values cleanliness and a comfortable home.",
  },
];

function FeaturedRoomies() {
  return (
    <section className="featured-roomies">

      {/* =========================
          SECTION HEADER
          ========================= */}

      <div className="featured-roomies-header">

        <div>
          <p className="featured-roomies-eyebrow">
            MEET YOUR POTENTIAL ROOMIES
          </p>

          <h2>
            People looking
            <br />
            for a place too.
          </h2>
        </div>

        <p className="featured-roomies-intro">
          Browse people searching for roommates with
          similar budgets, locations, and lifestyles.
        </p>

      </div>


      {/* =========================
          ROOMIE GRID
          ========================= */}

      <div className="featured-roomies-grid">

        {roomies.map((roomie) => (
          <RoomieCard
            key={roomie.id}
            {...roomie}
          />
        ))}

      </div>


      {/* =========================
          VIEW ALL
          ========================= */}

      <div className="featured-roomies-footer">

        <button className="featured-roomies-view-all">
          View All Roomies

          <span>→</span>
        </button>

      </div>

    </section>
  );
}

export default FeaturedRoomies;