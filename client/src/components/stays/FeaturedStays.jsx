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
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-bold"
            style={{ color: "#18100E", fontFamily: "Georgia, serif", fontSize: "1.25rem" }}
          >
            Featured Flats
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden animate-pulse"
              style={{ backgroundColor: "#FDFAF5", border: "1px solid #E8E0D8" }}
            >
              <div className="h-48" style={{ backgroundColor: "#E8E0D8" }} />
              <div className="p-4 space-y-3">
                <div className="h-4 rounded-full w-3/4" style={{ backgroundColor: "#E8E0D8" }} />
                <div className="h-3 rounded-full w-1/2" style={{ backgroundColor: "#E8E0D8" }} />
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
        <h2
          className="font-bold"
          style={{ color: "#18100E", fontFamily: "Georgia, serif", fontSize: "1.25rem" }}
        >
          Featured Flats
        </h2>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: "#F3EEE7", color: "#7B3045", border: "1px solid #E8E0D8" }}
        >
          Verified &amp; Popular
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
