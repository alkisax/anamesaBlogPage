import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";

const HeaderHomepage = ({ backEndUrl, admin, handleLogout }) => {
  const [pages, setPages] = useState([]);
  const [_selectedPage, setSelectedPage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  // if (admin !== null) console.log("Header: is admin?", admin)
  // else console.log("Header: is admin? no")

  // Fetch subpages from backend
  useEffect(() => {
    const getPages = async () => {
      try {
        const res = await axios.get(`${backEndUrl}/api/subPages`);
        // console.log('fetched subpages', res)
        setPages(res.data);
      } catch (error) {
        console.error("Error fetching subpages:", error);
      }
    };
    getPages();
  }, [backEndUrl]);

  return (
    <div>
      {/* Header */}
      <div
          className="relative flex items-center justify-between bg-gray-800 text-white p-4"
      >
        <h1 
          className="text-xl font-bold"
                      onClick={() => {
              // Navigate to homepage
              navigate("/")
            }}
          >
            <i>[→]</i>
        </h1>
        <div className="relative">

          <button
            onClick={(e) => {
              e.stopPropagation() // Prevent header click from firing
              setMenuOpen(!menuOpen)
            }}
            className="text-2xl focus:outline-none"
          >
            ☰
          </button>            
        </div>

        {/* Sidebar (shows when menuOpen = true) */}
        {menuOpen && (
          <nav 
            className="
              absolute top-full right-0 mt-2 bg-gray-700 text-white w-48 p-4 rounded shadow-lg      
            "
          >
            <ul className="space-y-2">
              {pages.length === 0 && <li>No subpages found</li>}
              {pages.map((page) => (
                <Link to={`/${page.name}`} key={page._id}>
                  <li
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
              {admin && (
                <li
                  className="cursor-pointer hover:bg-gray-600 p-2 rounded"
                  onClick={() => {
                    handleLogout()
                    setMenuOpen(false);
                  }}
                >
                  logout
                </li>
              )}
            </ul>
          </nav>
        )}

      </div>
    </div>
  );
}

export default HeaderHomepage;
