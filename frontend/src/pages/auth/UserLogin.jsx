import React from 'react'
import '../../styles/auth.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const UserLogin = () => {

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;

        const response = await axios.post("http://localhost:3000/api/auth/user/login", {
            email,
            password
        },{
            withCredentials: true
        });

        console.log(response.data);

        navigate("/");

    }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-dot">Z</div>
          <div className="brand-name">Zomato</div>
        </div>

        <div className="auth-hero">
          <div className="auth-title">User Sign in</div>
          <div className="auth-sub">Welcome back - enter your details to continue</div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <input className="input" id='email' type="email" placeholder="Email address" required />
          <input className="input" id='password' type="password" placeholder="Password" required />

          <div className="form-footer">
            {/* <label className="small"><input type="checkbox" /> &nbsp;Remember me</label> */}
            <Link to="/user/register" className="text-link">Create account</Link>
          </div>

          <button className="btn" type="submit">Sign in</button>
        </form>

        <div className="switcher">
          <Link to="/food-partner/login">Food Partner Login</Link>
          <Link to="/food-partner/register">Food Partner Register</Link>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
