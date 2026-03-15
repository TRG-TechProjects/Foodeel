// ...existing code...
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/theme.css";
import "../../styles/saved.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Saved = () => {
  const [saved, setSaved] = useState(() => {
    const raw = localStorage.getItem("savedReels");
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const v = sessionStorage.getItem("bottomActive");
    if (v) document.body.setAttribute("data-bottom-active", v);

    axios
      .get("http://foodeel-backend.onrender.com/api/food/save", { withCredentials: true })
      .then((response) => {
        const savedFood = (response.data.savedFoods || []).map((item) => ({
          _id: item.food._id,
          video: item.food.video,
          name: item.food.name,
          description: item.food.description,
          likeCount: item.food.likeCount,
          saveCount: item.food.saveCount,
          commentsCount: item.food.commentsCount,
        }));
        setSaved(savedFood);
      })
      .catch(() => {});
  }, []);

  const removeSaved = (id) => {
    try {
      // call backend to toggle save
      axios
        .post(
          "http://foodeel-backend.onrender.com/api/food/save",
          { foodId: id },
          { withCredentials: true }
        )
        .then(() => {
          const raw = localStorage.getItem("savedReels");
          const arr = raw ? JSON.parse(raw) : [];
          const next = arr.filter((r) => r._id !== id);
          localStorage.setItem("savedReels", JSON.stringify(next));
          setSaved(next);
          // notify other components (Home) to update counts
          
          window.dispatchEvent(new CustomEvent("reel-unsaved", { detail: { id } }));

          console.log("Save Removed");
          
        })
        .catch(() => {
          // fallback: still remove locally
          const raw = localStorage.getItem("savedReels");
          const arr = raw ? JSON.parse(raw) : [];
          const next = arr.filter((r) => r._id !== id);
          localStorage.setItem("savedReels", JSON.stringify(next));
          setSaved(next);
        });
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      const raw = localStorage.getItem("savedReels");
      const arr = raw ? JSON.parse(raw) : [];
      const next = arr.filter((r) => r._id !== id);
      localStorage.setItem("savedReels", JSON.stringify(next));
      setSaved(next);
    }
  };

  const navigate = useNavigate();

  const goToReel = (reelId) => {

      sessionStorage.setItem(
        "lastReel",
        JSON.stringify({ id: reelId, time: 0, paused: false })
      );
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-card"> {/*style={{ maxWidth: 760 }}*/}
        <div className="saved-head"><h2>Saved</h2></div>
        {saved && saved.length ? (
          <div className="saved-list">
            {saved.map((item) => (
              <div key={item._id} className="saved-item">
                <video
                  className="saved-video"
                  src={item.video}
                  // controls
                  muted
                  autoPlay
                  playsInline
                  loop
                  preload="metadata"
                  onClick={() => goToReel(item._id || item.id)}
                />
                <div className="saved-item-meta">
                  <div className="saved-desc">
                    <div className="saved-desc-title">{item.name}</div>
                    <div className="saved-desc-subtitle muted">
                      {item.foodPartner}
                    </div>
                  </div>
                  <button
                    className="action-btn saved-unsave"
                    onClick={() => removeSaved(item._id)}
                  >
                    Unsave
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="saved-head">
          <p className="muted">You haven't saved any items yet.</p></div>
        )}
      </div>

      <nav className="bottom-nav" aria-label="Bottom navigation">
        <ul>
          <li className="bottom-nav__item home">
            <Link
              to="/"
              onClick={() => {
                sessionStorage.setItem("bottomActive", "home");
                document.body.setAttribute("data-bottom-active", "home");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </Link>
          </li>
          <li className="bottom-nav__item saved">
            <Link
              to="/saved"
              onClick={() => {
                sessionStorage.setItem("bottomActive", "saved");
                document.body.setAttribute("data-bottom-active", "saved");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Saved;
