import React from "react";
import { RingLoader } from "react-spinners";

export default function RingLoaderCompoenent({size = 150, color = "#000000"}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10%",
      }}
    >
      <RingLoader color={color} size={size} />
    </div>
  );
}
