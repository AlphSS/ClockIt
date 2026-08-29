import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

export default function PostFlatCard() {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-md">
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
        <PlusCircle size={22} className="text-white" />
      </div>
      <h3 className="font-bold text-lg mb-1">Post Your Flat</h3>
      <p className="text-orange-100 text-sm mb-4 leading-relaxed">
        List your flat and find verified students easily.
      </p>
      <Link
        to="/stays/post"
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-orange-600 font-semibold text-sm rounded-xl hover:bg-orange-50 transition shadow-sm hover:shadow-md"
      >
        Post Flat →
      </Link>
    </div>
  );
}
