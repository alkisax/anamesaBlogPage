import { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate  } from 'react-router-dom';

const UploadedFiles = ({ backEndUrl }) => {
  const [files, setFiles] = useState([])

  useEffect(() => {
    const getUploads = async () => {
      try {
        const res = await axios.get (`${backEndUrl}/api/uploads`)
        setFiles(res.data)
      } catch (err) {
        console.error('Error fetching uploads', err);
      }
    }
    getUploads()
  },[backEndUrl])
 
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/');
  }

  return (
    <>
      <button
        onClick={navigateToHome}
        className='bg-blue-500 text-white px-4 py-2 rounded'
      >home</button>
      <div className="p-4">
        <h1 className="text-xl mb-4">Uploaded files</h1>
        <ul>
          {files.map(file => (
            <li key={file._id} className="mb-2">
              <a 
                href={`${backEndUrl}/uploads/${file.file?.filename}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {file.name} ({file.file?.contentType})
              </a>
            </li>
          ))}
        </ul>

      </div>
    </>
  )
}

export default UploadedFiles