"use client";

import { useEffect, useRef, useState } from "react";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
import { MdOutlineWhatsapp } from "react-icons/md";

export default function Rodape() {
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const checkVisibility = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      // Show footer if scrolled more than 100vh
      const shouldShow = scrollY > viewportHeight;
      console.log(
        "Scroll:",
        scrollY,
        "Viewport:",
        viewportHeight,
        "Should show:",
        shouldShow,
      );
      setIsVisible(shouldShow);
    };

    // Use rAF to throttle
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    checkVisibility();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={footerRef}
      className="w-[300px] h-[80px] bg-blue-200 fixed bottom-0 left-0 borderRodape flex justify-start items-center"
      style={{
        transform: isVisible ? "translateY(0%)" : "translateY(100%)",
        opacity: isVisible ? 1 : 0,
        transition: "transform 400ms ease, opacity 400ms ease",
        zIndex: 10,
      }}
    >
      <div className="w-[250px] h-[70px] flex justify-center items-center">
        <div className="w-[140px] h-[70px] bg-[url('/logoGeralAcima.png')] bg-contain bg-no-repeat bg-center "></div>
        <div className="text-3xl text-white flex items-center justify-around w-[120px]">
          <a href="https://wa.me/5541984453443">
            <MdOutlineWhatsapp className="text-[#1198d0]" />
          </a>
          <a href="https://www.instagram.com/acima.matinhos/">
            <FaInstagram className="text-[#45b664]" />
          </a>
          <a href="https://www.facebook.com/acimamatinhos">
            <FaFacebookSquare className="text-[#1198d0]" />
          </a>
        </div>
      </div>
    </div>
  );
}
