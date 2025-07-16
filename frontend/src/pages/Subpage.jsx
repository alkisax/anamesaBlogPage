import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useParams  } from 'react-router-dom';
import axios from 'axios';
import RenderedEditorJsContent from "../components/RenderedEditorJsContent";

const Subpage = ({ backEndUrl, forcedName }) => {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [pages, setPages] = useState([])

  useEffect(() => {
    const getpages = async () => {
      const res = await axios.get(`${backEndUrl}/api/subPages`)
      setPages(res.data)
    }
    getpages()
  }, [backEndUrl])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${backEndUrl}/api/posts`);
        setPosts(response.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false); 
      }
    };
    
    fetchPosts();
  }, [backEndUrl]);

  const { name: paramName } = useParams();
  const name = forcedName || paramName;
  const currentPage = pages.find((page) => page.name === name)
  const currentPageId = currentPage?._id
  const filteredPosts = posts.filter(
    (post) => post.subPage?._id === currentPageId
  )

  // αυτή η συνάρτηση κρατάει μόνο την πρώτη εικόνα και τις πρώτες 70 λέξεις. Σε μεγάλο βαθμό απο GPT
  const getPreviewContent = (content, maxWords = 70) => {
    const previewBlocks = [];
    let wordCount = 0;
    let imageIncluded = false;

    for (const block of content.blocks) {
      if (block.type === 'image' && !imageIncluded) {
        previewBlocks.push(block);
        imageIncluded = true;
      }

      if (block.type === 'header') {
        previewBlocks.push(block);
      }

      if (block.type === 'paragraph') {
        const words = block.data.text.split(/\s+/);
        const remaining = maxWords - wordCount;

        if (remaining <= 0) break;

        const trimmedWords = words.slice(0, remaining);
        previewBlocks.push({
          ...block,
          data: {
            ...block.data,
            text: trimmedWords.join(' ') + (words.length > remaining ? '...' : '')
          }
        });

        wordCount += trimmedWords.length;
      }

      if (wordCount >= maxWords && imageIncluded) break;
    }

    return {
      ...content,
      blocks: previewBlocks
    };
  };

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto">
        {loading && <p>Loading...</p>}
        {!loading && posts.length === 0 && <p>No posts found</p>}

        <div className="grid gap-6">
            {!loading && posts.length !== 0 &&
              filteredPosts.map((post) => (
                <Link to={`/posts/${post._id}`}>
                  <div 
                    key={post._id}
                    className="bg-slate-100 text-black shadow-md rounded-2xl p-6 border border-gray-300 hover:shadow-lg transition-shadow"
                  >
                      <RenderedEditorJsContent
                        editorJsData={getPreviewContent(post.content)}
                        subPageName={post.subPage?.name}
                      />

                    <p className="text-sm text-gray-500 mt-4">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))
            }        
        </div>    
      </div>
    </>
  )
}
export default Subpage