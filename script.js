// var tl = gsap.timeline()

// tl.from("#loader h2",{
//   x:50,
//   opacity:0,
//   duration:3,
//   stagger:0.5
// })
// tl.to("#loader h2",{
//   x:-20,
//   opacity:0,
//   duration:2,
//   stagger:-0.5
// })
// tl.to("#loader",{
//   opacity:0,
//   display:"none",
// })
var tl = gsap.timeline();

tl.to("#loader h2:nth-child(1)", { opacity: 1, duration: 1 })
  .to("#loader h2:nth-child(1)", { opacity: 0, duration: 1, delay: 1 }) // Fade out first text
  .to("#loader h2:nth-child(2)", { opacity: 1, duration: 1 })
  .to("#loader h2:nth-child(2)", { opacity: 0, duration: 1, delay: 1 }) // Fade out second text
  // .to("#loader h2:nth-child(3)", { opacity: 1, duration: 1 })
  // .to("#loader h2:nth-child(3)", { opacity: 0, duration: 1, delay: 1 }) // Fade out third text
  .to("#loader", { opacity: 0, display: "none", duration: 1 }); // Hide loader
