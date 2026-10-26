import RoomieCard from "./RoomieCard";
import "./FeaturedRoomies.css";

function FeaturedRoomies({ roomies = [] }) {
  return (
    <section className="featured-roomies">

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

      <div className="featured-roomies-grid">

        {roomies.length > 0 ? (
          roomies.map((roomie) => (
            <RoomieCard
              key={roomie.id}
              {...roomie}
            />
          ))
        ) : (
          <p>No roomie listings found.</p>
        )}

      </div>

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