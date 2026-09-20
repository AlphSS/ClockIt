import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Eye, CheckCircle, Clock, XCircle, Home, Sparkles } from "lucide-react";
import NavBar from "../../components/common/NavBar";
import { fetchMyListings, deleteStay, updateStayStatus } from "../../services/staysApi";
import { useAuth } from "../../context/AuthContext";
import { formatRent, getFirstImage } from "../../utils/stayHelpers";

function StatusBadge({ status }) {
  const configs = {
    available: { label: "Available", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    unavailable: { label: "Unavailable", classes: "bg-amber-50 text-amber-700 border-amber-200" },
    rented: { label: "Rented Out", classes: "bg-red-50 text-red-700 border-red-200" },
  };
  const cfg = configs[status] || configs.available;
  return (
    <span className={`px-2.5 py-1 text-xs font-bold border rounded-full ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

export default function MyListings() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  if (!user) {
    navigate("/login");
    return null;
  }

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await fetchMyListings(token);
        setListings(res.data || []);
      } catch (err) {
        console.error("Error loading my listings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  async function handleStatusChange(id, newStatus) {
    setUpdatingId(id);
    try {
      const token = await getToken();
      await updateStayStatus(id, newStatus, token);
      setListings((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      alert(err.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const token = await getToken();
      await deleteStay(id, token);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete listing.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3EEE7" }}>
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl border shadow-sm" style={{ backgroundColor: "#FDFAF5", borderColor: "#E8E0D8" }}>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#7B3045" }}>
              <Home size={14} /> Owner Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
              My Flat Listings
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage availability, edit details, or remove active listings.
            </p>
          </div>

          <Link
            to="/stays/create"
            className="flex items-center gap-2 px-5 py-3 font-bold text-xs rounded-xl transition-all shadow-md"
            style={{ backgroundColor: "#7B3045", color: "#FDFAF5" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6a2638"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7B3045"}
          >
            <Plus size={16} /> Post New Flat
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl border animate-pulse flex gap-4" style={{ backgroundColor: "#FDFAF5", borderColor: "#E8E0D8" }}>
                <div className="w-32 h-24 rounded-xl bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded-full w-2/3" />
                  <div className="h-4 bg-gray-200 rounded-full w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border" style={{ backgroundColor: "#FDFAF5", borderColor: "#E8E0D8" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#F3EEE7", color: "#7B3045" }}>
              <Sparkles size={28} />
            </div>
            <h3 className="font-bold text-xl mb-1" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
              No properties listed yet
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mb-6">
              Post your flat or room listing to connect with university students looking for housing.
            </p>
            <Link
              to="/stays/create"
              className="px-6 py-3 text-xs font-bold rounded-xl transition-all"
              style={{ backgroundColor: "#18100E", color: "#F3EEE7" }}
            >
              Post Your Flat
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="p-5 rounded-2xl border flex flex-col sm:flex-row gap-5 transition-all hover:shadow-md"
                style={{ backgroundColor: "#FDFAF5", borderColor: "#E8E0D8" }}
              >
                {/* Cover Image */}
                <div className="w-full sm:w-36 h-32 rounded-xl overflow-hidden flex-shrink-0 relative" style={{ backgroundColor: "#E8E0D8" }}>
                  <img
                    src={getFirstImage(listing.images)}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"; }}
                  />
                  <div className="absolute top-2 left-2">
                    <StatusBadge status={listing.status || "available"} />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg leading-snug line-clamp-1" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
                        {listing.title}
                      </h3>
                      <span className="font-bold text-base" style={{ color: "#7B3045" }}>
                        {formatRent(listing.rent)}/mo
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      {listing.location_area} &bull; {listing.bhk} &bull; {listing.furnishing}
                    </p>
                  </div>

                  {/* Status Toggle & Action Controls */}
                  <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500 font-medium">Status:</span>
                      <select
                        value={listing.status || "available"}
                        disabled={updatingId === listing.id}
                        onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg border font-bold text-xs outline-none cursor-pointer"
                        style={{ backgroundColor: "#F3EEE7", borderColor: "#E8E0D8", color: "#18100E" }}
                      >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                        <option value="rented">Mark as Rented</option>
                      </select>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/stays/${listing.id}`}
                        className="flex items-center gap-1 font-bold transition hover:underline"
                        style={{ color: "#18100E" }}
                      >
                        <Eye size={14} /> View
                      </Link>

                      <Link
                        to={`/stays/${listing.id}/edit`}
                        className="flex items-center gap-1 font-bold transition hover:underline"
                        style={{ color: "#7B3045" }}
                      >
                        <Edit2 size={14} /> Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(listing.id)}
                        disabled={deletingId === listing.id}
                        className="flex items-center gap-1 font-bold text-red-600 hover:text-red-800 disabled:opacity-50 transition"
                      >
                        <Trash2 size={14} />
                        {deletingId === listing.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
