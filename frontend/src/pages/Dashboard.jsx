import {useNavigate} from "react-router-dom";
import EditorJs from "../components/EditorJs";

function Dashboard({ editorJsData, setEditorJsData, backEndUrl }) {
  
  const navigate = useNavigate()
  const navigateToPosts = () => {
    navigate("/posts")
  }
  const navigateToUploads = () => {
    navigate("/uploads")
  }

  return (
    <>
      <div>
        <h3>View all posts</h3>
        <div className='btnDiv flex gap-3 mx-3 justify-center'>
          <button onClick={navigateToPosts}>
            Posts
          </button>
        </div>
      </div>

      <EditorJs 
        editorJsData={editorJsData} 
        setEditorJsData={setEditorJsData}
        backEndUrl={backEndUrl}
      />
      <br />
      <p>!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi minus illum nisi est? At quisquam id nulla molestias delectus, rerum quas provident illo corrupti dolor minus, sint vero obcaecati incidunt?</p>
      <br />
      <button onClick={navigateToUploads}>
        Uploaded Files
      </button>
    </>
  );
}

export default Dashboard;
