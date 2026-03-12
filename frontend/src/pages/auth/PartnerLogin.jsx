import React from 'react'
import '../../styles/auth.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PartnerLogin = () => {

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;

        const response = await axios.post("http://localhost:3000/api/auth/food-partner/login", {
            email,
            password
        }, {withCredentials: true});

        console.log(response.data);

        navigate("/create-food")

    }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-dot">P</div>
          <div className="brand-name">Partner Panel</div>
        </div>

        <div className="auth-hero">
          <div className="auth-title">Partner Sign in</div>
          <div className="auth-sub">Access your food partner dashboard</div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <input className="input" id="email" type="email" placeholder="Business email" required />
          <input className="input" id="password" type="password" placeholder="Password" required />

          <div className="form-footer">
            {/* <label className="small"><input type="checkbox" /> &nbsp;Remember me</label> */}
            <Link to="/food-partner/register" className="text-link">Create partner account</Link>
          </div>

          <button className="btn" type="submit">Sign in</button>
        </form>

        <div className="switcher">
          <Link to="/user/login">User Login</Link>
          <Link to="/user/register">User Register</Link>
        </div>
      </div>
    </div>
  )
}

export default PartnerLogin
