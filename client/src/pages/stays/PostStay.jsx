import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus, Loader2, Check, Sparkles } from "lucide-react";
import NavBar from "../../components/common/NavBar";
import { createStay, uploadStayImage } from "../../services/staysApi";
import { useAuth } from "../../context/AuthContext";

const AMENITY_OPTIONS = [
  "WiFi", "Parking", "Lift", "Power Backup", "Security", "Water Supply",
  "AC", "Washing Machine", "Kitchen", "Balcony", "Gym", "Swimming Pool"
];

const FACILITY_OPTIONS = [
  "College / University", "Grocery store", "Hospital", "Pharmacy",
  "Bus stop", "Metro", "Restaurant", "Cafe", "ATM", "Gym", "Laundry", "Shopping"
];

const BHK_OPTIONS = ["1 RK", "1 BHK", "2 BHK", "3+ BHK"];
const FURNISHING_OPTIONS = [
  { value: "furnished", label: "Fully Furnished" },
  { value: "semi-furnished", label: "Semi Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];
const PROPERTY_TYPES = [
  { value: "flat", label: "Flat / Apartment" },
  { value: "room", label: "Single Room" },
  { value: "house", label: "Independent House" },
  { value: "pg", label: "PG / Shared Hostel" },
];
const OCCUPANCY_OPTIONS = [
  { value: "any", label: "Any Occupancy" },
  { value: "students", label: "Students Only" },
  { value: "working", label: "Working Professionals" },
  { value: "family", label: "Families" },
];

function FormField({ label, error, children, required, hint }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#18100E" }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
    </div>
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
    distanceFromCollege: "",
    occupancyPreference: "any",
    genderPreference: "any",
    facilities: [],
    amenities: [],
    availableFrom: "",
  });

  const [images, setImages] = useState([]); // Array of { file, previewUrl, publicUrl, uploading }
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

  function toggleFacility(f) {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(f)
        ? prev.facilities.filter((x) => x !== f)
        : [...prev.facilities, f],
    }));
  }

  async function handleImageChange(e) {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      setGlobalError("Maximum 10 images allowed per listing.");
      return;
    }

    // Validate size (max 8MB per file) and type
    for (let f of files) {
      if (!f.type.startsWith("image/")) {
        setGlobalError("Only image files (JPG, PNG, WEBP) are allowed.");
        return;
      }
      if (f.size > 8 * 1024 * 1024) {
        setGlobalError(`Image ${f.name} exceeds 8MB file size limit.`);
        return;
      }
    }

    const newItems = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      uploading: false,
      publicUrl: null,
    }));

    setImages((prev) => [...prev, ...newItems]);

    // Background upload each image to Supabase Storage
    try {
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
          console.warn("Image upload failed, will fallback to data preview or standard URL:", err);
          setImages((prev) =>
            prev.map((item, j) => j === idx ? { ...item, uploading: false, publicUrl: item.previewUrl } : item)
          );
        }
      }
    } catch (err) {
      console.error("Token error during image upload:", err);
    }
  }

  function removeImage(idx) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function makeCover(idx) {
    setImages((prev) => {
      const copy = [...prev];
      const [target] = copy.splice(idx, 1);
      return [target, ...copy];
    });
  }

  function validate() {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.rent) newErrors.rent = "Rent amount is required.";
    if (!form.locationArea.trim()) newErrors.locationArea = "Area / Locality is required.";
    if (form.rent && (isNaN(form.rent) || parseInt(form.rent) <= 0)) newErrors.rent = "Rent must be a positive number.";
    if (form.securityDeposit && isNaN(form.securityDeposit)) newErrors.securityDeposit = "Security deposit must be a valid number.";
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
      const imageUrls = images.map((img) => img.publicUrl || img.previewUrl).filter(Boolean);

      const payload = {
        title: form.title,
        description: form.description,
        propertyType: form.propertyType,
        bhk: form.bhk,
        bathrooms: form.bathrooms,
        areaSqft: form.areaSqft,
        floor: form.floor,
        totalFloors: form.totalFloors,
        rent: form.rent,
        securityDeposit: form.securityDeposit,
        furnishing: form.furnishing,
        locationArea: form.locationArea,
        locationAddress: form.locationAddress,
        locationCity: form.locationCity,
        locationPincode: form.locationPincode,
        locationLandmark: form.locationLandmark,
        locationCampus: form.locationCampus,
        distanceFromCollege: form.distanceFromCollege,
        occupancyPreference: form.occupancyPreference,
        genderPreference: form.genderPreference,
        facilities: form.facilities,
        amenities: form.amenities,
        availableFrom: form.availableFrom,
        images: imageUrls,
      };

      const res = await createStay(payload, token);
      navigate(`/stays/${res.data.id}`);
    } catch (err) {
      setGlobalError(err.message || "Failed to create stay listing.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    fontSize: "14px",
    borderRadius: "12px",
    border: "1.5px solid #E8E0D8",
    backgroundColor: "#FDFAF5",
    color: "#18100E",
    outline: "none",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3EEE7" }}>
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold mb-6 hover:underline"
          style={{ color: "#7B3045" }}
        >
          <ArrowLeft size={16} /> Cancel &amp; Back
        </button>

        <div className="rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl" style={{ backgroundColor: "#FDFAF5", border: "1px solid #E8E0D8" }}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3" style={{ backgroundColor: "#F3EEE7", color: "#7B3045" }}>
              <Sparkles size={12} /> Post New Flat
            </div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
              List Your Property
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Reach thousands of students looking for verified housing in your locality.
            </p>
          </div>

          {globalError && (
            <div className="p-4 rounded-xl text-sm font-semibold text-red-700 bg-red-50 border border-red-200">
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. BASIC INFORMATION */}
            <div className="space-y-4">
              <h2 className="text-base font-bold uppercase tracking-wider pb-2 border-b" style={{ color: "#7B3045", borderColor: "#E8E0D8" }}>
                1. Basic Information
              </h2>

              <FormField label="Listing Title" required error={errors.title} hint="e.g. Spacious 2BHK Furnished Flat near University">
                <input
                  type="text"
                  name="title"
                  placeholder="Listing title..."
                  value={form.title}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </FormField>

              <FormField label="Detailed Description" hint="Describe room features, sunlight, balcony, rule preferences...">
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Describe your property..."
                  value={form.description}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Property Type">
                  <select name="propertyType" value={form.propertyType} onChange={handleChange} style={inputStyle}>
                    {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </FormField>

                <FormField label="Locality / Area" required error={errors.locationArea}>
                  <input
                    type="text"
                    name="locationArea"
                    placeholder="e.g. Kothrud, Baner, Karve Nagar"
                    value={form.locationArea}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </FormField>
              </div>

              <FormField label="Full Address">
                <input
                  type="text"
                  name="locationAddress"
                  placeholder="Building, street, block number..."
                  value={form.locationAddress}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="City">
                  <input type="text" name="locationCity" value={form.locationCity} onChange={handleChange} style={inputStyle} />
                </FormField>

                <FormField label="Pincode">
                  <input type="text" name="locationPincode" placeholder="411038" value={form.locationPincode} onChange={handleChange} style={inputStyle} />
                </FormField>

                <FormField label="Landmark">
                  <input type="text" name="locationLandmark" placeholder="Near Karve Statue" value={form.locationLandmark} onChange={handleChange} style={inputStyle} />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Nearest College / Campus">
                  <input type="text" name="locationCampus" placeholder="e.g. Pune University, MIT" value={form.locationCampus} onChange={handleChange} style={inputStyle} />
                </FormField>

                <FormField label="Distance to College (km)" hint="Approx distance in km">
                  <input type="number" step="0.1" name="distanceFromCollege" placeholder="1.5" value={form.distanceFromCollege} onChange={handleChange} style={inputStyle} />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Monthly Rent (₹)" required error={errors.rent}>
                  <input type="number" name="rent" placeholder="18000" value={form.rent} onChange={handleChange} style={inputStyle} />
                </FormField>

                <FormField label="Security Deposit (₹)" error={errors.securityDeposit}>
                  <input type="number" name="securityDeposit" placeholder="36000" value={form.securityDeposit} onChange={handleChange} style={inputStyle} />
                </FormField>

                <FormField label="Available From">
                  <input type="date" name="availableFrom" value={form.availableFrom} onChange={handleChange} style={inputStyle} />
                </FormField>
              </div>
            </div>

            {/* 2. PROPERTY SPECS */}
            <div className="space-y-4">
              <h2 className="text-base font-bold uppercase tracking-wider pb-2 border-b" style={{ color: "#7B3045", borderColor: "#E8E0D8" }}>
                2. Property Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="BHK Configuration">
                  <select name="bhk" value={form.bhk} onChange={handleChange} style={inputStyle}>
                    {BHK_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </FormField>

                <FormField label="Bathrooms">
                  <input type="number" min="1" name="bathrooms" value={form.bathrooms} onChange={handleChange} style={inputStyle} />
                </FormField>

                <FormField label="Furnishing Status">
                  <select name="furnishing" value={form.furnishing} onChange={handleChange} style={inputStyle}>
                    {FURNISHING_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Area (sqft)">
                  <input type="number" name="areaSqft" placeholder="900" value={form.areaSqft} onChange={handleChange} style={inputStyle} />
                </FormField>

                <FormField label="Floor">
                  <input type="number" name="floor" placeholder="3" value={form.floor} onChange={handleChange} style={inputStyle} />
                </FormField>

                <FormField label="Total Floors">
                  <input type="number" name="totalFloors" placeholder="7" value={form.totalFloors} onChange={handleChange} style={inputStyle} />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Occupancy Preference">
                  <select name="occupancyPreference" value={form.occupancyPreference} onChange={handleChange} style={inputStyle}>
                    {OCCUPANCY_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </FormField>

                <FormField label="Gender Preference">
                  <select name="genderPreference" value={form.genderPreference} onChange={handleChange} style={inputStyle}>
                    <option value="any">Any / Co-ed</option>
                    <option value="male">Male Only</option>
                    <option value="female">Female Only</option>
                  </select>
                </FormField>
              </div>
            </div>

            {/* 3. NEARBY FACILITIES & AMENITIES */}
            <div className="space-y-4">
              <h2 className="text-base font-bold uppercase tracking-wider pb-2 border-b" style={{ color: "#7B3045", borderColor: "#E8E0D8" }}>
                3. Nearby Facilities &amp; Amenities
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#18100E" }}>
                  Nearby Facilities
                </label>
                <div className="flex flex-wrap gap-2">
                  {FACILITY_OPTIONS.map((fac) => {
                    const active = form.facilities.includes(fac);
                    return (
                      <button
                        key={fac}
                        type="button"
                        onClick={() => toggleFacility(fac)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                        style={
                          active
                            ? { backgroundColor: "#7B3045", color: "#FDFAF5" }
                            : { backgroundColor: "#F3EEE7", color: "#18100E", border: "1px solid #E8E0D8" }
                        }
                      >
                        {active && <Check size={12} />} {fac}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#18100E" }}>
                  In-House Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const active = form.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                        style={
                          active
                            ? { backgroundColor: "#18100E", color: "#F3EEE7" }
                            : { backgroundColor: "#F3EEE7", color: "#18100E", border: "1px solid #E8E0D8" }
                        }
                      >
                        {active && <Check size={12} />} {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. PHOTO UPLOAD */}
            <div className="space-y-4">
              <h2 className="text-base font-bold uppercase tracking-wider pb-2 border-b" style={{ color: "#7B3045", borderColor: "#E8E0D8" }}>
                4. Property Photos
              </h2>
              <p className="text-xs text-gray-500">
                Upload up to 10 photos. The first image will be used as the cover photo.
              </p>

              {/* Upload Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50"
                style={{ borderColor: "#C4B8AE", backgroundColor: "#F8F4EF" }}
              >
                <Upload size={32} className="mb-2" style={{ color: "#7B3045" }} />
                <p className="text-sm font-bold" style={{ color: "#18100E" }}>Click or drag property photos to upload</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 8MB each</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden h-28 border group" style={{ borderColor: "#E8E0D8" }}>
                      <img src={img.previewUrl} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Cover Photo
                        </span>
                      )}
                      {img.uploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold">
                          <Loader2 size={16} className="animate-spin mr-1" /> Uploading...
                        </div>
                      )}
                      <div className="absolute top-1 right-1 flex gap-1">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => makeCover(idx)}
                            className="bg-black/60 hover:bg-black text-white text-[10px] px-1.5 py-0.5 rounded"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 border-t" style={{ borderColor: "#E8E0D8" }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-base font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: "#7B3045", color: "#F3EEE7" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6a2638"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7B3045"}
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                {loading ? "Publishing Listing..." : "Publish Stay Listing"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
