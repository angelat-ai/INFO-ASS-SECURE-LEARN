import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import styles from "../styles/BadgesPage.module.css";
import { BADGES_DATA } from "../data/badges";

export default function BadgesPage() {
  const [earnedBadgeIds, setEarnedBadgeIds] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("sl_earned_badges") || "[]");
    setEarnedBadgeIds(stored);
  }, []);

  return (
    <div className="dashboardLayout">
      <Sidebar />
      <div className="mainContent">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Your Badges</h1>
            <p>Collect them all by completing lessons and scoring perfectly!</p>
          </div>

          <div className={styles.badgesGrid}>
            {BADGES_DATA.map((badge) => {
              const isEarned = earnedBadgeIds.includes(badge.id);
              return (
                <div key={badge.id} className={`${styles.badgeCard} ${!isEarned ? styles.locked : ""}`}>
                  <img 
                    src={badge.image} 
                    alt={badge.name} 
                    className={styles.badgeIcon} 
                    onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Badge&background=ffb6c1&color=fff'; }} 
                  />
                  <div className={styles.badgeName}>{badge.name}</div>
                  <div className={styles.badgeDesc}>{badge.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
