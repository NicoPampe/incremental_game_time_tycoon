import Image from "next/image";
import App from "./app";
import { StrictMode } from "react";

export default function Home() {
  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}
