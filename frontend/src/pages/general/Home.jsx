import React, { useEffect, useRef, useState } from "react";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const manualPauseRef = useRef(new WeakMap());
  const [expandedMap, setExpandedMap] = useState({});

  const [videos, setVideos] = useState([]);

  // helper: save currently visible reel id/time/paused to sessionStorage
  const saveCurrentReel = () => {
    const root = containerRef.current;
    if (!root) return;
    const vids = Array.from(root.querySelectorAll("video[data-id]"));
    if (!vids.length) return;
    let best = null;
    let bestVisible = -1;
    const viewportH = root.clientHeight || window.innerHeight;
    vids.forEach((v) => {
      const r = v.getBoundingClientRect();
      const visible = Math.max(
        0,
        Math.min(r.bottom, viewportH) - Math.max(r.top, 0)
      );
      if (visible > bestVisible) {
        bestVisible = visible;
        best = v;
      }
    });
    if (best) {
      sessionStorage.setItem(
        "lastReel",
        JSON.stringify({
          id: best.dataset.id,
          time: best.currentTime,
          paused: best.paused,
        })
      );
    }
  };

  // persist a reel into localStorage.savedReels
  const saveReel = (reel) => {
      const raw = localStorage.getItem("savedReels");
      const arr = raw ? JSON.parse(raw) : [];
      const exists = arr.find((r) => r._id === reel._id);
      if (!exists) {
        const toSave = {
          _id: reel._id,
          video: reel.video,
          description: reel.description,
          foodPartner: reel.foodPartner,
        };
        arr.unshift(toSave);
        localStorage.setItem("savedReels", JSON.stringify(arr));
      }
  };

  // autoplay / visibility observer: saves visible reel on change and controls play/pause
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const vids = Array.from(root.querySelectorAll("video"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const isVisible =
            entry.intersectionRatio > 0.65 && entry.isIntersecting;
          if (isVisible) {
            sessionStorage.setItem(
              "lastReel",
              JSON.stringify({
                id: video.dataset.id,
                time: video.currentTime,
                paused: video.paused,
              })
            );

            if (!manualPauseRef.current.get(video)) {
              video.muted = true;
              video.play().catch(() => {});
            }
          } else {
            video.pause();
          }
        });
      },
      { root, threshold: [0.65] }
    );

    vids.forEach((v) => {
      manualPauseRef.current.set(v, false);
      observer.observe(v);
    });

    // if there's a saved position, don't force-play the first video
    const saved = sessionStorage.getItem("lastReel");
    if (!saved && vids[0]) vids[0].play().catch(() => {});

    return () => {
      observer.disconnect();
      // persist most visible video's currentTime on unmount
      const vis = vids.find((vid) => {
        const rect = vid.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.bottom <= (root.clientHeight || window.innerHeight)
        );
      });
      if (vis) {
        sessionStorage.setItem(
          "lastReel",
          JSON.stringify({
            id: vis.dataset.id,
            time: vis.currentTime,
            paused: vis.paused,
          })
        );
      }
    };
  }, []);

  // restore last viewed reel (id + time + paused) after videos load
  useEffect(() => {
    if (!videos || videos.length === 0) return;
    const raw = sessionStorage.getItem("lastReel");
    if (!raw) return;
    
      const { id, time = 0, paused = false } = JSON.parse(raw);
      const el = containerRef.current?.querySelector(`video[data-id="${id}"]`);
      if (!el) return;
      el.scrollIntoView({ behavior: "auto", block: "center" });

      const apply = () => {
        
          if (typeof time === "number" && !isNaN(time)) {
            if (el.duration && !isNaN(el.duration)) el.currentTime = Math.min(time, el.duration);
            else el.currentTime = time;
          }
        

        if (!paused) {
          el.muted = true;
          el.play().catch(() => {});
          manualPauseRef.current.set(el, false);
        } else {
          el.pause();
          manualPauseRef.current.set(el, true);
        }
        el.removeEventListener("loadedmetadata", apply);
      };

      if (el.readyState >= 1) apply();
      else el.addEventListener("loadedmetadata", apply);
    
  }, [videos]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food", { withCredentials: true })
      .then((response) => {
        console.log(response.data);

        setVideos(response.data.foodItems);
      })
      .catch(() => {});
  }, []);

  // listen for unsave events from Saved page and decrement saveCount
  useEffect(() => {
    const handler = (e) => {
      const id = e?.detail?.id;
      if (!id) return;
      setVideos((prev) =>
        prev.map((v) =>
          v._id === id ? { ...v, saveCount: Math.max(0, (v.saveCount || 0) - 1) } : v
        )
      );
    };
    window.addEventListener("reel-unsaved", handler);
    return () => window.removeEventListener("reel-unsaved", handler);
  }, []);

  const handleVideoClick = (id) => {
    const video = videoRefs.current[id];
    if (!video) return;
    const isPaused = video.paused;
    if (!isPaused) {
      video.pause();
      manualPauseRef.current.set(video, true);
    } else {
      // allow toggling play/pause on subsequent clicks; clearing manual pause will allow intersection to control
      video.play().catch(() => {});
      manualPauseRef.current.set(video, false);
    }
    sessionStorage.setItem(
      "lastReel",
      JSON.stringify({ id, time: video.currentTime, paused: video.paused })
    );
  };

  const handleSeeMore = (id) => (e) => {
    e.preventDefault();
    const isExpanded = !!expandedMap[id];
    const nextExpanded = !isExpanded;
    setExpandedMap((prev) => ({ ...prev, [id]: nextExpanded }));
    const video = videoRefs.current[id];
    if (video) {
      if (nextExpanded) {
        // expanding: pause the video and set manual pause
        video.pause();
        manualPauseRef.current.set(video, true);
      } else {
        // collapsing: resume playback and clear manual pause
        video.play().catch(() => {});
        manualPauseRef.current.set(video, false);
      }
    }
  };

  async function likeVideo(reel) {
    const response = await axios.post(
      "http://localhost:3000/api/food/like",
      { foodId: reel._id },
      { withCredentials: true }
    );

    if (response.data.like) {
      console.log("Video Liked");
      setVideos((prev) =>
        prev.map((v) =>
          v._id === reel._id ? { ...v, likeCount: v.likeCount + 1 } : v
        )
      );
    } else {
      console.log("Like Removed");
      setVideos((prev) =>
        prev.map((v) =>
          v._id === reel._id ? { ...v, likeCount: v.likeCount - 1 } : v
        )
      );
    }
  }

  async function saveVideo(reel) {
    const response = await axios.post(
      "http://localhost:3000/api/food/save",
      { foodId: reel._id },
      { withCredentials: true }
    );

    // console.log(response.data);

    if (response.data.save) {
      console.log("Video Saved");
      setVideos((prev) =>
        prev.map((v) => (v._id === reel._id ? { ...v, saveCount: v.saveCount + 1 } : v))
      );
    } else {
      console.log("Save Removed");
      setVideos((prev) =>
        prev.map((v) => (v._id === reel._id ? { ...v, saveCount: v.saveCount - 1 } : v))
      );
    }
  }

  return (
    <div className="home-reels" ref={containerRef}>
      {videos.map((reel) => (
        <section className="reel" key={reel._id}>
          <video
            data-id={reel._id}
            src={reel.video}
            muted
            autoPlay
            playsInline
            loop
            preload="metadata"
            ref={(el) => {
              if (el) videoRefs.current[reel._id] = el;
            }}
            onClick={() => handleVideoClick(reel._id)}
          />
          <div className="home-head"><h2>{reel.name}</h2></div>

          <div className="reel-overlay">
            <div
              className={`reel-description ${
                expandedMap[reel._id] ? "expanded" : ""
              }`}
            >
              <span className="reel-text">{reel.description}</span>
              <button className="see-more" onClick={handleSeeMore(reel._id)}>
                {expandedMap[reel._id] ? "See less" : "See more"}
              </button>
            </div>
            <Link
              className="visit-store"
              to={`/food-partner/${reel.foodPartner}`}
              onClick={() => saveCurrentReel()}
            >
              Visit store
            </Link>
          </div>

          <div className="reel-actions" onClick={(e) => e.stopPropagation()}>
            {" "}
            {/* onClick={(e) => e.stopPropagation()} */}
            <button
              className="action-btn"
              title="Like"
              onClick={() => {
                likeVideo(reel);
                saveCurrentReel();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <div className="action-count">
                {reel.likeCount ?? reel.likes ?? 0}
              </div>
            </button>
            <button
              className="action-btn"
              title="Comments"
              onClick={() => saveCurrentReel()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <div className="action-count">{reel.comments ?? 0}</div>
            </button>
            <button
              className="action-btn"
              title="Save"
              onClick={() => {
                saveCurrentReel();
                { saveReel(reel); }
                { saveVideo(reel); }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              <div className="action-count">{reel.saveCount ?? reel.saved ?? 0}</div>
            </button>
          </div>
        </section>
      ))}

      <nav className="bottom-nav" aria-label="Bottom navigation">
        <ul>
          <li className="bottom-nav__item home">
            <Link
              to="/"
              onClick={() => {
                saveCurrentReel();
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
                saveCurrentReel();
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

export default Home;
