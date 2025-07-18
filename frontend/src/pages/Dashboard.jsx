import {useNavigate} from "react-router-dom";
import { useRef } from 'react';
import EditorJs from "../components/EditorJs";
import LeftSidebarDashboard from "../components/LeftSidebarDashboard";
import { handlePreview } from "../utils/editorHelper"

function Dashboard({ editorJsData, setEditorJsData, backEndUrl }) {
  // χρειάζομαι μια μεταβλητή για να φορτωσω το Instance απο τον κειμενογράφο
  const editorRef = useRef(null);
  
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
          />          
        </div>

        <div className="flex-1 p-4">
          {/* <div>
            <h3>View all posts</h3>
            <div className='btnDiv flex gap-3 mx-3 justify-center'>
              <button onClick={navigateToPosts}>
                Posts
              </button>
            </div>
          </div> */}

          <EditorJs 
            editorJsData={editorJsData} 
            setEditorJsData={setEditorJsData}
            backEndUrl={backEndUrl}
            editorRef={editorRef}
          />
          <br />
          <p>!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi minus illum nisi est? At quisquam id nulla molestias delectus, rerum quas provident illo corrupti dolor minus, sint vero obcaecati incidunt?</p>
          <br />
          <button onClick={navigateToUploads}>
            Uploaded Files
          </button>           
        </div>
       
      </div>

    </>
  );
}

export default Dashboard;
