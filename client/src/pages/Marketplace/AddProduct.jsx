import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  ImagePlus,
  CheckCircle,
  UserRound,
} from "lucide-react";

import "./MarketplaceTheme.css";
import "./AddProduct.css";

import NavBar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";

import {
  createProduct,
  uploadProductImage,
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

function AddProduct() {
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

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const urls = images.map((image) => URL.createObjectURL(image));

    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const remainingSlots = 5 - images.length;

    const validFiles = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (validFiles.length !== selectedFiles.length) {
      setError("Only JPEG, PNG and WebP images are allowed.");
    } else {
      setError("");
    }

    if (remainingSlots <= 0) {
      setError("You can upload a maximum of 5 images.");
    } else {
      setImages((prev) => [...prev, ...validFiles].slice(0, 5));

      if (validFiles.length > remainingSlots) {
        setError("You can upload a maximum of 5 images.");
      }
    }

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await createProduct({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        condition: formData.condition,
        is_negotiable: formData.is_negotiable,
        location: formData.location.trim(),
      });

      const productId = response?.product?.id;

      if (!productId) {
        throw new Error(
          "The product was submitted, but the server did not return its ID."
        );
      }

      for (const image of images) {
        await uploadProductImage(productId, image);
      }

      setShowSuccess(true);
    } catch (err) {
      console.error("Unable to publish product:", err);
      setError(err.message || "Unable to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ap-page">
      <NavBar theme="roomies" />

      <main className="ap-main">
        {/* Compact editorial hero */}
        <section className="ap-hero">
          <div className="ap-hero-inner">
            <button
              type="button"
              onClick={() => navigate("/marketplace")}
              className="ap-back-button"
            >
              <ArrowLeft size={16} />
              Back to Marketplace
            </button>

            <span className="ap-eyebrow">
              CLOCKIT <span>·</span> GIVE IT A NEW HOME
            </span>

            <h1 className="ap-hero-title">
              Give it
              <br />
              <em>a new story.</em>
            </h1>

            <p className="ap-hero-description">
              Your unused things might be just what someone else is looking
              for. Create a listing and give your item a second life.
            </p>

            <div className="ap-hero-note">
              <span>SELL WITH LOVE</span>
              <span className="ap-note-heart">♡</span>
              <span>PASS IT ON</span>
            </div>
          </div>

          <div className="ap-hero-decoration" aria-hidden="true">
            <div className="ap-decoration-ring" />

            <div className="ap-decoration-card">
              <span>PRE-LOVED</span>
              <span className="ap-decoration-flower">✳</span>
              <strong>Ready for</strong>
              <em>someone new.</em>
              <span className="ap-decoration-bottom">THE CAMPUS EDIT</span>
            </div>

            <span className="ap-decoration-sticker">
              A NEW
              <br />
              CHAPTER
            </span>
          </div>
        </section>

        {/* Product form */}
        <section className="ap-form-section">
          <div className="ap-form-heading">
            <div>
              <span className="ap-eyebrow">LET'S MAKE IT OFFICIAL</span>

              <h2 className="ap-section-title">
                Your item's <em>story.</em>
              </h2>

              <p className="ap-section-description">
                A few little details will help the right person find it.
              </p>
            </div>

            <span className="ap-step-label">01 — LIST YOUR ITEM</span>
          </div>

          <div className="ap-form-card">
            <div className="ap-card-topline">
              <span>YOUR LISTING DETAILS</span>
              <span className="ap-card-star">✳</span>
            </div>

            {error && (
              <div className="ap-error" role="alert">
                <span className="ap-error-mark">!</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="ap-form">
              <div className="ap-form-group">
                <label htmlFor="ap-title" className="ap-label">
                  Product title <span>*</span>
                </label>

                <input
                  id="ap-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={120}
                  placeholder="e.g. My barely-used study table"
                  className="ap-input"
                />
              </div>

              <div className="ap-form-group">
                <label htmlFor="ap-description" className="ap-label">
                  Tell us about it
                </label>

                <textarea
                  id="ap-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  maxLength={2000}
                  placeholder="Share the details someone would love to know..."
                  className="ap-input ap-textarea"
                />

                <span className="ap-field-hint">
                  A little detail goes a long way.
                </span>
              </div>

              <div className="ap-form-group">
                <label htmlFor="ap-price" className="ap-label">
                  Your asking price <span>*</span>
                </label>

                <div className="ap-price-input">
                  <span>₹</span>

                  <input
                    id="ap-price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="ap-input"
                  />
                </div>
              </div>

              <div className="ap-form-row">
                <div className="ap-form-group">
                  <label htmlFor="ap-category" className="ap-label">
                    Category <span>*</span>
                  </label>

                  <select
                    id="ap-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="ap-input ap-select"
                  >
                    <option value="">Choose a category</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ap-form-group">
                  <label htmlFor="ap-condition" className="ap-label">
                    Condition <span>*</span>
                  </label>

                  <select
                    id="ap-condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                    className="ap-input ap-select"
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

              <div className="ap-form-group">
                <label htmlFor="ap-location" className="ap-label">
                  Where can they find you?
                </label>

                <input
                  id="ap-location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. MIT-WPU Hostel"
                  className="ap-input"
                />
              </div>

              <label
                className={`ap-negotiable ${
                  formData.is_negotiable ? "is-checked" : ""
                }`}
              >
                <input
                  type="checkbox"
                  name="is_negotiable"
                  checked={formData.is_negotiable}
                  onChange={handleChange}
                />

                <span className="ap-custom-checkbox">
                  {formData.is_negotiable ? "✓" : ""}
                </span>

                <span className="ap-negotiable-copy">
                  <strong>I'm open to offers</strong>
                  <small>Let buyers know the price is negotiable.</small>
                </span>
              </label>

              <div className="ap-image-section">
                <div className="ap-image-heading">
                  <div>
                    <label className="ap-label" htmlFor="ap-images">
                      Show it off
                    </label>
                    <p className="ap-field-hint">
                      Add up to 5 photos of your item.
                    </p>
                  </div>

                  <span className="ap-image-count">{images.length} / 5</span>
                </div>

                <div className="ap-image-upload">
                  <input
                    id="ap-images"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImageChange}
                    disabled={images.length >= 5 || loading}
                  />

                  <ImagePlus size={30} strokeWidth={1.5} />

                  <strong>
                    {images.length >= 5
                      ? "You've added all 5 photos"
                      : "Choose your photos"}
                  </strong>

                  <span>JPEG, PNG or WebP</span>
                </div>

                {images.length > 0 && (
                  <div className="ap-image-grid">
                    {images.map((image, index) => (
                      <div
                        key={`${image.name}-${index}`}
                        className="ap-image-preview"
                      >
                        <img
                          src={previews[index]}
                          alt={`Product preview ${index + 1}`}
                        />

                        {index === 0 && (
                          <span className="ap-cover-label">
                            COVER PHOTO
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          aria-label={`Remove image ${index + 1}`}
                          className="ap-remove-image"
                          disabled={loading}
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="ap-form-actions">
                <button
                  type="button"
                  onClick={() => navigate("/marketplace")}
                  className="ap-button ap-button-outline"
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="ap-button ap-button-primary"
                >
                  {loading ? (
                    <>
                      <span className="ap-button-spinner" />
                      Publishing listing...
                    </>
                  ) : (
                    <>
                      Publish my listing
                      <Plus size={17} />
                    </>
                  )}
                </button>
              </div>

              <p className="ap-form-footnote">
                A little treasure deserves a good new home. ♡
              </p>
            </form>
          </div>
        </section>

        <section className="ap-bottom-note">
          <span className="ap-bottom-note-symbol">✳</span>
          <p>
            One person's no-longer-needed can be another person's
            <em> just what I was looking for.</em>
          </p>
        </section>
      </main>

      <Footer theme="roomies" />

      {/* Success popup */}
      {showSuccess && (
        <div className="ap-success-overlay">
          <div
            className="ap-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ap-success-title"
          >
            <div className="ap-success-icon">
              <CheckCircle size={35} />
            </div>

            <span className="ap-success-eyebrow">
              CLOCKIT MARKETPLACE
            </span>

            <h2 id="ap-success-title">
              Your product has been added!
            </h2>

            <p>
              Your listing has been published successfully. It's ready to
              find its new home.
            </p>

            <button
              type="button"
              className="ap-button ap-button-primary ap-success-button"
              onClick={() => navigate("/marketplace/my-listing")}
            >
              <UserRound size={17} />
              View My Listings
            </button>

            <button
              type="button"
              className="ap-success-back"
              onClick={() => navigate("/marketplace")}
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProduct;
