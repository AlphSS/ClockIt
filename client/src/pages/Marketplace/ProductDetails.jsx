import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MapPin,
  GraduationCap,
  UserRound,
  Tag,
  ShieldCheck,
  PackageOpen,
  MessageCircle,
} from "lucide-react";

import { getProductById, getProducts } from "../../services/marketplaceApi";

/*
 * Design notes
 * - Concept: a campus notice board. The price hangs on a real
 *   price tag, the photo sits on a dotted pinboard grid, and
 *   facts read like a label sheet instead of a stack of cards.
 * - Palette: ink #14213D, board #E9ECF3, tag #FFD23F,
 *   coral #FF5A4E, slate #5B6478, paper #FFFFFF
 * - Type: Bricolage Grotesque (display) + DM Sans (body)
 */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');

    .pd-root { font-family: 'DM Sans', system-ui, sans-serif; }
    .pd-display { font-family: 'Bricolage Grotesque', 'DM Sans', system-ui, sans-serif; }

    .pd-board {
      background-color: #DDE2EE;
      background-image: radial-gradient(#B7C0D6 1.2px, transparent 1.2px);
      background-size: 22px 22px;
    }

    .pd-tag {
      clip-path: polygon(26px 0, 100% 0, 100% 100%, 26px 100%, 0 50%);
      transform-origin: 8px 50%;
      animation: pd-swing 900ms cubic-bezier(.2,.8,.2,1) 1 both;
    }
    .pd-tag-hole {
      box-shadow: inset 0 1px 2px rgba(20,33,61,.45);
    }
    @keyframes pd-swing {
      0%   { transform: rotate(-9deg); }
      45%  { transform: rotate(4deg); }
      75%  { transform: rotate(-1.5deg); }
      100% { transform: rotate(0deg); }
    }

    .pd-stamp { transform: rotate(-12deg); }

    .pd-cta { box-shadow: 5px 5px 0 #FFD23F; transition: transform .15s ease, box-shadow .15s ease; }
    .pd-cta:hover { transform: translate(2px, 2px); box-shadow: 3px 3px 0 #FFD23F; }
    .pd-cta:active { transform: translate(5px, 5px); box-shadow: 0 0 0 #FFD23F; }

    .pd-root button:focus-visible { outline: 3px solid #FF5A4E; outline-offset: 3px; }

    @media (prefers-reduced-motion: reduce) {
      .pd-tag { animation: none; }
      .pd-cta, .pd-cta:hover, .pd-cta:active { transition: none; }
    }
  `}</style>
);

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      setLoading(true);
      setError("");

      const [productData, productsData] = await Promise.all([
        getProductById(id),
        getProducts(),
      ]);

      const currentProduct = productData.product;

      setProduct(currentProduct);

      if (currentProduct.product_images?.length > 0) {
        setSelectedImage(currentProduct.product_images[0].image_url);
      }

      /*
       * Get random active products.
       * Current product is removed first.
       */
      const otherProducts = (productsData.products || []).filter(
        (item) => item.id !== currentProduct.id,
      );

      const shuffled = [...otherProducts].sort(() => Math.random() - 0.5);

      setRelatedProducts(shuffled.slice(0, 4));
    } catch (error) {
      console.error("Product details error:", error);

      setError(error.message || "Unable to load product.");
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-IN");
  };

  const openProduct = (productId) => {
    navigate(`/marketplace/product/${productId}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="pd-root min-h-screen bg-[#E9ECF3] text-[#14213D] flex items-center justify-center">
        <Styles />
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-[#C9D0E0] border-t-[#14213D] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-[#5B6478]">Loading product...</p>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error || !product) {
    return (
      <div className="pd-root min-h-screen bg-[#E9ECF3] text-[#14213D] flex items-center justify-center px-6">
        <Styles />
        <div className="text-center max-w-md">
          <PackageOpen size={45} className="mx-auto mb-4 text-[#14213D]" />

          <p className="text-[#FF5A4E] font-medium mb-5">
            {error || "Product not found."}
          </p>

          <button
            onClick={() => navigate("/marketplace")}
            className="pd-cta px-6 py-3 rounded-lg bg-[#14213D] text-white font-medium"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const images = product.product_images || [];

  return (
    <div className="pd-root min-h-screen bg-[#E9ECF3] text-[#14213D]">
      <Styles />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        {/* Back */}
        <button
          onClick={() => navigate("/marketplace")}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#14213D] bg-white rounded-full pl-3 pr-4 py-2 mb-6 hover:bg-[#14213D] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Marketplace
        </button>

        {/* Main Product */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-8 lg:gap-12 items-start">
          {/* ================= IMAGES ================= */}
          <div>
            {images.length > 0 ? (
              <div className="flex flex-col-reverse lg:flex-row gap-3 sm:gap-4">
                {/* Thumbnails: vertical rail on desktop, row on mobile */}
                {images.length > 1 && (
                  <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[640px] pb-1 lg:pb-0 lg:pr-1">
                    {images.map((image) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImage(image.image_url)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white p-1 transition ${
                          selectedImage === image.image_url
                            ? "ring-[3px] ring-[#14213D]"
                            : "ring-1 ring-[#C9D0E0] opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={image.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main image on a pinboard */}
                <div className="pd-board relative flex-1 aspect-square sm:aspect-[4/3] lg:aspect-auto lg:min-h-[560px] rounded-[28px] overflow-hidden flex items-center justify-center p-4 sm:p-8">
                  <div className="relative bg-white p-2 sm:p-3 rounded-md shadow-[0_2px_0_#B7C0D6,0_14px_30px_rgba(20,33,61,0.18)] max-w-full max-h-full">
                    <img
                      src={selectedImage || images[0].image_url}
                      alt={product.title}
                      className="block max-w-full max-h-[440px] lg:max-h-[520px] object-contain rounded-sm"
                    />

                    {/* Pin */}
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FF5A4E] shadow-[0_2px_4px_rgba(20,33,61,0.4)]" />

                    {product.status === "sold" && (
                      <div className="absolute inset-0 bg-[#14213D]/45 flex items-center justify-center">
                        <span className="pd-stamp pd-display px-7 py-2 border-4 border-[#FFD23F] text-[#FFD23F] font-extrabold text-3xl sm:text-4xl tracking-wide rounded-md">
                          SOLD
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-label="Save item"
                    className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white text-[#14213D] flex items-center justify-center shadow-md hover:bg-[#FF5A4E] hover:text-white transition-colors"
                  >
                    <Heart size={19} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="pd-board aspect-square sm:aspect-[4/3] rounded-[28px] flex items-center justify-center">
                <div className="text-center bg-white rounded-xl px-8 py-6 shadow-[0_14px_30px_rgba(20,33,61,0.12)]">
                  <PackageOpen
                    size={42}
                    className="mx-auto mb-3 text-[#5B6478]"
                  />

                  <p className="text-[#5B6478]">No Image Available</p>
                </div>
              </div>
            )}
          </div>

          {/* ================= DETAILS ================= */}
          <div className="flex flex-col lg:sticky lg:top-6">
            {/* Category + status */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#14213D] text-white text-xs font-medium">
                {product.category}
              </span>

              {product.status === "sold" && (
                <span className="px-3 py-1 rounded-full bg-[#FF5A4E] text-white text-xs font-medium">
                  Sold
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="pd-display text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-[-0.03em] leading-[0.98] break-words">
              {product.title}
            </h1>

            {/* Price tag */}
            <div className="mt-7">
              <div className="pd-tag inline-flex items-center bg-[#FFD23F] text-[#14213D] pl-11 pr-8 py-4 rounded-r-xl relative">
                <span className="pd-tag-hole absolute left-[13px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#E9ECF3]" />

                <div>
                  <p className="pd-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-none">
                    ₹{formatPrice(product.price)}
                  </p>

                  {product.is_negotiable && (
                    <p className="mt-1.5 text-sm font-semibold">
                      Price is negotiable
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Facts sheet */}
            <dl className="mt-8 bg-white rounded-2xl divide-y divide-[#E3E7F0] px-5">
              <div className="flex items-center gap-4 py-4">
                <Tag size={18} className="text-[#14213D] flex-shrink-0" />
                <dt className="text-sm text-[#5B6478] w-24 flex-shrink-0">
                  Condition
                </dt>
                <dd className="text-sm font-semibold">{product.condition}</dd>
              </div>

              {product.location && (
                <div className="flex items-center gap-4 py-4">
                  <MapPin size={18} className="text-[#14213D] flex-shrink-0" />
                  <dt className="text-sm text-[#5B6478] w-24 flex-shrink-0">
                    Location
                  </dt>
                  <dd className="text-sm font-semibold">{product.location}</dd>
                </div>
              )}

              {product.colleges?.name && (
                <div className="flex items-center gap-4 py-4">
                  <GraduationCap
                    size={18}
                    className="text-[#14213D] flex-shrink-0"
                  />
                  <dt className="text-sm text-[#5B6478] w-24 flex-shrink-0">
                    College
                  </dt>
                  <dd className="text-sm font-semibold">
                    {product.colleges.name}
                  </dd>
                </div>
              )}
            </dl>

            {/* Description */}
            {product.description && (
              <div className="mt-8">
                <h2 className="pd-display text-xl font-bold mb-2 tracking-tight">
                  About this item
                </h2>

                <p className="text-[15px] text-[#3E475A] leading-7 whitespace-pre-line max-w-[62ch]">
                  {product.description}
                </p>
              </div>
            )}

            {/* Seller */}
            <div className="mt-8 flex items-center gap-4 border-t-2 border-dashed border-[#B7C0D6] pt-6">
              <div className="w-12 h-12 rounded-full bg-[#14213D] flex items-center justify-center flex-shrink-0">
                <UserRound size={21} className="text-[#FFD23F]" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#5B6478]">Listed by</p>

                <p className="font-semibold truncate">
                  {product.profiles?.full_name ||
                    product.profiles?.username ||
                    "Unknown seller"}
                </p>

                {product.profiles?.username && (
                  <p className="text-xs text-[#5B6478]">
                    @{product.profiles.username}
                  </p>
                )}
              </div>

              <div className="ml-auto hidden sm:flex items-center gap-1.5 text-xs text-[#5B6478]">
                <ShieldCheck size={14} />
                Campus marketplace seller
              </div>
            </div>

            <div className="sm:hidden flex items-center gap-1.5 mt-3 text-xs text-[#5B6478]">
              <ShieldCheck size={14} />
              Campus marketplace seller
            </div>

            {/* Action */}
            {product.status === "active" && (
              <button className="pd-cta w-full mt-7 flex items-center justify-center gap-2 py-4 rounded-xl bg-[#14213D] text-white font-semibold">
                <MessageCircle size={19} />
                Chat with Seller
              </button>
            )}
          </div>
        </div>

        {/* ================= YOU MAY ALSO LIKE ================= */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-24">
            <div className="flex items-end justify-between mb-7">
              <div>
                <p className="text-sm text-[#5B6478] mb-1">
                  More from Marketplace
                </p>

                <h2 className="pd-display text-3xl sm:text-4xl font-extrabold tracking-[-0.02em]">
                  You may also like
                </h2>
              </div>

              <button
                onClick={() => navigate("/marketplace")}
                className="hidden sm:block text-sm font-medium underline underline-offset-4 decoration-2 decoration-[#FFD23F] hover:decoration-[#14213D] transition-colors"
              >
                View all
              </button>
            </div>

            {/* Related products */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6">
              {relatedProducts.map((item) => {
                const image = item.product_images?.[0]?.image_url;

                return (
                  <div
                    key={item.id}
                    onClick={() => openProduct(item.id)}
                    className="group cursor-pointer"
                  >
                    {/* Image with price tag chip */}
                    <div className="relative aspect-[4/5] bg-white rounded-[22px] overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PackageOpen size={32} className="text-[#9AA3B8]" />
                        </div>
                      )}

                      <span className="pd-display absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-[#FFD23F] text-[#14213D] text-base font-extrabold shadow-[0_4px_10px_rgba(20,33,61,0.2)]">
                        ₹{formatPrice(item.price)}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="pt-3 px-1">
                      <p className="text-sm sm:text-base font-semibold leading-snug line-clamp-2 group-hover:underline decoration-2 underline-offset-4 decoration-[#FFD23F]">
                        {item.title}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white text-[#3E475A] ring-1 ring-[#C9D0E0]">
                          {item.condition}
                        </span>

                        {item.is_negotiable && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#14213D] text-white">
                            Negotiable
                          </span>
                        )}
                      </div>

                      {item.location && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-[#5B6478]">
                          <MapPin size={12} />
                          <span className="truncate">{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile View All */}
            <button
              onClick={() => navigate("/marketplace")}
              className="sm:hidden w-full mt-8 py-3 rounded-xl bg-white text-sm font-medium hover:bg-[#14213D] hover:text-white transition-colors"
            >
              View all products
            </button>
          </section>
        )}

        <div className="h-10" />
      </div>
    </div>
  );
}

export default ProductDetails;
