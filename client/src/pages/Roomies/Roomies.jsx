import Navbar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";
import "./Roomies.css";

function Roomies() {
  return (
    <div className="roomies-page">

      {/* ================= NAVBAR ================= */}
      <Navbar theme="roomies" />


      {/* ================= ROOMIES CONTENT ================= */}
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


          <div className="roomies-hero-visual">

            <div className="roomies-image-placeholder">
              <span>ROOMIES</span>
            </div>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}
      <Footer theme="roomies" />

    </div>
  );
}

export default Roomies;