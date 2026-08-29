import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MessageSquare, Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import NavBar from "../../components/common/NavBar";
import { fetchMyInquiries } from "../../services/staysApi";
import { useAuth } from "../../context/AuthContext";
import { getFirstImage, formatRent } from "../../utils/stayHelpers";

const STATUS_CONFIGS = {
  pending: { icon: Clock, label: "Pending", classes: "bg-amber-50 text-amber-600 border-amber-200" },
  contacted: { icon: CheckCircle, label: "Contacted", classes: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  closed: { icon: XCircle, label: "Closed", classes: "bg-gray-100 text-gray-500 border-gray-200" },
};

function formatTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export default function MyInquiries() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user) {
    navigate("/login");
    return null;
  }

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await fetchMyInquiries(token);
        setInquiries(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Inquiries</h1>
          <p className="text-sm text-gray-400">{inquiries.length} inquiries sent</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded-full w-2/3" />
                    <div className="h-3 bg-gray-200 rounded-full w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mb-4">
              <MessageSquare size={28} className="text-cyan-300" />
            </div>
            <h3 className="font-bold text-gray-700 mb-1">No inquiries yet</h3>
            <p className="text-sm text-gray-400 mb-4">
              When you contact a flat owner, your inquiry will appear here.
            </p>
            <button
              onClick={() => navigate("/stays")}
              className="px-6 py-2.5 bg-cyan-500 text-white font-semibold rounded-xl text-sm hover:bg-cyan-600 transition"
            >
              Browse Flats
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => {
              const cfg = STATUS_CONFIGS[inq.status] || STATUS_CONFIGS.pending;
              const Icon = cfg.icon;
              return (
                <div key={inq.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
                  <div className="flex gap-4">
                    {/* Property thumbnail */}
                    {inq.stays && (
                      <Link to={`/stays/${inq.stay_id}`} className="w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={getFirstImage(inq.stays.images)}
                          alt={inq.stays.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"; }}
                        />
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {inq.stays && (
                            <Link to={`/stays/${inq.stay_id}`} className="font-bold text-gray-900 text-sm hover:text-cyan-600 transition block truncate">
                              {inq.stays.title}
                            </Link>
                          )}
                          <p className="text-xs text-gray-400">
                            {inq.stays?.location_area} · {formatRent(inq.stays?.rent)}/mo
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium border rounded-full ${cfg.classes}`}>
                            <Icon size={10} />{cfg.label}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-600 italic line-clamp-2">"{inq.message}"</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">{formatTimeAgo(inq.created_at)}</p>
                        <Link
                          to={`/stays/${inq.stay_id}`}
                          className="flex items-center gap-1 text-xs text-cyan-600 hover:underline"
                        >
                          View Flat <ExternalLink size={10} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
