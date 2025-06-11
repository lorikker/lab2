import { ImageResponse } from "next/og";

// Image metadata
export const alt = "About SixStar Fitness";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: "#2A2A2A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <div
          style={{ color: "#D5FC51", fontWeight: "bold", marginBottom: "20px" }}
        >
          SixStar Fitness
        </div>
        <div style={{ fontSize: 48 }}>About Us</div>
      </div>
    ),
    size,
  );
}
