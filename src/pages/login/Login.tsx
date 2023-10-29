import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RootState } from "../../app/store"
import { login } from "../../features/auth/authSlice"

const Login = () => {
  const { register, handleSubmit, reset } = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    isLoading,
    isError,
    error,
    user: { email },
  } = useSelector((state:RootState) => state.auth)

  // handle submit
  const onSubmit = (data) => {
    console.log(data)
    const loginData = {
      email: data.email,
      password: data.password,
    }
    dispatch(login(loginData))
    reset()
  }

  const handleGoogleSignIn = () => {
    dispatch(signInWithGoogle())
  }

  // redirect
  useEffect(() => {
    if (!isLoading && email) {
      navigate("/")
    }
  }, [])

  // error
  useEffect(() => {
    if (isError) {
      toast.error(error)
    }
  }, [])
  return (
    <div className="flex h-screen items-center">
      <div className="w-1/2 flex items-center justify-center">
        <img src={loginImage} className="max-h-96" alt="" />
      </div>
      <div className="w-1/2 grid place-items-center bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg p-10">
          <h1 className="mb-10 font-medium text-2xl text-gray-800">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="flex flex-col items-start">
                <label
                  htmlFor="email"
                  className="mb-1 text-gray-800 font-semibold"
                >
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  id="email"
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col items-start">
                <label
                  htmlFor="password"
                  className="mb-1 text-gray-800 font-semibold"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div className="relative">
                <button
                  type="submit"
                  className="font-bold text-white py-3 rounded-full bg-primary w-full hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50"
                >
                  {isLoading ? "Loading..." : "Login"}
                </button>
              </div>
            </div>
          </form>
          {/* google sign in */}
          <div className="mt-6 rounded-md shadow-md">
            <button
              type="button"
              className="px-4 py-4 text-base font-medium text-gray-700"
              onClick={handleGoogleSignIn}
              // disabled={isLoading}
            >
              Sign In with Google
            </button>
          </div>
          {isError && <span className="text-red-500">{error}</span>}
          <div>
            <p className="text-gray-800">
              Don't have an account?{" "}
              <span
                className="text-primary hover:underline cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
