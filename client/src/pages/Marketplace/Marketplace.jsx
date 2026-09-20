import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Heart,
  Clock3,
  Plus,
  PackageOpen,
  ChevronDown,
} from "lucide-react";

import { getProducts } from "../../services/marketplaceApi";

/*
 * Design notes (shares its language with ProductDetails)
 * - Concept: a campus notice board. Listings are pinned prints
 *   with a yellow price tag chip; the header sits on a dotted board.
 * - Palette: ink #14213D, board #E9ECF3, tag #FFD23F,
 *   coral #FF5A4E, slate #5B6478, paper #FFFFFF
 * - Type: Bricolage Grotesque (display) + DM Sans (body)
 */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');

    .mk-root { font-family: 'DM Sans', system-ui, sans-serif; }
    .mk-display { font-family: 'Bricolage Grotesque', 'DM Sans', system-ui, sans-serif; }

    .mk-board {
      background-color: #DDE2EE;
      background-image: radial-gradient(#B7C0D6 1.2px, transparent 1.2px);
      background-size: 22px 22px;
    }

    .mk-cta { box-shadow: 4px 4px 0 #FFD23F; transition: transform .15s ease, box-shadow .15s ease; }
    .mk-cta:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #FFD23F; }
    .mk-cta:active { transform: translate(4px, 4px); box-shadow: 0 0 0 #FFD23F; }

    .mk-root button:focus-visible,
    .mk-root select:focus-visible,
    .mk-root input:focus-visible { outline: 3px solid #FF5A4E; outline-offset: 2px; }

    @media (prefers-reduced-motion: reduce) {
      .mk-cta, .mk-cta:hover, .mk-cta:active { transition: none; }
    }
  `}</style>
);

function Marketplace() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Electronics",
    "Books",
    "Furniture",
    "Clothing",
    "Bicycles",
    "Notes & Study Material",
    "Hostel Essentials",
    "Sports",
    "Musical Instruments",
    "Other",
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Marketplace error:", error);
      setError(error.message || "Unable to load marketplace.");
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products
    .filter((product) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        product.title?.toLowerCase().includes(searchText) ||
        product.description?.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      }

      if (sortBy === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }

      if (sortBy === "price-low") {
        return Number(a.price) - Number(b.price);
      }

      if (sortBy === "price-high") {
        return Number(b.price) - Number(a.price);
      }

      return 0;
    });

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-IN");
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="mk-root min-h-screen bg-[#E9ECF3] text-[#14213D] flex items-center justify-center">
        <Styles />
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-[#C9D0E0] border-t-[#14213D] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5B6478]">Loading Marketplace...</p>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="mk-root min-h-screen bg-[#E9ECF3] text-[#14213D] flex items-center justify-center px-6">
        <Styles />
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-[0_14px_30px_rgba(20,33,61,0.1)]">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#FFD23F] flex items-center justify-center">
            <PackageOpen className="text-[#14213D]" size={28} />
          </div>

          <h2 className="mk-display text-2xl font-extrabold tracking-tight mb-2">
            Unable to load Marketplace
          </h2>

          <p className="text-[#5B6478] text-sm mb-6">{error}</p>

          <button
            onClick={loadProducts}
            className="mk-cta px-6 py-2.5 rounded-lg bg-[#14213D] text-white text-sm font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mk-root min-h-screen bg-[#E9ECF3] text-[#14213D]">
      <Styles />

      {/* Marketplace Header on the pinboard */}
      <header className="mk-board">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-12 sm:pb-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="inline-block text-sm font-semibold bg-[#FFD23F] px-3 py-1 rounded-md -rotate-2 mb-4">
                ClockIt Marketplace
              </p>

              <h1 className="mk-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[0.98] max-w-2xl">
                Find what you need around campus.
              </h1>

              <p className="text-[#3E475A] mt-4 max-w-xl text-sm sm:text-base leading-7">
                Buy, sell and discover useful products from students around your
                campus.
              </p>
            </div>

            <button
              onClick={() => navigate("/marketplace/add")}
              className="mk-cta self-start sm:self-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#14213D] text-white font-semibold"
            >
              <Plus size={18} />
              Sell an Item
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-8 max-w-3xl">
            <Search
              size={19}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5B6478]"
            />

            <input
              type="text"
              placeholder="Search for books, electronics, furniture..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-14 pl-[3.25rem] pr-5 rounded-full bg-white text-[#14213D] placeholder:text-[#8A93A8] shadow-[0_10px_24px_rgba(20,33,61,0.12)] border-0"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => {
            const active = category === item;

            return (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "bg-[#14213D] text-white"
                    : "bg-white text-[#3E475A] ring-1 ring-[#C9D0E0] hover:ring-[#14213D] hover:text-[#14213D]"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Result controls */}
        <div className="flex flex-row items-center justify-between gap-3 mt-7 mb-6 pb-4 border-b-2 border-dashed border-[#B7C0D6]">
          <p className="text-sm text-[#5B6478]">
            <span className="mk-display text-[#14213D] text-xl font-extrabold mr-1">
              {filteredProducts.length}
            </span>
            {filteredProducts.length === 1 ? "item" : "items"} found
          </p>

          <div className="relative">
            <SlidersHorizontal
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14213D] pointer-events-none"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-10 pr-10 py-2.5 rounded-full bg-white text-sm font-medium text-[#14213D] ring-1 ring-[#C9D0E0] hover:ring-[#14213D] cursor-pointer transition"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5B6478] pointer-events-none"
            />
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="mk-board rounded-[28px] py-20 px-6 text-center">
            <div className="inline-block bg-white rounded-2xl px-8 py-8 shadow-[0_14px_30px_rgba(20,33,61,0.12)]">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FFD23F] flex items-center justify-center">
                <PackageOpen size={30} className="text-[#14213D]" />
              </div>

              <h2 className="mk-display text-2xl font-extrabold tracking-tight mb-2">
                No products found
              </h2>

              <p className="text-[#5B6478] text-sm max-w-xs mx-auto">
                Try a different search term or select another category.
              </p>
            </div>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-9 sm:gap-x-6">
            {filteredProducts.map((product) => {
              const firstImage = product.product_images?.[0]?.image_url;

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/marketplace/product/${product.id}`)}
                  className="group cursor-pointer"
                >
                  {/* Image with price tag chip */}
                  <div className="relative aspect-[4/5] bg-white rounded-[22px] overflow-hidden">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PackageOpen size={35} className="text-[#9AA3B8]" />
                      </div>
                    )}

                    {/* Wishlist visual */}
                    <button
                      type="button"
                      aria-label="Save item"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white text-[#14213D] flex items-center justify-center shadow-md hover:bg-[#FF5A4E] hover:text-white transition-colors"
                    >
                      <Heart size={17} />
                    </button>

                    {/* Price */}
                    <span className="mk-display absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-[#FFD23F] text-[#14213D] text-base sm:text-lg font-extrabold shadow-[0_4px_10px_rgba(20,33,61,0.2)]">
                      ₹{formatPrice(product.price)}
                    </span>
                  </div>

                  {/* Product details */}
                  <div className="pt-3 px-1">
                    <h2 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2 group-hover:underline decoration-2 underline-offset-4 decoration-[#FFD23F]">
                      {product.title}
                    </h2>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white text-[#3E475A] ring-1 ring-[#C9D0E0]">
                        {product.condition}
                      </span>

                      {product.is_negotiable && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#14213D] text-white">
                          Negotiable
                        </span>
                      )}
                    </div>

                    {/* Location */}
                    {product.location && (
                      <div className="flex items-center gap-1.5 mt-2.5 text-xs text-[#3E475A]">
                        <MapPin size={13} />
                        <span className="truncate">{product.location}</span>
                      </div>
                    )}

                    {/* College */}
                    {product.colleges?.name && (
                      <p className="text-xs text-[#5B6478] mt-1 truncate">
                        {product.colleges.name}
                      </p>
                    )}

                    {/* Seller */}
                    <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-dashed border-[#B7C0D6] text-[11px] sm:text-xs text-[#5B6478]">
                      <Clock3 size={12} />
                      <span className="truncate">
                        {product.profiles?.full_name
                          ? `Seller: ${product.profiles.full_name}`
                          : "Campus seller"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}

export default Marketplace;
