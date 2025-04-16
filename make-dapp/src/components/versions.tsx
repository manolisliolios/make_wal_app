import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGenerationStore } from "@/hooks/generation-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ComponentPropsWithoutRef } from "react";

export function Versions({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const versions = useGenerationStore((state) => state.versions);
  const currentVersion = useGenerationStore((state) => state.currentVersion);
  const setCurrentVersion = useGenerationStore(
    (state) => state.setCurrentVersion,
  );
  const currentVersionData = versions[currentVersion];
  const isGenerating = currentVersionData?.status === "generating";

  return (
    <div {...props} className={cn("flex items-center gap-2", className)}>
      <Select
        value={currentVersion.toString()}
        onValueChange={(value) => setCurrentVersion(parseInt(value))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select version" />
        </SelectTrigger>
        <SelectContent>
          {versions.map((version) => (
            <SelectItem
              key={version.versionNumber}
              value={version.versionNumber.toString()}
              disabled={version.status === "generating"}
            >
              <div className="flex items-center justify-between w-full">
                <span>Version {version.versionNumber + 1}</span>
                {version.status === "generating" && (
                  <Badge variant="secondary" className="text-[10px] px-1 py-0">
                    Loading...
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
