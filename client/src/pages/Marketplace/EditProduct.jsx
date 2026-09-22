import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { getProductById, updateProduct } from "../../services/marketplaceApi";

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
 * Design notes (shares its language with Marketplace, ProductDetails
 * and MyListings)
 * - Concept: a listing form filled in on paper, resting on the
 *   campus notice board. The sheet overlaps the dotted header.
 * - Palette: ink #14213D, board #E9ECF3, tag #FFD23F,
 *   coral #FF5A4E, slate #5B6478, paper #FFFFFF
 * - Type: Bricolage Grotesque (display) + DM Sans (body)
 */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');

    .ep-root { font-family: 'DM Sans', system-ui, sans-serif; }
    .ep-display { font-family: 'Bricolage Grotesque', 'DM Sans', system-ui, sans-serif; }

    .ep-board {
      background-color: #DDE2EE;
      background-image: radial-gradient(#B7C0D6 1.2px, transparent 1.2px);
      background-size: 22px 22px;
    }

    .ep-field {
      width: 100%;
      padding: 0.8rem 1rem;
      border-radius: 0.75rem;
      background: #F4F6FA;
      color: #14213D;
      border: 2px solid transparent;
      transition: border-color .15s ease, background-color .15s ease;
    }
    .ep-field::placeholder { color: #8A93A8; }
    .ep-field:hover { border-color: #C9D0E0; }
    .ep-field:focus { outline: none; background: #FFFFFF; border-color: #14213D; }

    .ep-cta { box-shadow: 4px 4px 0 #FFD23F; transition: transform .15s ease, box-shadow .15s ease; }
    .ep-cta:hover:not(:disabled) { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #FFD23F; }
    .ep-cta:active:not(:disabled) { transform: translate(4px, 4px); box-shadow: 0 0 0 #FFD23F; }
    .ep-cta:disabled { box-shadow: none; }

    .ep-root button:focus-visible { outline: 3px solid #FF5A4E; outline-offset: 3px; }
    .ep-root input[type="checkbox"]:focus-visible { outline: 3px solid #FF5A4E; outline-offset: 3px; }

    @media (prefers-reduced-motion: reduce) {
      .ep-field, .ep-cta, .ep-cta:hover, .ep-cta:active { transition: none; }
    }
  `}</style>
);

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

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="ep-root min-h-screen bg-[#E9ECF3] text-[#14213D] flex items-center justify-center">
        <Styles />
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-[#C9D0E0] border-t-[#14213D] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5B6478]">Loading product...</p>
        </div>
      </div>
    );
  }

  const labelClass = "block text-sm font-semibold text-[#14213D] mb-2";

  return (
    <div className="ep-root min-h-screen bg-[#E9ECF3] text-[#14213D]">
      <Styles />

      {/* Header on the pinboard */}
      <header className="ep-board">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-24 sm:pb-28">
          {/* Back */}
          <button
            onClick={() => navigate("/marketplace/my-listings")}
            className="inline-flex items-center gap-2 text-sm font-medium bg-white rounded-full pl-3 pr-4 py-2 mb-8 hover:bg-[#14213D] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to My Listings
          </button>

          <h1 className="ep-display text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[0.98]">
            Edit Product
          </h1>

          <p className="text-[#3E475A] mt-3 text-sm sm:text-base leading-7">
            Update the details of your marketplace listing.
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
              <label htmlFor="ep-title" className={labelClass}>
                Product Title
              </label>

              <input
                id="ep-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Dell Inspiron Laptop"
                className="ep-field"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="ep-description" className={labelClass}>
                Description
              </label>

              <textarea
                id="ep-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your product..."
                className="ep-field resize-none leading-7"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="ep-price" className={labelClass}>
                Price (₹)
              </label>

              <div className="relative">
                <span className="ep-display absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-[#14213D] pointer-events-none">
                  ₹
                </span>

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
                  className="ep-field !pl-9 ep-display text-lg font-bold"
                />
              </div>
            </div>

            {/* Category + Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="ep-category" className={labelClass}>
                  Category
                </label>

                <select
                  id="ep-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="ep-field cursor-pointer"
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
                <label htmlFor="ep-condition" className={labelClass}>
                  Condition
                </label>

                <select
                  id="ep-condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  className="ep-field cursor-pointer"
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
              <label htmlFor="ep-location" className={labelClass}>
                Location
              </label>

              <input
                id="ep-location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. MIT-WPU Hostel"
                className="ep-field"
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

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t-2 border-dashed border-[#B7C0D6]">
              <button
                type="button"
                onClick={() => navigate("/marketplace/my-listings")}
                className="flex-1 px-5 py-3.5 rounded-xl bg-white ring-1 ring-[#C9D0E0] hover:ring-[#14213D] font-medium transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="ep-cta flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#14213D] text-white font-semibold disabled:opacity-50"
              >
                <Save size={18} />

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;