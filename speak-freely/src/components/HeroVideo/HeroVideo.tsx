"use client";

import { useRef, useState } from "react";
import styles from "./HeroVideo.module.css";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.videoWrapper}>

        {/* VIDEO */}
        <video
          ref={videoRef}
          className={styles.video}
          src="/CapstoneProjectTrailer.webm"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster="/hero-fallback.jpg"
        />

        {/* OVERLAY CONTROLS */}
        <div className={styles.controls}>

          {/* Play/Pause Button */}
          <button
            className={styles.controlButton}
            onClick={togglePlay}
            aria-label={isPaused ? "Play video" : "Pause video"}
          >
            {isPaused ? (
              /* ▶️ Play icon */
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              /* Pause icon */
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
          </button>

          {/* Mute/Unmute Button */}
          <button
            className={styles.controlButton}
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              /* Muted icon */
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M16.5 12c0-1.77-.78-3.29-2-4.3v8.59c1.22-1 2-2.52 2-4.29zm3.5 0c0 3.03-1.66 5.64-4.11 6.99l-1.13-1.63C16.55 16.13 18 14.21 18 12s-1.45-4.13-3.74-5.36l1.13-1.63C18.34 6.36 20 8.97 20 12zm-9-9L7 8H3v8h4l4 5V3z" />
              </svg>
            ) : (
              /*Unmuted icon */
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M7 9v6h4l5 5V4l-5 5H7z" />
              </svg>
            )}
          </button>

        </div>
      </div>
    </section>
  );
}
