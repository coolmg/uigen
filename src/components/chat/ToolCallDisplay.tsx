"use client";

import { Loader2 } from "lucide-react";

interface ToolCallDisplayProps {
  toolInvocation: {
    toolName: string;
    args: Record<string, any>;
    state: 'result' | string;
    result?: any;
  };
  isLoading?: boolean;
}

function getFileName(path: string): string {
  if (!path) return "file";
  return path.split('/').pop() || path;
}

function getUserFriendlyMessage(toolName: string, args: Record<string, any>): string {
  if (toolName === "str_replace_editor") {
    const command = args.command;
    const path = args.path;
    const fileName = getFileName(path);

    switch (command) {
      case "create":
        return `Creating ${fileName}`;
      case "str_replace":
        return `Editing ${fileName}`;
      case "insert":
        return `Updating ${fileName}`;
      case "view":
        return `Reading ${fileName}`;
      default:
        return `Working on ${fileName}`;
    }
  }

  if (toolName === "file_manager") {
    const command = args.command;
    const path = args.path;
    const newPath = args.new_path;
    const fileName = getFileName(path);
    const newFileName = getFileName(newPath);

    switch (command) {
      case "rename":
        return `Renaming ${fileName} to ${newFileName}`;
      case "delete":
        return `Deleting ${fileName}`;
      default:
        return `Managing ${fileName}`;
    }
  }

  // Fallback to technical name for unknown tools
  return toolName;
}

export function ToolCallDisplay({ toolInvocation, isLoading }: ToolCallDisplayProps) {
  const { toolName, args, state, result } = toolInvocation;
  const message = getUserFriendlyMessage(toolName, args);
  const isCompleted = state === "result" && result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isCompleted ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}