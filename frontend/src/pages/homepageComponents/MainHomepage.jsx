import Subpage from "../Subpage";

const MainHomepage = ({ backEndUrl }) => {
  return (
    <>
      <Subpage 
        backEndUrl={backEndUrl}
        forcedName="main"
      />;
    </>    
  ) 
};

export default MainHomepage;