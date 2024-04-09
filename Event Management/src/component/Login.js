import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[error,setError] = useState("")
  const[loginError,setloginError] = useState({})
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  
  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validateForm();
    // console.log(validationErrors,"Fchfgriggbv for login")
    if (Object.keys(validationErrors).length === 0) {
      try {
        await axios.post('/login', { email, password })
        .then(res => {
          if(res.data.status === "success"){
            navigate("/events");
          }
          else{
            setError(res.data.message)
          }
        })
        .catch(err => console.log(err));  
      }catch (error) {
        console.error('Login failed:', error);
      }
    }
    else{
      setloginError(validationErrors);
    }
    // try {
    //   await axios.post('/login', { email, password })
    //   .then(res => {
    //     if (Object.keys(validationErrors).length === 0) {
    //       if(res.data.status === "success"){
    //         navigate("/events");
    //       }
    //       else{
    //         setError(res.data.message)
    //       }
    //     }
    //     else{
    //       setloginError(validationErrors);
    //     }
    //   })
    //   .catch(err => console.log(err));
    //   // You can perform further actions here, such as redirecting to a dashboard.
    // } catch (error) {
    //   console.error('Login failed:', error);
    // }
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!email || email.trim().length < 0)  {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Invalid email format';
    }

    if (!password || password.trim().length <= 0) {
      validationErrors.password = 'Password is required';
    } 

    return validationErrors;
  };
  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
      {error && <span className="error text-danger">{error}</span>}
        <div>
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          {loginError.email && <span className="error">{loginError.email}</span>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {loginError.password && <span className="error">{loginError.password}</span>}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
