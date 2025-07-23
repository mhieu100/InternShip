import { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import { Spin, Progress } from "antd";

const HLSPlayer = ({ src, onError, quality = "medium" }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bufferHealth, setBufferHealth] = useState(0);
  const [stats, setStats] = useState({
    bitrate: 0,
    fps: 0,
    droppedFrames: 0,
    delay: 0,
  });

  useEffect(() => {
    let hls = null;
    let retryCount = 0;
    const maxRetries = 3;
    const retryInterval = 2000;
    const video = videoRef.current;

    const initializePlayer = () => {
      setIsLoading(true);
      setBufferHealth(0);

      if (video) {
        if (Hls.isSupported()) {
          if (hls) {
            hls.destroy();
          }

          const qualitySettings = {
            low: { maxBufferLength: 10, maxMaxBufferLength: 15 },
            medium: { maxBufferLength: 15, maxMaxBufferLength: 20 },
            high: { maxBufferLength: 20, maxMaxBufferLength: 25 },
          };

          const settings = qualitySettings[quality] || qualitySettings.medium;

          hls = new Hls({
            liveSyncDurationCount: 2,
            maxLiveSyncPlaybackRate: 1.5,
            maxBufferLength: settings.maxBufferLength,
            maxMaxBufferLength: settings.maxMaxBufferLength,
            enableWorker: true,
            lowLatencyMode: true,
            autoStartLoad: true,
            backBufferLength: 10,
            startLevel: -1,
            initialLiveManifestSize: 1,
            debug: false,
            // Advanced settings for better performance
            fragLoadingTimeOut: 20000,
            manifestLoadingTimeOut: 20000,
            levelLoadingTimeOut: 20000,
            fragLoadingMaxRetry: 3,
            manifestLoadingMaxRetry: 3,
            levelLoadingMaxRetry: 3,
          });

          // Monitor stream health
          hls.on(Hls.Events.FRAG_BUFFERED, (_, { stats: fragStats }) => {
            setStats((prev) => ({
              ...prev,
              bitrate: Math.round(fragStats.bitrate / 1000),
              delay: Math.round(fragStats.loading.first - fragStats.trequest),
            }));
          });

          hls.on(Hls.Events.FPS_DROP, (_, { currentDropped }) => {
            setStats((prev) => ({
              ...prev,
              droppedFrames: currentDropped,
            }));
          });

          // Buffer health monitoring
          const updateBufferHealth = () => {
            if (video) {
              const buffered = video.buffered;
              if (buffered.length > 0) {
                const bufferedEnd = buffered.end(buffered.length - 1);
                const duration = video.duration;
                const health = (bufferedEnd / duration) * 100;
                setBufferHealth(Math.min(Math.round(health), 100));
              }
            }
          };

          video.addEventListener("progress", updateBufferHealth);

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(() => {
                      hls.startLoad();
                    }, retryInterval);
                  } else {
                    setIsLoading(false);
                    if (onError) onError();
                  }
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  break;
                default:
                  setIsLoading(false);
                  if (onError) onError();
                  break;
              }
            }
          });

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false);
            videoRef.current.play().catch((error) => {
              console.error("Playback error:", error);
            });
          });

          hls.loadSource(src);
          hls.attachMedia(video);

          // FPS monitoring
          let lastTime = 0;
          let frames = 0;
          const calculateFPS = (now) => {
            frames++;
            if (now - lastTime >= 1000) {
              setStats((prev) => ({
                ...prev,
                fps: frames,
              }));
              frames = 0;
              lastTime = now;
            }
            requestAnimationFrame(calculateFPS);
          };
          requestAnimationFrame(calculateFPS);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src;
          video.addEventListener("loadedmetadata", () => {
            setIsLoading(false);
            video.play().catch(console.error);
          });
          video.addEventListener("error", () => {
            setIsLoading(false);
            if (onError) onError();
          });
        }
      }
    };

    initializePlayer();

    return () => {
      if (hls) {
        hls.stopLoad();
        hls.destroy();
      }
      if (video) {
        video.pause();
        video.src = "";
        video.load();
      }
    };
  }, [src, onError, quality]);

  return (
    <div
      style={{
        width: "400px",
        height: "225px",
        backgroundColor: "#000000",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1,
          }}
        >
          <Spin>
            <div style={{ padding: "20px", color: "white" }}>
              Đang kết nối...
            </div>
          </Spin>
          <Progress
            type="circle"
            percent={bufferHealth}
            size="small"
            style={{ marginTop: 10 }}
          />
        </div>
      )}
      <video
        ref={videoRef}
        controls
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: isLoading ? 0.3 : 1,
        }}
      />
      {!isLoading && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "5px",
            background: "rgba(0, 0, 0, 0.5)",
            color: "white",
            fontSize: "12px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Bitrate: {stats.bitrate}kbps</span>
          <span>FPS: {stats.fps}</span>
          <span>Buffer: {bufferHealth}%</span>
        </div>
      )}
    </div>
  );
};

export default HLSPlayer;
