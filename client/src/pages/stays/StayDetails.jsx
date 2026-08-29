import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Heart, Share2, Flag, MapPin, Bed, Bath,
  Maximize2, Star, Calendar, CheckCircle, Building2,
  Layers, Sofa, Shield, Wifi,
} from "lucide-react";
import NavBar from "../../components/common/NavBar";
import StayGallery from "../../components/stays/StayGallery";
import OwnerCard from "../../components/stays/OwnerCard";
import InquiryModal from "../../components/stays/InquiryModal";
import { fetchStayById, recordStayView } from "../../services/staysApi";
import { useSavedStays } from "../../hooks/useSavedStays";
import { useAuth } from "../../context/AuthContext";
import {
  formatRent, formatDate, getFurnishingLabel, getAmenityIcon, getFirstImage,
} from "../../utils/stayHelpers";

function InfoChip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
      <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-cyan-600" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function StayDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, getToken } = useAuth();
  const { isSaved, toggle: toggleSave } = useSavedStays();
  const [stay, setStay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetchStayById(id);
        setStay(res.data);

        // Record view
        const token = user ? await getToken() : null;
        recordStayView(id, token).catch(() => {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, user, getToken]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: stay.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-pulse">
          <div className="h-96 bg-gray-200 rounded-2xl mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded-full w-3/4" />
              <div className="h-4 bg-gray-200 rounded-full w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stay) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex flex-col items-center justify-center h-64 text-center px-4">
          <Building2 size={40} className="text-gray-300 mb-4" />
          <h2 className="font-bold text-gray-700 mb-1">Flat not found</h2>
          <p className="text-gray-400 text-sm mb-4">{error || "This listing may have been removed."}</p>
          <button onClick={() => navigate("/stays")} className="px-4 py-2 bg-cyan-500 text-white rounded-xl text-sm font-semibold">
            Browse Flats
          </button>
        </div>
      </div>
    );
  }

  const isVerified = stay.is_verified && stay.verification_status === "verified";
  const owner = stay.profiles;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-medium px-6 py-3 rounded-full shadow-xl z-50 animate-bounce">
          {toast}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition"
        >
          <ArrowLeft size={16} /> Back to listings
        </button>

        {/* Gallery */}
        <div className="mb-6">
          <StayGallery images={stay.images} title={stay.title} />
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title row */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {isVerified && (
                      <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle size={11} /> Verified
                      </span>
                    )}
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                      {stay.property_type || "flat"}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">{stay.title}</h1>
                  <div className="flex items-center gap-1.5 mt-2 text-gray-500">
                    <MapPin size={15} />
                    <span className="text-sm">
                      {[stay.location_address, stay.location_area, stay.location_city]
                        .filter(Boolean).join(", ")}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
                    title="Share"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (!user) { navigate("/login"); return; }
                      toggleSave(id);
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                      isSaved(id)
                        ? "bg-red-50 text-red-500"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-500"
                    }`}
                    title={isSaved(id) ? "Unsave" : "Save"}
                  >
                    <Heart size={16} fill={isSaved(id) ? "currentColor" : "none"} />
                  </button>
                  <button
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
                    title="Report"
                  >
                    <Flag size={16} />
                  </button>
                </div>
              </div>

              {/* Rent + rating */}
              <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-gray-100">
                <div>
                  <span className="text-3xl font-bold text-gray-900">{formatRent(stay.rent)}</span>
                  <span className="text-gray-400 text-sm">/month</span>
                  {stay.security_deposit > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Security: {formatRent(stay.security_deposit)}
                    </p>
                  )}
                </div>
                {stay.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(stay.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-700">{stay.rating}</span>
                    <span className="text-sm text-gray-400">({stay.review_count} reviews)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Property specs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <InfoChip icon={Bed} label="BHK" value={stay.bhk} />
                <InfoChip icon={Bath} label="Bathrooms" value={`${stay.bathrooms} Bath`} />
                {stay.area_sqft && <InfoChip icon={Maximize2} label="Area" value={`${stay.area_sqft} sqft`} />}
                {stay.floor != null && <InfoChip icon={Layers} label="Floor" value={`${stay.floor} / ${stay.total_floors || "?"}`} />}
                <InfoChip icon={Sofa} label="Furnishing" value={getFurnishingLabel(stay.furnishing)} />
                <InfoChip icon={Calendar} label="Available From" value={formatDate(stay.available_from)} />
                {stay.location_campus && <InfoChip icon={Building2} label="Nearby Campus" value={stay.location_campus} />}
                {stay.location_landmark && <InfoChip icon={MapPin} label="Landmark" value={stay.location_landmark} />}
              </div>
            </div>

            {/* Description */}
            {stay.description && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {stay.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {stay.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {stay.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                      <span className="text-lg">{getAmenityIcon(amenity)}</span>
                      <span className="text-sm text-gray-700 font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Owner card */}
            <OwnerCard owner={owner} onContact={() => setInquiryOpen(true)} />

            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <button
                onClick={() => {
                  if (!user) { navigate("/login"); return; }
                  toggleSave(id);
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition border ${
                  isSaved(id)
                    ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Heart size={16} fill={isSaved(id) ? "currentColor" : "none"} />
                {isSaved(id) ? "Saved" : "Save Flat"}
              </button>
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-xl font-semibold text-sm transition"
              >
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* Location info */}
            {stay.location_pincode && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h4 className="font-bold text-gray-900 text-sm mb-3">Location</h4>
                <div className="space-y-1.5 text-sm text-gray-600">
                  {stay.location_area && <p>📍 {stay.location_area}</p>}
                  {stay.location_address && <p>🏠 {stay.location_address}</p>}
                  {stay.location_city && <p>🌆 {stay.location_city}</p>}
                  {stay.location_pincode && <p>📮 {stay.location_pincode}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Inquiry modal */}
      {inquiryOpen && (
        <InquiryModal
          stay={stay}
          onClose={() => setInquiryOpen(false)}
          onSuccess={() => showToast("Inquiry sent! The owner will contact you soon.")}
        />
      )}
    </div>
  );
}
