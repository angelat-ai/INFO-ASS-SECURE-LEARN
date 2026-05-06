import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import styles from "../styles/NicknamePage.module.css";

const avatars = [
  { id: "angel", src: "/assets/avatar-angel.png", name: "Angel" },
  { id: "kurt", src: "/assets/avatar-kurt.png", name: "Kurt" },
  { id: "sheena", src: "/assets/avatar-sheena.png", name: "Sheena" },
];

export default function NicknamePage() {
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("angel");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 80);
    }
  }, []);

  const handleSubmit = async () => {
    if (!nickname.trim()) { setError("Please enter a nickname."); return; }
    if (nickname.trim().length < 2) { setError("Nickname must be at least 2 characters."); return; }
    setLoading(true);
    try {
      const data = await authAPI.setNickname({ nickname: nickname.trim(), avatar: selectedAvatar });
      updateUser({ nickname: nickname.trim(), avatar: selectedAvatar });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to save nickname.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.avatarShowcase}>
          {avatars.map((av) => (
            <img
              key={av.id}
              src={av.src}
              alt={av.name}
              className={`${styles.showcaseChar} ${selectedAvatar === av.id ? styles.active : ""}`}
            />
          ))}
          <img src="/assets/cloud.png" alt="" className={styles.cloudDecor} />
        </div>
      </div>

      <div className={styles.rightPanel} ref={containerRef}>
        <div className={styles.card}>
          <h1 className={styles.title}>What Should we call you?</h1>
          <p className={styles.subtitle}>This helps us personalize your experience</p>

          <div className={styles.field}>
            <label className={styles.label}>Your Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => { setNickname(e.target.value); setError(""); }}
              className={styles.input}
              placeholder=""
              maxLength={24}
              autoFocus
            />
            <p className={styles.hint}>You can change this anytime in settings.</p>
          </div>

          <div className={styles.avatarSection}>
            <p className={styles.avatarLabel}>Choose your avatar</p>
            <div className={styles.avatarGrid}>
              {avatars.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  className={`${styles.avatarBtn} ${selectedAvatar === av.id ? styles.selected : ""}`}
                  onClick={() => setSelectedAvatar(av.id)}
                >
                  <img src={av.src} alt={av.name} className={styles.avatarImg} />
                  <span className={styles.avatarName}>{av.name}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.continueBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <span className={styles.spinner} /> : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
