import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Heart, Share2, MapPin, Bed, Bath,
  Maximize2, Star, Calendar, CheckCircle, Building2,
  Layers, Sofa, Shield, GraduationCap, DollarSign,
  MessageSquare, Send, Trash2, Edit3, X, Sparkles
} from "lucide-react";
import NavBar from "../../components/common/NavBar";
import StayGallery from "../../components/stays/StayGallery";
import OwnerCard from "../../components/stays/OwnerCard";
import InquiryModal from "../../components/stays/InquiryModal";
import {
  fetchStayById, recordStayView, fetchStayReviews,
  createStayReview, deleteStayReview, saveStay, unsaveStay
} from "../../services/staysApi";
import { useSavedStays } from "../../hooks/useSavedStays";
import { useAuth } from "../../context/AuthContext";
import {
  formatRent, formatDate, getFurnishingLabel, getAmenityIcon
} from "../../utils/stayHelpers";

function InfoChip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl border" style={{ backgroundColor: "#FDFAF5", borderColor: "#E8E0D8" }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F3EEE7", color: "#7B3045" }}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="text-sm font-bold text-gray-900">{value}</p>
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

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

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

    async function loadReviews() {
      try {
        setReviewsLoading(true);
        const res = await fetchStayReviews(id);
        setReviews(res.data || []);
      } catch (err) {
        console.warn("Reviews load error:", err);
      } finally {
        setReviewsLoading(false);
      }
    }

    if (id) {
      load();
      loadReviews();
    }
  }, [id, user, getToken]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: stay?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Listing link copied to clipboard!");
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!newReviewText.trim()) {
      setReviewError("Please write a few words in your review.");
      return;
    }

    setSubmittingReview(true);
    setReviewError("");

    try {
      const token = await getToken();
      const res = await createStayReview(
        id,
        { rating: newRating, review: newReviewText },
        token
      );

      // Add to reviews list
      setReviews((prev) => [res.data, ...prev]);
      setNewReviewText("");
      showToast("Review submitted successfully!");

      // Refresh stay details for updated rating & review count
      const updated = await fetchStayById(id);
      setStay(updated.data);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setSubmittingReview(false);
    }
  }

  async function handleDeleteReview(reviewId) {
    if (!window.confirm("Delete your review?")) return;
    try {
      const token = await getToken();
      await deleteStayReview(id, reviewId, token);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      showToast("Review deleted.");

      const updated = await fetchStayById(id);
      setStay(updated.data);
    } catch (err) {
      showToast(err.message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F3EEE7" }}>
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-6">
          <div className="h-96 rounded-3xl bg-gray-200" />
          <div className="h-8 bg-gray-200 rounded-full w-2/3" />
          <div className="h-4 bg-gray-200 rounded-full w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !stay) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F3EEE7" }}>
        <NavBar />
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#E8E0D8", color: "#7B3045" }}>
            <Building2 size={32} />
          </div>
          <h2 className="font-bold text-2xl mb-2" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
            Flat listing not found
          </h2>
          <p className="text-gray-500 text-sm max-w-md mb-6">{error || "This listing may have been unlisted or removed."}</p>
          <button
            onClick={() => navigate("/stays")}
            className="px-6 py-3 font-bold rounded-xl text-sm transition-all"
            style={{ backgroundColor: "#18100E", color: "#F3EEE7" }}
          >
            Back to All Listings
          </button>
        </div>
      </div>
    );
  }

  const isVerified = stay.is_verified && stay.verification_status === "verified";
  const isOwner = user && user.id === stay.owner_id;
  const userHasReviewed = reviews.some((r) => r.reviewer_id === user?.id);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3EEE7" }}>
      <NavBar />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white text-sm font-semibold px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce" style={{ backgroundColor: "#18100E" }}>
          {toast}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold hover:underline transition-colors"
          style={{ color: "#7B3045" }}
        >
          <ArrowLeft size={16} /> Back to stays
        </button>

        {/* Gallery Component */}
        <div className="rounded-3xl overflow-hidden shadow-lg" style={{ border: "1px solid #E8E0D8" }}>
          <StayGallery images={stay.images} title={stay.title} />
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Left Details (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header / Title Card */}
            <div className="rounded-2xl p-6 sm:p-8 space-y-4" style={{ backgroundColor: "#FDFAF5", border: "1px solid #E8E0D8" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {isVerified && (
                      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: "#2D6A4F" }}>
                        <CheckCircle size={12} /> Verified Listing
                      </span>
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ backgroundColor: "#F3EEE7", color: "#7B3045", border: "1px solid #E8E0D8" }}>
                      {stay.property_type || "Flat"}
                    </span>
                    {stay.status && (
                      <span
                        className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: stay.status === "available" ? "#E6F4EA" : stay.status === "rented" ? "#FCE8E6" : "#FEF7E0",
                          color: stay.status === "available" ? "#137333" : stay.status === "rented" ? "#C5221F" : "#B06000",
                        }}
                      >
                        {stay.status}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold leading-tight" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
                    {stay.title}
                  </h1>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                    <span>{[stay.location_address, stay.location_area, stay.location_city].filter(Boolean).join(", ")}</span>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                    style={{ backgroundColor: "#F3EEE7", color: "#18100E", border: "1px solid #E8E0D8" }}
                    title="Share"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (!user) { navigate("/login"); return; }
                      toggleSave(id);
                    }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: isSaved(id) ? "#7B3045" : "#F3EEE7",
                      color: isSaved(id) ? "#FDFAF5" : "#7B3045",
                      border: "1px solid #E8E0D8",
                    }}
                    title={isSaved(id) ? "Unsave" : "Save"}
                  >
                    <Heart size={16} fill={isSaved(id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {/* Price & Rating Bar */}
              <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-3xl font-bold" style={{ color: "#18100E" }}>
                    {formatRent(stay.rent)}
                  </span>
                  <span className="text-sm text-gray-500 font-medium"> / month</span>
                  {stay.security_deposit > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Security Deposit: <span className="font-semibold">{formatRent(stay.security_deposit)}</span>
                    </p>
                  )}
                </div>

                {stay.rating > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={i < Math.floor(stay.rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-base" style={{ color: "#18100E" }}>{stay.rating}</span>
                    <span className="text-xs text-gray-500">({stay.review_count} reviews)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: "#F3EEE7", color: "#6B7280" }}>
                    <Sparkles size={13} /> No reviews yet
                  </div>
                )}
              </div>
            </div>

            {/* Property Overview Grid */}
            <div className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: "#FDFAF5", border: "1px solid #E8E0D8" }}>
              <h2 className="font-bold text-lg" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
                Property Highlights
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <InfoChip icon={Bed} label="BHK Config" value={stay.bhk} />
                <InfoChip icon={Bath} label="Bathrooms" value={`${stay.bathrooms} Bath`} />
                {stay.area_sqft && <InfoChip icon={Maximize2} label="Super Area" value={`${stay.area_sqft} sqft`} />}
                {stay.floor != null && <InfoChip icon={Layers} label="Floor" value={`${stay.floor} of ${stay.total_floors || "?"}`} />}
                <InfoChip icon={Sofa} label="Furnishing" value={getFurnishingLabel(stay.furnishing)} />
                <InfoChip icon={Calendar} label="Available From" value={formatDate(stay.available_from)} />
                {stay.distance_from_college > 0 && (
                  <InfoChip icon={GraduationCap} label="Campus Distance" value={`${stay.distance_from_college} km`} />
                )}
                {stay.location_campus && (
                  <InfoChip icon={Building2} label="Target College" value={stay.location_campus} />
                )}
              </div>
            </div>

            {/* Description */}
            {stay.description && (
              <div className="rounded-2xl p-6 space-y-3" style={{ backgroundColor: "#FDFAF5", border: "1px solid #E8E0D8" }}>
                <h2 className="font-bold text-lg" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
                  Description
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {stay.description}
                </p>
              </div>
            )}

            {/* Facilities / Amenities */}
            {((stay.facilities?.length > 0) || (stay.amenities?.length > 0)) && (
              <div className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: "#FDFAF5", border: "1px solid #E8E0D8" }}>
                <h2 className="font-bold text-lg" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
                  Amenities &amp; Nearby Facilities
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[...(stay.facilities || []), ...(stay.amenities || [])].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl" style={{ backgroundColor: "#F3EEE7", border: "1px solid #E8E0D8" }}>
                      <span className="text-base">{getAmenityIcon(item)}</span>
                      <span className="text-xs font-semibold text-gray-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="rounded-2xl p-6 sm:p-8 space-y-6" style={{ backgroundColor: "#FDFAF5", border: "1px solid #E8E0D8" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-xl" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
                    Student Reviews &amp; Ratings
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {reviews.length} feedback {reviews.length === 1 ? "entry" : "entries"}
                  </p>
                </div>
              </div>

              {/* Submit Review Form (For authenticated non-owners who haven't submitted yet) */}
              {user && !isOwner && !userHasReviewed && (
                <form onSubmit={handleSubmitReview} className="p-5 rounded-xl space-y-4" style={{ backgroundColor: "#F8F4EF", border: "1px solid #E8E0D8" }}>
                  <h3 className="font-bold text-sm" style={{ color: "#18100E" }}>Write a Review</h3>

                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            size={22}
                            className={star <= newRating ? "text-amber-500 fill-amber-500" : "text-gray-300"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review text */}
                  <div>
                    <textarea
                      rows={3}
                      placeholder="Share your feedback about the location, property condition, owner response..."
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      className="w-full p-3 text-sm rounded-xl border outline-none transition-all"
                      style={{ backgroundColor: "#FDFAF5", borderColor: "#E8E0D8", color: "#18100E" }}
                    />
                  </div>

                  {reviewError && <p className="text-xs font-semibold text-red-500">{reviewError}</p>}

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl text-white transition-all disabled:opacity-50"
                    style={{ backgroundColor: "#7B3045" }}
                  >
                    <Send size={13} /> {submittingReview ? "Submitting..." : "Post Review"}
                  </button>
                </form>
              )}

              {/* Review List */}
              {reviewsLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-xl" />
                  <div className="h-16 bg-gray-200 rounded-xl" />
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-sm italic text-gray-500 py-4">Be the first to review this stay.</p>
              ) : (
                <div className="space-y-4 divide-y divide-gray-200">
                  {reviews.map((r) => (
                    <div key={r.id} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: "#7B3045", color: "#F3EEE7" }}>
                            {r.profiles?.full_name?.charAt(0) || r.profiles?.username?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="text-xs font-bold" style={{ color: "#18100E" }}>
                              {r.profiles?.full_name || r.profiles?.username || "Verified Student"}
                            </p>
                            <p className="text-[10px] text-gray-400">{formatDate(r.created_at)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < r.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}
                              />
                            ))}
                          </div>

                          {user && user.id === r.reviewer_id && (
                            <button
                              onClick={() => handleDeleteReview(r.id)}
                              className="text-red-500 hover:text-red-700 transition"
                              title="Delete Review"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed pl-10">
                        {r.review}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Owner Info & Contact Card */}
            <OwnerCard
              owner={stay.profiles}
              isOwner={isOwner}
              onContact={() => {
                if (!user) {
                  navigate("/login");
                  return;
                }
                setInquiryOpen(true);
              }}
            />

            {/* Quick Actions Card */}
            <div className="rounded-2xl p-5 space-y-3" style={{ backgroundColor: "#FDFAF5", border: "1px solid #E8E0D8" }}>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">Actions</h3>

              <button
                onClick={() => {
                  if (!user) { navigate("/login"); return; }
                  toggleSave(id);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all border"
                style={{
                  backgroundColor: isSaved(id) ? "#FEF2F2" : "#F3EEE7",
                  borderColor: isSaved(id) ? "#FCA5A5" : "#E8E0D8",
                  color: isSaved(id) ? "#DC2626" : "#18100E",
                }}
              >
                <Heart size={15} fill={isSaved(id) ? "currentColor" : "none"} />
                {isSaved(id) ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>

              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all"
                style={{ backgroundColor: "#F3EEE7", color: "#18100E", border: "1px solid #E8E0D8" }}
              >
                <Share2 size={15} /> Share Listing
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Inquiry Modal */}
      {inquiryOpen && (
        <InquiryModal
          stay={stay}
          onClose={() => setInquiryOpen(false)}
          onSuccess={() => showToast("Inquiry sent successfully to the listing owner!")}
        />
      )}
    </div>
  );
}
