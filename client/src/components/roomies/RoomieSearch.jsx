import { useState } from "react";

import "./RoomieSearch.css";

function RoomieSearch({ onSearch }) {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    listingType: "",
    location: "",
    bhk: "",
    furnishing: "",
    minBudget: "",
    maxBudget: "",
    moveInFrom: "",
  });

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSearch() {
    onSearch({
      search,
      ...filters,
    });
  }

  function clearFilters() {
    const emptyFilters = {
      listingType: "",
      location: "",
      bhk: "",
      furnishing: "",
      minBudget: "",
      maxBudget: "",
      moveInFrom: "",
    };

    setFilters(emptyFilters);
    setSearch("");

    onSearch({});
  }

  return (
    <section className="roomie-search-section">

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
          Tell us what you're looking for and discover
          people who match your location, budget,
          lifestyle, and living preferences.
        </p>

      </div>

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
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
          />

        </div>

        <button
          className="roomie-search-button"
          onClick={handleSearch}
        >
          Search
        </button>

      </div>

      <div className="roomie-filter-row">

        <button
          className="roomie-filter"
          onClick={() =>
            setShowFilters((previous) => !previous)
          }
        >
          <span>Filters</span>

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

      {showFilters && (
        <div className="roomie-filter-panel">

          <select
            name="listingType"
            value={filters.listingType}
            onChange={handleFilterChange}
          >
            <option value="">All listings</option>
            <option value="HAS_PLACE">
              People with a place
            </option>
            <option value="LOOKING_FOR_PLACE">
              People looking for a place
            </option>
          </select>

          <input
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Location"
          />

          <select
            name="bhk"
            value={filters.bhk}
            onChange={handleFilterChange}
          >
            <option value="">Any BHK</option>
            <option value="1 RK">1 RK</option>
            <option value="1 BHK">1 BHK</option>
            <option value="2 BHK">2 BHK</option>
            <option value="3 BHK">3 BHK</option>
            <option value="4 BHK">4 BHK</option>
          </select>

          <select
            name="furnishing"
            value={filters.furnishing}
            onChange={handleFilterChange}
          >
            <option value="">Any furnishing</option>
            <option value="Furnished">
              Furnished
            </option>
            <option value="Semi-furnished">
              Semi-furnished
            </option>
            <option value="Unfurnished">
              Unfurnished
            </option>
          </select>

          <input
            type="number"
            name="minBudget"
            value={filters.minBudget}
            onChange={handleFilterChange}
            placeholder="Min budget"
          />

          <input
            type="number"
            name="maxBudget"
            value={filters.maxBudget}
            onChange={handleFilterChange}
            placeholder="Max budget"
          />

          <input
            type="date"
            name="moveInFrom"
            value={filters.moveInFrom}
            onChange={handleFilterChange}
          />

          <button
            className="roomie-clear-filters"
            onClick={clearFilters}
          >
            Clear
          </button>

          <button
            className="roomie-apply-filters"
            onClick={handleSearch}
          >
            Apply Filters
          </button>

        </div>
      )}

      <div className="roomie-search-note">

        <span className="roomie-note-dot"></span>

        <p>
          Find people looking for the same kind of
          living experience.
        </p>

      </div>

    </section>
  );
}

export default RoomieSearch;