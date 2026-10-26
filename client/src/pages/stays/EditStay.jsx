import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus, Loader2, CheckCircle, Save } from "lucide-react";
import NavBar from "../../components/common/NavBar";
import { fetchStayById, updateStay, uploadStayImage } from "../../services/staysApi";
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

export default function EditStay() {
  const { id } = useParams();
  const { user, getToken } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [images, setImages] = useState([]); // Array of { previewUrl, publicUrl, uploading }
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchStayById(id);
        const stay = res.data;

        if (user && stay.owner_id !== user.id) {
          navigate("/stays/my-listings");
          return;
        }

        setForm({
          title: stay.title || "",
          description: stay.description || "",
          propertyType: stay.property_type || "flat",
          bhk: stay.bhk || "2 BHK",
          bathrooms: String(stay.bathrooms || "1"),
          areaSqft: String(stay.area_sqft || ""),
          floor: String(stay.floor ?? ""),
          totalFloors: String(stay.total_floors ?? ""),
          rent: String(stay.rent || ""),
          securityDeposit: String(stay.security_deposit || ""),
          furnishing: stay.furnishing || "unfurnished",
          locationArea: stay.location_area || "",
          locationAddress: stay.location_address || "",
          locationCity: stay.location_city || "Pune",
          locationPincode: stay.location_pincode || "",
          locationLandmark: stay.location_landmark || "",
          locationCampus: stay.location_campus || "",
          distanceFromCollege: String(stay.distance_from_college || ""),
          occupancyPreference: stay.occupancy_preference || "any",
          genderPreference: stay.gender_preference || "any",
          status: stay.status || "available",
          facilities: stay.facilities || [],
          amenities: stay.amenities || [],
          availableFrom: stay.available_from || "",
        });

        setImages((stay.images || []).map((url) => ({ previewUrl: url, publicUrl: url })));
      } catch (err) {
        setFetchError(err.message || "Failed to load stay details.");
      } finally {
        setFetchLoading(false);
      }
    }
    if (id) load();
  }, [id, user, navigate]);

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
      setGlobalError("Maximum 10 images allowed.");
      return;
    }

    const newItems = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      uploading: false,
      publicUrl: null,
    }));

    setImages((prev) => [...prev, ...newItems]);

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
          console.warn("Upload fallback:", err);
          setImages((prev) =>
            prev.map((item, j) => j === idx ? { ...item, uploading: false, publicUrl: item.previewUrl } : item)
          );
        }
      }
    } catch (err) {
      console.error(err);
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
    if (!form.rent) newErrors.rent = "Rent is required.";
    if (!form.locationArea.trim()) newErrors.locationArea = "Area is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGlobalError("");
    setSavedSuccess(false);

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
        status: form.status,
        facilities: form.facilities,
        amenities: form.amenities,
        availableFrom: form.availableFrom,
        images: imageUrls,
      };

      await updateStay(id, payload, token);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setGlobalError(err.message || "Failed to update listing.");
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

  if (fetchLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F3EEE7" }}>
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-full w-1/3" />
          <div className="h-96 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (fetchError || !form) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F3EEE7" }}>
        <NavBar />
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <h2 className="font-bold text-2xl mb-2" style={{ color: "#18100E" }}>Error loading listing</h2>
          <p className="text-gray-500 text-sm mb-6">{fetchError}</p>
          <button onClick={() => navigate("/stays/my-listings")} className="px-6 py-3 font-bold rounded-xl text-sm" style={{ backgroundColor: "#18100E", color: "#F3EEE7" }}>
            Return to My Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3EEE7" }}>
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate("/stays/my-listings")}
          className="inline-flex items-center gap-2 text-sm font-semibold mb-6 hover:underline"
          style={{ color: "#7B3045" }}
        >
          <ArrowLeft size={16} /> Back to My Listings
        </button>

        <div className="rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl" style={{ backgroundColor: "#FDFAF5", border: "1px solid #E8E0D8" }}>
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
              Edit Flat Listing
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Update pricing, availability, photos, or status of your property.
            </p>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-xl text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center gap-2">
              <CheckCircle size={18} /> Listing updated successfully!
            </div>
          )}

          {globalError && (
            <div className="p-4 rounded-xl text-sm font-semibold text-red-700 bg-red-50 border border-red-200">
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Status Selection Bar */}
            <div className="p-5 rounded-2xl space-y-2 border" style={{ backgroundColor: "#F8F4EF", borderColor: "#E8E0D8" }}>
              <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "#18100E" }}>
                Listing Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "available", label: "Available" },
                  { value: "unavailable", label: "Unavailable" },
                  { value: "rented", label: "Rented Out" },
                ].map((st) => (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, status: st.value }))}
                    className="py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={
                      form.status === st.value
                        ? { backgroundColor: "#7B3045", color: "#FDFAF5" }
                        : { backgroundColor: "#FDFAF5", color: "#18100E", border: "1px solid #E8E0D8" }
                    }
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-base font-bold uppercase tracking-wider pb-2 border-b" style={{ color: "#7B3045", borderColor: "#E8E0D8" }}>
                Basic Information
              </h2>

              <FormField label="Listing Title" required error={errors.title}>
                <input type="text" name="title" value={form.title} onChange={handleChange} style={inputStyle} />
              </FormField>

              <FormField label="Description">
                <textarea name="description" rows={4} value={form.description} onChange={handleChange} style={inputStyle} />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Property Type">
                  <select name="propertyType" value={form.propertyType} onChange={handleChange} style={inputStyle}>
                    {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </FormField>

                <FormField label="Locality / Area" required error={errors.locationArea}>
                  <input type="text" name="locationArea" value={form.locationArea} onChange={handleChange} style={inputStyle} />
                </FormField>
              </div>

              <FormField label="Full Address">
                <input type="text" name="locationAddress" value={form.locationAddress} onChange={handleChange} style={inputStyle} />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Monthly Rent (₹)" required error={errors.rent}>
                  <input type="number" name="rent" value={form.rent} onChange={handleChange} style={inputStyle} />
                </FormField>

                <FormField label="Security Deposit (₹)">
                  <input type="number" name="securityDeposit" value={form.securityDeposit} onChange={handleChange} style={inputStyle} />
                </FormField>

                <FormField label="Available From">
                  <input type="date" name="availableFrom" value={form.availableFrom} onChange={handleChange} style={inputStyle} />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Nearest College">
                  <input type="text" name="locationCampus" value={form.locationCampus} onChange={handleChange} style={inputStyle} />
                </FormField>

                <FormField label="Distance from College (km)">
                  <input type="number" step="0.1" name="distanceFromCollege" value={form.distanceFromCollege} onChange={handleChange} style={inputStyle} />
                </FormField>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h2 className="text-base font-bold uppercase tracking-wider pb-2 border-b" style={{ color: "#7B3045", borderColor: "#E8E0D8" }}>
                Specifications &amp; Furnishing
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
            </div>

            {/* Facilities & Amenities */}
            <div className="space-y-4">
              <h2 className="text-base font-bold uppercase tracking-wider pb-2 border-b" style={{ color: "#7B3045", borderColor: "#E8E0D8" }}>
                Facilities &amp; Amenities
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
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                        style={
                          active
                            ? { backgroundColor: "#7B3045", color: "#FDFAF5" }
                            : { backgroundColor: "#F3EEE7", color: "#18100E", border: "1px solid #E8E0D8" }
                        }
                      >
                        {fac}
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
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                        style={
                          active
                            ? { backgroundColor: "#18100E", color: "#F3EEE7" }
                            : { backgroundColor: "#F3EEE7", color: "#18100E", border: "1px solid #E8E0D8" }
                        }
                      >
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-4">
              <h2 className="text-base font-bold uppercase tracking-wider pb-2 border-b" style={{ color: "#7B3045", borderColor: "#E8E0D8" }}>
                Property Photos
              </h2>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50"
                style={{ borderColor: "#C4B8AE", backgroundColor: "#F8F4EF" }}
              >
                <Upload size={28} className="mb-2" style={{ color: "#7B3045" }} />
                <p className="text-sm font-bold" style={{ color: "#18100E" }}>Add or update photos</p>
                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden h-28 border" style={{ borderColor: "#E8E0D8" }}>
                      <img src={img.previewUrl} alt={`Property ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Cover
                        </span>
                      )}
                      <div className="absolute top-1 right-1 flex gap-1">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => makeCover(idx)}
                            className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded"
                          >
                            Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="bg-red-600 text-white p-1 rounded-full"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t" style={{ borderColor: "#E8E0D8" }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-base font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: "#7B3045", color: "#F3EEE7" }}
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                {loading ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
