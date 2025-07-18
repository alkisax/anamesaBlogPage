import { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import RenderedEditorJsContent from './RenderedEditorJsContent'
import { useInitEditor } from '../hooks/useInitEditor';
import { handlePageSelect, handleNewPageSubmit } from '../utils/editorHelper';
import CustomPageCreatorComponent from './CustomPageCreatorComponent';


const EditorJs = ({ 
  editorJsData,
  setEditorJsData,
  backEndUrl,
  editorRef,
  setIsPinned,
  pages,
  setPages,
  selectedPage,
  setSelectedPage,
  newPage,
  setNewPage,
  isEditMode=false
}) => {

  const { id } = useParams();

  // ✅ σε χωριστό custom hook μεταφέρθηκε όλη η παραμετροποίηση του editorJs
  useInitEditor(editorRef, backEndUrl);

  useEffect(() => {
    const getpages = async () => {
      const res = await axios.get(`${backEndUrl}/api/subPages`)
      setPages(res.data)
    }
    getpages()
  }, [backEndUrl])

  // 🟧 If in edit mode, fetch post and populate editor
  useEffect(() => {
    const fetchPost = async () => {
      if (isEditMode && id && editorRef.current) {
        console.log("enter edit mode")        
        try {
          const response = await axios.get(`${backEndUrl}/api/posts/${id}`);
          const savedData = response.data.content;
          const savedSubPage = response.data.subPage || '';
          const editor = editorRef.current;

          // Clear and render with existing data
          await editor.isReady;
          editor.render(savedData);
          setSelectedPage(savedSubPage);
          setIsPinned(response.data.pinned || false);

        } catch (error) {
          console.error("Failed to load post for editing:", error);
        }
      }
    };

    fetchPost();
  }, [id, isEditMode, backEndUrl, editorRef, setIsPinned]);

  const selectedPageName = pages.find(p => p._id === selectedPage)?.name || ''

  useEffect(() => {
    setEditorJsData(null);
  }, [setEditorJsData]);

  return (
    <>
      <div>
        <div 
          id="editorjs" 
          style={{ border: '2px solid blue', padding: '4px', minHeight: '300px' }} 
        />
        <div className='btnDiv flex gap-3 mx-3 justify-center'>
          <CustomPageCreatorComponent 
            handlePageSelect={handlePageSelect}
            selectedPage={selectedPage}
            pages={pages}
            newPage={newPage}
            setNewPage={setNewPage}
            handleNewPageSubmit={handleNewPageSubmit}
          />
        </div>
      </div>

      <div>
        <RenderedEditorJsContent
          editorJsData={editorJsData}
          subPageName={selectedPageName}
        />
      </div>
    </>
  )
}
export default EditorJs