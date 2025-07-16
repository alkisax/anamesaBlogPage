import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Homepage from './pages/Homepage'
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts'
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

          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
