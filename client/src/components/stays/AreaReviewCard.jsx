import { Star } from "lucide-react";

function RatingBar({ label, value }) {
  const pct = ((value || 0) / 5) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-6">{value ? value.toFixed(1) : "—"}</span>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            size={12}
            className={filled || half ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
          />
        );
      })}
    </div>
  );
}

export default function AreaReviewCard({ area }) {
  if (!area) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-bold text-gray-900 text-base">{area.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={area.overall_rating || 0} />
            <span className="text-sm font-bold text-amber-500">{(area.overall_rating || 0).toFixed(1)}</span>
            <span className="text-xs text-gray-400">({area.review_count || 0} reviews)</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center text-lg">
          📍
        </div>
      </div>

      {/* Category bars */}
      <div className="space-y-2 mb-4">
        <RatingBar label="Safety" value={area.avg_safety} />
        <RatingBar label="Transport" value={area.avg_transport} />
        <RatingBar label="Food" value={area.avg_food} />
        <RatingBar label="Water" value={area.avg_water} />
        <RatingBar label="Internet" value={area.avg_internet} />
      </div>

      {/* Latest review comment */}
      {area.latest_comment && (
        <div className="bg-gray-50 rounded-xl p-3 mt-3">
          <p className="text-xs text-gray-600 italic leading-relaxed">
            "{area.latest_comment}"
          </p>
          {area.latest_reviewer && (
            <p className="text-xs text-gray-400 mt-1.5">— {area.latest_reviewer}</p>
          )}
        </div>
      )}
    </div>
  );
}
