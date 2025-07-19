import MainHomepage from "./homepageComponents/MainHomepage";
import IntroHome from "./homepageComponents/IntroHome"
import OnlyPinnedPostsAndLastPosts from "../components/OnlyPinnedPostsAndLastPosts";

function Homepage({ backEndUrl, editorJsData, setEditorJsData, username, password, setUsername,setPassword, handleLogin }) {

  return (
    <>
      <div>
        <IntroHome />
        <OnlyPinnedPostsAndLastPosts 
          backEndUrl={backEndUrl}
        />    
      </div>


      <div className="flex flex-col min-h-screen">
        <MainHomepage 
          editorJsData={editorJsData} 
          setEditorJsData={setEditorJsData}
          backEndUrl={backEndUrl}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </div>
    </>
  )
}

export default Homepage;
