import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";

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

/*
 * Design notes (shares its language with Marketplace, ProductDetails,
 * MyListings and EditProduct)
 * - Concept: a blank card you fill in and pin to the campus notice board.
 *   The sheet overlaps the dotted header; photos you add appear as
 *   pinned prints.
 * - Palette: ink #14213D, board #E9ECF3, tag #FFD23F,
 *   coral #FF5A4E, slate #5B6478, paper #FFFFFF
 * - Type: Bricolage Grotesque (display) + DM Sans (body)
 */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');

    .ap-root { font-family: 'DM Sans', system-ui, sans-serif; }
    .ap-display { font-family: 'Bricolage Grotesque', 'DM Sans', system-ui, sans-serif; }

    .ap-board {
      background-color: #DDE2EE;
      background-image: radial-gradient(#B7C0D6 1.2px, transparent 1.2px);
      background-size: 22px 22px;
    }

    .ap-field {
      width: 100%;
      padding: 0.8rem 1rem;
      border-radius: 0.75rem;
      background: #F4F6FA;
      color: #14213D;
      border: 2px solid transparent;
      transition: border-color .15s ease, background-color .15s ease;
    }
    .ap-field::placeholder { color: #8A93A8; }
    .ap-field:hover { border-color: #C9D0E0; }
    .ap-field:focus { outline: none; background: #FFFFFF; border-color: #14213D; }

    .ap-cta { box-shadow: 4px 4px 0 #FFD23F; transition: transform .15s ease, box-shadow .15s ease; }
    .ap-cta:hover:not(:disabled) { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #FFD23F; }
    .ap-cta:active:not(:disabled) { transform: translate(4px, 4px); box-shadow: 0 0 0 #FFD23F; }
    .ap-cta:disabled { box-shadow: none; }

    .ap-root button:focus-visible { outline: 3px solid #FF5A4E; outline-offset: 3px; }
    .ap-root input[type="checkbox"]:focus-visible { outline: 3px solid #FF5A4E; outline-offset: 3px; }
    .ap-drop:focus-within { border-color: #14213D; background: #FFF6CC; }

    @media (prefers-reduced-motion: reduce) {
      .ap-field, .ap-cta, .ap-cta:hover, .ap-cta:active { transition: none; }
    }
  `}</style>
);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    );

    if (validFiles.length !== selectedFiles.length) {
      setError("Only JPEG, PNG and WebP images are allowed.");
    }

    setImages((prev) => [...prev, ...validFiles].slice(0, 5));

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
  };

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

      // Go to My Listings
      navigate("/marketplace/my-listings");
    } catch (err) {
      console.error(err);

      setError(err.message || "Unable to create product.");
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "block text-sm font-semibold text-[#14213D] mb-2";

  return (
    <div className="ap-root min-h-screen bg-[#E9ECF3] text-[#14213D]">
      <Styles />

      {/* Header on the pinboard */}
      <header className="ap-board">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-24 sm:pb-28">
          {/* Back */}
          <button
            onClick={() => navigate("/marketplace")}
            className="inline-flex items-center gap-2 text-sm font-medium bg-white rounded-full pl-3 pr-4 py-2 mb-8 hover:bg-[#14213D] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Marketplace
          </button>

          <h1 className="ap-display text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[0.98]">
            Sell an Item
          </h1>

          <p className="text-[#3E475A] mt-3 text-sm sm:text-base leading-7">
            Create a listing for other students on UniMart.
          </p>
        </div>
      </header>

      {/* Form sheet, overlapping the header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 pb-14">
        <div className="relative bg-white rounded-[28px] p-6 sm:p-9 shadow-[0_18px_44px_rgba(20,33,61,0.14)]">
          {/* Pin */}
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FF5A4E] shadow-[0_2px_4px_rgba(20,33,61,0.4)]" />

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-6 px-5 py-4 rounded-2xl bg-[#FFF1EF] border-l-8 border-[#FF5A4E] text-[#14213D] text-sm font-medium"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="ap-title" className={labelClass}>
                Product Title
              </label>

              <input
                id="ap-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Dell Inspiron Laptop"
                className="ap-field"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="ap-description" className={labelClass}>
                Description
              </label>

              <textarea
                id="ap-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your product..."
                className="ap-field resize-none leading-7"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="ap-price" className={labelClass}>
                Price (₹)
              </label>

              <div className="relative">
                <span className="ap-display absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-[#14213D] pointer-events-none">
                  ₹
                </span>

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
                  className="ap-field !pl-9 ap-display text-lg font-bold"
                />
              </div>
            </div>

            {/* Category + Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="ap-category" className={labelClass}>
                  Category
                </label>

                <select
                  id="ap-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="ap-field cursor-pointer"
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ap-condition" className={labelClass}>
                  Condition
                </label>

                <select
                  id="ap-condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  className="ap-field cursor-pointer"
                >
                  <option value="">Select condition</option>

                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="ap-location" className={labelClass}>
                Location
              </label>

              <input
                id="ap-location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. MIT-WPU Hostel"
                className="ap-field"
              />
            </div>

            {/* Negotiable */}
            <label
              className={`flex items-center gap-3 cursor-pointer px-4 py-3.5 rounded-xl border-2 border-dashed transition-colors ${
                formData.is_negotiable
                  ? "border-[#14213D] bg-[#FFD23F]/40"
                  : "border-[#B7C0D6] hover:border-[#14213D]"
              }`}
            >
              <input
                type="checkbox"
                name="is_negotiable"
                checked={formData.is_negotiable}
                onChange={handleChange}
                className="w-5 h-5 accent-[#14213D]"
              />

              <span className="text-sm font-medium text-[#14213D]">
                Price is negotiable
              </span>
            </label>

            {/* Images */}
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <span className={labelClass}>Product Images</span>

                <span className="ap-display text-sm font-bold text-[#5B6478] mb-2">
                  {images.length} of 5
                </span>
              </div>

              <p className="text-sm text-[#5B6478] mb-3">
                Add up to 5 images. JPEG, PNG or WebP.
              </p>

              <label className="ap-drop border-2 border-dashed border-[#B7C0D6] rounded-2xl p-7 flex flex-col items-center justify-center cursor-pointer hover:border-[#14213D] hover:bg-[#FFF6CC] transition-colors">
                <span className="w-12 h-12 rounded-full bg-[#FFD23F] flex items-center justify-center mb-3">
                  <Plus size={24} className="text-[#14213D]" />
                </span>

                <span className="text-sm font-semibold text-[#14213D]">
                  Click to select images
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>

              {/* Image previews */}
              {images.length > 0 && (
                <div className="ap-board rounded-2xl p-4 sm:p-5 mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
                  {images.map((image, index) => (
                    <div
                      key={`${image.name}-${index}`}
                      className="relative aspect-square bg-white p-1.5 rounded-md shadow-[0_2px_0_#B7C0D6,0_10px_20px_rgba(20,33,61,0.16)]"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-sm"
                      />

                      {/* Pin */}
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#FF5A4E] shadow-[0_2px_3px_rgba(20,33,61,0.4)]" />

                      <button
                        type="button"
                        aria-label={`Remove image ${index + 1}`}
                        onClick={() => removeImage(index)}
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#14213D] text-white flex items-center justify-center hover:bg-[#FF5A4E] transition-colors"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t-2 border-dashed border-[#B7C0D6]">
              <button
                type="button"
                onClick={() => navigate("/marketplace")}
                className="flex-1 px-5 py-3.5 rounded-xl bg-white ring-1 ring-[#C9D0E0] hover:ring-[#14213D] font-medium transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="ap-cta flex-1 px-5 py-3.5 rounded-xl bg-[#14213D] text-white font-semibold disabled:opacity-50"
              >
                {loading ? "Creating Listing..." : "Create Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
