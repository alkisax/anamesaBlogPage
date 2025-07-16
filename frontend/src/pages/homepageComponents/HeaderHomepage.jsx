import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function HeaderHomepage({ backEndUrl }) {
  const [pages, setPages] = useState([]);
  const [_selectedPage, setSelectedPage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch subpages from backend
  useEffect(() => {
    const getPages = async () => {
      try {
        const res = await axios.get(`${backEndUrl}/api/subPages`);
        console.log('fetched subpages', res)
        setPages(res.data);
      } catch (error) {
        console.error("Error fetching subpages:", error);
      }
    };
    getPages();
  }, [backEndUrl]);

  return (
    <div className="w-full">
      {/* Header */}
      <>
        <Link to={`/`}>
            <header className="flex items-center justify-between bg-gray-800 text-white p-4">
            <h1 className="text-xl font-bold">My Blog</h1>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl focus:outline-none"
            >
              ☰
            </button>
          </header>
        </Link>      
      </>


      {/* Sidebar (shows when menuOpen = true) */}
      {menuOpen && (
        <nav className="absolute top-16 left-0 bg-gray-700 text-white w-48 p-4 rounded shadow-lg">
          <ul className="space-y-2">
            {pages.length === 0 && <li>No subpages found</li>}
            {pages.map((page) => (
              <Link to={`/${page.name}`}>
                <li
                  key={page._id}
                  className="cursor-pointer hover:bg-gray-600 p-2 rounded"
                  onClick={() => {
                    setSelectedPage(page._id);
                    setMenuOpen(false);
                  }}
                >
                  {page.name || "Untitled Page"}
                </li> 
              </Link>

            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default HeaderHomepage;
