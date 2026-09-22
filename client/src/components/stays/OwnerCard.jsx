import { Phone, CheckCircle, User } from "lucide-react";

export default function OwnerCard({ owner, onContact }) {
  if (!owner) return null;

  const initials = owner.full_name
    ? owner.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "OW";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide text-gray-500">
        Owner / Landlord
      </h4>

      <div className="flex items-center gap-3 mb-4">
        {owner.avatar_url ? (
          <img
            src={owner.avatar_url}
            alt={owner.full_name}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold">
            {initials}
          </div>
        )}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-900">
              {owner.full_name || owner.username || "Property Owner"}
            </span>
            <CheckCircle size={14} className="text-emerald-500" />
          </div>
          <span className="text-xs text-gray-400">@{owner.username || "owner"}</span>
        </div>
      </div>

      <button
        onClick={onContact}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        <Phone size={16} />
        Contact Owner
      </button>

      <p className="text-xs text-center text-gray-400 mt-3">
        Usually responds within 2 hours
      </p>
    </div>
  );
}
