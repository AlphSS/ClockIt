import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Eye, CheckCircle, Clock, XCircle, ArrowLeft } from "lucide-react";
import NavBar from "../../components/common/NavBar";
import { fetchMyListings, deleteStay } from "../../services/staysApi";
import { useAuth } from "../../context/AuthContext";
import { formatRent, getFirstImage } from "../../utils/stayHelpers";

function StatusBadge({ status }) {
  const configs = {
    verified: { icon: CheckCircle, label: "Verified", classes: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    pending: { icon: Clock, label: "Pending", classes: "bg-amber-50 text-amber-600 border-amber-200" },
    rejected: { icon: XCircle, label: "Rejected", classes: "bg-red-50 text-red-500 border-red-200" },
  };
  const cfg = configs[status] || configs.pending;
  const Icon = cfg.icon;
  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium border rounded-full ${cfg.classes}`}>
      <Icon size={10} />{cfg.label}
    </span>
  );
}

export default function MyListings() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  if (!user) {
    navigate("/login");
    return null;
  }

  async function load() {
    try {
      const token = await getToken();
      const res = await fetchMyListings(token);
      setListings(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this listing? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const token = await getToken();
      await deleteStay(id, token);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
            <p className="text-sm text-gray-400">{listings.length} properties listed</p>
          </div>
          <Link
            to="/stays/post"
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition shadow-sm"
          >
            <Plus size={16} /> Add New
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 animate-pulse">
                <div className="w-28 h-20 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded-full w-2/3" />
                  <div className="h-3 bg-gray-200 rounded-full w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
              <Plus size={28} className="text-orange-400" />
            </div>
            <h3 className="font-bold text-gray-700 mb-1">No listings yet</h3>
            <p className="text-sm text-gray-400 mb-4">Post your first flat and reach thousands of students.</p>
            <Link
              to="/stays/post"
              className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition"
            >
              Post Your Flat
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 hover:shadow-md transition">
                <div className="w-28 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={getFirstImage(listing.images)}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900 truncate">{listing.title}</h3>
                      <p className="text-sm text-gray-400">{listing.location_area} · {listing.bhk}</p>
                      <p className="text-sm font-semibold text-cyan-600 mt-1">{formatRent(listing.rent)}/mo</p>
                    </div>
                    <StatusBadge status={listing.verification_status} />
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Eye size={12} /> {listing.views || 0} views
                    </div>
                    <Link
                      to={`/stays/${listing.id}`}
                      className="flex items-center gap-1 text-xs text-cyan-600 hover:underline"
                    >
                      <Eye size={12} /> View
                    </Link>
                    <Link
                      to={`/stays/${listing.id}/edit`}
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
                    >
                      <Edit2 size={12} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      disabled={deletingId === listing.id}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash2 size={12} />
                      {deletingId === listing.id ? "Deleting..." : "Delete"}
                    </button>
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
