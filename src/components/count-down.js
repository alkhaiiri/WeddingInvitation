import React, { useEffect, useState } from "react";
import translations from "./translations";

function Countdown({ targetDate, lang }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div className="count_down">
      <div
        className="item animate__animated animate__bounceInUp animate__slower"
        data-days="00"
      >
        {days} <span>{translations[lang].day}</span>
      </div>
      <div
        className="item animate__animated animate__bounceInUp animate__slower"
        data-hours="00"
      >
        {hours} <span>{translations[lang].hour}</span>
      </div>
      <div
        className="item animate__animated animate__bounceInUp animate__slower"
        data-minutes="00"
      >
        {minutes} <span>{translations[lang].minute}</span>
      </div>
      <div
        className="item animate__animated animate__bounceInUp animate__slower"
        data-seconds="00"
      >
        {seconds} <span>{translations[lang].second}</span>
      </div>
    </div>
  );
}

export default Countdown;
