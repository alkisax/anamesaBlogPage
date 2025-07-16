import { useEffect, useState } from "react";
import axios from 'axios';
import { usePagination } from "../hooks/usePagination";
import Pagination from "../components/Pagination";

const UploadedFiles = ({ backEndUrl }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const getUploads = async () => {
      try {
        const res = await axios.get(`${backEndUrl}/api/uploads`);
        setFiles(res.data);
      } catch (err) {
        console.error('Error fetching uploads', err);
      }
    };
    getUploads();
  }, [backEndUrl]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(`${backEndUrl}/api/uploads/${id}`);
      setFiles((prev) => prev.filter((file) => file._id !== id));
    } catch (err) {
      console.error("Error deleting file", err);
      alert("Failed to delete file.");
    }
  };

  const getFileIconOrPreview = (file) => {
    const type = file.file?.contentType;
    if (type?.startsWith("image/")) {
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

  // ✅ Apply pagination
  const { currentItems: currentFiles, pageCount, currentPage, handlePageClick, goToPage } =
    usePagination(files, 10);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Uploaded Files</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Preview</th>
            <th className="border border-gray-300 px-4 py-2">Filename</th>
            <th className="border border-gray-300 px-4 py-2">Link</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentFiles.map((file) => {
            const fileUrl = `${backEndUrl}/uploads/${file.file?.filename}`;
            return (
              <tr key={file._id}>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {getFileIconOrPreview(file)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {file.name || file.file?.originalName || "Untitled"}
                  <br />
                  <small className="text-gray-600">{file.file?.contentType}</small>
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
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        loading={false}
        posts={files}
        goToPage={goToPage}
        currentPage={currentPage}
        pageCount={pageCount}
        handlePageClick={handlePageClick}
      />
    </div>
  );
};

export default UploadedFiles;
