import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";
import "./Marketplace.css";

import {
  Search,
  SlidersHorizontal,
  MapPin,
  Heart,
  Clock3,
  Plus,
  PackageOpen,
  ChevronDown,
} from "lucide-react";

import { getProducts } from "../../services/marketplaceApi";

function Marketplace() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Electronics",
    "Books",
    "Furniture",
    "Clothing",
    "Bicycles",
    "Notes & Study Material",
    "Hostel Essentials",
    "Sports",
    "Musical Instruments",
    "Other",
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Marketplace error:", error);
      setError(error.message || "Unable to load marketplace.");
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products
    .filter((product) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        product.title?.toLowerCase().includes(searchText) ||
        product.description?.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      }

      if (sortBy === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }

      if (sortBy === "price-low") {
        return Number(a.price) - Number(b.price);
      }

      if (sortBy === "price-high") {
        return Number(b.price) - Number(a.price);
      }

      return 0;
    });

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-IN");
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="marketplace-page">
        <NavBar theme="roomies" />

        <div className="marketplace-loading">
          <div className="marketplace-loading-spinner" />

          <p>Loading Marketplace...</p>
        </div>

        <Footer theme="roomies" />
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="marketplace-page">
        <NavBar theme="roomies" />

        <div className="marketplace-error-wrapper">
          <div className="marketplace-error">
            <div className="marketplace-error-icon">
              <PackageOpen size={28} />
            </div>

            <h2>Unable to load Marketplace</h2>

            <p>{error}</p>

            <button
              onClick={loadProducts}
              className="marketplace-sell-button"
            >
              Try Again
            </button>
          </div>
        </div>

        <Footer theme="roomies" />
      </div>
    );
  }

  return (
    <div className="marketplace-page">
      <NavBar theme="roomies" />

      {/* =====================================================
          MARKETPLACE HEADER
          ===================================================== */}

      <header className="marketplace-header">
        <div className="marketplace-header-content">
          <div>
            <span className="marketplace-eyebrow">
              ClockIt Marketplace
            </span>

            <h1>
              Find what you 
              <br />
              need around
              <br /> campus.
            </h1>

            <p className="marketplace-header-description">
              Buy, sell and discover useful products from students
              around your campus.
            </p>
          </div>

          <button
            onClick={() => navigate("/marketplace/add")}
            className="marketplace-sell-button"
          >
            <Plus size={18} />
            Sell an Item
          </button>

          {/* =================================================
              SEARCH
              ================================================= */}

          <div className="marketplace-search-wrapper">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search for books, electronics, furniture..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="marketplace-search"
            />
          </div>
        </div>
              {/* Right-side marketplace illustration */}
        <img
          src="/marketplace-hero.png"
          alt="Marketplace finds"
          className="marketplace-hero-image"
        />
      </header>

      {/* =====================================================
          MARKETPLACE CONTENT
          ===================================================== */}

      <main className="marketplace-content">

        {/* ===================================================
            CATEGORIES
            =================================================== */}

        <div className="marketplace-categories">
          {categories.map((item) => {
            const active = category === item;

            return (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`marketplace-category ${
                  active ? "active" : ""
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* ===================================================
            RESULT CONTROLS
            =================================================== */}

        <div className="marketplace-result-bar">
          <p className="marketplace-result-count">
            <strong>{filteredProducts.length}</strong>

            {filteredProducts.length === 1
              ? "item"
              : "items"}{" "}
            found
          </p>

          <div className="marketplace-sort-wrapper">
            <SlidersHorizontal size={16} />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="marketplace-sort"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
            </select>

            <ChevronDown size={16} />
          </div>
        </div>

        {/* ===================================================
            EMPTY STATE
            =================================================== */}

        {filteredProducts.length === 0 ? (
          <div className="marketplace-empty">
            <div className="marketplace-empty-icon">
              <PackageOpen size={30} />
            </div>

            <h2>No products found</h2>

            <p>
              Try a different search term or select another
              category.
            </p>
          </div>
        ) : (

          /* =================================================
             PRODUCT GRID
             ================================================= */

          <div className="marketplace-grid">
            {filteredProducts.map((product) => {
              const firstImage =
                product.product_images?.[0]?.image_url;

              return (
                <div
                  key={product.id}
                  onClick={() =>
                    navigate(
                      `/marketplace/product/${product.id}`
                    )
                  }
                  className="marketplace-product-card"
                >

                  {/* =========================================
                      PRODUCT IMAGE
                      ========================================= */}

                  <div className="marketplace-product-image">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={product.title}
                      />
                    ) : (
                      <div className="marketplace-product-placeholder">
                        <PackageOpen size={35} />
                      </div>
                    )}

                    {/* =======================================
                        WISHLIST
                        ======================================= */}

                    <button
                      type="button"
                      aria-label="Save item"
                      onClick={(e) => e.stopPropagation()}
                      className="marketplace-favorite"
                    >
                      <Heart size={17} />
                    </button>

                    {/* =======================================
                        PRICE
                        ======================================= */}

                    <span className="marketplace-price">
                      ₹{formatPrice(product.price)}
                    </span>
                  </div>

                  {/* =========================================
                      PRODUCT DETAILS
                      ========================================= */}

                  <div className="marketplace-product-info">

                    <h2 className="marketplace-product-title">
                      {product.title}
                    </h2>

                    {/* =======================================
                        BADGES
                        ======================================= */}

                    <div className="marketplace-tags">
                      <span className="marketplace-tag condition">
                        {product.condition}
                      </span>

                      {product.is_negotiable && (
                        <span className="marketplace-tag">
                          Negotiable
                        </span>
                      )}
                    </div>

                    {/* =======================================
                        LOCATION
                        ======================================= */}

                    {product.location && (
                      <div className="marketplace-location">
                        <MapPin size={13} />

                        <span>
                          {product.location}
                        </span>
                      </div>
                    )}

                    {/* =======================================
                        COLLEGE
                        ======================================= */}

                    {product.colleges?.name && (
                      <p className="marketplace-seller">
                        {product.colleges.name}
                      </p>
                    )}

                    {/* =======================================
                        SELLER
                        ======================================= */}

                    <div className="marketplace-seller">
                      <Clock3 size={12} />

                      <span>
                        {product.profiles?.full_name
                          ? `Seller: ${product.profiles.full_name}`
                          : "Campus seller"}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom spacing */}
        <div style={{ height: "32px" }} />
      </main>

      <Footer theme="roomies" />
    </div>
  );
}

export default Marketplace;