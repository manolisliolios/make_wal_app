"use client";

import { ChatDialog } from "@/components/chat-dialog";
import { CodeEditor } from "@/components/code-editor";
import { CopyButton } from "@/components/copy-button";
import { EditorToolbar } from "@/components/editor-toolbar";
import { Preview, PreviewControls } from "@/components/preview";
import { useGenerationStore } from "@/hooks/generation-store";
import { useMemo, useState } from "react";

export const EditorLayout = () => {
  const view = useGenerationStore((state) => state.view);
  const versions = useGenerationStore((state) => state.versions);
  const currentVersion = useGenerationStore((state) => state.currentVersion);
  const currentCode = versions[currentVersion]?.code ?? "";
  const [viewerSize, setViewerSize] = useState("100");

  const toolbarActions = useMemo(() => {
    if (view === "preview") {
      return (
        <PreviewControls
          viewerSize={viewerSize}
          onViewerSizeChange={setViewerSize}
        />
      );
    }
    if (view === "code") {
      return <CopyButton value={currentCode} className="h-8" />;
    }
    return null;
  }, [view, viewerSize, currentCode]);

  return (
    <div className="flex-1 relative py-3 pl-4 pr-1 flex flex-col gap-2 border-l border-border">
      <EditorToolbar actions={toolbarActions} />
      <Preview
        className={view === "preview" ? "block" : "hidden"}
        viewerSize={viewerSize}
        onViewerSizeChange={setViewerSize}
      />
      <CodeEditor className={view === "code" ? "block" : "hidden"} />
      <ChatDialog />
    </div>
  );
};
