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
  ArrowUpRight,
} from "lucide-react";

import "./MarketplaceTheme.css";
import "./ProductDetails.css";

import NavBar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";
import { startConversation } from "../../services/chatApi";
import { supabase } from "../../services/supabase";
import { getProductById, getProducts } from "../../services/marketplaceApi";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [chatError, setChatError] = useState("");
  const [startingChat, setStartingChat] = useState(false);
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
      setProduct(null);
      setSelectedImage(null);

      const [productData, productsData] = await Promise.all([
        getProductById(id),
        getProducts(),
      ]);

      const currentProduct = productData.product;

      setProduct(currentProduct);

      if (currentProduct.product_images?.length > 0) {
        setSelectedImage(currentProduct.product_images[0].image_url);
      }

      const otherProducts = (productsData.products || []).filter(
        (item) => item.id !== currentProduct.id && item.status === "active",
      );

      const shuffled = [...otherProducts].sort(() => Math.random() - 0.5);

      setRelatedProducts(shuffled.slice(0, 4));
    } catch (err) {
      console.error("Product details error:", err);
      setError(
        err.response?.data?.message || err.message || "Unable to load product.",
      );
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (price) => Number(price).toLocaleString("en-IN");

  const openProduct = (productId) => {
    navigate(`/marketplace/product/${productId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  async function handleChatWithSeller() {
    try {
      setChatError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      if (user.id === product.seller_id) {
        setChatError("You cannot chat with yourself about your own listing.");
        return;
      }

      setStartingChat(true);

      const result = await startConversation(product.seller_id);

      navigate(`/chat?conversation=${result.conversation.id}`);
    } catch (error) {
      setChatError(error.message || "Unable to start the conversation.");
    } finally {
      setStartingChat(false);
    }
  }
  const images = product?.product_images || [];

  return (
    <div className="pd-root">
      <NavBar theme="roomies" />

      <main className="pd-main">
        {loading ? (
          <section className="pd-state">
            <div className="pd-spinner" />
            <h2 className="pd-display">Finding your item...</h2>
            <p>Just a moment while we get the details ready.</p>
          </section>
        ) : error || !product ? (
          <section className="pd-state">
            <div className="pd-state-icon">
              <PackageOpen size={34} strokeWidth={1.4} />
            </div>

            <span className="pd-eyebrow">MARKETPLACE</span>

            <h1 className="pd-display">Item not found.</h1>

            <p>{error || "This product may no longer be available."}</p>

            <button
              type="button"
              className="pd-button pd-button-primary"
              onClick={() => navigate("/marketplace")}
            >
              <ArrowLeft size={17} />
              Back to Marketplace
            </button>
          </section>
        ) : (
          <>
            <div className="pd-page-container">
              <button
                type="button"
                className="pd-back-link"
                onClick={() => navigate("/marketplace")}
              >
                <ArrowLeft size={17} />
                Back to Marketplace
              </button>

              <div className="pd-product-layout">
                {/* Product gallery */}
                <section className="pd-gallery" aria-label="Product images">
                  {images.length > 0 ? (
                    <>
                      <div className="pd-gallery-main">
                        <div className="pd-image-frame">
                          <img
                            src={selectedImage || images[0].image_url}
                            alt={product.title}
                            className="pd-main-image"
                          />

                          {product.status === "sold" && (
                            <div className="pd-sold-overlay">
                              <span className="pd-sold-stamp">SOLD</span>
                            </div>
                          )}
                        </div>

                        <span className="pd-gallery-caption">
                          A closer look
                        </span>
                      </div>

                      {images.length > 1 && (
                        <div className="pd-thumbnails">
                          {images.map((image, index) => (
                            <button
                              type="button"
                              key={image.id || image.image_url}
                              className={`pd-thumbnail ${
                                selectedImage === image.image_url
                                  ? "pd-thumbnail-active"
                                  : ""
                              }`}
                              onClick={() => setSelectedImage(image.image_url)}
                              aria-label={`View product image ${index + 1}`}
                              aria-pressed={selectedImage === image.image_url}
                            >
                              <img
                                src={image.image_url}
                                alt={`${product.title} view ${index + 1}`}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="pd-no-image">
                      <PackageOpen size={52} strokeWidth={1.2} />
                      <p>No image available</p>
                    </div>
                  )}
                </section>

                {/* Product information */}
                <section className="pd-details">
                  <div className="pd-meta-row">
                    <span className="pd-category">{product.category}</span>

                    {product.status === "sold" && (
                      <span className="pd-sold-label">Sold</span>
                    )}
                  </div>

                  <h1 className="pd-display pd-title">{product.title}</h1>

                  <div className="pd-price-block">
                    <span className="pd-price-label">ASKING PRICE</span>
                    <div className="pd-price-line">
                      <span className="pd-price">
                        ₹{formatPrice(product.price)}
                      </span>

                      {product.is_negotiable && (
                        <span className="pd-negotiable">Negotiable</span>
                      )}
                    </div>
                  </div>

                  <div className="pd-facts">
                    <div className="pd-fact">
                      <span className="pd-fact-icon">
                        <Tag size={17} />
                      </span>
                      <div>
                        <span className="pd-fact-label">Condition</span>
                        <span className="pd-fact-value">
                          {product.condition || "Not specified"}
                        </span>
                      </div>
                    </div>

                    {product.location && (
                      <div className="pd-fact">
                        <span className="pd-fact-icon">
                          <MapPin size={17} />
                        </span>
                        <div>
                          <span className="pd-fact-label">Location</span>
                          <span className="pd-fact-value">
                            {product.location}
                          </span>
                        </div>
                      </div>
                    )}

                    {product.colleges?.name && (
                      <div className="pd-fact">
                        <span className="pd-fact-icon">
                          <GraduationCap size={18} />
                        </span>
                        <div>
                          <span className="pd-fact-label">College</span>
                          <span className="pd-fact-value">
                            {product.colleges.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {product.description && (
                    <div className="pd-description">
                      <span className="pd-eyebrow">THE DETAILS</span>
                      <h2 className="pd-display">About this item</h2>
                      <p>{product.description}</p>
                    </div>
                  )}

                  <div className="pd-seller">
                    <div className="pd-seller-avatar">
                      <UserRound size={23} />
                    </div>

                    <div className="pd-seller-info">
                      <span className="pd-seller-label">LISTED BY</span>
                      <span className="pd-seller-name">
                        {product.profiles?.full_name ||
                          product.profiles?.username ||
                          "Campus seller"}
                      </span>

                      {product.profiles?.username && (
                        <span className="pd-seller-username">
                          @{product.profiles.username}
                        </span>
                      )}
                    </div>

                    <div className="pd-seller-trust">
                      <ShieldCheck size={17} />
                      <span>Campus seller</span>
                    </div>
                  </div>

                  {product.status === "active" && (
                    <>
                      <button
                        type="button"
                        onClick={handleChatWithSeller}
                        disabled={startingChat}
                        className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#a51f3d] hover:bg-[#A83A54] text-white font-medium shadow-lg shadow-[#8F2942]/20 transition-all duration-300 disabled:opacity-60"
                      >
                        <MessageCircle size={19} />
                        {startingChat ? "Opening chat..." : "Chat with Seller"}
                      </button>

                      {chatError && (
                        <p className="mt-3 text-sm text-red-600" role="alert">
                          {chatError}
                        </p>
                      )}
                    </>
                  )}
                </section>
              </div>

              {/* Related products */}
              {relatedProducts.length > 0 && (
                <section className="pd-related">
                  <div className="pd-related-heading">
                    <div>
                      <span className="pd-eyebrow">A FEW MORE FINDS</span>
                      <h2 className="pd-display">
                        You may also like<span>.</span>
                      </h2>
                    </div>

                    <button
                      type="button"
                      className="pd-view-all"
                      onClick={() => navigate("/marketplace")}
                    >
                      View all products
                      <ArrowUpRight size={17} />
                    </button>
                  </div>

                  <div className="pd-related-grid">
                    {relatedProducts.map((item) => {
                      const image = item.product_images?.[0]?.image_url;

                      return (
                        <button
                          type="button"
                          key={item.id}
                          className="pd-related-card"
                          onClick={() => openProduct(item.id)}
                        >
                          <div className="pd-related-image">
                            {image ? (
                              <img
                                src={image}
                                alt={item.title || "Related product"}
                              />
                            ) : (
                              <div className="pd-related-placeholder">
                                <PackageOpen size={29} />
                              </div>
                            )}

                            <span className="pd-related-price">
                              ₹{formatPrice(item.price)}
                            </span>
                          </div>

                          <div className="pd-related-info">
                            <h3>{item.title}</h3>
                            <span>{item.condition}</span>

                            {item.location && (
                              <p>
                                <MapPin size={13} />
                                {item.location}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </main>

      <Footer theme="roomies" />
    </div>
  );
}

export default ProductDetails;
