import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Package, Check, LoaderCircle } from "lucide-react";

import "./MarketplaceTheme.css";
import "./EditProduct.css";

import NavBar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";

import {
  getProductById,
  updateProduct,
} from "../../services/marketplaceApi";

const categories = [
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

const conditions = ["New", "Like New", "Good", "Fair", "Used"];

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    is_negotiable: false,
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProductById(id);
      const product = data.product;

      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        condition: product.condition || "",
        is_negotiable: product.is_negotiable || false,
        location: product.location || "",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load product.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await updateProduct(id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        condition: formData.condition,
        is_negotiable: formData.is_negotiable,
        location: formData.location.trim(),
      });

      navigate("/marketplace/my-listings");
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to update product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ep-page">
      {/* Keep navigation identical during loading and after loading. */}
      <NavBar theme="roomies" />

      <main className="ep-main">
        {loading ? (
          <section className="ep-loading">
            <div className="ep-loading-card">
              <span className="ep-loading-icon">
                <Package size={27} strokeWidth={1.5} />
              </span>

              <span className="ep-spinner" />

              <h1>Finding your listing...</h1>

              <p>
                Just a moment while we bring your item's details back.
              </p>
            </div>
          </section>
        ) : (
          <>
            {/* Hero */}
            <section className="ep-hero">
              <div className="ep-hero-inner">
                <button
                  type="button"
                  onClick={() => navigate("/marketplace/my-listings")}
                  className="ep-back-button"
                >
                  <ArrowLeft size={16} />
                  Back to My Listings
                </button>

                <span className="ep-eyebrow">
                  CLOCKIT <span>·</span> A LITTLE UPDATE
                </span>

                <h1 className="ep-hero-title">
                  Make it
                  <br />
                  <em>just right.</em>
                </h1>

                <p className="ep-hero-description">
                  Plans change, details change. Give your listing a little
                  refresh so it finds the right person.
                </p>

                <div className="ep-hero-note">
                  <span>REFINE</span>
                  <span className="ep-note-star">✳</span>
                  <span>REFRESH</span>
                  <span className="ep-note-star">✳</span>
                  <span>RELlST</span>
                </div>
              </div>

              <div className="ep-hero-art" aria-hidden="true">
                <div className="ep-art-ring" />

                <div className="ep-art-card">
                  <span className="ep-art-kicker">YOUR CAMPUS FIND</span>

                  <div className="ep-art-symbol">
                    <Package size={47} strokeWidth={1} />
                  </div>

                  <span className="ep-art-title">A fresh</span>
                  <em>new chapter.</em>

                  <div className="ep-art-divider" />

                  <span className="ep-art-footer">
                    MADE WITH CARE · CLOCKIT
                  </span>
                </div>

                <span className="ep-art-sticker">
                  STILL
                  <br />
                  LOVELY ♡
                </span>
              </div>
            </section>

            {/* Form */}
            <section className="ep-form-section">
              <div className="ep-form-heading">
                <div>
                  <span className="ep-eyebrow">YOUR LISTING, YOUR WAY</span>

                  <h2 className="ep-section-title">
                    Edit the <em>details.</em>
                  </h2>

                  <p className="ep-section-description">
                    Make your changes below. Your updated details will be
                    saved to your listing.
                  </p>
                </div>

                <span className="ep-step-label">02 — EDIT LISTING</span>
              </div>

              <div className="ep-form-card">
                <div className="ep-card-topline">
                  <span>LISTING DETAILS</span>
                  <span className="ep-card-star">✳</span>
                </div>

                {error && (
                  <div className="ep-error" role="alert">
                    <span className="ep-error-mark">!</span>
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="ep-form">
                  {/* Title */}
                  <div className="ep-form-group">
                    <label htmlFor="ep-title" className="ep-label">
                      Product title <span>*</span>
                    </label>

                    <input
                      id="ep-title"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Dell Inspiron Laptop"
                      className="ep-input"
                    />
                  </div>

                  {/* Description */}
                  <div className="ep-form-group">
                    <label htmlFor="ep-description" className="ep-label">
                      Tell us about it
                    </label>

                    <textarea
                      id="ep-description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe your product..."
                      className="ep-input ep-textarea"
                    />

                    <span className="ep-field-hint">
                      Help buyers understand what makes your item special.
                    </span>
                  </div>

                  {/* Price */}
                  <div className="ep-form-group">
                    <label htmlFor="ep-price" className="ep-label">
                      Your asking price <span>*</span>
                    </label>

                    <div className="ep-price-input">
                      <span>₹</span>

                      <input
                        id="ep-price"
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                        placeholder="Enter price"
                        className="ep-input"
                      />
                    </div>
                  </div>

                  {/* Category and condition */}
                  <div className="ep-form-row">
                    <div className="ep-form-group">
                      <label htmlFor="ep-category" className="ep-label">
                        Category <span>*</span>
                      </label>

                      <select
                        id="ep-category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="ep-input ep-select"
                      >
                        <option value="">Choose a category</option>

                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="ep-form-group">
                      <label htmlFor="ep-condition" className="ep-label">
                        Condition <span>*</span>
                      </label>

                      <select
                        id="ep-condition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        required
                        className="ep-input ep-select"
                      >
                        <option value="">Choose condition</option>

                        {conditions.map((condition) => (
                          <option key={condition} value={condition}>
                            {condition}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="ep-form-group">
                    <label htmlFor="ep-location" className="ep-label">
                      Location
                    </label>

                    <input
                      id="ep-location"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. MIT-WPU Hostel"
                      className="ep-input"
                    />
                  </div>

                  {/* Negotiable */}
                  <label
                    className={`ep-negotiable ${
                      formData.is_negotiable ? "is-checked" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="is_negotiable"
                      checked={formData.is_negotiable}
                      onChange={handleChange}
                    />

                    <span className="ep-custom-checkbox">
                      {formData.is_negotiable ? <Check size={14} /> : null}
                    </span>

                    <span className="ep-negotiable-copy">
                      <strong>I'm open to offers</strong>
                      <small>Let buyers know the price is negotiable.</small>
                    </span>
                  </label>

                  {/* Actions */}
                  <div className="ep-form-actions">
                    <button
                      type="button"
                      onClick={() => navigate("/marketplace/my-listings")}
                      className="ep-button ep-button-outline"
                      disabled={saving}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="ep-button ep-button-primary"
                    >
                      {saving ? (
                        <>
                          <LoaderCircle
                            size={17}
                            className="ep-saving-spinner"
                          />
                          Saving changes...
                        </>
                      ) : (
                        <>
                          <Save size={17} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>

                  <p className="ep-form-footnote">
                    Every good find deserves the right details. ♡
                  </p>
                </form>
              </div>
            </section>

            {/* Bottom note */}
            <section className="ep-bottom-note">
              <span>✳</span>
              <p>
                A little refresh can make your listing
                <em> shine all over again.</em>
              </p>
            </section>
          </>
        )}
      </main>

      {/* Same footer and theme in every state. */}
      <Footer theme="roomies" />
    </div>
  );
}

export default EditProduct;