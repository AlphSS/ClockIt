import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Sparkles } from "lucide-react";
import NavBar from "../../components/common/NavBar";
import StayCard from "../../components/stays/StayCard";
import { fetchSavedStays } from "../../services/staysApi";
import { useSavedStays } from "../../hooks/useSavedStays";
import { useAuth } from "../../context/AuthContext";

export default function SavedStays() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isSaved, toggle: toggleSave, loading: saveLoading, initSaved } = useSavedStays();

  if (!user) {
    navigate("/login");
    return null;
  }

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await fetchSavedStays(token);
        setStays(res.data || []);
        initSaved((res.data || []).map((s) => s.id));
      } catch (err) {
        console.error("Fetch saved stays error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken, initSaved]);

  async function handleToggleSave(stayId) {
    await toggleSave(stayId);
    setStays((prev) => prev.filter((s) => s.id !== stayId));
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3EEE7" }}>
      <NavBar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Title Card */}
        <div className="p-6 rounded-3xl border shadow-sm flex items-center justify-between" style={{ backgroundColor: "#FDFAF5", borderColor: "#E8E0D8" }}>
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#7B3045" }}>
              <Heart size={14} fill="currentColor" /> Wishlist
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
              Saved Flats
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {stays.length} properties saved to your personal wishlist
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border overflow-hidden animate-pulse" style={{ backgroundColor: "#FDFAF5", borderColor: "#E8E0D8" }}>
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-200 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : stays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border" style={{ backgroundColor: "#FDFAF5", borderColor: "#E8E0D8" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}>
              <Heart size={28} />
            </div>
            <h3 className="font-bold text-xl mb-1" style={{ fontFamily: "Georgia, serif", color: "#18100E" }}>
              Your wishlist is empty
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mb-6">
              Browse student stays and click the heart icon on any listing to save it for quick reference later.
            </p>
            <button
              onClick={() => navigate("/stays")}
              className="px-6 py-3 text-xs font-bold rounded-xl transition-all"
              style={{ backgroundColor: "#18100E", color: "#F3EEE7" }}
            >
              Explore Stays
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stays.map((stay) => (
              <StayCard
                key={stay.id}
                stay={stay}
                isSaved={true}
                onToggleSave={handleToggleSave}
                saveLoading={saveLoading}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
