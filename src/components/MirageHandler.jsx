import { useEffect } from "react";
import { mirageServer } from "../../mirage/server";

export default function MirageHandler() {
  useEffect(() => {
    mirageServer.start();
    return () => {
      mirageServer.stop();
    };
  }, []);

  return null;
}
