import { useEffect, useState } from "react";

interface CanvasMessage {
  type: string;
  code: string;
}

export default function Canvas() {
  const [code, setCode] = useState("");

  useEffect(() => {
    const handleMessage = (event: MessageEvent<CanvasMessage>) => {
      if (event.data.type === "CODE") {
        setCode(event.data.code);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="w-full h-full p-4">
      {code ? (
        <div dangerouslySetInnerHTML={{ __html: code }} />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No code to preview
        </div>
      )}
    </div>
  );
}
