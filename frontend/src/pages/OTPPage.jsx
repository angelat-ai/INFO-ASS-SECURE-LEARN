import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/OTPPage.module.css";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const inputs = useRef([]);
  const navigate = useNavigate();
  const { login } = useAuth();
  const email = sessionStorage.getItem("pending_email") || "your email";

  useEffect(() => {
    const stored = sessionStorage.getItem("dev_otp");
    if (stored) setDevOtp(stored);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
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
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const next = [...otp];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtp(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.verifyOTP({ email, otp: code });
      login(res.user, res.access);
      sessionStorage.removeItem("dev_otp");
      sessionStorage.removeItem("pending_email");
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
      const res = await authAPI.resendOTP({ email });
      if (res.dev_otp) {
        setDevOtp(res.dev_otp);
        sessionStorage.setItem("dev_otp", res.dev_otp);
      }
      setTimer(45);
      setCanResend(false);
      setError("");
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Failed to resend. Try again.");
    }
  };

  const fillOtp = () => {
    if (!devOtp) return;
    const digits = devOtp.split("");
    setOtp(digits);
  };

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Verify Your Account</h1>
        <p className={styles.sub}>Enter the 6-digit code sent to</p>
        <p className={styles.email}>{email}</p>

        {devOtp && (
          <div
            style={{
              background: "#1a1a2e",
              border: "1px dashed #f0c040",
              borderRadius: "8px",
              padding: "10px 16px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#aaa", fontSize: "11px", marginBottom: "4px" }}>
              DEV MODE — Your OTP
            </p>
            <p
              style={{
                color: "#f0c040",
                fontSize: "22px",
                fontWeight: "bold",
                letterSpacing: "6px",
              }}
            >
              {devOtp}
            </p>
            <button
              onClick={fillOtp}
              style={{
                marginTop: "6px",
                background: "transparent",
                border: "1px solid #f0c040",
                color: "#f0c040",
                borderRadius: "4px",
                padding: "3px 12px",
                cursor: "pointer",
                fontSize: "11px",
              }}
            >
              Auto-fill
            </button>
          </div>
        )}

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
