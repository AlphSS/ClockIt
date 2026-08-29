import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus, Loader2 } from "lucide-react";
import NavBar from "../../components/common/NavBar";
import { createStay, uploadStayImage } from "../../services/staysApi";
import { useAuth } from "../../context/AuthContext";

const AMENITY_OPTIONS = [
  "WiFi", "Parking", "Lift", "Power Backup", "Security", "Water Supply",
  "AC", "Washing Machine", "Kitchen", "Balcony", "Gym",
];

const BHK_OPTIONS = ["1 RK", "1 BHK", "2 BHK", "3+ BHK"];
const FURNISHING_OPTIONS = ["furnished", "semi-furnished", "unfurnished"];
const PROPERTY_TYPES = ["flat", "room", "house", "pg"];

function FormField({ label, error, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3 mb-4 mt-6">
      {children}
    </h2>
  );
}

export default function PostStay() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    propertyType: "flat",
    bhk: "2 BHK",
    bathrooms: "1",
    areaSqft: "",
    floor: "",
    totalFloors: "",
    rent: "",
    securityDeposit: "",
    furnishing: "furnished",
    locationArea: "",
    locationAddress: "",
    locationCity: "Pune",
    locationPincode: "",
    locationLandmark: "",
    locationCampus: "",
    amenities: [],
    availableFrom: "",
  });

  const [images, setImages] = useState([]); // { file, url, uploading, uploaded, publicUrl }
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const fileInputRef = useRef(null);

  if (!user) {
    navigate("/login");
    return null;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function toggleAmenity(a) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  }

  async function handleImageChange(e) {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      setGlobalError("Maximum 10 images allowed.");
      return;
    }

    const newItems = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      uploading: false,
      publicUrl: null,
    }));

    setImages((prev) => [...prev, ...newItems]);

    // Upload each image
    const token = await getToken();
    for (let i = 0; i < newItems.length; i++) {
      const idx = images.length + i;
      setImages((prev) =>
        prev.map((item, j) => j === idx ? { ...item, uploading: true } : item)
      );
      try {
        const res = await uploadStayImage(newItems[i].file, token);
        setImages((prev) =>
          prev.map((item, j) => j === idx ? { ...item, uploading: false, publicUrl: res.url } : item)
        );
      } catch (err) {
        console.warn("Image upload failed:", err.message);
        setImages((prev) =>
          prev.map((item, j) => j === idx ? { ...item, uploading: false } : item)
        );
      }
    }
  }

  function removeImage(idx) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function validate() {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.rent) newErrors.rent = "Rent is required.";
    if (!form.locationArea.trim()) newErrors.locationArea = "Area is required.";
    if (form.rent && isNaN(form.rent)) newErrors.rent = "Rent must be a number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGlobalError("");

    try {
      const token = await getToken();
      const imageUrls = images.map((img) => img.publicUrl).filter(Boolean);

      await createStay({ ...form, images: imageUrls }, token);
      navigate("/stays/my-listings");
    } catch (err) {
      setGlobalError(err.message || "Failed to post your flat. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition shadow-sm"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Post Your Flat</h1>
            <p className="text-sm text-gray-400">Fill in the details to list your property</p>
          </div>
        </div>

        {globalError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-0">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionTitle>📋 Basic Information</SectionTitle>
            <div className="space-y-4">
              <FormField label="Property Title" error={errors.title} required>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. 2BHK Fully Furnished Flat in Kothrud"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition"
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your property, surroundings, and any special features..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Property Type" required>
                  <select
                    name="propertyType"
                    value={form.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition appearance-none"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t} className="capitalize">{t.toUpperCase()}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="BHK" required>
                  <select
                    name="bhk"
                    value={form.bhk}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition appearance-none"
                  >
                    {BHK_OPTIONS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField label="Bathrooms">
                  <input
                    name="bathrooms"
                    type="number"
                    min="1"
                    value={form.bathrooms}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition"
                  />
                </FormField>
                <FormField label="Area (sqft)">
                  <input
                    name="areaSqft"
                    type="number"
                    value={form.areaSqft}
                    onChange={handleChange}
                    placeholder="e.g. 850"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition"
                  />
                </FormField>
                <FormField label="Floor">
                  <input
                    name="floor"
                    type="number"
                    value={form.floor}
                    onChange={handleChange}
                    placeholder="e.g. 3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition"
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-4">
            <SectionTitle>💰 Pricing</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Monthly Rent (₹)" error={errors.rent} required>
                <input
                  name="rent"
                  type="number"
                  value={form.rent}
                  onChange={handleChange}
                  placeholder="e.g. 15000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition"
                />
              </FormField>
              <FormField label="Security Deposit (₹)">
                <input
                  name="securityDeposit"
                  type="number"
                  value={form.securityDeposit}
                  onChange={handleChange}
                  placeholder="e.g. 30000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition"
                />
              </FormField>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-4">
            <SectionTitle>📍 Location</SectionTitle>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Area / Locality" error={errors.locationArea} required>
                  <input
                    name="locationArea"
                    value={form.locationArea}
                    onChange={handleChange}
                    placeholder="e.g. Kothrud"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition"
                  />
                </FormField>
                <FormField label="City">
                  <input
                    name="locationCity"
                    value={form.locationCity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition"
                  />
                </FormField>
              </div>
              <FormField label="Full Address">
                <input
                  name="locationAddress"
                  value={form.locationAddress}
                  onChange={handleChange}
                  placeholder="e.g. Near Karve Statue, Lane 5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition"
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Pincode">
                  <input
                    name="locationPincode"
                    value={form.locationPincode}
                    onChange={handleChange}
                    placeholder="e.g. 411038"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition"
                  />
                </FormField>
                <FormField label="Nearby Landmark">
                  <input
                    name="locationLandmark"
                    value={form.locationLandmark}
                    onChange={handleChange}
                    placeholder="e.g. Near DMart"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition"
                  />
                </FormField>
              </div>
              <FormField label="Nearby Campus / College">
                <input
                  name="locationCampus"
                  value={form.locationCampus}
                  onChange={handleChange}
                  placeholder="e.g. Pune University"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition"
                />
              </FormField>
            </div>
          </div>

          {/* Furnishing + Availability */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-4">
            <SectionTitle>🛋️ Furnishing & Availability</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Furnishing">
                <div className="flex gap-2">
                  {FURNISHING_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, furnishing: opt }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition ${
                        form.furnishing === opt
                          ? "bg-cyan-500 text-white border-cyan-500"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-cyan-300"
                      }`}
                    >
                      {opt === "semi-furnished" ? "Semi" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </FormField>
              <FormField label="Available From">
                <input
                  name="availableFrom"
                  type="date"
                  value={form.availableFrom}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition"
                />
              </FormField>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-4">
            <SectionTitle>✅ Amenities</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition ${
                    form.amenities.includes(amenity)
                      ? "bg-cyan-500 text-white border-cyan-500 shadow-sm"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-cyan-300 hover:text-cyan-600"
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-4">
            <SectionTitle>🖼️ Property Images</SectionTitle>
            <p className="text-xs text-gray-400 mb-4">Upload up to 10 images. First image will be the cover.</p>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={img.url} alt={`img-${i}`} className="w-full h-full object-cover" />
                  {img.uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 size={20} className="text-white animate-spin" />
                    </div>
                  )}
                  {!img.uploading && (
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={12} />
                    </button>
                  )}
                  {i === 0 && (
                    <div className="absolute bottom-1.5 left-1.5 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded-full">
                      Cover
                    </div>
                  )}
                </div>
              ))}

              {images.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-cyan-400 hover:bg-cyan-50 flex flex-col items-center justify-center text-gray-400 hover:text-cyan-500 transition"
                >
                  <Plus size={24} />
                  <span className="text-xs mt-1">Add</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Submit */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Posting...</>
              ) : (
                "Post Flat →"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
