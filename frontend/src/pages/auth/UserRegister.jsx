import React from 'react'
import '../../styles/auth.css'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        const response = await axios.post("https://foodeel-backend.onrender.com/api/auth/user/register", {
            fullName: firstName + " " + lastName,
            email,
            password
        }, {
            withCredentials: true
        })

        console.log(response.data);

        navigate("/");

    };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-dot">Z</div>
          <div className="brand-name">Zomato</div>
        </div>

        <div className="auth-hero">
          <div className="auth-title">Create your account</div>
          <div className="auth-sub">Join as a user to order delicious food</div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <input className="input" id="firstName" type="text" placeholder="First name" required />
            <input className="input" id="lastName" type="text" placeholder="Last name" required />
          </div>
          <input className="input" id="email" type="email" placeholder="Email address" required />
          <input className="input" id="password" type="password" placeholder="Password" required />

          <div className="form-footer">
            {/* <label className="small"><input type="checkbox" /> &nbsp;I agree to the terms</label> */}
            <Link to="/user/login" className="text-link">Already have an account?</Link>
          </div>

          <button className="btn" type="submit">Create account</button>
        </form>

        <div className="switcher">
          <Link to="/food-partner/login">Food Partner Login</Link>
          <Link to="/food-partner/register">Food Partner Register</Link>
        </div>
      </div>
    </div>
  )
}

export default UserRegister
