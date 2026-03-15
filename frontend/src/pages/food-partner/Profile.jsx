import React, { useEffect, useState } from "react";
import "../../styles/profile.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/* No hardcoded dummy partner/reels data — placeholders and fallbacks are used when data is not present. */

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  const goToReel = (reelId) => {

      sessionStorage.setItem(
        "lastReel",
        JSON.stringify({ id: reelId, time: 0, paused: false })
      );
    navigate("/");
  };

  useEffect(() => {
    axios
      .get(`http://foodeel-backend.onrender.com/api/food-partner/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setProfile(response.data.foodPartner);
        setVideos(response.data.foodPartner.foodItems);
      });
  }, [id]);

  return (
    <div className="auth-container partner-full">
      <div className="auth-card">
        <div className="partner-profile">
          <div className="profile-header section-card">
            <div className="avatar">
              {/* {profile?.avatar ? <img src={profile.avatar} alt={`${profile?.name ?? 'avatar' } avatar`} /> : <span>{initials}</span>} */}
              <img
                className="profile-avatar"
                src="https://images.pexels.com/photos/28929407/pexels-photo-28929407.jpeg"
                alt=""
              />
            </div>
            <div style={{ flex: 1 }}>
              <div className="profile-name">
                {profile?.name ?? "Business name"}
              </div>
              <div className="profile-details">
                <div>Number : {profile?.phone ?? "-"}</div>
                <div>Email : {profile?.email ?? "-"}</div>
                <div>Address : {profile?.address ?? "-"}</div>
                <div className="profile-meta">{/* visit store removed */}</div>
              </div>
            </div>
          </div>

          <div className="profile-stats section-card">
            <div className="stat-card">
              <div className="stat-value">
                {profile?.totalMeals
                  ? profile.totalMeals.toLocaleString()
                  : "-"}
              </div>
              <div className="stat-label">Total meals</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {profile?.customersServed
                  ? profile.customersServed.toLocaleString()
                  : "-"}
              </div>
              <div className="stat-label">Customers served</div>
            </div>
          </div>

          <div className="profile-reels section-card">
            <h3 style={{ marginBottom: -10, color: "var(--text)" }}>Reels</h3>
            <div style={{ color: "var(--muted)", marginBottom: 12 }}>
              Recent food videos uploaded by this business
            </div>
            <div className="reels-grid">
                {videos.length === 0 ? (
                <div style={{ color: "var(--muted)" }}>
                  No reels uploaded yet
                </div>
              ) : (
                videos.map((v) => (
                  <div key={v.id} className="reel-card">
                    <video
                      src={v.video}
                      muted
                      autoPlay
                      playsInline
                      loop
                      preload="metadata"
                      alt={v.name}
                      className="reel-thumb"
                      onClick={() => goToReel(v._id || v.id)}
                    />
                    <div className="reel-meta">
                      <div className="reel-title">{v.title}</div>
                      {/* <div className="reel-views">{v.views.toLocaleString()} views</div> */}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
