import { test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallDisplay } from "../ToolCallDisplay";

afterEach(() => {
  cleanup();
});

// str_replace_editor tool tests
test("shows 'Creating' message for str_replace_editor create command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    args: {
      command: "create",
      path: "/App.jsx",
      file_text: "export default function App() { return <div>Hello</div>; }"
    },
    state: "result" as const,
    result: "File created successfully"
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("shows 'Editing' message for str_replace_editor str_replace command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    args: {
      command: "str_replace",
      path: "/components/Button.tsx",
      old_str: "old code",
      new_str: "new code"
    },
    state: "result" as const,
    result: "File updated successfully"
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("Editing Button.tsx")).toBeDefined();
});

test("shows 'Updating' message for str_replace_editor insert command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    args: {
      command: "insert",
      path: "/utils/helpers.js",
      insert_line: 5,
      new_str: "console.log('debug');"
    },
    state: "result" as const,
    result: "Content inserted successfully"
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("Updating helpers.js")).toBeDefined();
});

test("shows 'Reading' message for str_replace_editor view command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    args: {
      command: "view",
      path: "/package.json",
      view_range: [1, 10]
    },
    state: "result" as const,
    result: "File content retrieved"
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("Reading package.json")).toBeDefined();
});

test("shows 'Working on' message for str_replace_editor unknown command", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    args: {
      command: "unknown_command",
      path: "/test.js"
    },
    state: "result" as const,
    result: "Operation completed"
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("Working on test.js")).toBeDefined();
});

// file_manager tool tests
test("shows 'Renaming' message for file_manager rename command", () => {
  const toolInvocation = {
    toolName: "file_manager",
    args: {
      command: "rename",
      path: "/old.txt",
      new_path: "/new.txt"
    },
    state: "result" as const,
    result: { success: true, message: "File renamed successfully" }
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("Renaming old.txt to new.txt")).toBeDefined();
});

test("shows 'Deleting' message for file_manager delete command", () => {
  const toolInvocation = {
    toolName: "file_manager",
    args: {
      command: "delete",
      path: "/temp.js"
    },
    state: "result" as const,
    result: { success: true, message: "File deleted successfully" }
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("Deleting temp.js")).toBeDefined();
});

test("shows 'Managing' message for file_manager unknown command", () => {
  const toolInvocation = {
    toolName: "file_manager",
    args: {
      command: "unknown_operation",
      path: "/test.js"
    },
    state: "result" as const,
    result: { success: true }
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("Managing test.js")).toBeDefined();
});

// Loading state tests
test("shows loading spinner when tool is in progress", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    args: {
      command: "create",
      path: "/App.jsx"
    },
    state: "in-progress",
    result: undefined
  };

  const { container } = render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("shows green dot when tool is completed", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    args: {
      command: "create",
      path: "/App.jsx"
    },
    state: "result" as const,
    result: "Success"
  };

  const { container } = render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

// Edge cases
test("handles missing path gracefully", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    args: {
      command: "create",
      // path is missing
    },
    state: "result" as const,
    result: "Success"
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("Creating file")).toBeDefined();
});

test("handles empty path gracefully", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    args: {
      command: "create",
      path: ""
    },
    state: "result" as const,
    result: "Success"
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("Creating file")).toBeDefined();
});

test("extracts filename from nested path", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    args: {
      command: "create",
      path: "/src/components/ui/Button.tsx"
    },
    state: "result" as const,
    result: "Success"
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("handles missing args gracefully", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    args: {},
    state: "result" as const,
    result: "Success"
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("Working on file")).toBeDefined();
});

test("falls back to technical name for unknown tools", () => {
  const toolInvocation = {
    toolName: "unknown_tool",
    args: {
      some_arg: "value"
    },
    state: "result" as const,
    result: "Success"
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("handles missing new_path in rename operation", () => {
  const toolInvocation = {
    toolName: "file_manager",
    args: {
      command: "rename",
      path: "/old.txt"
      // new_path is missing
    },
    state: "result" as const,
    result: { success: true }
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  expect(screen.getByText("Renaming old.txt to file")).toBeDefined();
});

test("applies correct CSS classes", () => {
  const toolInvocation = {
    toolName: "str_replace_editor",
    args: {
      command: "create",
      path: "/App.jsx"
    },
    state: "result" as const,
    result: "Success"
  };

  const { container } = render(<ToolCallDisplay toolInvocation={toolInvocation} />);
  
  const element = container.firstChild as HTMLElement;
  expect(element.className).toContain("inline-flex");
  expect(element.className).toContain("items-center");
  expect(element.className).toContain("gap-2");
  expect(element.className).toContain("bg-neutral-50");
  expect(element.className).toContain("rounded-lg");
  expect(element.className).toContain("text-xs");
  expect(element.className).toContain("font-mono");
});