import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function R(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * This component overlays falling flowers on its parent (cover section).
 * It only creates visual flower divs in a positioned overlay, never new sections.
 */
export default function FallingFlower({ show }) {
  const overlayRef = useRef();

  useEffect(() => {
    if (!show || !overlayRef.current) return;

    const overlay = overlayRef.current;
    gsap.set(overlay, { perspective: 600 });

    const w = overlay.offsetWidth;
    const h = overlay.offsetHeight;
    const total = 20;
    const flowers = [];

    function animm(elm, delay) {
      gsap.to(elm, {
        y: h + 100,
        duration: R(6, 15),
        ease: "none",
        repeat: -1,
        delay: delay,
      });
      gsap.to(elm, {
        x: "+=100",
        rotationZ: R(0, 180),
        duration: R(4, 8),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(elm, {
        duration: R(2, 8),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: -5,
      });
    }

    for (let i = 0; i < total; i++) {
      // dot1
      const div1 = document.createElement("div");
      div1.className = "dot";
      gsap.set(div1, { x: R(0, w), y: 0, z: 0 });
      overlay.appendChild(div1);
      animm(div1, -15);
      flowers.push(div1);

      // dot2
      const div2 = document.createElement("div");
      div2.className = "dot2";
      gsap.set(div2, { x: R(0, w), y: 0, z: 0 });
      overlay.appendChild(div2);
      animm(div2, -25);
      flowers.push(div2);

      // dot3
      const div3 = document.createElement("div");
      div3.className = "dot3";
      gsap.set(div3, { x: R(0, w), y: 0, z: 0 });
      overlay.appendChild(div3);
      animm(div3, -5);
      flowers.push(div3);
    }

    // Cleanup on unmount/hide
    return () => {
      flowers.forEach((f) => {
        if (overlay.contains(f)) overlay.removeChild(f);
      });
    };
  }, [show]);

  // The overlay is absolutely positioned, pointer-events none so it doesn't block content
  return (
    <div
      ref={overlayRef}
      className="falling-flower-overlay"
      style={{
        pointerEvents: "none",
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: 10, // above section content
      }}
    />
  );
}