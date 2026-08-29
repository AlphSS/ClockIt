import { useEffect, useState } from "react";
import { MapPin, ChevronRight, Loader2 } from "lucide-react";
import { fetchAreas } from "../../services/staysApi";

const FALLBACK_AREAS = [
  "Kothrud", "Karve Nagar", "Hinjewadi", "Baner", "Wakad", "Aundh", "Pashan",
];

// Color palette for area chips
const COLORS = [
  "from-cyan-500 to-cyan-600",
  "from-violet-500 to-violet-600",
  "from-orange-500 to-orange-600",
  "from-emerald-500 to-emerald-600",
  "from-rose-500 to-rose-600",
  "from-amber-500 to-amber-600",
  "from-blue-500 to-blue-600",
];

export default function PopularAreas({ onAreaClick, activeArea }) {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAreas()
      .then((res) => setAreas(res.data || []))
      .catch(() => setAreas(FALLBACK_AREAS.map((name, i) => ({ id: i, name }))))
      .finally(() => setLoading(false));
  }, []);

  const displayAreas = areas.length > 0 ? areas : FALLBACK_AREAS.map((name, i) => ({ id: i, name }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Popular Areas</h3>
        <span className="text-xs text-gray-400">{displayAreas.length} areas</span>
      </div>

      {loading ? (
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-24 bg-gray-100 rounded-full animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {displayAreas.map((area, idx) => {
            const isActive = activeArea === area.name;
            const colorClass = COLORS[idx % COLORS.length];

            return (
              <button
                key={area.id || idx}
                onClick={() => onAreaClick(isActive ? "" : area.name)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-md active:scale-[0.97] ${
                  isActive
                    ? `bg-gradient-to-r ${colorClass} text-white shadow-md`
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                }`}
              >
                <MapPin size={13} />
                {area.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
