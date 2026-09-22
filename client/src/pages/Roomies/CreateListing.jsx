import { useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";

import { createRoomieListing } from "../../services/roomieApi";

import "./CreateListing.css";

const initialForm = {
  listingType: "HAS_PLACE",
  title: "",
  description: "",
  location: "",
  bhk: "",
  monthlyRent: "",
  minBudget: "",
  maxBudget: "",
  availableFrom: "",
  roommatesNeeded: "1",
  furnishing: "",
  amenities: [],
};

const amenityOptions = [
  "WiFi",
  "Geyser",
  "Washing Machine",
  "Refrigerator",
  "Parking",
  "AC",
  "TV",
  "Kitchen",
];

function CreateListing() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function toggleAmenity(amenity) {
    setForm((previous) => ({
      ...previous,
      amenities: previous.amenities.includes(amenity)
        ? previous.amenities.filter(
            (item) => item !== amenity
          )
        : [...previous.amenities, amenity],
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        ...form,

        monthlyRent:
          form.listingType === "HAS_PLACE"
            ? form.monthlyRent
            : null,

        roommatesNeeded:
          form.listingType === "HAS_PLACE"
            ? form.roommatesNeeded
            : null,

        minBudget:
          form.listingType === "LOOKING_FOR_PLACE"
            ? form.minBudget
            : null,

        maxBudget:
          form.listingType === "LOOKING_FOR_PLACE"
            ? form.maxBudget
            : null,
      };

      await createRoomieListing(payload);

      setSuccess("Your listing has been created successfully.");

      setTimeout(() => {
        navigate("/roomies");
      }, 1200);
    } catch (err) {
      setError(
        err.message || "Unable to create listing."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-listing-page">
      <NavBar theme="roomies" />

      <main className="create-listing-container">
        <div className="create-listing-header">
          <p className="create-listing-eyebrow">
            CLOCKIT • ROOMIES
          </p>

          <h1>Create a Roomie Listing</h1>

          <p>
            Tell people what you're looking for or share
            the place you already have.
          </p>
        </div>

        <form
          className="create-listing-form"
          onSubmit={handleSubmit}
        >
          {/* TYPE */}

          <section className="listing-section">
            <h2>What are you looking for?</h2>

            <div className="listing-type-options">
              <button
                type="button"
                className={
                  form.listingType === "HAS_PLACE"
                    ? "listing-type active"
                    : "listing-type"
                }
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    listingType: "HAS_PLACE",
                  }))
                }
              >
                <strong>I have a place</strong>
                <span>
                  I already have accommodation and need
                  a roommate.
                </span>
              </button>

              <button
                type="button"
                className={
                  form.listingType === "LOOKING_FOR_PLACE"
                    ? "listing-type active"
                    : "listing-type"
                }
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    listingType: "LOOKING_FOR_PLACE",
                  }))
                }
              >
                <strong>I'm looking for a place</strong>
                <span>
                  I need a room/place and want to find
                  the right living situation.
                </span>
              </button>
            </div>
          </section>

          {/* BASIC INFORMATION */}

          <section className="listing-section">
            <h2>Basic information</h2>

            <label>
              Listing title
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Looking for a roommate in Kothrud"
                required
              />
            </label>

            <label>
              Location
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Kothrud, Pune"
                required
              />
            </label>

            <label>
              BHK
              <select
                name="bhk"
                value={form.bhk}
                onChange={handleChange}
              >
                <option value="">Select BHK</option>
                <option value="1 RK">1 RK</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4 BHK">4 BHK</option>
              </select>
            </label>

            <label>
              Move-in date
              <input
                type="date"
                name="availableFrom"
                value={form.availableFrom}
                onChange={handleChange}
              />
            </label>
          </section>

          {/* HAS PLACE */}

          {form.listingType === "HAS_PLACE" && (
            <section className="listing-section">
              <h2>Your place</h2>

              <label>
                Monthly rent
                <input
                  type="number"
                  name="monthlyRent"
                  value={form.monthlyRent}
                  onChange={handleChange}
                  placeholder="12000"
                  min="0"
                />
              </label>

              <label>
                Roommates needed
                <input
                  type="number"
                  name="roommatesNeeded"
                  value={form.roommatesNeeded}
                  onChange={handleChange}
                  min="1"
                />
              </label>
            </section>
          )}

          {/* LOOKING FOR PLACE */}

          {form.listingType === "LOOKING_FOR_PLACE" && (
            <section className="listing-section">
              <h2>Your budget</h2>

              <div className="form-grid">
                <label>
                  Minimum budget
                  <input
                    type="number"
                    name="minBudget"
                    value={form.minBudget}
                    onChange={handleChange}
                    placeholder="8000"
                    min="0"
                  />
                </label>

                <label>
                  Maximum budget
                  <input
                    type="number"
                    name="maxBudget"
                    value={form.maxBudget}
                    onChange={handleChange}
                    placeholder="12000"
                    min="0"
                  />
                </label>
              </div>
            </section>
          )}

          {/* FURNISHING */}

          <section className="listing-section">
            <h2>Place details</h2>

            <label>
              Furnishing
              <select
                name="furnishing"
                value={form.furnishing}
                onChange={handleChange}
              >
                <option value="">Select furnishing</option>
                <option value="Furnished">Furnished</option>
                <option value="Semi-furnished">
                  Semi-furnished
                </option>
                <option value="Unfurnished">
                  Unfurnished
                </option>
              </select>
            </label>

            <div className="amenities-group">
              <span>Amenities</span>

              <div className="amenities-grid">
                {amenityOptions.map((amenity) => (
                  <label
                    key={amenity}
                    className="amenity-option"
                  >
                    <input
                      type="checkbox"
                      checked={form.amenities.includes(
                        amenity
                      )}
                      onChange={() =>
                        toggleAmenity(amenity)
                      }
                    />

                    {amenity}
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* DESCRIPTION */}

          <section className="listing-section">
            <h2>Tell people more</h2>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="6"
                placeholder="Tell potential roomies about the place, the environment, and what you're looking for..."
              />
            </label>
          </section>

          {error && (
            <div className="listing-message error">
              {error}
            </div>
          )}

          {success && (
            <div className="listing-message success">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="create-listing-submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Listing"}
          </button>
        </form>
      </main>

      <Footer theme="roomies" />
    </div>
  );
}

export default CreateListing;