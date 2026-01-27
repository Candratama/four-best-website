"use client";

import { useState } from "react";

interface VideoSectionProps {
  youtubeUrl: string;
  thumbnailImage: string;
  title?: string;
}

// Extract YouTube video ID from URL
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : null;
}

export default function VideoSection({
  youtubeUrl,
  thumbnailImage,
  title = "Virtual Tour",
}: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYouTubeId(youtubeUrl);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
  };

  return (
    <>
      {/* Video Modal */}
      {isPlaying && (
        <div
          className="video-modal-overlay"
          onClick={handleClose}
        >
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="video-modal-close"
              onClick={handleClose}
              aria-label="Close video"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="video-modal-iframe-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Section */}
      <section
        aria-label="section"
        className="section-dark relative p-0 text-light"
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <button
                className="d-block hover video-trigger w-100"
                onClick={handlePlay}
                style={{ border: "none", padding: 0, background: "none", cursor: "pointer" }}
              >
                <div className="relative overflow-hidden z-3">
                  <div className="absolute start-0 w-100 abs-middle fs-36 text-white text-center z-2">
                    <div className="player circle wow scaleIn">
                      <span></span>
                    </div>
                  </div>
                  <div className="absolute w-100 h-100 top-0 bg-dark hover-op-05"></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailImage}
                    className="w-100 hover-scale-1-1"
                    alt={title}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="abs bottom-10 z-2 w-100 pointer-events-none">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <h1 className="fs-120 text-uppercase fs-sm-10vw mb-4 lh-1">
                  {title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
