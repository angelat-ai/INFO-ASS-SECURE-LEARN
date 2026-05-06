import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import styles from "../styles/LoginPage.module.css";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "", remember: false });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      requestAnimationFrame(() => {
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const data = await authAPI.login({
        username: form.username,
        password: form.password,
      });
      login(data.user, data.access);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.logoWrap}>
          <img src="/assets/login-logo.png" alt="SecureLearn Logo" className={styles.logo} />
        </div>
        <div className={styles.bowDecor}>
          <img src="/assets/bow.png" alt="" className={styles.bow} />
        </div>
      </div>

      <div className={styles.rightPanel} ref={containerRef}>
        <div className={styles.bowTopRight}>
          <img src="/assets/bow.png" alt="" className={styles.bowSmall} />
        </div>

        <div className={styles.formBox}>
          <div className={styles.heading}>
            <h1 className={styles.welcomeText}>Welcome</h1>
            <p className={styles.subtitle}>Log in to start learning</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label className={styles.label}>Username or Email</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className={styles.input}
                placeholder=""
                autoComplete="username"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.passWrap}>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder=""
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPass((s) => !s)}
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-pink, #e91e63)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-pink, #e91e63)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.row}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span>Remember me</span>
              </label>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              className={styles.loginBtn}
              disabled={loading}
            >
              {loading ? <span className={styles.spinner} /> : "Log In"}
            </button>

            <Link to="/login" className={styles.forgotLink}>
              Forgot password?
            </Link>

            <p className={styles.signupPrompt}>
              Don&apos;t have an account?{" "}
              <Link to="/signup" className={styles.signupLink}>
                sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
