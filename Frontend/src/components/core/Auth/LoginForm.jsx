import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch} from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../../services/operations/authAPI"
import {toast} from "react-hot-toast"

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

   
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = async(e) => {
    e.preventDefault();
    
    dispatch(login(email, password, navigate))
     
  }

  const logInWithGoogle = async() =>{
    console.log("Google Auth");
    try {
      const response = await fetch('http://localhost:4000/auth/google');
      console.log("response: ", response);
    } catch (error) {
      console.log("Error in google auth: ", error);
    }
 
  }

  return (

    <>
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className="form-style w-full pl-1 rounded-sm"
        />
      </label>
      <label className="relative">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          className="form-style w-full !pr-10 pl-1 rounded-sm"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[26px] z-[10] cursor-pointer"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
            Forgot Password
          </p>
        </Link>
      </label>
      <button type="submit"
        className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900">
        Log In
      </button>
      
          <p className="text-white font-bold text-center">or</p>
  
      </form>

       <div className="w-full flex justify-center">
          <button onClick={logInWithGoogle} className="mt-6 rounded-[8px] bg-[#4c6cec] py-[8px] px-[12px] font-medium text-richblack-900">
            Log In with Google
          </button>
       </div>

    </>
  )
}

export default LoginForm
