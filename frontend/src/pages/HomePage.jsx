import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Homepage({ backEndUrl }) {
  const [pages, setPages] = useState([]);
  const [_selectedPage, setSelectedPage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch subpages from backend
  useEffect(() => {
    const getPages = async () => {
      try {
        const res = await axios.get(`${backEndUrl}/api/subPages`);
        setPages(res.data);
      } catch (error) {
        console.error("Error fetching subpages:", error);
      }
    };
    getPages();
  }, [backEndUrl]);

  // Navigation handler for Dashboard
  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">My Blog</h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl focus:outline-none"
        >
          ☰
        </button>
      </header>

      {/* Sidebar (shows when menuOpen = true) */}
      {menuOpen && (
        <nav className="absolute top-16 left-0 bg-gray-700 text-white w-48 p-4 rounded shadow-lg">
          <ul className="space-y-2">
            {pages.length === 0 && <li>No subpages found</li>}
            {pages.map((page) => (
              <li
                key={page._id}
                className="cursor-pointer hover:bg-gray-600 p-2 rounded"
                onClick={() => {
                  setSelectedPage(page._id);
                  setMenuOpen(false);
                }}
              >
                {page.title || "Untitled Page"}
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-grow flex justify-center items-center">
        <h2 className="text-2xl">Welcome to the Homepage</h2>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 flex justify-center">
        <button
          onClick={navigateToDashboard}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Dashboard
        </button>
      </footer>
    </div>
  );
}

export default Homepage;
