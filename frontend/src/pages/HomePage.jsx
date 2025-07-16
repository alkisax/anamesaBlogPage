import MainHomepage from "./homepageComponents/MainHomepage";

function Homepage({ backEndUrl }) {

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <MainHomepage backEndUrl={backEndUrl} />
      </div>
    </>
  );
}

export default Homepage;
