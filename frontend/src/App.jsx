import { useState } from 'react'
import { useRef } from 'react';
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./layouts/Layout";
import Homepage from './pages/HomePage'
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts'
import Subpage from './pages/Subpage'
import BlogPost from './pages/BlogPost';
import EditBlogPost from './pages/EditBlogPost';
import UploadedFiles from './pages/UploadedFiles'

import useAuth from "./hooks/useAuth"
import LoginForm from './service/login/LoginForm';
import ProtectedRoute from './service/login/ProtectedRoute'

const App = () => {

  // χρειάζομαι μια μεταβλητή για να φορτωσω το Instance απο τον κειμενογράφο
  const editorRef = useRef(null);
  const [editorJsData, setEditorJsData] = useState({})
 
  // const backEndUrl = 'http://localhost:3001'
  const backEndUrl = 'https://anamesa.onrender.com'
  
  const {
    admin,
    username,
    password,
    setUsername,
    setPassword,
    handleLogin,
    handleLogout,
    message,
  } = useAuth(backEndUrl); //custom hook με ολες τις λειτουργίες του login

  const isAdmin = admin?.roles?.includes("admin");
  // if (isAdmin !== null) console.log("App: is admin?", isAdmin)
  // else console.log("App: is admin? no")

  return (
    <>
      <Routes>
        {/* Parent route with Layout */}
        {/* αυτό το  route δεν τελειώνει εδω αλλα περικλύει όλα τα υπόλοιπα */}
        <Route element={
          <Layout 
            backEndUrl={backEndUrl}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            isAdmin={isAdmin}
            admin={admin}
          />
        }> 

          <Route 
            path="/" 
            element={<Homepage 
              editorJsData={editorJsData} 
              setEditorJsData={setEditorJsData}
              backEndUrl={backEndUrl}
              admin={admin}
            />}
          />

          <Route 
            path="/dashboard" 
            element={
              <>
                <ProtectedRoute admin={admin} requiredRole="admin">
                  <Dashboard 
                    editorJsData={editorJsData} 
                    setEditorJsData={setEditorJsData}
                    backEndUrl={backEndUrl}
                    handleLogout={handleLogout}
                    message={message}
                    editorRef={editorRef}
                  />
                </ProtectedRoute>         
              </>
            }
          />

          <Route
            path="/posts"
            element={<Posts 
              backEndUrl={backEndUrl}
            />}
          />

          <Route 
            path="/posts/:id" 
            element={<BlogPost 
              backEndUrl={backEndUrl}
              admin={admin}
            />}
          />

          <Route 
            path="/edit/:id" 
            element={<Dashboard
              editorJsData={editorJsData}
              setEditorJsData={setEditorJsData}
              backEndUrl={backEndUrl}
              isEditMode={true}
              editorRef={editorRef}

            />}
          />

          <Route 
            path="/uploads" 
            element={<UploadedFiles 
              backEndUrl={backEndUrl}
            />} 
          />

          <Route path="/login" element={
            <>
              <LoginForm 
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                handleLogin={handleLogin}
                url={backEndUrl}
              />
            </>
          } />

          <Route
            path="/:name"
            element={<Subpage 
              backEndUrl={backEndUrl}
            />}
          />

        </Route>
      </Routes>
    </>
  )
}

export default App
