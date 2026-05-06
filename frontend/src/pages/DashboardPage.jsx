import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userAPI, lessonAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
import styles from "../styles/DashboardPage.module.css";

const avatarMap = {
  angel: "/assets/avatar-angel.png",
  kurt: "/assets/avatar-kurt.png",
  sheena: "/assets/avatar-sheena.png",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([userAPI.getProgress(), lessonAPI.getAll()])
      .then(([prog, les]) => {
        setProgress(prog);
        setLessons(les.slice(0, 2));
      })
      .catch(() => {
        setProgress({ total_xp: 0, day_streak: 0, badges_earned: 0, quiz_avg: 0, lessons_completed: 0, total_lessons: 10, level: 1 });
        setLessons([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const xpForLevel = 300;
  const currentXP = progress?.total_xp || 0;
  const xpPercent = Math.min((currentXP % xpForLevel) / xpForLevel * 100, 100);
  const lessonPercent = progress ? Math.round((progress.lessons_completed / progress.total_lessons) * 100) : 0;

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.logoRow}>
              <img src="/assets/logo-icon.png" alt="" className={styles.headerLogo} />
              <span className={styles.headerBrand}>SecureLearn</span>
            </div>
            <h2 className={styles.greeting}>
              Hi, {user?.nickname || user?.username || "User"}!
            </h2>
            <p className={styles.greetingSub}>Keep Learning, keep growing</p>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.levelBox}>
              <div className={styles.levelTop}>
                <span className={styles.levelText}>Level {progress?.level || 1}</span>
                <span className={styles.xpText}>{currentXP} XP</span>
              </div>
              <div className={styles.xpBarWrap}>
                <div
                  className={styles.xpBar}
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
            <img
              src={avatarMap[user?.avatar] || avatarMap.angel}
              alt="avatar"
              className={styles.avatarImg}
            />
          </div>
        </header>

        {loading ? (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
          </div>
        ) : (
          <>
            <section className={styles.progressCard}>
              <h3 className={styles.cardTitle}>Your Progress</h3>
              <div className={styles.progressBarWrap}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${lessonPercent}%` }}
                />
              </div>
              <div className={styles.progressMeta}>
                <span>{progress?.lessons_completed || 0} / {progress?.total_lessons || 10} Lessons Completed</span>
                <span>{lessonPercent}%</span>
              </div>
            </section>

            <section className={styles.statsRow}>
              {[
                { label: "Total XP", value: progress?.total_xp || 0 },
                { label: "Day Streak", value: progress?.day_streak || 0 },
                { label: "Badges Earned", value: progress?.badges_earned || 0 },
                { label: "Quiz Avg", value: `${progress?.quiz_avg || 0}%` },
              ].map((stat) => (
                <div key={stat.label} className={styles.statItem}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </section>

            <section className={styles.startSection}>
              <h3 className={styles.sectionTitle}>Start Learning</h3>
              <div className={styles.lessonGrid}>
                {lessons.map((lesson) => (
                  <div key={lesson.id} className={styles.lessonCard}>
                    <img
                      src={lesson.thumbnail || "/assets/webgoat-thumb.png"}
                      alt={lesson.title}
                      className={styles.lessonThumb}
                    />
                    <p className={styles.lessonTitle}>{lesson.title}</p>
                    <p className={styles.lessonMeta}>
                      {lesson.difficulty} · {lesson.duration}
                    </p>
                    <button
                      className={styles.studyBtn}
                      onClick={() => navigate(`/lessons/${lesson.id}`)}
                    >
                      Study
                    </button>
                  </div>
                ))}
                {lessons.length === 0 && (
                  <div className={styles.lessonCard}>
                    <img src="/assets/webgoat-thumb.png" alt="WebGoat" className={styles.lessonThumb} />
                    <p className={styles.lessonTitle}>What is WEBGOAT?</p>
                    <p className={styles.lessonMeta}>Beginner · 15 min</p>
                    <button className={styles.studyBtn} onClick={() => navigate("/lessons")}>Study</button>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
