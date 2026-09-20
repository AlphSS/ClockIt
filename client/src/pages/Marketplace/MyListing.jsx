import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Pencil, Trash2, CheckCircle, MapPin } from "lucide-react";

import {
  getMyProducts,
  markProductAsSold,
  deleteProduct,
} from "../../services/marketplaceApi";

/*
 * Design notes (shares its language with Marketplace and ProductDetails)
 * - Concept: your own corner of the campus notice board. Each listing
 *   is a pinned print with a yellow price chip and a status tag.
 * - Palette: ink #14213D, board #E9ECF3, tag #FFD23F,
 *   coral #FF5A4E, slate #5B6478, paper #FFFFFF
 * - Type: Bricolage Grotesque (display) + DM Sans (body)
 */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');

    .ml-root { font-family: 'DM Sans', system-ui, sans-serif; }
    .ml-display { font-family: 'Bricolage Grotesque', 'DM Sans', system-ui, sans-serif; }

    .ml-board {
      background-color: #DDE2EE;
      background-image: radial-gradient(#B7C0D6 1.2px, transparent 1.2px);
      background-size: 22px 22px;
    }

    .ml-cta { box-shadow: 4px 4px 0 #FFD23F; transition: transform .15s ease, box-shadow .15s ease; }
    .ml-cta:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #FFD23F; }
    .ml-cta:active { transform: translate(4px, 4px); box-shadow: 0 0 0 #FFD23F; }

    .ml-root button:focus-visible { outline: 3px solid #FF5A4E; outline-offset: 2px; }

    @media (prefers-reduced-motion: reduce) {
      .ml-cta, .ml-cta:hover, .ml-cta:active { transition: none; }
    }
  `}</style>
);

function MyListings() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load your listings.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSold = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this product as sold?",
    );

    if (!confirmed) return;

    try {
      await markProductAsSold(productId);

      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, status: "sold" } : product,
        ),
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to mark product as sold.");
    }
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?",
    );

    if (!confirmed) return;

    try {
      await deleteProduct(productId);

      setProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete product.");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="ml-root min-h-screen bg-[#E9ECF3] text-[#14213D] flex items-center justify-center">
        <Styles />
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-[#C9D0E0] border-t-[#14213D] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5B6478]">Loading your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-root min-h-screen bg-[#E9ECF3] text-[#14213D]">
      <Styles />

      {/* Header on the pinboard */}
      <header className="ml-board">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h1 className="ml-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[0.98]">
                My Listings
              </h1>

              <p className="text-[#3E475A] mt-4 max-w-xl text-sm sm:text-base leading-7">
                Manage the products you have listed on UniMart.
              </p>
            </div>

            <button
              onClick={() => navigate("/marketplace")}
              className="ml-cta self-start sm:self-auto px-6 py-3.5 rounded-xl bg-[#14213D] text-white font-semibold"
            >
              Marketplace
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 px-5 py-4 rounded-2xl bg-white border-l-8 border-[#FF5A4E] text-[#14213D] text-sm font-medium shadow-[0_10px_24px_rgba(20,33,61,0.08)]"
          >
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && products.length === 0 && (
          <div className="ml-board rounded-[28px] py-16 px-6 text-center">
            <div className="inline-block bg-white rounded-2xl px-8 py-9 shadow-[0_14px_30px_rgba(20,33,61,0.12)]">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FFD23F] flex items-center justify-center">
                <Package size={30} className="text-[#14213D]" />
              </div>

              <h2 className="ml-display text-2xl font-extrabold tracking-tight">
                No listings yet
              </h2>

              <p className="text-[#5B6478] text-sm mt-2">
                You haven't listed any products yet.
              </p>

              <button
                onClick={() => navigate("/marketplace/add")}
                className="ml-cta mt-6 px-6 py-3 rounded-xl bg-[#14213D] text-white font-semibold text-sm"
              >
                Add Product
              </button>
            </div>
          </div>
        )}

        {/* Products */}
        {products.length > 0 && (
          <>
            <p className="text-sm text-[#5B6478] mb-6 pb-4 border-b-2 border-dashed border-[#B7C0D6]">
              <span className="ml-display text-[#14213D] text-xl font-extrabold mr-1">
                {products.length}
              </span>
              {products.length === 1 ? "listing" : "listings"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {products.map((product) => {
                const image = product.product_images?.[0]?.image_url;

                const isSold = product.status === "sold";

                return (
                  <div key={product.id} className="flex flex-col">
                    {/* Image with price chip and status tag */}
                    <div className="relative aspect-[4/3] bg-white rounded-[22px] overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt={product.title}
                          className={`w-full h-full object-cover ${
                            isSold ? "grayscale opacity-60" : ""
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#9AA3B8]">
                          <Package size={45} />
                        </div>
                      )}

                      {/* Status */}
                      <span
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                          isSold
                            ? "bg-[#FF5A4E] text-white"
                            : "bg-[#14213D] text-white"
                        }`}
                      >
                        {isSold ? "SOLD" : "ACTIVE"}
                      </span>

                      {/* Price */}
                      <span className="ml-display absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-[#FFD23F] text-[#14213D] text-lg font-extrabold shadow-[0_4px_10px_rgba(20,33,61,0.2)]">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="pt-4 px-1 flex flex-col flex-1">
                      <h2 className="ml-display text-xl font-bold tracking-tight truncate">
                        {product.title}
                      </h2>

                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#14213D] text-white text-xs">
                          {product.category}
                        </span>

                        <span className="px-2.5 py-0.5 rounded-full bg-white text-[#3E475A] ring-1 ring-[#C9D0E0] text-xs">
                          {product.condition}
                        </span>

                        {product.is_negotiable && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FFD23F] text-[#14213D] text-xs font-medium">
                            Negotiable
                          </span>
                        )}
                      </div>

                      {product.location && (
                        <div className="flex items-center gap-1.5 mt-3 text-sm text-[#3E475A]">
                          <MapPin size={15} />
                          <span>{product.location}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-dashed border-[#B7C0D6]">
                        <button
                          onClick={() =>
                            navigate(`/marketplace/product/${product.id}/edit`)
                          }
                          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white ring-1 ring-[#C9D0E0] hover:ring-[#14213D] transition text-sm font-medium"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        {!isSold && (
                          <button
                            onClick={() => handleMarkAsSold(product.id)}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#14213D] text-white hover:bg-[#22345E] transition text-sm font-medium"
                          >
                            <CheckCircle size={16} />
                            Mark Sold
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[#D6382B] ring-1 ring-[#FFB8B1] hover:bg-[#FF5A4E] hover:text-white hover:ring-[#FF5A4E] transition text-sm font-medium"
                        >
                          <Trash2 size={16} />
                          Delete Listing
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyListings;