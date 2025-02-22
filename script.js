var tl = gsap.timeline();

tl.fromTo("#loader h2:nth-child(1)", { opacity: 0, x: "100%" }, { opacity: 1, x: "0%", duration: 1 })
  .to("#loader h2:nth-child(1)", { opacity: 0, x: "-100%", duration: 1, delay: 1 })
  .fromTo("#loader h2:nth-child(2)", { opacity: 0, x: "100%" }, { opacity: 1, x: "0%", duration: 1 })
  .to("#loader h2:nth-child(2)", { opacity: 0, x: "-100%", duration: 1, delay: 1 })
  .to("#loader", { opacity: 0, display: "none", duration: 1 });