import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function StayGallery({ images = [], title }) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeImages = images.length > 0
    ? images
    : ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"];

  function prev() {
    setCurrent((c) => (c - 1 + safeImages.length) % safeImages.length);
  }
  function next() {
    setCurrent((c) => (c + 1) % safeImages.length);
  }

  return (
    <>
      {/* Main gallery */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-72 md:h-96 rounded-2xl overflow-hidden">
        {/* Main image */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={safeImages[0]}
            alt={title}
            className="w-full h-full object-cover hover:brightness-95 transition"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800";
            }}
          />
        </div>

        {/* Thumbnails */}
        {safeImages.slice(1, 5).map((img, i) => (
          <div
            key={i}
            className="relative cursor-pointer overflow-hidden"
            onClick={() => { setCurrent(i + 1); setLightboxOpen(true); }}
          >
            <img
              src={img}
              alt={`${title} ${i + 2}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800";
              }}
            />
            {/* Show +N overlay on last thumbnail if more images exist */}
            {i === 3 && safeImages.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">+{safeImages.length - 5}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
          >
            <X size={20} />
          </button>

          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
          >
            <ChevronLeft size={20} />
          </button>

          <img
            src={safeImages[current]}
            alt={`${title} ${current + 1}`}
            className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl"
          />

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-4 text-white/70 text-sm">
            {current + 1} / {safeImages.length}
          </div>
        </div>
      )}
    </>
  );
}
