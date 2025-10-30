"use client";
import { useEffect } from "react";
import { mirageServer } from "../../mirage/server";

export default function FrontendHandler() {
  useEffect(() => {
    mirageServer.start();
    return () => {
      mirageServer.stop();
    };
  }, []);

  return null;
}
