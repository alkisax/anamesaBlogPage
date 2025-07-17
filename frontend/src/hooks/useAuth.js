import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useAuth = (backEndUrl) => {
  const [admin, setAdmin] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedAdmin = localStorage.getItem("admin");
    if (token && storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    } else {
      setAdmin(false); // Explicitly mark as not logged in
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log("Submitting login...")

    try {
      const response = await axios.post(`${backEndUrl}/api/login`, {
        "username": username,
        "password": password
      })
      console.log("Login successful", response.data)

      const { token, admin } = response.data.data
      localStorage.setItem("token", token)
      localStorage.setItem("admin", JSON.stringify(admin));

      const isAdmin = admin.roles.includes("admin")
      console.log("Is admin?", isAdmin)

      setAdmin(admin);
      setMessage('')
      navigate("/dashboard")
    } catch (error) {
      console.log(error)
      setMessage('Login failed: Invalid username or password')
      setTimeout(() => {
        setMessage('');
      }, 7000); 
      navigate("/")
    }
  }

  // Logout handler
  const handleLogout = () => {
    console.log("logout reached");
    
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setAdmin(null);
    console.log("Logged out successfully");
    navigate("/");
  };

  return {
    admin,
    username,
    password,
    setUsername,
    setPassword,
    handleLogin,
    handleLogout,
    message,
  };
};

export default useAuth;