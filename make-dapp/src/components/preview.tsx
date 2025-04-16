"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useGenerationStore } from "@/hooks/generation-store";
import { LoaderCircle, Monitor, Smartphone, Tablet } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

interface PreviewProps {
  className?: string;
  viewerSize: string;
  onViewerSizeChange: (size: string) => void;
}

export function PreviewControls({
  viewerSize,
  onViewerSizeChange,
}: {
  viewerSize: string;
  onViewerSizeChange: (value: string) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      size="sm"
      defaultValue="100"
      value={viewerSize}
      onValueChange={(value) => {
        onViewerSizeChange(value);
      }}
      className="items-center gap-1.5 rounded-md border p-1 shadow-sm flex bg-background"
    >
      <ToggleGroupItem value="100" className="h-7 w-7 rounded-sm p-0">
        <Monitor className="h-3.5 w-3.5" />
      </ToggleGroupItem>
      <ToggleGroupItem value="60" className="h-7 w-7 rounded-sm p-0">
        <Tablet className="h-3.5 w-3.5" />
      </ToggleGroupItem>
      <ToggleGroupItem value="35" className="h-7 w-7 rounded-sm p-0">
        <Smartphone className="h-3.5 w-3.5" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function Preview({
  className,
  viewerSize,
  onViewerSizeChange,
}: PreviewProps) {
  const versions = useGenerationStore((state) => state.versions);
  const currentVersion = useGenerationStore((state) => state.currentVersion);
  const currentCode = versions[currentVersion]?.code ?? "";
  const isGenerating = versions[currentVersion]?.status === "generating";
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const viewerPanelRef = useRef<ImperativePanelHandle>(null);
  const [lastValidCode, setLastValidCode] = useState("");
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  const updateIframeContent = useCallback(
    (code: string) => {
      if (!iframeRef.current?.contentWindow) return;

      const iframeDoc = iframeRef.current.contentDocument;
      if (!iframeDoc) return;

      try {
        // Only update if the code is valid HTML
        if (code.includes("<") && code.includes(">")) {
          // Clear any pending updates
          if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
          }

          // Debounce the update to prevent too frequent re-renders
          updateTimeoutRef.current = setTimeout(() => {
            try {
              // Extract and apply styles
              const styleContent = code.includes("<style>")
                ? code.split("<style>")[1].split("</style>")[0]
                : "";

              // Get the body content
              const bodyContent = code.includes("<body>")
                ? code.split("<body>")[1].split("</body>")[0]
                : code;

              // Only update if the content has changed
              if (bodyContent !== lastValidCode) {
                // Clear previous content
                iframeDoc.open();
                iframeDoc.write(`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        ${styleContent}
                      </style>
                    </head>
                    <body>
                      ${bodyContent}
                    </body>
                  </html>
                `);
                iframeDoc.close();
                setLastValidCode(bodyContent);
              }
            } catch (error) {
              console.error("Error updating iframe content:", error);
              // If there's an error, revert to last valid code
              if (lastValidCode) {
                updateIframeContent(lastValidCode);
              }
            }
          }, 100); // Debounce for 100ms
        }
      } catch (error) {
        console.error("Error processing code:", error);
      }
    },
    [lastValidCode],
  );

  useEffect(() => {
    updateIframeContent(currentCode);
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [updateIframeContent, currentCode]);

  useEffect(() => {
    if (viewerPanelRef.current) {
      viewerPanelRef.current.resize(Number.parseInt(viewerSize));
    }
  }, [viewerSize]);

  return (
    <div className={cn("flex-1 relative", className)}>
      <div
        className={cn(
          "h-full relative after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-lg after:bg-muted-foreground/25 after:border after:border-border",
        )}
      >
        <ResizablePanelGroup direction="horizontal" className="relative z-10">
          <ResizablePanel
            ref={viewerPanelRef}
            order={1}
            className={cn(
              "relative rounded-lg border bg-background border-border",
            )}
            defaultSize={Number.parseInt(viewerSize)}
            onResize={(size) => {
              onViewerSizeChange(size.toString());
            }}
            minSize={30}
          >
            <iframe
              ref={iframeRef}
              title="block-preview"
              className="relative z-20 w-full h-full bg-background"
              sandbox="allow-scripts allow-same-origin"
            />
            {isGenerating && (
              <div className="absolute inset-0 z-30 bg-background/50 backdrop-blur-[1px] flex items-center justify-center pointer-events-auto animate-pulse">
                <LoaderCircle className="w-10 h-10 animate-spin" />
              </div>
            )}
          </ResizablePanel>
          <ResizableHandle
            className={cn(
              "relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10 sm:block",
            )}
          />
          <ResizablePanel defaultSize={0} minSize={0} order={2} />
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
