import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import styles from "../styles/OTPPage.module.css";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const email = sessionStorage.getItem("pending_email") || "your email";

  useEffect(() => {
    if (timer === 0) { setCanResend(true); return; }
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError("");
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtp(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter the 6-digit code."); return; }
    setLoading(true);
    try {
      await authAPI.verifyOTP({ email, otp: code });
      navigate("/welcome");
    } catch (err) {
      setError(err.message || "Invalid code. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await authAPI.resendOTP({ email });
      setTimer(45);
      setCanResend(false);
      setError("");
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Failed to resend. Try again.");
    }
  };

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Verify Your Account</h1>
        <p className={styles.sub}>Enter the 6-digit code sent to</p>
        <p className={styles.email}>{email}</p>

        <div className={styles.otpRow} onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`${styles.otpInput} ${digit ? styles.filled : ""}`}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={styles.verifyBtn}
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? <span className={styles.spinner} /> : "Verify Code"}
        </button>

        <button
          className={`${styles.resendBtn} ${canResend ? styles.active : ""}`}
          onClick={handleResend}
          disabled={!canResend}
        >
          {canResend
            ? "Resend code"
            : `Resend code ( ${pad(Math.floor(timer / 60))}:${pad(timer % 60)} )`}
        </button>
      </div>

      <div className={styles.cloudsRow}>
        {[...Array(6)].map((_, i) => (
          <img
            key={i}
            src="/assets/cloud.png"
            alt=""
            className={styles.cloud}
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
}
