import React, { useState, useRef } from 'react'
import '../../styles/auth.css'
import '../../styles/create-food.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateFood = () => {
  const [videoFile, setVideoFile] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [status, setStatus] = useState(null)
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if(!file) return
    setVideoFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const file = (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) || null
    if(file) {
      setVideoFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    // simple validation
    if(!videoFile){
      setStatus({ type: 'error', message: 'Please upload a video file' })
      return
    }
    if(!name.trim()){
      setStatus({ type: 'error', message: 'Please enter a name for this food item' })
      return
    }

    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('video', videoFile);

    const response = await axios.post("http://localhost:3000/api/food", formData, {
      withCredentials: true,
    })

    console.log(response.data)
    navigate("/create-food");

    // For now just simulate an upload; console log the payload
    // console.log('Uploading video', { name, description, file: videoFile })
    // setStatus({ type: 'success', message: 'Uploaded (mock) — implement API call to actually upload' })

    // Reset the form fields to keep UI simple
    setName('')
    setDescription('')
    setVideoFile(null)
    setPreviewUrl(null)
    if(fileInputRef.current){ fileInputRef.current.value = '' }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-dot">P</div>
          <div className="brand-name">Partner Panel</div>
        </div>

        <div className="auth-hero">
          <div className="auth-title">Create food</div>
          <div className="auth-sub">Upload a new food item with short video</div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="small">Video file</label>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`video-dropzone ${dragActive ? 'active' : ''}`}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="var(--primary)" />
              <path d="M10 16l4-4-4-4v8z" fill="var(--primary-contrast)" />
            </svg>
            <div className="drop-text">Click or drag a short video here to upload</div>
          </div>
          <input ref={fileInputRef} className="input file-input-hidden" type="file" accept="video/*" onChange={handleVideoChange} />

          {previewUrl && (
            <div className="video-preview">
              <video src={previewUrl} controls width="100%" />
              <div style={{ marginTop: 8 }}>
                <button type="button" className="btn" onClick={() => { setPreviewUrl(null); setVideoFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}>Remove</button>
              </div>
            </div>
          )}

          <label className="small">Name</label>
          <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Food name" />

          <label className="small">Description</label>
          <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" rows={4}></textarea>

          <div className="form-footer">
            {status && <div className={status.type === 'error' ? 'small' : 'small'} style={{ color: status.type === 'error' ? 'var(--primary-700)' : 'green' }}>{status.message}</div>}
          </div>

          <button className="btn" type="submit">Upload</button>
        </form>
      </div>
    </div>
  )
}

export default CreateFood