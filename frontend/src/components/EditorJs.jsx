import { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import RenderedEditorJsContent from './RenderedEditorJsContent'
import { useInitEditor } from '../hooks/useInitEditor';

import EditorJS from '@editorjs/editorjs';

const EditorJs = ({ editorJsData, setEditorJsData, backEndUrl, isEditMode=false }) => {
  // χρειάζομαι μια μεταβλητή για να φορτωσω το Instance απο τον κειμενογράφο
  const editorRef = useRef(null);

  // Προσθήκη λογικής για custom pages
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [newPage, setNewPage] = useState('');
  // const [originalImageUrls, setOriginalImageUrls] = useState([]);

  useEffect(() => {
    const getpages = async () => {
      const res = await axios.get(`${backEndUrl}/api/subPages`)
      setPages(res.data)
    }
    getpages()
  }, [backEndUrl])

  const handlePageSelect = (e) => {
    const value = e.target.value
    if (value === '__new__') {
      setSelectedPage('')
    } else {
      setSelectedPage(value)
    }
  }

  const handleNewPageSubmit = async () => {
    if (!newPage) return;
    try {
      const res = await axios.post(`${backEndUrl}/api/subPages`, { name: newPage });
      setPages([...pages, res.data]);
      setSelectedPage(res.data._id);
      setNewPage('');
    } catch (err) {
      console.error('Error creating page', err);
    }
  };

  // ✅ σε χωριστό custom hook μεταφέρθηκε όλη η παραμετροποίηση του editorJs
  useInitEditor(editorRef, backEndUrl);

  const { id } = useParams();

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

          // store original image URLs
          // const initialImageUrls = savedData.blocks
          //   .filter(block => block.type === 'image')
          //   .map(block => block.data.file.url);

          // setOriginalImageUrls(initialImageUrls);
        } catch (error) {
          console.error("Failed to load post for editing:", error);
        }
      }
    };

    fetchPost();
  }, [id, isEditMode, backEndUrl]);


  const handlePreview = async () => {
    const outputData = await editorRef.current.save()
    // localStorage.setItem('editorData', JSON.stringify(outputData));
    setEditorJsData(outputData);
  }

  const handleSubmit = async () => {
    if(editorRef.current) {
      try {
        //  η save() ερχεται απο τον editorjs και επιστρέφει μια υπόσχεση με τα δεδομένα του editor
        const outputData = await editorRef.current.save()
        // localStorage.setItem('editorData', JSON.stringify(outputData));
        setEditorJsData(outputData);
        console.log('Data saved:', outputData);

        if (isEditMode && id) {
          await axios.put(`${backEndUrl}/api/posts/${id}`, {
            content: outputData,
            subPage: selectedPage
          })
          console.log("✅ Post updated");
        } else {
          await axios.post(`${backEndUrl}/api/posts`, {
            content: outputData,
            subPage: selectedPage
          })
          console.log("✅ Post created");
        }

        // για την αποθήκευση στην Mongo        
        // για επιπλέων αποθήκευση εικόνων στην mongoDB ως base64. Τo axios παραπάνω τα σώζει ως λινκ. πχ http://localhost:3001/uploads/image-1751308923423.jpg
        // const imageBlocks = outputData.blocks.filter(block => block.type === 'image')

        // for (const block of imageBlocks) {
        //   const imageUrl = block.data.file.url

          // // ✅ Skip if image already existed in original post
          // if (originalImageUrls.includes(imageUrl)) {
          //   console.log(`Skipping already uploaded image: ${imageUrl}`);
          //   continue;
          // }

          // try {
          //   // 👇 ΠΑΡΕ ΤΗΝ ΕΙΚΟΝΑ ως arraybuffer (BINARY)
          //   const imageResponse = await axios.get(imageUrl, {
          //     responseType: 'arraybuffer'
          //   })

          //   // 👇 Convert binary to Blob/File
          //   const mimeType = block.data.file.mime || 'image/jpeg';
          //   const buffer = imageResponse.data;
          //   const file = new File([buffer], 'editor-image.jpg', { type: mimeType });

          //   // 👇 Upload using FormData (required for multer backend)
          //   const formData = new FormData();
          //   formData.append('image', file);
          //   formData.append('name', block.data.caption || 'Image');
          //   formData.append('desc', block.data.caption || '');

          //   await axios.post(`${backEndUrl}/api/images`, formData)
          //   console.log('✅ Image sent as JSON to MongoDB');
          // } catch (err) {
          //   console.error('❌ Failed to upload image:', err);
          // }
        // }
      } catch (error) {
        console.error("saving failed", error)
      };
    }
  }

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

          {/* Προσθήκη λογικής για custom pages */}
          <div className="w-full max-w-md mx-auto">
            <select 
              onChange={handlePageSelect} 
              value={selectedPage}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a page</option>
              {pages.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
              <option value="__new__">+ Create new page</option>
            </select>

            {selectedPage === '' && (
              <div>
                <input
                  type="text"
                  value={newPage}
                  onChange={e => setNewPage(e.target.value)}
                  placeholder="New page name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  onClick={handleNewPageSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create page
                </button>
              </div>
            )}
          </div>
          

          <button onClick={handlePreview}>
            preview
          </button>
          <button onClick={handleSubmit}>
            submit
          </button>
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