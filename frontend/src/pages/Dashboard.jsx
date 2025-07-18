import {useNavigate} from "react-router-dom";
import { useRef, useState } from 'react';
import EditorJs from "../components/EditorJs";
import LeftSidebarDashboard from "../components/LeftSidebarDashboard";
import { handlePreview, handleSubmit, handlePageSelect, handleNewPageSubmit } from "../utils/editorHelper"

function Dashboard({ editorJsData, setEditorJsData, backEndUrl, isEditMode=false }) {
  // χρειάζομαι μια μεταβλητή για να φορτωσω το Instance απο τον κειμενογράφο
  const editorRef = useRef(null);
  // Προσθήκη λογικής για custom pages
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [newPage, setNewPage] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  
  const navigate = useNavigate()
  const navigateToPosts = () => {
    navigate("/posts")
  }
  const navigateToUploads = () => {
    navigate("/uploads")
  }

  return (
    <>
      <div className="flex min-h-screen flex-col sm:flex-row">

        <div 
          className="
            flex-shrink-0 
            w-full md:max-w-44 sm:w-44
            sm:min-h-screen
          "
        >
          <LeftSidebarDashboard 
            navigateToPosts={navigateToPosts}
            navigateToUploads={navigateToUploads}
            editorJsData={editorJsData} 
            setEditorJsData={setEditorJsData}
            editorRef={editorRef}
            handlePreview={handlePreview}
            handleSubmit={handleSubmit}
            backEndUrl={backEndUrl}
            selectedPage={selectedPage}
            isPinned={isPinned}
            setIsPinned={setIsPinned}
            isEditMode={isEditMode}
            // id={id}
            handlePageSelect={handlePageSelect}
            handleNewPageSubmit={handleNewPageSubmit}
            pages={pages}
            newPage={newPage}
            setNewPage={setNewPage}
          />          
        </div>

        <div className="flex-1 p-4">
          <EditorJs 
            editorJsData={editorJsData} 
            setEditorJsData={setEditorJsData}
            backEndUrl={backEndUrl}
            editorRef={editorRef}
            setIsPinned={setIsPinned}
            pages={pages}
            setPages={setPages}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            newPage={newPage}
            setNewPage={setNewPage}
            isEditMode={isEditMode}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
