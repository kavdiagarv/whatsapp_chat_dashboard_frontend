import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeClosed } from 'lucide-react';
import { Eye } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = () => {
    // e.preventDefault();

    // Hardcoded credentials
    const validUsername = 'admin';
    const validPassword = 'agent123';

    if (username === validUsername && password === validPassword) {
        console.log("Login successful");
        localStorage.setItem("isAuthenticate",true);
        navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Agent Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="mb-6" style={{ position: 'relative' }}>
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
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(10%)", // Slightly adjust for label height
                cursor: "pointer",
              }}
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
      </div>
    </div>
  );
};

export default LoginPage;



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // ✅ important

// const LoginPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate(); // ✅ this should be called inside the component

//   const handleLogin = (e) => {
//     e.preventDefault();

//     if (username === 'admin' && password === 'secure123') {
//       console.log("Login successful");
//       navigate('/dashboard'); // ✅ redirects
//     } else {
//       alert('Invalid credentials');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm"
//       >
//         <h2 className="text-2xl font-semibold text-center mb-6">Agent Login</h2>
//         <input
//           type="text"
//           placeholder="Username"
//           className="w-full mb-4 p-2 border border-gray-300 rounded"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full mb-4 p-2 border border-gray-300 rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;
