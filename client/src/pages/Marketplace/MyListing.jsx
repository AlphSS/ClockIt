import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Pencil,
  Trash2,
  CheckCircle,
  MapPin,
  Plus,
  ArrowRight,
  PackageOpen,
} from "lucide-react";

import "./MarketplaceTheme.css";
import "./MyListing.css";

import NavBar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";

import {
  getMyProducts,
  markProductAsSold,
  deleteProduct,
} from "../../services/marketplaceApi";

function MyListings() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load your listings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSold = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this product as sold?"
    );

    if (!confirmed) return;

    try {
      await markProductAsSold(productId);

      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? { ...product, status: "sold" }
            : product
        )
      );
    } catch (err) {
      console.error(err);
      window.alert(
        err.response?.data?.message || "Failed to mark product as sold."
      );
    }
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(productId);

      setProducts((prev) =>
        prev.filter((product) => product.id !== productId)
      );
    } catch (err) {
      console.error(err);
      window.alert(
        err.response?.data?.message || "Failed to delete product."
      );
    }
  };

  const formatPrice = (price) =>
    Number(price).toLocaleString("en-IN");

  return (
    <div className="ml-root">
      <NavBar theme="roomies" />

      <main className="ml-main">
        <section className="ml-hero">
          <div className="ml-hero-inner">
            <div className="ml-hero-copy">
              <span className="ml-eyebrow">
                <Package size={15} />
                YOUR CAMPUS MARKETPLACE
              </span>

              <h1 className="ml-display">
                My <span>Listings.</span>
              </h1>

              <p>
                Keep track of your campus finds, manage your products,
                and give your pre-loved things a new home.
              </p>

              {!loading && !error && (
                <div className="ml-hero-stats">
                  <div className="ml-stat">
                    <span className="ml-stat-number">
                      {products.length}
                    </span>
                    <span className="ml-stat-label">
                      Total listings
                    </span>
                  </div>

                  <div className="ml-stat-divider" />

                  <div className="ml-stat">
                    <span className="ml-stat-number">
                      {products.filter(
                        (product) => product.status === "active"
                      ).length}
                    </span>
                    <span className="ml-stat-label">
                      Active listings
                    </span>
                  </div>

                  <div className="ml-stat-divider" />

                  <div className="ml-stat">
                    <span className="ml-stat-number">
                      {products.filter(
                        (product) => product.status === "sold"
                      ).length}
                    </span>
                    <span className="ml-stat-label">
                      Sold
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="ml-hero-actions">
              <button
                type="button"
                className="ml-button ml-button-primary"
                onClick={() => navigate("/marketplace/add")}
              >
                <Plus size={18} />
                Add a product
              </button>

              <button
                type="button"
                className="ml-button ml-button-secondary"
                onClick={() => navigate("/marketplace")}
              >
                Browse marketplace
                <ArrowRight size={17} />
              </button>
            </div>

            <span className="ml-hero-decoration" aria-hidden="true">
              yours to
              <br />
              rehome ♡
            </span>
          </div>
        </section>

        <section className="ml-content">
          <div className="ml-section-heading">
            <div>
              <span className="ml-section-kicker">YOUR CORNER</span>
              <h2 className="ml-display">Everything you've listed</h2>
            </div>

            {!loading && !error && (
              <span className="ml-count">
                {products.length}{" "}
                {products.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="ml-state">
              <div className="ml-spinner" />
              <h3>Gathering your listings</h3>
              <p>Just a moment while we get everything ready.</p>
            </div>
          ) : error ? (
            <div className="ml-state ml-error-state" role="alert">
              <div className="ml-state-icon">
                <PackageOpen size={28} />
              </div>
              <h3>Couldn't load your listings</h3>
              <p>{error}</p>

              <button
                type="button"
                className="ml-button ml-button-primary"
                onClick={loadProducts}
              >
                Try again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="ml-empty-state">
              <div className="ml-empty-art">
                <PackageOpen size={45} strokeWidth={1.3} />
                <span>♡</span>
              </div>

              <span className="ml-section-kicker">
                A LITTLE SPACE TO START
              </span>

              <h3 className="ml-display">Nothing here just yet.</h3>

              <p>
                Your listings will appear here once you add your first
                product. Give something you no longer need a new home!
              </p>

              <button
                type="button"
                className="ml-button ml-button-primary"
                onClick={() => navigate("/marketplace/add")}
              >
                <Plus size={18} />
                List your first product
              </button>
            </div>
          ) : (
            <div className="ml-product-grid">
              {products.map((product) => {
                const image =
                  product.product_images?.[0]?.image_url;
                const isSold = product.status === "sold";

                return (
                  <article className="ml-product-card" key={product.id}>
                    <div className="ml-product-image">
                      {image ? (
                        <img
                          src={image}
                          alt={product.title || "Product"}
                          className={isSold ? "ml-image-sold" : ""}
                        />
                      ) : (
                        <div className="ml-no-image">
                          <PackageOpen size={38} strokeWidth={1.3} />
                          <span>No image available</span>
                        </div>
                      )}

                      <span
                        className={`ml-status ${
                          isSold ? "ml-status-sold" : "ml-status-active"
                        }`}
                      >
                        <span className="ml-status-dot" />
                        {isSold ? "Sold" : "Active"}
                      </span>

                      <span className="ml-price">
                        ₹{formatPrice(product.price)}
                      </span>
                    </div>

                    <div className="ml-product-info">
                      <div className="ml-product-heading">
                        <span className="ml-product-category">
                          {product.category}
                        </span>

                        {product.is_negotiable && (
                          <span className="ml-negotiable">
                            Negotiable
                          </span>
                        )}
                      </div>

                      <h3 title={product.title}>{product.title}</h3>

                      <span className="ml-condition">
                        {product.condition}
                      </span>

                      {product.location && (
                        <p className="ml-location">
                          <MapPin size={15} />
                          <span>{product.location}</span>
                        </p>
                      )}

                      <div className="ml-product-actions">
                        <button
                          type="button"
                          className="ml-action-button ml-edit-button"
                          onClick={() =>
                            navigate(
                              `/marketplace/product/${product.id}/edit`
                            )
                          }
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        {!isSold && (
                          <button
                            type="button"
                            className="ml-action-button ml-sold-button"
                            onClick={() =>
                              handleMarkAsSold(product.id)
                            }
                          >
                            <CheckCircle size={16} />
                            Mark sold
                          </button>
                        )}

                        <button
                          type="button"
                          className="ml-action-button ml-delete-button"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 size={16} />
                          Delete listing
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer theme="roomies" />
    </div>
  );
}

export default MyListings;
