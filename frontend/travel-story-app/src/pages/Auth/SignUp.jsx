import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!name) {
      setError("Please enter your name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError("");

    // SignUp API Call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // Handle successful SignUp response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      // Handle SignUp error
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className='h-screen bg-cyan-50 overflow-hidden relative'>
      <div className='login-ui-box right-10 -top-40' />
      <div className='login-ui-box bg-cyan-200 -bottom-40 right-1/2' />

      <div className='container h-screen flex items-center justify-center px-5 mx-auto'>
        {/* Left Side - Travel Image */}
        <div className='w-2/4 h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50'>
          <div>
            <h4 className='text-5xl text-white font-semibold leading-[58px]'>
              Join the <br/>Adventure
            </h4>
            <p className='text-[15px] text-white leading-6 pr-7 mt-4'>
              Create an account to start documenting your travels and preserving
              your memories in your personal travel journal.
            </p>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className='w-2/4 h-[80vh] bg-white rounded-r-lg relative p-12 shadow-lg shadow-cyan-200/20 flex flex-col justify-center'>
          <form onSubmit={handleSignUp} className='w-full'>
            <h4 className='text-xl font-semibold mb-7'>SignUp</h4>

            <input
              type="text"
              placeholder='Full Name'
              className='input-box p-2'
              value={name}
              onChange={({ target }) => setName(target.value)}
            />

            <input
              type="text"
              placeholder='Email'
              className='input-box p-2'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=''
            />

            {error && <p className='text-red-500 text-xs p-1 '>{error}</p>}

            <button type="submit" className='btn-primary'>
              CREATE ACCOUNT
            </button>

            <p className='text-xs text-slate-500 text-center my-4'>Or</p>

            <button
              type="button"
              className='btn-primary btn-light'
              onClick={() => navigate("/login")}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
