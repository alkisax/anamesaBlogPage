import EditorJs from '../components/EditorJs';

const EditBlogPost = ({ editorJsData, setEditorJsData, backEndUrl}) => {

  return (
    <>

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