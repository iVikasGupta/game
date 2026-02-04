import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside style={{ width: "220px", background: "#1a1a2e", color: "white", minHeight: "100vh", padding: "22px" }}>
      <h3 style={{ marginBottom: "30px" }}>🏭 Factory Admin</h3>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "15px" }}>
            <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
              🏠 Dashboard
            </Link>
          </li>
          <li style={{ marginBottom: "15px" }}>
            <Link to="/admin/users" style={{ color: "white", textDecoration: "none" }}>
              👤 Users
            </Link>
          </li>
          <li style={{ marginBottom: "15px" }}>
            <Link to="/admin/groups" style={{ color: "white", textDecoration: "none" }}>
              👥 Groups
            </Link>
          </li>
          <li style={{ marginBottom: "15px" }}>
            <Link to="/admin/results" style={{ color: "white", textDecoration: "none" }}>
              📊 Results
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
