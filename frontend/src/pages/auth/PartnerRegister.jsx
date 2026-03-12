import React from 'react'
import '../../styles/auth.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PartnerRegister = () => {

    const navigate = useNavigate();

    const handleSubmit =  (e) => {
        e.preventDefault();

        const businessName = e.target.businessName.value;
        const ownerName = e.target.ownerName.value;
        const phone = e.target.phone.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const address = e.target.address.value;

        axios.post("http://localhost:3000/api/auth/food-partner/register", {
            name: businessName,
            contactName: ownerName,
            phone,
            email,
            password,
            address
        }, {withCredentials: true})
        .then(response => {
            console.log(response.data);
            navigate("/create-food");
        })
        .catch(error => {
            console.error("There was an error in registering !", error);
        });

    }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-dot">P</div>
          <div className="brand-name">Partner Panel</div>
        </div>

        <div className="auth-hero">
          <div className="auth-title">Partner register</div>
          <div className="auth-sub">Register your business to start receiving orders</div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <input className="input" type="text" id="businessName" placeholder="Business name" required />
          <div className="row">
            <input className="input input--grow" type="text" id="ownerName" placeholder="Owner name" required />
            <input className="input" type="tel" id="phone" placeholder="Phone number" required />
          </div>
          <input className="input" type="email" id="email" placeholder="Business email" required />
          <input className="input" type="password" id="password" placeholder="Password" required />
          <input className="input" type="text" id="address" placeholder="Business address" required />

          <div className="form-footer">
            {/* <label className="small"><input type="checkbox" /> &nbsp;I accept partner terms</label> */}
            <Link to="/food-partner/login" className="text-link">Already a partner?</Link>
          </div>

          <button className="btn" type="submit">Create account</button>
        </form>

        <div className="switcher">
          <Link to="/user/login">User Login</Link>
          <Link to="/user/register">User Register</Link>
        </div>
      </div>
    </div>
  )
}

export default PartnerRegister
