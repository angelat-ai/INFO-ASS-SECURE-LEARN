import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LESSONS_DATA } from "../data/lessons";
import styles from "../styles/LessonDetailPage.module.css";

export default function LessonDetailPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = LESSONS_DATA.find((l) => l.id === Number(lessonId));
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  if (!lesson) {
    return (
      <div className={styles.notFound}>
        <p>Lesson not found.</p>
        <button onClick={() => navigate("/lessons")}>Back to Lessons</button>
      </div>
    );
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const estimatedSecs = parseInt(lesson.duration) * 60 || 600;
  const remaining = Math.max(estimatedSecs - elapsed, 0);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/lessons")}>
          ← back
        </button>
        <div className={styles.levelTag}>{lesson.difficulty} · lvl {lesson.level}</div>
        <div className={styles.timerBox}>
          <span className={styles.timerIcon}>⏱</span>
          <span className={styles.timerText}>{formatTime(remaining)} secs</span>
        </div>
        <div className={styles.xpTag}>+{lesson.xp} XP</div>
      </div>

      <div className={styles.content}>
        <h1 className={styles.lessonTitle}>{lesson.title}</h1>
        <p className={styles.lessonSub}>
          Understand how attackers exploit vulnerabilities and how to defend against them.
        </p>

        <div className={styles.progressScroll}>
          <div className={styles.scrollBar} />
        </div>

        <div className={styles.sections}>
          {lesson.content.map((section, i) => (
            <div key={i} className={styles.section}>
              <h2 className={styles.sectionHeading}>{section.heading}</h2>
              <p className={styles.sectionBody}>{section.body}</p>
              {section.source && (
                <a
                  href={section.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.sourceLink}
                >
                  📎 Source: {section.sourceLabel}
                </a>
              )}
            </div>
          ))}
        </div>

        <div className={styles.codeExample}>
          <p className={styles.codeLabel}>Example SQL Query (Vulnerable)</p>
          <pre className={styles.codeBlock}>
            {`SELECT * FROM users\nWHERE username = '[input]'\nAND password = '[input]'`}
          </pre>
        </div>

        <button
          className={styles.quizBtn}
          onClick={() => navigate(`/quiz/${lesson.id}`)}
        >
          I&apos;ve Read This — Take the Quiz
        </button>
      </div>
    </div>
  );
}
