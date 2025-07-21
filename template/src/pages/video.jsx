import { useRef, useEffect } from "react";
import Hls from "hls.js";

const HLSPlayer = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
    }
  }, [src]);

  return (
    <div
      style={{
        width: "400px",
        height: "225px", // 16:9 tỉ lệ ngang
        backgroundColor: "black", // hoặc grey để thấy viền
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        controls
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain", // hoặc 'cover'
        }}
      />
    </div>
  );
};

export default HLSPlayer;
