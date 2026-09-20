import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { fetchAreas } from "../../services/staysApi";

const FALLBACK_AREAS = [
  "Kothrud", "Karve Nagar", "Hinjewadi", "Baner", "Wakad", "Aundh", "Pashan",
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
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "#FDFAF5", border: "1px solid #E8E0D8", boxShadow: "0 2px 12px rgba(24,16,14,0.04)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "#18100E" }}
        >
          Popular Areas
        </h3>
        <span className="text-xs" style={{ color: "#9CA3AF" }}>{displayAreas.length} areas</span>
      </div>

      {loading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 rounded-full animate-pulse"
              style={{ backgroundColor: "#E8E0D8" }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {displayAreas.map((area, idx) => {
            const isActive = activeArea === area.name;
            return (
              <button
                key={area.id || idx}
                onClick={() => onAreaClick(isActive ? "" : area.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={
                  isActive
                    ? { backgroundColor: "#18100E", color: "#F3EEE7", border: "1.5px solid #18100E" }
                    : { backgroundColor: "#F3EEE7", color: "#6B7280", border: "1.5px solid #E8E0D8" }
                }
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.borderColor = "#7B3045";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.borderColor = "#E8E0D8";
                }}
              >
                <MapPin size={11} />
                {area.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
