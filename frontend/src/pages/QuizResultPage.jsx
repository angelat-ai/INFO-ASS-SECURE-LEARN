import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LESSONS_DATA } from "../data/lessons";
import { BADGES_DATA } from "../data/badges";
import styles from "../styles/QuizResultPage.module.css";

function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 12 + 6,
      h: Math.random() * 6 + 4,
      color: ["#e91e8c","#f06292","#fce4ec","#ff9800","#4caf50","#2196f3","#9c27b0","#ffeb3b"][Math.floor(Math.random() * 8)],
      rot: Math.random() * 360,
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 3 + 2,
      vr: Math.random() * 4 - 2,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });
      animId = requestAnimationFrame(draw);
    };

    draw();
    const stop = setTimeout(() => cancelAnimationFrame(animId), 5000);
    return () => { cancelAnimationFrame(animId); clearTimeout(stop); };
  }, []);

  return <canvas ref={canvasRef} className={styles.confettiCanvas} />;
}

export default function QuizResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { user } = useAuth();
  const [showConfetti, setShowConfetti] = useState(true);

  const { score = 0, total = 5, pct = 0 } = location.state || {};
  const lesson = LESSONS_DATA.find((l) => l.id === Number(lessonId));
  const earnedBadges = BADGES_DATA.filter((b) => b.trigger?.lessonId === Number(lessonId));

  useEffect(() => {
    if (!lesson) return;
    const userId = user?.id || "guest";
    const stored = JSON.parse(localStorage.getItem(`sl_progress_${userId}`) || "{}");
    const xpEarned = pct === 100 ? lesson.xp + 20 : Math.round(lesson.xp * (pct / 100));
    stored[lesson.id] = { completed: true, score: pct, xp: xpEarned, completedAt: new Date().toISOString() };

    const currentXP = parseInt(localStorage.getItem(`sl_xp_${userId}`) || "0");
    localStorage.setItem(`sl_xp_${userId}`, currentXP + xpEarned);
    localStorage.setItem(`sl_progress_${userId}`, JSON.stringify(stored));

    if (earnedBadges.length > 0) {
      const storedBadges = JSON.parse(localStorage.getItem(`sl_badges_${userId}`) || "[]");
      earnedBadges.forEach((b) => {
        if (!storedBadges.includes(b.id)) storedBadges.push(b.id);
      });
      localStorage.setItem(`sl_badges_${userId}`, JSON.stringify(storedBadges));
    }

    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const xpEarned = pct === 100 ? (lesson?.xp || 30) + 20 : Math.round((lesson?.xp || 30) * (pct / 100));
  const circumference = 2 * Math.PI * 54;
  const strokeDash = circumference - (pct / 100) * circumference;

  const nextLesson = LESSONS_DATA.find((l) => l.id === Number(lessonId) + 1);

  return (
    <div className={styles.page}>
      {showConfetti && <Confetti />}

      <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
        ← back
      </button>

      <div className={styles.content}>
        <h1 className={styles.title}>
          {pct === 100 ? "Perfect Score! 🎉" : pct >= 60 ? "Great Job! 🌟" : "Keep Going! 💪"}
        </h1>

        <div className={styles.circleWrap}>
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r="54" fill="none" stroke="#fce4ec" strokeWidth="10" />
            <circle
              cx="65" cy="65" r="54"
              fill="none"
              stroke={pct === 100 ? "#4caf50" : "var(--pink-deep)"}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDash}
              strokeLinecap="round"
              transform="rotate(-90 65 65)"
              style={{ transition: "stroke-dashoffset 1.2s ease" }}
            />
          </svg>
          <span className={styles.pctText}>{pct}%</span>
        </div>

        <p className={styles.subText}>
          Amazing work, {user?.nickname || "User"}!
        </p>
        <p className={styles.subText}>You&apos;ve earned</p>
        <p className={styles.xpEarned}>+{xpEarned}</p>

        {earnedBadges.length > 0 && (
          <div className={styles.badgesRow}>
            {earnedBadges.map((b) => (
              <div key={b.id} className={styles.badgeItem}>
                <img src={b.image} alt={b.name} className={styles.badgeImg} />
                <div>
                  <p className={styles.badgeName}>{b.name}</p>
                  <p className={styles.badgeSub}>New badge unlocked</p>
                </div>
              </div>
            ))}
            <div className={styles.badgeItem}>
              <img src={lesson?.thumbnail} alt="lesson" className={styles.badgeImg} />
              <div>
                <p className={styles.badgeName}>Lesson completed</p>
                <p className={styles.badgeSub}>{lesson?.title}</p>
              </div>
            </div>
          </div>
        )}

        <div className={styles.btnRow}>
          <button
            className={styles.dashBtn}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
          {nextLesson && (
            <button
              className={styles.nextBtn}
              onClick={() => navigate(`/lessons/${nextLesson.id}`)}
            >
              Next Lesson
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
