import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  UserRound,
  MapPin,
  SlidersHorizontal,
  PackageOpen,
  ArrowUpDown,
} from "lucide-react";

import NavBar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";
import { getProducts } from "../../services/marketplaceApi";

import "./MarketplaceTheme.css";
import "./Marketplace.css";

function Marketplace() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const categories = [
    "All",
    "Electronics",
    "Furniture",
    "Books",
    "Clothing",
    "Home & Kitchen",
    "Other",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();

        const productList = Array.isArray(response)
          ? response
          : response?.products || response?.data || [];

        setProducts(productList);
      } catch (err) {
        console.error("Error fetching marketplace products:", err);
        setError("We couldn't load the products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const searchText = search.toLowerCase();

      result = result.filter((product) => {
        const title = product.title || product.name || "";
        const description = product.description || "";
        const category = product.category || "";
        const location = product.location || "";

        return (
          title.toLowerCase().includes(searchText) ||
          description.toLowerCase().includes(searchText) ||
          category.toLowerCase().includes(searchText) ||
          location.toLowerCase().includes(searchText)
        );
      });
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          (product.category || "").toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    if (selectedCondition !== "All") {
      result = result.filter(
        (product) =>
          (product.condition || "").toLowerCase() ===
          selectedCondition.toLowerCase()
      );
    }

    if (sortBy === "price-low") {
      result.sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      );
    } else if (sortBy === "price-high") {
      result.sort(
        (a, b) => Number(b.price || 0) - Number(a.price || 0)
      );
    } else if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );
    }

    return result;
  }, [products, search, selectedCategory, selectedCondition, sortBy]);

  const getProductImage = (product) =>
    product.product_images?.[0]?.image_url ||
    product.image_url ||
    product.image ||
    "";

  const getProductTitle = (product) =>
    product.title || product.name || "Untitled Product";

  const getProductId = (product) => product.id || product.product_id;

  const formatPrice = (price) => {
    const amount = Number(price);

    if (!Number.isFinite(amount)) {
      return "Price not available";
    }

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="mk-page mk-root">
      <NavBar theme="roomies" />

      <main className="mk-main">
        {/* Marketplace Hero */}
        <section className="mk-hero">
          <div className="mk-hero-inner">
            <div className="mk-hero-copy">
              <span className="mk-eyebrow">
                CLOCKIT <span className="mk-kicker-dot">·</span>{" "}
                GIVE IT A NEW HOME
              </span>

              <h1 className="mk-hero-title mk-display">
                Good things
                <br />
                deserve <em>another story.</em>
              </h1>

              <p className="mk-hero-description">
                Have something you no longer need? Pass it on to someone
                who will love it just as much.
              </p>

              <div className="mk-hero-motto">
                <span>SELL WITH LOVE</span>
                <span className="mk-hero-heart">♡</span>
                <span>PASS IT ON</span>
              </div>

              <div className="mk-hero-actions">
                <button
                  type="button"
                  className="mk-my-listings-btn"
                  onClick={() => navigate("/marketplace/my-listing")}
                >
                  <UserRound size={19} />
                  My Listings
                </button>

                <button
                  type="button"
                  className="mk-sell-btn"
                  onClick={() => navigate("/marketplace/add")}
                >
                  <Plus size={20} />
                  Sell an Item
                </button>
              </div>
            </div>

            {/* Decorative collage — no external image required */}
            <div
              className="mk-collage"
              aria-label="Pre-loved, well-loved campus finds"
            >
              <div className="mk-collage-ring" />

              <div className="mk-collage-back">
                <span className="mk-collage-back-line" />
              </div>

              <div className="mk-collage-side-card">
                <span>✳</span>
                <div className="mk-collage-plant">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>

              <div className="mk-collage-card">
                <span className="mk-collage-eyebrow">
                  THE CAMPUS EDIT
                </span>

                <span className="mk-collage-star">✳</span>

                <div className="mk-collage-heading">
                  Pre-loved.
                  <br />
                  <em>Well loved.</em>
                </div>

                <div className="mk-collage-divider" />

                <p>
                  SUSTAINABLE PICKS
                  <br />
                  FOR BRIGHTER DAYS.
                </p>
              </div>

              <div className="mk-collage-badge">
                MADE FOR
                <br />
                STUDENTS
              </div>

              <div className="mk-collage-heart">♡</div>
            </div>
          </div>
        </section>

        {/* Marketplace Products */}
        <section className="mk-products-section">
          <div className="mk-section-heading">
            <div>
              <span className="mk-eyebrow">
                EXPLORE THE COMMUNITY
              </span>
              <h2 className="mk-display">Find your next favourite.</h2>
              <p>Browse items listed by your community.</p>
            </div>

            <span className="mk-result-count">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Search and sorting */}
          <div className="mk-toolbar">
            <div className="mk-search-box">
              <Search size={18} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products, categories, locations..."
                aria-label="Search marketplace"
              />
            </div>

            <label className="mk-sort-box">
              <ArrowUpDown size={16} />
              <span className="mk-sort-label">Sort:</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort products"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </label>
          </div>

          {/* Category filters */}
          <div className="mk-filter-heading">
            <SlidersHorizontal size={16} />
            <span>Categories</span>
          </div>

          <div className="mk-category-filters">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`mk-category-chip ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Condition filters */}
          <div className="mk-condition-filter">
            <label htmlFor="mk-condition">Condition</label>
            <select
              id="mk-condition"
              value={selectedCondition}
              onChange={(event) =>
                setSelectedCondition(event.target.value)
              }
            >
              <option value="All">All conditions</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Used">Used</option>
            </select>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="mk-state">
              <div className="mk-loader" />
              <p>Finding lovely things for you...</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="mk-state mk-error-state">
              <p>{error}</p>
              <button
                type="button"
                className="mk-sell-btn"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Product grid */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="mk-product-grid">
              {filteredProducts.map((product) => {
                const productId = getProductId(product);
                const image = getProductImage(product);
                const title = getProductTitle(product);

                return (
                  <article
                    className="mk-product-card"
                    key={productId ?? title}
                    onClick={() =>
                      productId &&
                      navigate(`/marketplace/product/${productId}`)
                    }
                    onKeyDown={(event) => {
                      if (
                        productId &&
                        (event.key === "Enter" || event.key === " ")
                      ) {
                        event.preventDefault();
                        navigate(`/marketplace/product/${productId}`);
                      }
                    }}
                    role="link"
                    tabIndex={productId ? 0 : -1}
                  >
                    <div className="mk-product-image-wrap">
                      {image ? (
                        <img
                          className="mk-product-image"
                          src={image}
                          alt={title}
                          loading="lazy"
                        />
                      ) : (
                        <div className="mk-image-placeholder">
                          <PackageOpen size={34} />
                          <span>No image available</span>
                        </div>
                      )}

                      {product.condition && (
                        <span className="mk-condition-badge">
                          {product.condition}
                        </span>
                      )}

                      {product.status &&
                        product.status.toLowerCase() !== "available" && (
                          <span className="mk-status-badge">
                            {product.status}
                          </span>
                        )}
                    </div>

                    <div className="mk-product-info">
                      <div className="mk-product-meta">
                        <span>{product.category || "Other"}</span>

                        {product.is_negotiable && (
                          <span className="mk-negotiable">
                            Negotiable
                          </span>
                        )}
                      </div>

                      <h3>{title}</h3>

                      <p className="mk-product-price">
                        {formatPrice(product.price)}
                      </p>

                      <div className="mk-product-location">
                        <MapPin size={14} />
                        <span>
                          {product.location || "Location not specified"}
                        </span>
                      </div>

                      <div className="mk-product-footer">
                        <span className="mk-seller-name">
                          {product.profiles?.full_name ||
                            product.seller_name ||
                            "Community seller"}
                        </span>
                        <span className="mk-view-link">View item ↗</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="mk-empty-state">
              <span className="mk-empty-icon">
                <PackageOpen size={32} />
              </span>

              <h3>No items found just yet.</h3>

              <p>
                Try changing your search or filters to discover more items.
              </p>

              <button
                type="button"
                className="mk-sell-btn"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setSelectedCondition("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer theme="roomies" />
    </div>
  );
}

export default Marketplace;
