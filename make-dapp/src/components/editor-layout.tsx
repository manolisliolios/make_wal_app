"use client";

import { ChatDialog } from "@/components/chat-dialog";
import { CodeEditor } from "@/components/code-editor";
import { CopyButton } from "@/components/copy-button";
import { EditorToolbar } from "@/components/editor-toolbar";
import { Preview, PreviewControls } from "@/components/preview";
import { Versions } from "@/components/versions";
import { useGenerationStore } from "@/hooks/generation-store";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface EditorLayoutProps {
  className?: string;
}

export const EditorLayout = ({ className }: EditorLayoutProps) => {
  const view = useGenerationStore((state) => state.view);
  const versions = useGenerationStore((state) => state.versions);
  const currentVersion = useGenerationStore((state) => state.currentVersion);
  const currentCode = versions[currentVersion]?.code ?? "";
  const [viewerSize, setViewerSize] = useState("100");

  const toolbarActions = useMemo(() => {
    if (view === "preview") {
      return (
        <>
          <Versions />
          <PreviewControls
            viewerSize={viewerSize}
            onViewerSizeChange={setViewerSize}
          />
        </>
      );
    }
    if (view === "code") {
      return (
        <>
          <Versions />
          <CopyButton value={currentCode} className="h-8" />
        </>
      );
    }
    return null;
  }, [view, viewerSize, currentCode]);

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <EditorToolbar actions={toolbarActions} />
      <div className="flex-1 overflow-hidden">
        <Preview
          className={view === "preview" ? "block h-full" : "hidden"}
          viewerSize={viewerSize}
          onViewerSizeChange={setViewerSize}
        />
        <CodeEditor className={view === "code" ? "block h-full" : "hidden"} />
      </div>
      <ChatDialog />
    </div>
  );
};
