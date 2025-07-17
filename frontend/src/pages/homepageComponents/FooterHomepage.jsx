import { useNavigate } from "react-router-dom";

function FooterHomepage() {

  const navigate = useNavigate();

  // Navigation handler for Dashboard
  const navigateToDashboard = () => {
    const storedAdmin = localStorage.getItem("admin");
    const adminData = storedAdmin ? JSON.parse(storedAdmin) : null;
    if (adminData && adminData.roles.includes("admin")) {
      navigate("/dashboard"); // Admin -> dashboard
    } else {
      navigate("/login"); // Not admin -> login
    }
  };

  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 flex justify-center">
        <button
          onClick={navigateToDashboard}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Dashboard
        </button>
      </footer>
    </>
  );
}

export default FooterHomepage;
