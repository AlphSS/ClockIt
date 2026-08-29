import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Bed } from "lucide-react";
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleToggleSave(stayId) {
    await toggleSave(stayId);
    // Remove from list if unsaved
    if (isSaved(stayId)) {
      setStays((prev) => prev.filter((s) => s.id !== stayId));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Saved Flats</h1>
          <p className="text-sm text-gray-400">{stays.length} saved properties</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-200 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : stays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Heart size={28} className="text-red-300" />
            </div>
            <h3 className="font-bold text-gray-700 mb-1">No saved flats</h3>
            <p className="text-sm text-gray-400 mb-4">
              Browse flats and tap the heart icon to save them here.
            </p>
            <button
              onClick={() => navigate("/stays")}
              className="px-6 py-2.5 bg-cyan-500 text-white font-semibold rounded-xl text-sm hover:bg-cyan-600 transition"
            >
              Browse Flats
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stays.map((stay) => (
              <StayCard
                key={stay.id}
                stay={stay}
                isSaved={isSaved(stay.id)}
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
