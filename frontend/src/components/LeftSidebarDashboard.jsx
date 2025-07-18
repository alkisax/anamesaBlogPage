const LeftSidebarDashboard = ({ navigateToPosts, navigateToUploads }) => {

  return (
    <div 
      className="
        bg-blue-100 text-blue-900
        p-4
        flex flex-row flex-wrap sm:flex-col
        sm:h-full
        gap-2
        w-full
        overflow-hidden
      "
    >
      <button
        onClick={navigateToPosts}
        className="px-4 py-2 bg-blue-600 text-white rounded sm:w-full flex-shrink-0 text-sm"
      >
        Posts
      </button>
      <button 
        onClick={navigateToUploads}
        className="px-4 py-2 bg-blue-600 text-white rounded sm:w-full flex-shrink-0 text-sm"
      >
        Uploaded Files
      </button>

      <br />
      <hr />
      <strong>post</strong>
      <hr />


      <br />
      <strong>testing text</strong>
      <hr />
      <p>
        !Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi minus illum nisi est? At quisquam id nulla molestias delectus, rerum quas provident illo corrupti dolor minus, sint vero obcaecati incidunt?    
      </p>
    </div>
  )
}
export default LeftSidebarDashboard