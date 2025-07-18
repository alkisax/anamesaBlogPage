
const LoginForm = ({ username, password, setUsername, setPassword, handleLogin, }) =>{

  // const googleUrl = `https://accounts.google.com/o/oauth2/auth?client_id=37391548646-a2tj5o8cnvula4l29p8lodkmvu44sirh.apps.googleusercontent.com&redirect_uri=${url}/login/google/callback&response_type=code&scope=email%20profile&access_type=offline`;

  return (
    <>
      <form 
        onSubmit={handleLogin}
        className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto"
      >
        <div>
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
            Username
          </label>
          <input type="text"
          id="username"
          value={username}
          name="username"
          onChange={({target}) => setUsername(target.value)}
          autoComplete="username"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input 
          type="password"
          id="password"
          value={password}
          name="password"
          onChange={({target}) => setPassword(target.value)}
          autoComplete="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <button 
          id="loginBtn"
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          login
        </button>
      </form>

      {/* <a href={googleUrl}>
        <button id="GoogleLoginBtn" type="button">Login with Google</button>
      </a> */}
    </>
  )
}
export default LoginForm