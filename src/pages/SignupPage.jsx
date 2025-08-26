import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // added Link
import { Eye, EyeClosed } from 'lucide-react';
import axios from 'axios';
import { toast } from "react-toastify";


const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };  

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://ec2-3-6-152-103.ap-south-1.compute.amazonaws.com:5000/api/chat/create-agent', {
        name,
        email,
        password,
      });
      localStorage.setItem("isAuthenticate",true);  
      // alert(`Signup successful! Your Agent ID is ${res.data.agentId}`);
      toast.success(`Signup successful! Your Agent ID is ${res?.data?.agentId}`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || "Error signing up");
      // setError(err.response?.data?.message || "Error signing up"); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Agent Account
        </h2>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-xl"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-xl"
            required
          />
          <div className="mb-6 relative">
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl"
              placeholder="Enter password"
              required
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {passwordVisible ? <Eye /> : <EyeClosed />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold"
          >
            Sign Up
          </button>
        </form>

        {/* Already have account redirect */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;