import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/SettingsPage.module.css";
import Sidebar from "../components/Sidebar";

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [message, setMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      updateUser({ nickname: nickname.trim() });
      setMessage("Nickname updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="dashboardLayout">
      <Sidebar />
      <div className="mainContent">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Settings</h1>
            <p>Manage your profile and learn about the team</p>
          </div>

          <div className={styles.section}>
            <h2>Profile Settings</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Permanent Name (Nickname)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="What should we call you?"
                  required
                />
              </div>
              <button type="submit" className={styles.btn}>Save Changes</button>
              {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
            </form>
          </div>

          <div className={styles.section}>
            <h2>Meet the Developers</h2>
            <div className={styles.teamGrid}>
              <div className={styles.teamCard}>
                <img 
                  src="/assets/angel.png" 
                  alt="Angel Garcia" 
                  className={styles.avatar} 
                  onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Angel+Garcia&background=ffb6c1&color=fff'; }} 
                />
                <div className={styles.teamName}>Angel Garcia</div>
                <div className={styles.teamRole}>Lead Developer</div>
              </div>
              <div className={styles.teamCard}>
                <img 
                  src="/assets/kurt.png" 
                  alt="Kurt Canilang" 
                  className={styles.avatar} 
                  onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Kurt+Canilang&background=ffb6c1&color=fff'; }} 
                />
                <div className={styles.teamName}>Kurt Canilang</div>
                <div className={styles.teamRole}>Developer</div>
              </div>
              <div className={styles.teamCard}>
                <img 
                  src="/assets/sheena.png" 
                  alt="Sheena Deguzman" 
                  className={styles.avatar} 
                  onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Sheena+Deguzman&background=ffb6c1&color=fff'; }} 
                />
                <div className={styles.teamName}>Sheena Deguzman</div>
                <div className={styles.teamRole}>Developer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
