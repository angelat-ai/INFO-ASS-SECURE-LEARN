import { useState } from "react";
import styles from "../styles/PasswordStrength.module.css";

function getStrength(password) {
  let score = 0;
  if (!password) return { score: 0, label: "", color: "" };
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "#e53935" };
  if (score === 2) return { score: 2, label: "Fair", color: "#ff9800" };
  if (score === 3) return { score: 3, label: "Good", color: "#8bc34a" };
  if (score >= 4) return { score: 4, label: "Strong", color: "#4caf50" };
}

function generatePassword() {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const nums = "23456789";
  const syms = "!@#$%^&*-_+=?";
  const all = upper + lower + nums + syms;
  let pwd = "";
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += nums[Math.floor(Math.random() * nums.length)];
  pwd += syms[Math.floor(Math.random() * syms.length)];
  for (let i = 0; i < 8; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }
  return pwd
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

export default function PasswordStrength({ password, onSuggest }) {
  const [copied, setCopied] = useState(false);
  const strength = getStrength(password);

  const handleSuggest = () => {
    const pwd = generatePassword();
    onSuggest(pwd);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!password) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.bars}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={styles.bar}
            style={{
              background:
                i <= strength.score ? strength.color : "var(--pink-border)",
            }}
          />
        ))}
        <span className={styles.label} style={{ color: strength.color }}>
          {strength.label}
        </span>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.suggestBtn} onClick={handleSuggest}>
          ✨ Suggest strong password
        </button>
        {password && (
          <button type="button" className={styles.copyBtn} onClick={handleCopy}>
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
        )}
      </div>

      {strength.score < 3 && (
        <ul className={styles.tips}>
          {password.length < 8 && <li>At least 8 characters</li>}
          {!/[A-Z]/.test(password) && <li>Add an uppercase letter</li>}
          {!/[0-9]/.test(password) && <li>Add a number</li>}
          {!/[^A-Za-z0-9]/.test(password) && <li>Add a special character (!@#$...)</li>}
        </ul>
      )}
    </div>
  );
}
