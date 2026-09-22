import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X, MapPin, Tag, ShieldCheck } from "lucide-react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

import {
  createProduct,
  uploadProductImage,
} from "../../services/marketplaceApi";

import "./AddProduct.css";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     FORM HANDLING
     ===================================================== */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =====================================================
     IMAGE HANDLING
     ===================================================== */

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (validFiles.length !== selectedFiles.length) {
      setError("Only JPEG, PNG and WebP images are allowed.");
    } else {
      setError("");
    }

    setImages((prev) => [...prev, ...validFiles].slice(0, 5));

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  /* =====================================================
     SUBMIT
     ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // Create product first
      const response = await createProduct({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        condition: formData.condition,
        is_negotiable: formData.is_negotiable,
        location: formData.location.trim(),
      });

      const productId = response.product.id;

      // Upload images
      for (const image of images) {
        await uploadProductImage(productId, image);
      }

      // Redirect to My Listings
      navigate("/marketplace/my-listings");
    } catch (err) {
      console.error(err);

      setError(err.message || "Unable to create product.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     JSX
     ===================================================== */

  return (
    <div className="add-product-page">
      {/* =================================================
          NAVBAR
          ================================================= */}

      <Navbar theme="roomies" />

      {/* =================================================
          PAGE CONTENT
          ================================================= */}

      <main className="add-product-main">
        {/* =================================================
            HERO / PINBOARD HEADER
            ================================================= */}

        <section className="add-product-hero">
          <div className="add-product-hero-inner">
            <button
              type="button"
              className="back-marketplace-btn"
              onClick={() => navigate("/marketplace")}
            >
              <ArrowLeft size={17} />
              Back to Marketplace
            </button>

            <div className="hero-copy">
              <div className="hero-eyebrow">
                <span className="hero-dot"></span>
                CLOCKIT MARKETPLACE
              </div>

              <h1>Sell an Item</h1>

              <p>
                Turn things you no longer need into something useful for
                another student.
              </p>
            </div>

            <div className="hero-sticker">
              <Tag size={20} />
              <span>LIST IT</span>
            </div>
          </div>
        </section>

        {/* =================================================
            FORM
            ================================================= */}

        <section className="add-product-container">
          <div className="add-product-card">
            {/* Decorative pin */}
            <div className="card-pin"></div>

            {/* Card header */}
            <div className="form-card-header">
              <div>
                <span className="form-kicker">CREATE LISTING</span>

                <h2>Tell students about your item</h2>

                <p>
                  Add the important details so buyers know exactly what
                  you're offering.
                </p>
              </div>

              <div className="secure-badge">
                <ShieldCheck size={18} />
                <span>Student Marketplace</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="form-error" role="alert">
                <div className="error-icon">!</div>

                <div>
                  <strong>Something went wrong</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* =================================================
                FORM
                ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="add-product-form"
            >
              {/* Product title */}
              <div className="form-group">
                <label htmlFor="ap-title">
                  Product Title
                  <span className="required">*</span>
                </label>

                <input
                  id="ap-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Dell Inspiron Laptop"
                  className="product-input"
                />

                <span className="field-help">
                  Give your item a clear and searchable name.
                </span>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="ap-description">
                  Description
                </label>

                <textarea
                  id="ap-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your product, its features, age, reason for selling, etc."
                  className="product-input product-textarea"
                />

                <span className="field-help">
                  Be honest and specific about the item's condition.
                </span>
              </div>

              {/* Price */}
              <div className="form-group">
                <label htmlFor="ap-price">
                  Price
                  <span className="required">*</span>
                </label>

                <div className="price-input-wrapper">
                  <span className="rupee-symbol">₹</span>

                  <input
                    id="ap-price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    placeholder="Enter price"
                    className="product-input price-input"
                  />
                </div>
              </div>

              {/* Category + Condition */}
              <div className="form-two-column">
                {/* Category */}
                <div className="form-group">
                  <label htmlFor="ap-category">
                    Category
                    <span className="required">*</span>
                  </label>

                  <select
                    id="ap-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="product-input product-select"
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition */}
                <div className="form-group">
                  <label htmlFor="ap-condition">
                    Condition
                    <span className="required">*</span>
                  </label>

                  <select
                    id="ap-condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                    className="product-input product-select"
                  >
                    <option value="">
                      Select condition
                    </option>

                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="form-group">
                <label htmlFor="ap-location">
                  Location
                </label>

                <div className="location-input-wrapper">
                  <MapPin size={18} />

                  <input
                    id="ap-location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. MIT-WPU Hostel"
                    className="product-input location-input"
                  />
                </div>

                <span className="field-help">
                  Let buyers know where they can collect the item.
                </span>
              </div>

              {/* Negotiable */}
              <label
                className={`negotiable-option ${
                  formData.is_negotiable ? "selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  name="is_negotiable"
                  checked={formData.is_negotiable}
                  onChange={handleChange}
                />

                <span className="custom-checkbox">
                  ✓
                </span>

                <span className="negotiable-content">
                  <strong>Price is negotiable</strong>

                  <small>
                    Allow interested students to discuss the price with you.
                  </small>
                </span>
              </label>

              {/* =================================================
                  IMAGES
                  ================================================= */}

              <div className="images-section">
                <div className="images-heading">
                  <div>
                    <label>Product Images</label>

                    <p>
                      Add up to 5 clear images of your item.
                    </p>
                  </div>

                  <span className="image-counter">
                    {images.length} / 5
                  </span>
                </div>

                {/* Upload */}
                <label className="image-upload-area">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImageChange}
                  />

                  <div className="upload-icon">
                    <Plus size={27} />
                  </div>

                  <strong>
                    Click to select images
                  </strong>

                  <span>
                    JPEG, PNG or WebP
                  </span>
                </label>

                {/* Image previews */}
                {images.length > 0 && (
                  <div className="image-preview-board">
                    {images.map((image, index) => (
                      <div
                        key={`${image.name}-${index}`}
                        className="image-preview-card"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                        />

                        <span className="image-pin"></span>

                        <button
                          type="button"
                          className="remove-image-btn"
                          aria-label={`Remove image ${index + 1}`}
                          onClick={() => removeImage(index)}
                        >
                          <X size={15} />
                        </button>

                        <span className="image-number">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* =================================================
                  ACTIONS
                  ================================================= */}

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/marketplace")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="create-listing-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="button-spinner"></span>
                      Creating Listing...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Create Listing
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* =================================================
          FOOTER
          ================================================= */}

      <Footer theme = "roomies" />
    </div>
  );
}

export default AddProduct;