import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LESSONS_DATA } from "../data/lessons";
import Sidebar from "../components/Sidebar";
import styles from "../styles/LessonsPage.module.css";

const FILTERS = ["All", "Beginner", "Intermediate", "Advanced"];

export default function LessonsPage() {
  const [filter, setFilter] = useState("All");
  const [userProgress, setUserProgress] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem(`sl_progress_${user?.id || "guest"}`);
    if (stored) setUserProgress(JSON.parse(stored));
  }, [user]);

  const beginnerDone = LESSONS_DATA.filter(
    (l) => l.difficulty === "Beginner"
  ).every((l) => userProgress[l.id]?.completed);

  const intermediateDone = LESSONS_DATA.filter(
    (l) => l.difficulty === "Intermediate"
  ).every((l) => userProgress[l.id]?.completed);

  const isUnlocked = (lesson) => {
    if (!lesson.locked) return true;
    if (lesson.difficulty === "Intermediate") return beginnerDone;
    if (lesson.difficulty === "Advanced") return intermediateDone;
    return false;
  };

  const filtered =
    filter === "All"
      ? LESSONS_DATA
      : LESSONS_DATA.filter((l) => l.difficulty === filter);

  const handleStart = (lesson) => {
    if (!isUnlocked(lesson)) return;
    navigate(`/lessons/${lesson.id}`);
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>All Lessons</h1>
        <p className={styles.pageSub}>Choose a lesson and earn a badge!</p>

        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filtered.map((lesson) => {
            const unlocked = isUnlocked(lesson);
            const completed = userProgress[lesson.id]?.completed;

            return (
              <div
                key={lesson.id}
                className={`${styles.card} ${!unlocked ? styles.locked : ""} ${completed ? styles.completed : ""}`}
              >
                {completed && <div className={styles.completedBadge}>✓ Done</div>}
                <img
                  src={lesson.thumbnail}
                  alt={lesson.title}
                  className={styles.thumb}
                />
                <h3 className={styles.cardTitle}>{lesson.title}</h3>
                <p className={styles.cardMeta}>
                  {lesson.difficulty} · {lesson.duration}
                </p>

                {unlocked ? (
                  <button
                    className={styles.startBtn}
                    onClick={() => handleStart(lesson)}
                  >
                    {completed ? "Review" : "Start"}
                  </button>
                ) : (
                  <button className={styles.lockedBtn} disabled>
                    🔒 {lesson.prerequisite || "Finish first level"}
                  </button>
                )}

                <p className={styles.xpLabel}>+{lesson.xp} XP</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
