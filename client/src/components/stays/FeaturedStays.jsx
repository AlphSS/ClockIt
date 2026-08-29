import { useEffect, useState } from "react";
import { fetchFeaturedStays } from "../../services/staysApi";
import StayCard from "./StayCard";

export default function FeaturedStays({ isSaved, onToggleSave, saveLoading }) {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedStays()
      .then((res) => setStays(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">✨ Featured Flats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                <div className="h-3 bg-gray-200 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stays.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">✨ Featured Flats</h2>
        <span className="text-xs text-gray-400 bg-amber-50 text-amber-600 px-2 py-1 rounded-full font-medium border border-amber-200">
          Verified & Popular
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stays.map((stay) => (
          <StayCard
            key={stay.id}
            stay={stay}
            isSaved={isSaved?.(stay.id)}
            onToggleSave={onToggleSave}
            saveLoading={saveLoading}
          />
        ))}
      </div>
    </div>
  );
}
