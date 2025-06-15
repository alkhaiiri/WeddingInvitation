import React, { useEffect, useRef, useState, useMemo } from "react";
import "./assets/styles.css";
import "./assets/invitation.css";
import "./assets/default.min.css";
import "./assets/alertify.min.css";
import "./assets/lightbox.min.css";
import "./assets/splide-core.min.css";
import Countdown from "./components/count-down";
import FallingFlower from "./components/falling-flower";
import translations from "./components/translations";

import gsap from "gsap";
import AOS from "aos";
import 'aos/dist/aos.css';

function App() {
  const [step, setStep] = useState("loading"); // 'loading', 'loader', 'main'
  const [showInvitation, setShowInvitation] = useState(false);
  const audioRef = useRef(null);
  const cardRef = useRef();
  const s1Ref = useRef();
  const s2Ref = useRef();
  const containerRef = useRef();
  const invitationRef = useRef();
  const [activeNav, setActiveNav] = useState("");
  const [hideNav, setHideNav] = useState(false);
  const [lang, setLang] = useState("my");
  const [guest, setGuest] = useState(null);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState("attendanceYes");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {
    setLang(getLangFromUrl());
  }, []);

  function getLangFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("lang") || "my";
  }

  function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || null;
  }

  useEffect(() => {
    fetch(`https://manage-invitation.vercel.app/api/guest-messages?page=1&limit=100`)
      .then(res => {
        if (!res.ok) throw new Error("Wishes not found");
        return res.json();
      })
      .then(data => {
        setMessages(data);
      })
      .catch(err => {
        setError(err.message);
      });

    const id = getIdFromUrl();
    if (!id) {
      setError("No guest ID in URL.");
      return;
    }

    fetch(`https://manage-invitation.vercel.app/api/guests/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Guest not found");
        return res.json();
      })
      .then(data => {
        setGuest(data);
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);

    let attendanceVal = "attendanceYes";
    if (attendance === "attend") attendanceVal = "attendanceYes";
    else if (attendance === "absent") attendanceVal = "attendanceNo";
    else if (attendance === "maybe") attendanceVal = "attendanceMaybe";

    const reqBody = {
      guests_id: getIdFromUrl(),
      guests_name: guestName,
      message,
      attendance: attendanceVal,
    };

    try {
      const res = await fetch("https://manage-invitation.vercel.app/api/guest-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });
      if (!res.ok) throw new Error("Failed to submit message");
      setSubmitResult({ success: true });
      setGuestName("");
      setMessage("");
      setAttendance("attendanceYes");
    } catch (err) {
      setSubmitResult({ success: false, error: err.message });
    } finally {
      setSubmitting(false);
      fetch(`https://manage-invitation.vercel.app/api/guest-messages?page=1&limit=100`)
      .then(res => {
        if (!res.ok) throw new Error("Wishes not found");
        return res.json();
      })
      .then(data => {
        setMessages(data);
      })
      .catch(err => {
        setError(err.message);
      });
    }
  };

  useEffect(() => {
    if (step !== "loading") return;
    gsap.to(".lording", { opacity: 1, duration: 0.7 });
    gsap.to(".lording", {
      opacity: 0,
      duration: 0.5,
      delay: 0.5,
      onComplete: () => setStep("loader"),
    });
  }, [step]);

  useEffect(() => {
    if (step !== "loader") return;
    let tl = gsap.timeline();
    tl.fromTo("#loader h2:nth-child(1)", { opacity: 0, x: "100%" }, { opacity: 1, x: "0%", duration: 1 })
      .to("#loader h2:nth-child(1)", { opacity: 0, x: "-100%", duration: 1, delay: 1 })
      .fromTo("#loader h2:nth-child(2)", { opacity: 0, x: "100%" }, { opacity: 1, x: "0%", duration: 1 })
      .to("#loader h2:nth-child(2)", { opacity: 0, x: "-100%", duration: 1, delay: 1 })
      .fromTo("#loader h2:nth-child(3)", { opacity: 0, x: "100%" }, { opacity: 1, x: "0%", duration: 1 })
      .to("#loader h2:nth-child(3)", { opacity: 0, x: "-100%", duration: 1, delay: 1 })
      .to("#loader", { opacity: 0, display: "none", duration: 1 });

    const timer = setTimeout(() => setStep("main"), 8700);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (step === "main") {
      AOS.init();
      const card = cardRef.current;
      if (card) card.addEventListener("click", handleCardClick);
      return () => {
        if (card) card.removeEventListener("click", handleCardClick);
      };
    }
  }, [step]);

  function handleCardClick() {
    const card = cardRef.current;
    const s1 = s1Ref.current;
    const s2 = s2Ref.current;
    const audio = audioRef.current;

    if (!card.classList.contains("active")) {
      card.classList.add("active");
      expandCard(card, s1, s2, audio);
    }
  }

  function expandCard(card, s1, s2, audio) {
    audio.muted = false;
    audio.play().catch((err) => {
      console.log("Autoplay blocked:", err);
    });

    if (s1 && s2) {
      s1.style.opacity = "0";
      s2.style.opacity = "0";
      setTimeout(() => {
        s1.style.display = "none";
        s2.style.display = "none";
      }, 1500);
    }
    card.classList.add("expanded");

    setTimeout(() => {
      card.style.width = "100%";
      card.style.height = "100%";
      setShowInvitation(true);
    }, 500);
  }

  useEffect(() => {
    if (!showInvitation) return;

    const container = invitationRef.current;
    if (container) {
      container.classList.add("animate__animated", "animate__fadeIn", "animate__slow");
      setTimeout(() => {
        container.classList.remove("hide");
      }, 1000);
    }

    setTimeout(() => {
      AOS.init({
        container: invitationRef.current,
        duration: 1000,
        easing: "ease-in-out",
        offset: 120,
      });
      AOS.refresh();
    }, 1000);

    const observer = new window.IntersectionObserver(
      (entries) => {
        AOS.refresh();
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
            setHideNav(entry.target.id === "footer");
          }
        });
      },
      { rootMargin: "0px", threshold: 0.3 }
    );
    const sections = container.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [showInvitation]);

  return (
    <>
      {step === "loading" && (
        <div className="lording">
          <div className="center">
            <div className="ring"></div>
            <span>loading...</span>
          </div>
        </div>
      )}

      {step === "loader" && (
        <div id="loader">
          <h2>To Our Dearest Family and Friends</h2>
          <h2>We Welcome You</h2>
          <h2>To Our Special Day</h2>
        </div>
      )}

      {step === "main" && (
        <div id="container" ref={containerRef}>
          <div className="s-2" ref={s2Ref}></div>
          <div className="card" ref={cardRef}>
            <div className="sides left-side">
              <h1 className="cover-header">THE WE</h1>
              <h3 className="cover-subheader">ALKHAIRI</h3>
              {[...Array(5)].map((_, i) => (
                <h3 className="cover-subheader" key={i}></h3>
              ))}
              <h3
                style={{
                  height: "5vh",
                  margin: "0px 25px 0px 5px",
                  alignContent: "center",
                }}
                className="cover-subheader"
              >
                {guest === null ? "" : translations[lang].to}
              </h3>
              <h3 className="cover-subheader"></h3>
            </div>
            <div className="sides right-side">
              <h1 className="cover-header">DDING OF</h1>
              <h3 className="cover-subheader"> & NURISYA</h3>
              {[...Array(5)].map((_, i) => (
                <h3 className="cover-subheader" key={i}></h3>
              ))}
              <h3
                style={{
                  height: "5vh",
                  margin: "0px 20px 0px 5px",
                  alignContent: "center",
                  textAlign: "center"
                }}
                className="cover-subheader"
              >
                {guest?.data?.first_guest || ""}
                {guest?.data?.second_guest && (
                  <center style={{
                    margin: "5px 0px"
                  }}>&</center>
                )}
                {guest?.data?.second_guest || ""}
              </h3>
              <h3 className="cover-subheader"></h3>
            </div>
            <div className="back-side">
              <div
                ref={invitationRef}
                className="container-invitation"
                style={{
                  overflowY: "scroll",
                  height: "inherit",
                  position: "relative",
                }}
              >
                <section className="cover" id="cover">
                  <FallingFlower show={showInvitation} />
                  <div id="container-invitation hide"></div>
                  <div className="overlay"></div>
                  <div className="frame animate__animated animate__fadeIn animate__slow animate__delay-1s">
                    <div className="detail">
                      <div className="flower-top animate__animated animate__fadeIn animate__slow animate__delay-1s">
                        <img
                          src="https://s3.ap-southeast-1.amazonaws.com/cdn.kadio.id/images/kdo2/index-flower.png"
                          alt=""
                          width="100%"
                        />
                      </div>
                      <h5 className="mb-3 animate__animated animate__flipInY animate__slower animate__delay-1s">
                        {translations[lang].coverTitle}
                      </h5>
                      <h2 className="font-secondary mb-3 animate__animated animate__bounceInUp animate__slower">
                        Alkhairi <br></br>&amp;<br></br> Nurisya
                      </h2>
                      <h4 className="animate__animated animate__bounceInUp animate__slower">
                        {translations[lang].datetime}
                      </h4>
                      <p className="d-block animate__animated animate__bounceInUp animate__slower">
                        #ALwaysWithNurisya
                      </p>
                      
                      <Countdown targetDate="2025-07-05 09:00:00" lang={lang}/>
                      <div className="flower-bottom animate__animated animate__fadeIn animate__slow animate__delay-1s">
                        <img
                          src="https://s3.ap-southeast-1.amazonaws.com/cdn.kadio.id/images/kdo2/index-flower.png"
                          alt=""
                          width="100%"
                        />
                      </div>
                    </div>
                  </div>
                </section>
                <section className="bridegroom" id="bridegroom">
                  <div className="content">
                  <section>
                      <h2 data-aos="fade-up" data-aos-duration="1500">
                        {translations[lang].bride}
                      </h2>
                      <br></br>
                  </section>
                  <section>
                      <p
                        // className="mt-4 mb-8"
                        className="mt-4"
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {translations[lang].welcomeMessage}
                      </p>
                    </section>
                    <div className="row bride-profile">
                      <div className="left-flower"></div>
                      <div className="right-flower"></div>
                      <div className="col mb-6">
                        <section>
                          <div
                            className="image-bride"
                            data-aos="fade-right"
                            data-aos-duration="1000"
                          >
                            {/* <div className="bg-flower groom"></div>
                            <img
                              className="bride"
                              src="https://s3.ap-southeast-1.amazonaws.com/cdn.kadio.id/upload/439/bride1649774583_groom.jpg"
                              alt=""
                            />
                            <div className="flower groom"></div> */}
                            <div className="bg-flower groom"></div>
                            <div className="flower-frame groom">
                              <span className="bride-name">Alkhairi</span>
                            </div>
                            <div className="flower groom"></div>
                          </div>
                        </section>
                        <section>
                          <div data-aos="fade-up" data-aos-duration="1000">
                            {/* <h4 className="mb-2 mt-2">Alkhairi</h4> */}
                            <h5 className="mb-2">Muhammad Alkhairi Mashuri</h5>
                            <br></br>
                            <p className="mb-2">{translations[lang].sonOf}</p>
                            <p className="bold">{translations[lang].fatherPrefix} Kawiyun</p>
                            <p className="bold line-height-1">&amp;</p>
                            <p className="bold mb-4">{translations[lang].motherPrefix} Ernawati</p>
                            {/* <p style={{ whiteSpace: "pre-wrap" }}>
                              Indonesia
                            </p> */}
                          </div>
                        </section>
                        <hr></hr>
                      </div>
                      <div className="col">
                        <section>
                          <div
                            className="image-bride"
                            data-aos="fade-left"
                            data-aos-duration="1000"
                          >
                            <div className="bg-flower groom"></div>
                            <div className="flower-frame groom">
                              <span className="bride-name">Nurisya</span>
                            </div>
                            <div className="flower groom"></div>
                          </div>
                        </section>
                        <section>
                          <div data-aos="fade-up" data-aos-duration="1000">
                            {/* <h4 className="mb-2 mt-2">Nurisya</h4> */}
                            <h5 className="mb-2">Nurisya Ilyana Binti Zairimi</h5>
                            <br></br>
                            <p className="mb-2">{translations[lang].daughterOf}</p>
                            <p className="bold">{translations[lang].fatherPrefix} Zairimi Bin Ahmad</p>
                            <p className="bold line-height-1">&amp;</p>
                            <p className="bold mb-4">{translations[lang].motherPrefix} Wahida Binti Ab Rahman</p>
                            {/* <p style={{ whiteSpace: "pre-wrap" }}>
                              Malaysia
                            </p> */}
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="event" id="event">
                  <div className="content">
                    <h2
                      className="mb-4"
                      data-aos="fade-up"
                      data-aos-duration="1500"
                    >
                      {translations[lang].detail}
                    </h2>
                    <div className="row justify-center mt-6 flex-wrap">
                      <section>
                        <div className="item mb-8">
                          <section>
                            <div
                              className="detail"
                              data-aos="fade-up"
                              data-aos-duration="1000"
                            >
                              <p>{translations[lang].datetime}</p>
                              <br></br>
                              <br></br>
                              <h3 className="mb-2">{translations[lang].solemnization}</h3>
                              <p className="mb-2">09:00AM - 10:30AM MYT</p>
                              <br></br>
                              <h3 className="mb-2">{translations[lang].reception}</h3>
                              <p className="mb-2">12:00PM - 04:00PM MYT</p>
                              <br></br>
                              <p className="bold mb-2">DeRoses Hall - Floral Crystal Event Space</p>
                              <p>F-02-01, Level 2, Center Courtyard</p>
                              <br></br>
                              <p>Conezion IOI RESORT CITY, 62502, Putrajaya, Wilayah Persekutuan Putrajaya, Malaysia</p>
                              <div className="d-flex align-center justify-center mt-3">
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href="https://maps.app.goo.gl/zKVHSWESD4i7aV7D7"
                                  className="btn-open-map mr-2"
                                >
                                  {translations[lang].openMap}
                                  <img
                                    src="https://s3.ap-southeast-1.amazonaws.com/cdn.kadio.id/images/icon/maps-white.png"
                                    alt=""
                                  />
                                </a>
                              </div>
                            </div>
                          </section>
                        </div>
                      </section>
                    </div>
                  </div>
                </section>
                <section className="rsvp" id="rsvp">
                  <div className="content">
                    <section>
                      <h2
                        className="text-center"
                        data-aos="fade-up"
                        data-aos-duration="1000"
                      >
                        {translations[lang].pray}
                      </h2>
                    </section>
                    <section>
                      <div
                        className="form_message mt-6"
                        data-aos="fade-up"
                        data-aos-duration="1500"
                      >
                        <form id="form_message" onSubmit={handleSubmit}>
                          <label>{translations[lang].name} : </label>
                          <input
                            id="guest_name"
                            type="text"
                            name="guest_name"
                            value={guestName}
                            onChange={e => setGuestName(e.target.value)}
                            required
                          />
                          <p className="font-primary"></p>
                          <br />
                          <label>{translations[lang].message} :</label>
                          <textarea
                            id="message"
                            type="text"
                            name="message"
                            rows="3"
                            className="mb-5"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            required
                          ></textarea>
                          <label>{translations[lang].attendance} :</label>
                          <div className="mt-1 d-flex align-center">
                            <input
                              type="radio"
                              name="attendant"
                              value="attend"
                              id="hadir"
                              checked={attendance === "attend"}
                              onChange={() => setAttendance("attend")}
                            />
                            <label className="font-primary ml-2" htmlFor="hadir">
                              {translations[lang].attendanceYes}
                            </label>
                          </div>
                          <div className="mt-2 d-flex align-center">
                            <input
                              type="radio"
                              name="attendant"
                              value="absent"
                              id="absent"
                              checked={attendance === "absent"}
                              onChange={() => setAttendance("absent")}
                            />
                            <label className="font-primary ml-2" htmlFor="absent">
                              {translations[lang].attendanceNo}
                            </label>
                          </div>
                          <div className="mt-2 d-flex align-center">
                            <input
                              type="radio"
                              name="attendant"
                              value="maybe"
                              id="maybe"
                              checked={attendance === "maybe"}
                              onChange={() => setAttendance("maybe")}
                            />
                            <label className="font-primary ml-2" htmlFor="maybe">
                              {translations[lang].attendanceMaybe}
                            </label>
                          </div>
                          <br />
                          <button
                            type="submit"
                            id="btn_message"
                            className="mb-4"
                            disabled={submitting}
                          >
                            {submitting ? translations[lang].submitting || "Submitting..." : translations[lang].submit}
                            <img
                              src="https://s3.ap-southeast-1.amazonaws.com/cdn.kadio.id/images/icon/send-blue.png"
                              alt=""
                            />
                          </button>
                          {submitResult && (
                            <div className="mt-2">
                              {submitResult.success
                                ? (translations[lang].submitSuccess || "Message sent successfully!")
                                : (translations[lang].submitError || "Failed to send message.")}
                            </div>
                          )}
                        </form>
                        <div className="flower">
                          <img
                            src="https://s3.ap-southeast-1.amazonaws.com/cdn.kadio.id/images/kdo2/rsvp-flower.png"
                            alt=""
                          />
                        </div>
                      </div>
                    </section>
                    <section>
                      <div
                        className="message_guest"
                        data-aos="fade-up"
                        data-aos-duration="1000"
                      >
                        <p className="mb-4">{translations[lang].guestMessage}</p>
                        <ul id="message_list" style={{ listStyle: "none" }}>
                          {messages?.data?.messages && messages?.data?.messages?.length > 0 ? (
                            messages?.data?.messages?.map((msg) => (
                              <li key={msg.id}>
                                <span className="from">{msg.guests_name}</span>
                                <span className="guest_message">{msg.message}</span>
                              </li>
                            ))
                          ) : (
                            <li>
                              <span className="from">-</span>
                              <span className="guest_message">Belum ada ucapan</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </section>
                    <section>
                      <div
                        className="turut-mengundang"
                        data-aos="fade-up"
                        data-aos-duration="1500"
                      >
                        <div className="flower"></div>
                        <ol>
                          <p style={{textAlign: "center", color: "#ffffff", fontFamily: "'Josefin Slab', serif"}}>
                            {translations[lang].weddingPrayer}
                          </p>
                        </ol>
                      </div>
                    </section>
                  </div>
                </section>
                <section id="footer">
                  <footer>
                    <p
                      style={{
                        textAlign: "center",
                        padding: 10,
                        marginBottom: 0,
                      }}
                    >
                      #ALwaysWithNurisya
                    </p>
                    <p
                      style={{
                        textAlign: "center",
                        padding: 10,
                        marginBottom: 0,
                      }}
                    >
                    </p>
                  </footer>
                </section>
              </div>
            </div>
          </div>
          <div className="s-1" ref={s1Ref}></div>
        </div>
      )}

      <audio
        id="hbdmp"
        ref={audioRef}
        loop
      >
        <source
          src={process.env.PUBLIC_URL + "/wedding.mp3"}
          type="audio/mp3"
        />
      </audio>
    </>
  );
}

export default App;
