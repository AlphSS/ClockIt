import { cn } from "../../lib/utils";
import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";

const defaultItems = [
  {
    num: "01",
    name: "Gourmet Burgers",
    clipId: "clip-original",
    image:
      "https://cdn.21st.dev/assets/mirror/53/534bb84332e13a8595670521bdcc71acd40fabbf589c1775f4028df1ca1ea96a.jpg",
  },
  {
    num: "02",
    name: "Fresh Desserts",
    clipId: "clip-hexagons",
    image:
      "https://cdn.21st.dev/assets/mirror/be/bec9c493cadbcd53fd0e00a0cf98f1dbb7813141c9c461b8c1b7920f6b7fa721.jpg",
  },
  {
    num: "03",
    name: "Artisan Waffles",
    clipId: "clip-pixels",
    image:
      "https://cdn.21st.dev/assets/mirror/b0/b05848f9ad0d993c69b9c21c3793b3b5507eff7064b01540d196cac068101729.jpg",
  },
];

export const Component = ({ items = defaultItems, className }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const mainGroupRef = useRef(null);
  const masterTl = useRef(null);

  const createLoop = (index) => {
    const item = items[index];
    const selector = `#${item.clipId} .path`;

    if (masterTl.current) masterTl.current.kill();

    if (imageRef.current) imageRef.current.setAttribute("href", item.image);
    if (mainGroupRef.current)
      mainGroupRef.current.setAttribute("clip-path", `url(#${item.clipId})`);

    gsap.set(selector, { scale: 0, transformOrigin: "50% 50%" });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    // 1. IN (Expo Out)
    tl.to(selector, {
      scale: 1,
      duration: 0.8,
      stagger: { amount: 0.4, from: "random" },
      ease: "expo.out",
    })
      // 2. IDLE (Sine Breath)
      .to(selector, {
        scale: 1.05,
        duration: 1.5,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
        stagger: { amount: 0.2, from: "center" },
      })
      // 3. OUT (Expo In)
      .to(selector, {
        scale: 0,
        duration: 0.6,
        stagger: { amount: 0.3, from: "edges" },
        ease: "expo.in",
      });

    masterTl.current = tl;
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      createLoop(0);
    }, containerRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleItemHover = (index) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    createLoop(index);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col md:flex-row items-center justify-between min-h-screen w-full p-8 md:p-24 overflow-hidden transition-colors duration-500",
        "bg-[#2A2A29]",
        className
      )}
    >
      {/* LEFT SIDE: HIGH CONTRAST MENU */}
      <div className="z-20 w-full md:w-1/2">
        <nav>
          <ul className="flex flex-col gap-14">
            {items.map((item, index) => (
              <li
                key={item.num}
                onMouseEnter={() => handleItemHover(index)}
                className="group cursor-pointer"
              >
                <div className="flex items-start gap-6">
                  {/* Numbers */}
                  <span
                    className={cn(
                      "text-3xl font-bold transition-all duration-500 mt-2",
                      activeIndex === index
                        ? "text-orange-500 scale-110"
                        : "text-[#4A4A47]"
                    )}
                  >
                    {item.num}
                  </span>

                  {/* Main Text */}
                  <h2
                    className={cn(
                      "text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] transition-all duration-700",
                      activeIndex === index
                        ? "text-[#EDE9E3] opacity-100 translate-x-4"
                        : "opacity-100 translate-x-0 text-transparent " +
                          "[text-stroke:1.5px_#4A4A47] [-webkit-text-stroke:1.5px_#4A4A47]"
                    )}
                  >
                    {item.name.split(" ")[0]}
                    <br />
                    {item.name.split(" ")[1]}
                  </h2>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* RIGHT SIDE: SHAPE REVEAL */}
      <div className="relative w-full md:w-1/2 flex justify-center items-center mt-16 md:mt-0">
        <div className="absolute w-[120%] h-[120%] bg-[#8B7765]/25 blur-[120px] rounded-full transition-opacity duration-1000" />

        <svg
          viewBox="0 0 500 500"
          className="w-[100%] max-w-[500px] h-auto z-10 drop-shadow-[0_0_60px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* Same shape as "Stays" — a simple apartment / house silhouette */}
            <clipPath id="clip-original">
              <path className="path" d="M60,190 L250,40 L440,190 Z" />
              <rect className="path" x="95" y="190" width="310" height="270" rx="8" />
              <rect className="path" x="150" y="330" width="70" height="130" />
              <rect className="path" x="280" y="230" width="60" height="60" rx="4" />
            </clipPath>

            <clipPath id="clip-hexagons">
              <rect className="path" x="20" y="20" width="200" height="280" rx="12" />
              <rect className="path" x="20" y="320" width="200" height="160" rx="12" />
              <rect className="path" x="240" y="20" width="240" height="140" rx="12" />
              <rect className="path" x="240" y="180" width="110" height="160" rx="12" />
              <rect className="path" x="370" y="180" width="110" height="160" rx="12" />
              <rect className="path" x="240" y="360" width="240" height="120" rx="12" />
            </clipPath>

            {/* Grid Squares */}
            <clipPath id="clip-pixels">
              {Array.from({ length: 9 }).map((_, i) => (
                <rect
                  key={i}
                  className="path"
                  x={(i % 3) * 160 + 20}
                  y={Math.floor(i / 3) * 160 + 20}
                  width="140"
                  height="140"
                  rx="4"
                />
              ))}
            </clipPath>
          </defs>

          <g ref={mainGroupRef} clipPath={`url(#${items[0].clipId})`}>
            <image
              ref={imageRef}
              href={items[0].image}
              width="500"
              height="500"
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};