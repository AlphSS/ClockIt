import { Link, useNavigate } from "react-router-dom";
import { Heart, MapPin, Bed, Bath, Maximize2, Star, Phone, CheckCircle, Calendar } from "lucide-react";
import { formatRent, formatDate, getFirstImage, getAmenityIcon, getFurnishingLabel } from "../../utils/stayHelpers";

export default function StayCard({ stay, isSaved, onToggleSave, saveLoading }) {
  const navigate = useNavigate();

  if (!stay) return null;

  const mainImage = getFirstImage(stay.images);
  const topAmenities = (stay.amenities || []).slice(0, 3);
  const isVerified = stay.is_verified && stay.verification_status === "verified";

  function handleCardClick(e) {
    // Don't navigate if clicking heart
    if (e.target.closest(".heart-btn")) return;
    navigate(`/stays/${stay.id}`);
  }

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={stay.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800";
          }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Verified badge */}
        {isVerified && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            <CheckCircle size={11} />
            Verified
          </div>
        )}

        {/* Heart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(stay.id);
          }}
          disabled={saveLoading === stay.id}
          className={`heart-btn absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isSaved
              ? "bg-red-500 text-white shadow-md"
              : "bg-white/90 text-gray-400 hover:text-red-400 hover:bg-white shadow-sm"
          }`}
        >
          <Heart
            size={16}
            className={`transition-transform ${saveLoading === stay.id ? "animate-pulse" : ""}`}
            fill={isSaved ? "currentColor" : "none"}
          />
        </button>

        {/* Rent badge */}
        <div className="absolute bottom-3 left-3">
          <span className="text-white font-bold text-lg drop-shadow-md">
            {formatRent(stay.rent)}
            <span className="text-sm font-normal">/mo</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 line-clamp-1 group-hover:text-cyan-600 transition">
          {stay.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin size={13} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{stay.location_area}, {stay.location_city || "Pune"}</span>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Bed size={14} className="text-cyan-500" />
            <span className="font-medium">{stay.bhk}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1">
            <Bath size={14} className="text-cyan-500" />
            <span>{stay.bathrooms} Bath</span>
          </div>
          {stay.area_sqft && (
            <>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <Maximize2 size={13} className="text-cyan-500" />
                <span>{stay.area_sqft} sqft</span>
              </div>
            </>
          )}
        </div>

        {/* Amenities */}
        {topAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {topAmenities.map((a) => (
              <span key={a} className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-100">
                <span>{getAmenityIcon(a)}</span>
                {a}
              </span>
            ))}
            {(stay.amenities?.length || 0) > 3 && (
              <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-100">
                +{stay.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-3">
            {/* Rating */}
            {stay.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold text-gray-700">{stay.rating}</span>
                <span className="text-xs text-gray-400">({stay.review_count})</span>
              </div>
            )}
            {/* Availability */}
            {stay.available_from && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={11} />
                <span>{formatDate(stay.available_from)}</span>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <Link
            to={`/stays/${stay.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition shadow-sm hover:shadow-md"
          >
            <Phone size={12} />
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
