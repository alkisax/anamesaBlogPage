import { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate  } from 'react-router-dom';

const UploadedFiles = ({ backEndUrl }) => {
  const [files, setFiles] = useState([])

  useEffect(() => {
    const getUploads = async () => {
      try {
        const res = await axios.get (`${backEndUrl}/api/uploads`)
        console.log(res)
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

  const getFileIconOrPreview = (file) => {
    const type = file.file?.contentType;

    if (type?.startsWith("image/")) {
      // ✅ Thumbnail preview for images
      return (
        <img
          src={`${backEndUrl}/uploads/${file.file.filename}`}
          alt={file.name || "image"}
          className="w-16 h-16 object-cover rounded border"
        />
      );
    } else if (type === "application/pdf") {
      return <span className="text-red-500 font-bold text-xl">📄 PDF</span>;
    } else if (type?.includes("word")) {
      return <span className="text-blue-500 font-bold text-xl">📝 Word</span>;
    } else if (type === "text/plain") {
      return <span className="text-gray-700 font-bold text-xl">📃 TXT</span>;
    }
    return <span className="text-gray-500">📎 File</span>;
  };


  return (
    <>
      <button
        onClick={navigateToHome}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Home
      </button>

      <div className="p-4">
        <h1 className="text-xl mb-4">Uploaded Files</h1>

        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Preview</th>
              <th className="border border-gray-300 px-4 py-2">Filename</th>
              <th className="border border-gray-300 px-4 py-2">Link</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => {
              const fileUrl = `${backEndUrl}/uploads/${file.file?.filename}`;
              return (
                <tr key={file._id}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {getFileIconOrPreview(file)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {file.name || file.file?.originalName || "Untitled"}
                    <br />
                    <small className="text-gray-600">
                      {file.file?.contentType}
                    </small>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 break-all">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {fileUrl}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UploadedFiles