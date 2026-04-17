'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

export default function ProfileAvatar({ initials, isPro, initialImage }) {
  const [image, setImage] = useState(initialImage || null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const bgColor = isPro ? '#085041' : '#1D9E75'

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // Compress & convert to base64 via canvas
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = async () => {
      const canvas = document.createElement('canvas')
      const MAX = 300
      const scale = Math.min(MAX / img.width, MAX / img.height, 1)
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82)
      URL.revokeObjectURL(url)

      setUploading(true)
      try {
        const res = await fetch('/api/user/avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl }),
        })
        if (res.ok) setImage(dataUrl)
      } finally {
        setUploading(false)
      }
    }
    img.src = url
    // reset so same file can be re-selected
    e.target.value = ''
  }

  return (
    <div style={{ position: 'relative', width: '72px', height: '72px', flexShrink: 0 }}>
      {/* Avatar circle */}
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: image ? 'transparent' : bgColor,
        border: `3px solid ${bgColor}`,
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 12px rgba(8,80,65,0.18)',
      }}>
        {image ? (
          <img
            src={image}
            alt="Profile"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{
            fontSize: '22px', fontWeight: '700', color: '#fff',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            userSelect: 'none',
          }}>
            {initials}
          </span>
        )}
      </div>

      {/* Camera edit button */}
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        aria-label="Change profile photo"
        style={{
          position: 'absolute', bottom: '0', right: '0',
          width: '24px', height: '24px', borderRadius: '50%',
          background: '#fff',
          border: `2px solid ${bgColor}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: uploading ? 'wait' : 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          padding: 0,
          transition: 'transform 0.15s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {uploading ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={bgColor} strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={bgColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        )}
      </button>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </div>
  )
}
