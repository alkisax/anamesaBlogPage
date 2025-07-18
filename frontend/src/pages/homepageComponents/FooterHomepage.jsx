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
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Dashboard
        </button>
      </footer>
    </>
  );
}

export default FooterHomepage;
