import EditorJs from '../components/EditorJs';
import { useNavigate  } from 'react-router-dom';

const EditBlogPost = ({ editorJsData, setEditorJsData, backEndUrl}) => {

  const navigate = useNavigate();

  const navigateToDashboard = () => {
    navigate('/dashboard');
  }

  return (
    <>
      <button
        onClick={navigateToDashboard}
        className='bg-blue-500 text-white px-4 py-2 rounded'
      >Dashboard</button>
      <EditorJs 
        editorJsData={editorJsData} 
        setEditorJsData={setEditorJsData}
        backEndUrl={backEndUrl}
        isEditMode={true}
      />
    </>
  )
}

export default EditBlogPost