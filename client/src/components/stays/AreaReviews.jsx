import { useEffect, useState } from "react";
import { Star, X, PenLine, Loader2, CheckCircle } from "lucide-react";
import AreaReviewCard from "./AreaReviewCard";
import { fetchAreas, fetchAreaReviews, createAreaReview } from "../../services/staysApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ── Star Rating Input ─────────────────────────────────────────────────────────

function StarInput({ value, onChange, label }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-20 flex-shrink-0">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              size={20}
              className={`transition-colors ${
                star <= (hovered || value)
                  ? "text-amber-400 fill-amber-400"
                  : "text-gray-200 fill-gray-200"
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-xs font-semibold text-gray-500 w-4">{value || "–"}</span>
    </div>
  );
}

// ── Write Review Modal ────────────────────────────────────────────────────────

function WriteReviewModal({ areas, onClose, onSuccess }) {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState(areas[0]?.id || "");
  const [ratings, setRatings] = useState({
    safetyRating: 0,
    transportRating: 0,
    foodRating: 0,
    waterRating: 0,
    internetRating: 0,
  });
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function setRating(key, val) {
    setRatings((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    const allRated = Object.values(ratings).every((v) => v >= 1);
    if (!allRated) { setError("Please rate all 5 categories."); return; }
    if (!selectedArea) { setError("Please select an area."); return; }

    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      await createAreaReview(selectedArea, { ...ratings, comment }, token);
      setDone(true);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (err) {
      setError(err.message || "Failed to submit review. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center">
              <PenLine size={16} className="text-cyan-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Write a Review</h3>
              <p className="text-xs text-gray-400">Rate your area experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition"
          >
            <X size={16} />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <CheckCircle size={28} className="text-emerald-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Review Submitted!</h3>
            <p className="text-sm text-gray-400">Thank you for helping fellow students.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* Area selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Area</label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition appearance-none"
              >
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}, {a.city}</option>
                ))}
              </select>
            </div>

            {/* Star ratings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Rate Each Category</label>
              <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                <StarInput label="🔒 Safety" value={ratings.safetyRating} onChange={(v) => setRating("safetyRating", v)} />
                <StarInput label="🚌 Transport" value={ratings.transportRating} onChange={(v) => setRating("transportRating", v)} />
                <StarInput label="🍔 Food" value={ratings.foodRating} onChange={(v) => setRating("foodRating", v)} />
                <StarInput label="💧 Water" value={ratings.waterRating} onChange={(v) => setRating("waterRating", v)} />
                <StarInput label="📶 Internet" value={ratings.internetRating} onChange={(v) => setRating("internetRating", v)} />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Comment <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share your experience living in this area..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-xl transition disabled:opacity-60"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main AreaReviews Component ────────────────────────────────────────────────

export default function AreaReviews() {
  const { user } = useAuth();
  const [areas, setAreas] = useState([]);
  const [allAreas, setAllAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  async function load() {
    try {
      const res = await fetchAreas();
      const areasData = res.data || [];
      setAllAreas(areasData);

      // Fetch latest review comment for each area
      const enriched = await Promise.all(
        areasData.map(async (area) => {
          if (!area.review_count) return area;
          try {
            const rev = await fetchAreaReviews(area.id, 1);
            const latest = rev.data?.[0];
            return {
              ...area,
              latest_comment: latest?.comment || null,
              latest_reviewer: latest?.profiles?.full_name
                ? latest.profiles.full_name.split(" ")[0] + " " + (latest.profiles.full_name.split(" ")[1]?.[0] || "") + "."
                : latest?.profiles?.username || null,
            };
          } catch {
            return area;
          }
        })
      );

      // Only show areas with reviews
      setAreas(enriched.filter((a) => a.review_count > 0));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">🗺️ Area Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded-full" />
                  <div className="h-3 w-32 bg-gray-200 rounded-full" />
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-xl" />
              </div>
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-16 bg-gray-200 rounded-full" />
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">🗺️ Area Reviews</h2>
          <p className="text-xs text-gray-400 mt-0.5">Based on student reviews</p>
        </div>
        <button
          onClick={() => setReviewModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-xl transition shadow-sm hover:shadow-md"
        >
          <PenLine size={14} />
          Write a Review
        </button>
      </div>

      {areas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {areas.map((area) => (
            <AreaReviewCard key={area.id} area={area} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center bg-white rounded-2xl border border-gray-100">
          <span className="text-3xl mb-2">🗺️</span>
          <p className="text-sm font-semibold text-gray-700 mb-1">No area reviews yet</p>
          <p className="text-xs text-gray-400">Be the first to review your area and help fellow students.</p>
        </div>
      )}

      {reviewModalOpen && (
        <WriteReviewModal
          areas={allAreas}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={() => { setReviewModalOpen(false); setLoading(true); load(); }}
        />
      )}
    </div>
  );
}
