import "./styles/adminSkeleton.css";

const AdminSkeleton = ({ darkMode }) => {
  return (
    <section className={`admin-skeleton ${darkMode ? "dark-mode" : ""}`}>
      <header className="skeleton-navbar">
        <div className="skeleton-logo shimmer"></div>
        <div className="skeleton-search shimmer"></div>
        <div className="skeleton-icons">
          <div className="skeleton-icon shimmer"></div>
          <div className="skeleton-avatar shimmer"></div>
        </div>
      </header>

      <section className="admin-container">
        <aside className="skeleton-sidebar">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="skeleton-sidebar-link shimmer"></div>
          ))}
        </aside>

        <main className="skeleton-main-content">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="skeleton-card shimmer"></div>
          ))}
        </main>
      </section>
    </section>
  );
};

export default AdminSkeleton;
