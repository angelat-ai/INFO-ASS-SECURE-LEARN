import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RARITY_COLORS } from "../data/badges";
import styles from "../styles/BadgeEarnedPage.module.css";

function BadgeAnimation({ badge }) {
  const imgRef = useRef(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    el.style.transform = "scale(0) rotate(-20deg)";
    el.style.opacity = "0";
    setTimeout(() => {
      el.style.transition = "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease";
      el.style.transform = "scale(1) rotate(0deg)";
      el.style.opacity = "1";
    }, 200);
  }, [badge]);

  return (
    <div className={styles.badgeAnimWrap}>
      <div className={styles.glowRing} style={{ boxShadow: `0 0 60px 20px ${RARITY_COLORS[badge?.rarity] || "#e91e8c"}44` }} />
      <img ref={imgRef} src={badge?.image} alt={badge?.name} className={styles.badgeAnimImg} />
    </div>
  );
}

export default function BadgeEarnedPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const badges = state?.badges || [];

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
        ← back
      </button>

      <div className={styles.content}>
        <h1 className={styles.title}>You Earned The Badge</h1>
        <p className={styles.subtitle}>Congratulations, champion! 🏆</p>

        <div className={styles.badgesList}>
          {badges.map((badge, i) => (
            <div
              key={badge.id}
              className={styles.badgeCard}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <BadgeAnimation badge={badge} />
              <div className={styles.badgeInfo}>
                <p
                  className={styles.badgeName}
                  style={{ color: RARITY_COLORS[badge.rarity] }}
                >
                  {badge.name}
                </p>
                <p className={styles.badgeDesc}>{badge.description}</p>
                <span
                  className={styles.rarityTag}
                  style={{ background: RARITY_COLORS[badge.rarity] + "22", color: RARITY_COLORS[badge.rarity] }}
                >
                  {badge.rarity?.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          className={styles.proceedBtn}
          onClick={() => navigate("/dashboard")}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
