import { Link, useNavigate } from "react-router-dom";
import { Heart, MapPin, Bed, Bath, Maximize2, Star, CheckCircle, Calendar } from "lucide-react";
import { formatRent, formatDate, getFirstImage, getAmenityIcon, getFurnishingLabel } from "../../utils/stayHelpers";

export default function StayCard({ stay, isSaved, onToggleSave, saveLoading }) {
  const navigate = useNavigate();

  if (!stay) return null;

  const mainImage = getFirstImage(stay.images);
  const topAmenities = (stay.amenities || []).slice(0, 3);
  const isVerified = stay.is_verified && stay.verification_status === "verified";

  function handleCardClick(e) {
    if (e.target.closest(".heart-btn")) return;
    navigate(`/stays/${stay.id}`);
  }

  return (
    <div
      onClick={handleCardClick}
      className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        backgroundColor: "#FDFAF5",
        border: "1px solid #E8E0D8",
        boxShadow: "0 2px 8px rgba(24,16,14,0.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(24,16,14,0.12)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(24,16,14,0.05)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden" style={{ backgroundColor: "#E8E0D8" }}>
        <img
          src={mainImage}
          alt={stay.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

        {/* Verified badge */}
        {isVerified && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1 text-white text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "#2D6A4F" }}
          >
            <CheckCircle size={10} /> Verified
          </div>
        )}

        {/* Heart */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSave(stay.id); }}
          disabled={saveLoading === stay.id}
          className="heart-btn absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{
            backgroundColor: isSaved ? "#7B3045" : "rgba(253,250,245,0.9)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <Heart
            size={15}
            style={{ color: isSaved ? "#FDFAF5" : "#7B3045" }}
            className={saveLoading === stay.id ? "animate-pulse" : ""}
            fill={isSaved ? "currentColor" : "none"}
          />
        </button>

        {/* Rent badge */}
        <div className="absolute bottom-3 left-3">
          <span className="text-white font-bold text-lg drop-shadow-md">
            {formatRent(stay.rent)}
            <span className="text-sm font-normal opacity-80">/mo</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3
          className="font-bold text-base leading-snug mb-1 line-clamp-1 transition-colors"
          style={{ color: "#18100E", fontFamily: "Georgia, serif" }}
        >
          {stay.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 mb-3" style={{ color: "#9CA3AF" }}>
          <MapPin size={12} className="flex-shrink-0" />
          <span className="text-xs truncate">{stay.location_area}, {stay.location_city || "Pune"}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 text-xs mb-3" style={{ color: "#6B7280" }}>
          <div className="flex items-center gap-1">
            <Bed size={13} style={{ color: "#7B3045" }} />
            <span className="font-semibold">{stay.bhk}</span>
          </div>
          <span style={{ color: "#D1C7BB" }}>•</span>
          <div className="flex items-center gap-1">
            <Bath size={13} style={{ color: "#7B3045" }} />
            <span>{stay.bathrooms} Bath</span>
          </div>
          {stay.area_sqft && (
            <>
              <span style={{ color: "#D1C7BB" }}>•</span>
              <div className="flex items-center gap-1">
                <Maximize2 size={12} style={{ color: "#7B3045" }} />
                <span>{stay.area_sqft} sqft</span>
              </div>
            </>
          )}
        </div>

        {/* Amenities */}
        {topAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {topAmenities.map((a) => (
              <span
                key={a}
                className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full"
                style={{ backgroundColor: "#F3EEE7", color: "#6B7280", border: "1px solid #E8E0D8" }}
              >
                <span>{getAmenityIcon(a)}</span>
                {a}
              </span>
            ))}
            {(stay.amenities?.length || 0) > 3 && (
              <span
                className="px-2 py-0.5 text-xs rounded-full"
                style={{ backgroundColor: "#F3EEE7", color: "#9CA3AF", border: "1px solid #E8E0D8" }}
              >
                +{stay.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #F0E9E1" }}>
          <div className="flex items-center gap-3">
            {stay.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star size={12} style={{ color: "#D97706" }} fill="#D97706" />
                <span className="text-xs font-bold" style={{ color: "#18100E" }}>{stay.rating}</span>
                <span className="text-xs" style={{ color: "#9CA3AF" }}>({stay.review_count})</span>
              </div>
            )}
            {stay.available_from && (
              <div className="flex items-center gap-1" style={{ color: "#9CA3AF" }}>
                <Calendar size={11} />
                <span className="text-xs">{formatDate(stay.available_from)}</span>
              </div>
            )}
          </div>

          <Link
            to={`/stays/${stay.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all"
            style={{ backgroundColor: "#18100E", color: "#F3EEE7" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#7B3045"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#18100E"}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
