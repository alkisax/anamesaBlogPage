import MainHomepage from "./homepageComponents/MainHomepage";

function Homepage({ backEndUrl, editorJsData, setEditorJsData, username, password, setUsername,setPassword, handleLogin }) {

  return (
    <>
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
  );
}

export default Homepage;
