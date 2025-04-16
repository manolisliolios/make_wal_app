import { cn } from "@/lib/utils";
import { useGenerationStore } from "@/hooks/generation-store";
import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useRef } from "react";

interface CodeEditorProps {
  className?: string;
}

export function CodeEditor({ className }: CodeEditorProps) {
  const versions = useGenerationStore((state) => state.versions);
  const currentVersion = useGenerationStore((state) => state.currentVersion);
  const updateCurrentCode = useGenerationStore(
    (state) => state.updateCurrentCode,
  );
  const editorRef = useRef<HTMLDivElement>(null);

  const currentCode = versions[currentVersion]?.code ?? "";
  const isGenerating = versions[currentVersion]?.status === "generating";

  useEffect(() => {
    if (editorRef.current && isGenerating) {
      const editor = editorRef.current.querySelector(".cm-editor");
      if (editor) {
        editor.scrollTop = editor.scrollHeight;
      }
    }
  }, [currentCode, isGenerating]);

  return (
    <div className={cn("flex-1 relative min-h-0", className)}>
      <div className="absolute inset-0 rounded-lg border" ref={editorRef}>
        <CodeMirror
          value={currentCode}
          height="100%"
          extensions={[javascript({ jsx: true })]}
          onChange={updateCurrentCode}
          theme="dark"
          className="h-full"
          readOnly={isGenerating}
        />
      </div>
    </div>
  );
}
