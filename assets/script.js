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

document.addEventListener("DOMContentLoaded", () => {
  AOS.init();
  const card = document.querySelector(".card");
  const s1 = document.querySelector(".s-1");
  const s2 = document.querySelector(".s-2");

  function expandCard() {
    hbdmp.muted = false;
    hbdmp.play();

    s1.style.opacity = "0";
    s2.style.opacity = "0";

    setTimeout(() => {
      s1.style.display = "none";
      s2.style.display = "none";
    }, 1500);

    card.classList.add("expanded");

    setTimeout(() => {
      card.style.width = "100%";
      card.style.height = "100%";
      AOS.init({
        container: document.querySelector('.container-invitation'),
        duration: 1000,
        easing: 'ease-in-out',
        // once: true,
        offset: 120,
        callback: function(el) {
          console.log('AOS triggered:', el);
        }
      });
    }, 1000);
  }

  card.addEventListener("click", function () {
    if (!card.classList.contains("active")) {
      card.classList.add("active");
      expandCard();
      confirm_open_invitation();
    }
  });
});

function confirm_open_invitation() {
  var container = document.querySelector(".container-invitation");

  container.classList.add(
    "animate__animated",
    "animate__fadeIn",
    "animate__slow"
  );

  setTimeout(function () {
    container.classList.remove("hide");

    let observer = new IntersectionObserver(
      (entries, observer) => {
        console.log('AOS refresh');
        AOS.refresh();
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log(`Intersecting: ${entry.target.id}`);
            $(".navItem").removeClass("active");
            if (entry.target.id === "cover") {
              $(".navItem").removeClass("active");
            } else if (entry.target.id === "bridegroom") {
              $(".bridegroomNavItem").addClass("active");
            } else if (entry.target.id === "event") {
              $(".eventNavItem").addClass("active");
            } else if (entry.target.id === "story") {
              $(".storyNavItem").addClass("active");
            } else if (entry.target.id === "galery") {
              $(".galeryNavItem").addClass("active");
            } else if (entry.target.id === "rsvp") {
              $(".rsvpNavItem").addClass("active");
            }
            if (entry.target.id === "footer") {
              $(".nav").addClass("hide");
            } else {
              $(".nav").removeClass("hide");
            }
          }
        });
      },
      { rootMargin: "0px", threshold: 0.3 }
    );
    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section);
    });
  }, 1000);

  lightbox.option({
    resizeDuration: 200,
    wrapAround: true,
    disableScrolling: true,
  });
}

window.onload = function (){
  fallingFlower();
}

function fallingFlower() {
  TweenLite.set("#container-invitation", { perspective: 600 });

  var total = 20;
  var container = document.getElementById("container-invitation"),
      w = window.innerWidth,
      h = window.innerHeight;

  for (i = 0; i < total; i++) {
      var Div = document.createElement("div");
      var Div2 = document.createElement("div");
      var Div3 = document.createElement("div");
      TweenLite.set(Div, {
          attr: { class: "dot" },
          x: R(0, w),
          y: 0,
          z: 0,
      });
      TweenLite.set(Div2, {
          attr: { class: "dot2" },
          x: R(0, w),
          y: 0,
          z: 0,
      });
      TweenLite.set(Div3, {
          attr: { class: "dot3" },
          x: R(0, w),
          y: 0,
          z: 0,
      });
      container.appendChild(Div);
      container.appendChild(Div2);
      container.appendChild(Div3);
      animm(Div);
      animm2(Div2);
      animm3(Div3);
  }

  function animm(elm) {
      TweenMax.to(elm, R(6, 15), {
          y: h + 100,
          ease: Linear.easeNone,
          repeat: -1,
          delay: -15,
      });
      TweenMax.to(elm, R(4, 8), {
          x: "+=100",
          rotationZ: R(0, 180),
          repeat: -1,
          yoyo: true,
          ease: Sine.easeInOut,
      });
      TweenMax.to(elm, R(2, 8), {
          repeat: -1,
          yoyo: true,
          ease: Sine.easeInOut,
          delay: -5,
      });
  }
  function animm2(elm) {
      TweenMax.to(elm, R(6, 15), {
          y: h + 100,
          ease: Linear.easeNone,
          repeat: -1,
          delay: -25,
      });
      TweenMax.to(elm, R(4, 8), {
          x: "+=100",
          rotationZ: R(0, 180),
          repeat: -1,
          yoyo: true,
          ease: Sine.easeInOut,
      });
      TweenMax.to(elm, R(2, 8), {
          repeat: -1,
          yoyo: true,
          ease: Sine.easeInOut,
          delay: -5,
      });
  }
  function animm3(elm) {
      TweenMax.to(elm, R(6, 15), {
          y: h + 100,
          ease: Linear.easeNone,
          repeat: -1,
          delay: -5,
      });
      TweenMax.to(elm, R(4, 8), {
          x: "+=100",
          rotationZ: R(0, 180),
          repeat: -1,
          yoyo: true,
          ease: Sine.easeInOut,
      });
      TweenMax.to(elm, R(2, 8), {
          repeat: -1,
          yoyo: true,
          ease: Sine.easeInOut,
          delay: -5,
      });
  }

  function R(min, max) {
      return min + Math.random() * (max - min);
  }
}