import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeClosed } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // 🔹 Normal Email/Password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5000/api/chat/login', {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);      // Store JWT
      localStorage.setItem("agent", JSON.stringify(res.data));  // Store agentId
      localStorage.setItem("isAuthenticate", true); 
      toast.success('Login Successful !!')
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
      // setError(err.response?.data?.message || "Invalid email or password");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Agent Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-6 relative">
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 border rounded-xl focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Enter password"
              required
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
            >
              {passwordVisible ? <Eye /> : <EyeClosed />}
            </span>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition" 
          >
            Login
          </button>
        </form>

        {/* 🔹 Redirect to Signup */}
        <p className="text-sm text-center mt-4">
          Don’t have an account? 
          <span 
            onClick={() => navigate('/signup')} 
            className="text-blue-600 hover:underline cursor-pointer ml-1"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
