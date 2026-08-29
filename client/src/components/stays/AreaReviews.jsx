import { useEffect, useState } from "react";
import AreaReviewCard from "./AreaReviewCard";
import { fetchAreas, fetchAreaReviews } from "../../services/staysApi";

export default function AreaReviews() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchAreas();
        const areasData = res.data || [];

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
    load();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">🗺️ Area Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
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

  if (!areas.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">🗺️ Area Reviews</h2>
        <span className="text-xs text-gray-400">Based on student reviews</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {areas.map((area) => (
          <AreaReviewCard key={area.id} area={area} />
        ))}
      </div>
    </div>
  );
}
