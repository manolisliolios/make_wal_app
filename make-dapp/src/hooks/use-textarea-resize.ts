"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import type { ComponentProps } from "react";

export function useTextareaResize(
  value: ComponentProps<"textarea">["value"],
  rows = 1,
) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = useCallback(
    (textArea: HTMLTextAreaElement | null) => {
      if (textArea) {
        // Get the line height to calculate minimum height based on rows
        const computedStyle = window.getComputedStyle(textArea);
        const lineHeight = Number.parseInt(computedStyle.lineHeight, 10) || 20;
        const padding =
          Number.parseInt(computedStyle.paddingTop, 10) +
          Number.parseInt(computedStyle.paddingBottom, 10);

        // Calculate minimum height based on rows
        const minHeight = lineHeight * rows + padding;

        // Reset height to auto first to get the correct scrollHeight
        textArea.style.height = "0px";
        const scrollHeight = Math.max(textArea.scrollHeight, minHeight);

        // Set the final height
        textArea.style.height = `${scrollHeight + 2}px`;
      }
    },
    [rows],
  );

  // Handle initial ref assignment and updates
  const setTextareaRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;
      resizeTextarea(node);
    },
    [resizeTextarea],
  );

  // Handle value changes
  useLayoutEffect(() => {
    resizeTextarea(textareaRef.current);
  }, [resizeTextarea, value]);

  return setTextareaRef;
}
