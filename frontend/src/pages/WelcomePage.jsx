import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/WelcomePage.module.css";

const features = [
  { icon: "📖", text: "Learn at your own pace" },
  { icon: "🧪", text: "Hands-on real world labs" },
  { icon: "🧠", text: "Test your knowledge" },
  { icon: "🏆", text: "Earn XP and unlock badges" },
];

export default function WelcomePage() {
  const navigate = useNavigate();
  const itemsRef = useRef([]);
  const heroRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.style.opacity = "0";
      heroRef.current.style.transform = "scale(0.85)";
      setTimeout(() => {
        heroRef.current.style.transition = "opacity 0.7s ease, transform 0.7s ease";
        heroRef.current.style.opacity = "1";
        heroRef.current.style.transform = "scale(1)";
      }, 100);
    }

    if (rightRef.current) {
      rightRef.current.style.opacity = "0";
      rightRef.current.style.transform = "translateX(40px)";
      setTimeout(() => {
        rightRef.current.style.transition = "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s";
        rightRef.current.style.opacity = "1";
        rightRef.current.style.transform = "translateX(0)";
      }, 100);
    }

    itemsRef.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateX(30px)";
      setTimeout(() => {
        el.style.transition = `opacity 0.5s ease ${0.4 + i * 0.12}s, transform 0.5s ease ${0.4 + i * 0.12}s`;
        el.style.opacity = "1";
        el.style.transform = "translateX(0)";
      }, 100);
    });
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div ref={heroRef} className={styles.heroWrap}>
          <img
            src="/assets/shield-check.png"
            alt="SecureLearn Shield"
            className={styles.shieldImg}
          />
        </div>
      </div>

      <div className={styles.rightPanel} ref={rightRef}>
        <div className={styles.content}>
          <h1 className={styles.title}>Welcome to SecureLearn!</h1>
          <p className={styles.subtitle}>
            You&apos;re all set to start your cybersecurity journey.
          </p>

          <ul className={styles.featureList}>
            {features.map((f, i) => (
              <li
                key={i}
                ref={(el) => (itemsRef.current[i] = el)}
                className={styles.featureItem}
              >
                <span className={styles.featureIcon}>{f.icon}</span>
                <span className={styles.featureText}>{f.text}</span>
              </li>
            ))}
          </ul>

          <button
            className={styles.beginBtn}
            onClick={() => navigate("/nickname")}
          >
            Let&apos;s Begin
          </button>
        </div>
      </div>
    </div>
  );
}
