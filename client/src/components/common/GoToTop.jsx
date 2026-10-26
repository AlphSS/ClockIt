import { useEffect, useState } from "react";

function GoToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Go to top"
      className="
        group fixed bottom-7 right-7 z-50
        flex h-12 w-12 items-center justify-center
        rounded-full
        border border-white/15
        bg-[#0a0a0a]/70
        text-white
        backdrop-blur-xl
        shadow-[0_8px_25px_rgba(0,0,0,0.35)]
        transition-all duration-300
        hover:-translate-y-1
        hover:bg-[#0a0a0a]/85
        hover:shadow-[0_10px_30px_rgba(0,0,0,0.45)]
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-300 group-hover:-translate-y-1"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}

export default GoToTop;