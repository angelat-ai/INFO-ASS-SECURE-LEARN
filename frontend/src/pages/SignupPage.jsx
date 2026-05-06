import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import PasswordStrength from "../components/PasswordStrength";
import styles from "../styles/SignupPage.module.css";

export default function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.style.opacity = "0";
      el.style.transform = "translateX(40px)";
      requestAnimationFrame(() => {
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        el.style.opacity = "1";
        el.style.transform = "translateX(0)";
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError("");
  };

  const handleSuggestPassword = (pwd) => {
    setForm((f) => ({ ...f, password: pwd, confirmPassword: pwd }));
  };

  const validate = () => {
    if (!form.username.trim()) return "Username is required.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      return "Valid email is required.";
    if (form.password.length < 8)
      return "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await authAPI.signup({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      sessionStorage.setItem("pending_email", form.email);
      navigate("/verify-otp");
    } catch (err) {
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.logoWrap}>
          <img src="/assets/logo.png" alt="SecureLearn" className={styles.logo} />
        </div>
      </div>

      <div className={styles.rightPanel} ref={containerRef}>
        <div className={styles.bowTop}>
          <img src="/assets/bow.png" alt="" className={styles.bow} />
        </div>

        <div className={styles.formBox}>
          <div className={styles.heading}>
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Join SecureLearn and start your journey</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className={styles.input}
                autoComplete="username"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
                autoComplete="email"
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
                  autoComplete="new-password"
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
              <PasswordStrength
                password={form.password}
                onSuggest={handleSuggestPassword}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
              <div className={styles.passWrap}>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={styles.input}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowConfirm((s) => !s)}
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-pink, #e91e63)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-pink, #e91e63)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className={styles.matchError}>Passwords do not match</p>
              )}
              {form.confirmPassword && form.password === form.confirmPassword && form.password && (
                <p className={styles.matchOk}>✓ Passwords match</p>
              )}
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              className={styles.signupBtn}
              disabled={loading}
            >
              {loading ? <span className={styles.spinner} /> : "Create Account"}
            </button>

            <p className={styles.loginPrompt}>
              Already have an account?{" "}
              <Link to="/login" className={styles.loginLink}>
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
