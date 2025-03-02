var tl = gsap.timeline();

tl.to(".lording", { opacity: 1, duration: 0.7 })
  .to(".lording", {
    opacity: 0,
    duration: 0.5,
    delay: 0.5,
    onComplete: () => {
      document.querySelector(".lording").style.display = "none";
    },
  })
  .fromTo(
    "#loader h2:nth-child(1)",
    { opacity: 0, x: "100%" },
    { opacity: 1, x: "0%", duration: 2 }
  )
  .to("#loader h2:nth-child(1)", {
    opacity: 0,
    x: "-100%",
    duration: 1,
    delay: 0.5,
  })
  .fromTo(
    "#loader h2:nth-child(2)",
    { opacity: 0, x: "100%" },
    { opacity: 1, x: "0%", duration: 1.5 }
  )
  .to("#loader h2:nth-child(2)", {
    opacity: 0,
    x: "-100%",
    duration: 1,
    delay: 0.5,
  })
  .fromTo(
    "#loader h2:nth-child(3)",
    { opacity: 0, x: "100%" },
    { opacity: 1, x: "0%", duration: 1.5 }
  )
  .to("#loader h2:nth-child(3)", {
    opacity: 0,
    x: "-100%",
    duration: 1,
    delay: 0.5,
  })
  .to("#loader", { opacity: 0, display: "none", duration: 1 });

setTimeout(function () {
  $("#container").show();
}, 6599);

var hbdmp = document.getElementById("hbdmp");
var icon = document.getElementById("icon");

// icon.onclick = function () {
//   if (hbdmp.paused) {
//     hbdmp.play();
//     icon.src = "images/pause.png";
//   } else {
//     hbdmp.pause();
//     icon.src = "images/play.png";
//   }
// };

document.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector(".card");
  const s1 = document.querySelector(".s-1");
  const s2 = document.querySelector(".s-2");

  function expandCard() {
    hbdmp.muted = false;
    hbdmp.play();
    // Hide s-1 and s-2 smoothly
    s1.style.opacity = "0";
    s2.style.opacity = "0";

    setTimeout(() => {
      s1.style.display = "none"; // Completely hide after fading
      s2.style.display = "none";
    }, 1500);

    // Smooth expansion
    card.classList.add("expanded");

    // Optionally, remove fixed width/height after expansion
    setTimeout(() => {
      card.style.width = "100vw";
      card.style.height = "100vh";
    }, 1000); // Adjust the timing based on the animation speed
  }

  // card.addEventListener("click", expandCard);
  card.addEventListener("click", function () {
    card.classList.toggle("active");
    expandCard();
  });
});
