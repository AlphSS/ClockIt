import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

export default function PostFlatCard() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "#18100E" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ backgroundColor: "rgba(243,238,231,0.1)" }}
      >
        <PlusCircle size={20} style={{ color: "#F3EEE7" }} />
      </div>
      <h3
        className="font-bold text-base mb-1"
        style={{ color: "#F3EEE7", fontFamily: "Georgia, serif" }}
      >
        Post Your Flat
      </h3>
      <p className="text-xs mb-4 leading-relaxed" style={{ color: "#9CA3AF" }}>
        List your flat and find verified students easily.
      </p>
      <Link
        to="/stays/post"
        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all"
        style={{ backgroundColor: "#7B3045", color: "#F3EEE7" }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6a2638"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7B3045"}
      >
        Post Flat →
      </Link>
    </div>
  );
}
