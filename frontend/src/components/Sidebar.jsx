import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Sidebar.module.css";

const navItems = [
  { to: "/dashboard", icon: "🏠", label: "Home" },
  { to: "/lessons", icon: "📚", label: "Lessons" },
  { to: "/badges", icon: "🏅", label: "Badges" },
  { to: "/settings", icon: "⚙️", label: "Settings" },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoMark}>
        <img src="/assets/logo-icon.png" alt="SL" className={styles.logoIcon} />
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
            title={item.label}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
        <span className={styles.navIcon}>🚪</span>
        <span className={styles.navLabel}>Logout</span>
      </button>
    </aside>
  );
}
