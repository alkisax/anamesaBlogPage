import { useState } from 'react'
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

function App() {
  const [editorJsData, setEditorJsData] = useState({})

  const backEndUrl = 'http://localhost:3001'

  return (
    <>
      <BrowserRouter>

        
          <Routes>
            {/* Parent route with Layout */}
            <Route element={<Layout backEndUrl={backEndUrl} />}>

            <Route 
              path="/" 
              element={<Homepage 
                editorJsData={editorJsData} 
                setEditorJsData={setEditorJsData}
                backEndUrl={backEndUrl}
              />}
            />

            <Route 
              path="/dashboard" 
              element={<Dashboard 
                editorJsData={editorJsData} 
                setEditorJsData={setEditorJsData}
                backEndUrl={backEndUrl}
              />}
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
              />}
            />

            <Route 
              path="/edit/:id" 
              element={<EditBlogPost
                editorJsData={editorJsData}
                setEditorJsData={setEditorJsData}
                backEndUrl={backEndUrl}
                isEditMode={true}
              />}
            />

            <Route 
              path="/uploads" 
              element={<UploadedFiles 
                backEndUrl={backEndUrl}
              />} 
            />

            <Route
              path="/:name"
              element={<Subpage 
                backEndUrl={backEndUrl}
              />}
            />
            </Route>
          </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
