import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MessageSquare, Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import NavBar from "../../components/common/NavBar";
import { fetchMyInquiries } from "../../services/staysApi";
import { useAuth } from "../../context/AuthContext";
import { getFirstImage, formatRent } from "../../utils/stayHelpers";

const STATUS_CONFIGS = {
  pending: { label: "Pending Owner Response", classes: "bg-amber-50 text-amber-800 border-amber-200" },
  contacted: { label: "Contacted / In Touch", classes: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  closed: { label: "Inquiry Closed", classes: "bg-gray-100 text-gray-600 border-gray-200" },
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
  }, [getToken]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3EEE7" }}>
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="p-6 rounded-3xl border shadow-sm" style={{ backgroundColor: "#FDFAF5", borderColor: "#E8E0D8" }}>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#7B3045" }}>
            <MessageSquare size={14} /> Student Inquiries
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
            My Sent Inquiries
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track inquiries you sent to property owners on ClockIt.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-5 rounded-2xl border animate-pulse flex gap-4" style={{ backgroundColor: "#FDFAF5", borderColor: "#E8E0D8" }}>
                <div className="w-20 h-16 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded-full w-2/3" />
                  <div className="h-3 bg-gray-200 rounded-full w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border" style={{ backgroundColor: "#FDFAF5", borderColor: "#E8E0D8" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#F3EEE7", color: "#7B3045" }}>
              <MessageSquare size={28} />
            </div>
            <h3 className="font-bold text-xl mb-1" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
              No inquiries sent yet
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mb-6">
              When you find a flat you like, click "Contact Owner" on the details page to send a direct message.
            </p>
            <button
              onClick={() => navigate("/stays")}
              className="px-6 py-3 text-xs font-bold rounded-xl transition-all"
              style={{ backgroundColor: "#18100E", color: "#F3EEE7" }}
            >
              Browse Flats
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => {
              const cfg = STATUS_CONFIGS[inq.status] || STATUS_CONFIGS.pending;
              return (
                <div key={inq.id} className="p-5 rounded-2xl border transition-all hover:shadow-md space-y-3" style={{ backgroundColor: "#FDFAF5", borderColor: "#E8E0D8" }}>
                  <div className="flex gap-4">
                    {inq.stays && (
                      <Link to={`/stays/${inq.stay_id}`} className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 relative" style={{ backgroundColor: "#E8E0D8" }}>
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
                            <Link to={`/stays/${inq.stay_id}`} className="font-bold text-base hover:underline line-clamp-1" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
                              {inq.stays.title}
                            </Link>
                          )}
                          <p className="text-xs text-gray-500">
                            {inq.stays?.location_area} &bull; {formatRent(inq.stays?.rent)}/mo
                          </p>
                        </div>
                        <span className={`px-2.5 py-1 text-[11px] font-bold border rounded-full ${cfg.classes}`}>
                          {cfg.label}
                        </span>
                      </div>

                      <div className="mt-3 p-3 rounded-xl border text-xs text-gray-700 italic" style={{ backgroundColor: "#F8F4EF", borderColor: "#E8E0D8" }}>
                        "{inq.message}"
                      </div>

                      <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                        <span>Sent {formatTimeAgo(inq.created_at)}</span>
                        <Link
                          to={`/stays/${inq.stay_id}`}
                          className="flex items-center gap-1 font-bold hover:underline"
                          style={{ color: "#7B3045" }}
                        >
                          View Flat <ExternalLink size={12} />
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
