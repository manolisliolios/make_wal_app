import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenerationStore } from "@/hooks/generation-store";
import {
  ChatInput,
  ChatInputSubmit,
  ChatInputTextArea,
} from "@/components/ui/chat-input";
import { useCompletion } from "@ai-sdk/react";
import { useEffect } from "react";

export function ChatDialog() {
  const versions = useGenerationStore((state) => state.versions);
  const currentVersion = useGenerationStore((state) => state.currentVersion);
  const setView = useGenerationStore((state) => state.setView);
  const updateCurrentCode = useGenerationStore(
    (state) => state.updateCurrentCode,
  );
  const updateStatus = useGenerationStore((state) => state.updateStatus);
  const addVersion = useGenerationStore((state) => state.addVersion);
  const chatOpen = useGenerationStore((state) => state.chatOpen);
  const setChatOpen = useGenerationStore((state) => state.setChatOpen);

  const {
    completion,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    stop,
    setInput,
  } = useCompletion({
    api: "http://localhost:3000/api/make-oai",
    onFinish: (prompt, completion) => {
      setView("preview");
      updateCurrentCode(completion);
      updateStatus("complete");
      setChatOpen(false);
    },
    body: {
      currentCode: versions[currentVersion]?.code ?? "",
    },
  });

  const handleGenerate = () => {
    addVersion("", input);
    handleSubmit();
    setInput("");
    setChatOpen(false);
  };

  useEffect(() => {
    if (completion) {
      updateCurrentCode(completion);
    }
  }, [completion, updateCurrentCode]);

  return (
    <Dialog open={chatOpen} onOpenChange={setChatOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What UI do you want to build?</DialogTitle>
        </DialogHeader>

        <ChatInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleGenerate}
          loading={isLoading}
          onStop={stop}
        >
          <ChatInputTextArea placeholder="Type your code generation prompt..." />
          <ChatInputSubmit />
        </ChatInput>
      </DialogContent>
    </Dialog>
  );
}
