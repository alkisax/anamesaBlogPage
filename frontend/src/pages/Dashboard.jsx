import {useNavigate} from "react-router-dom";
// import { useRef } from 'react';
import { useState } from 'react';
import EditorJs from "../components/EditorJs";
import LeftSidebarDashboard from "../components/LeftSidebarDashboard";
import { handlePreview, handleSubmit, handlePageSelect, handleNewPageSubmit } from "../utils/editorHelper"
import { useParams } from 'react-router-dom';

function Dashboard({
  editorJsData,
  setEditorJsData,
  backEndUrl,
  editorRef,
  isEditMode=false
}) {
  
  // // χρειάζομαι μια μεταβλητή για να φορτωσω το Instance απο τον κειμενογράφο
  // const editorRef = useRef(null);

  // Προσθήκη λογικής για custom pages
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [newPage, setNewPage] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const { id } = useParams();
  
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
            id={id}
            handlePageSelect={handlePageSelect}
            handleNewPageSubmit={handleNewPageSubmit}
            pages={pages}
            setPages={setPages}
            newPage={newPage}
            setNewPage={setNewPage}
            setSelectedPage={setSelectedPage}
          />          
        </div>

        <div className="flex-1 p-4">
          <EditorJs 
            id={id}
            editorJsData={editorJsData} 
            setEditorJsData={setEditorJsData}
            backEndUrl={backEndUrl}
            editorRef={editorRef}
            setIsPinned={setIsPinned}
            pages={pages}
            setPages={setPages}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            isEditMode={isEditMode}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
