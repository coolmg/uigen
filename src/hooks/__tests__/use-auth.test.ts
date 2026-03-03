import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { signIn as signInAction, signUp as signUpAction } from "@/actions";
import { getAnonWorkData, clearAnonWork } from "@/lib/anon-work-tracker";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";

// Mock all dependencies
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/actions", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("@/lib/anon-work-tracker", () => ({
  getAnonWorkData: vi.fn(),
  clearAnonWork: vi.fn(),
}));

vi.mock("@/actions/get-projects", () => ({
  getProjects: vi.fn(),
}));

vi.mock("@/actions/create-project", () => ({
  createProject: vi.fn(),
}));

describe("useAuth", () => {
  const mockPush = vi.fn();
  const mockSignInAction = vi.mocked(signInAction);
  const mockSignUpAction = vi.mocked(signUpAction);
  const mockGetAnonWorkData = vi.mocked(getAnonWorkData);
  const mockClearAnonWork = vi.mocked(clearAnonWork);
  const mockGetProjects = vi.mocked(getProjects);
  const mockCreateProject = vi.mocked(createProject);
  const mockUseRouter = vi.mocked(useRouter);

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });

    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("initial state", () => {
    it("should return initial state with isLoading false", () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);
      expect(typeof result.current.signIn).toBe("function");
      expect(typeof result.current.signUp).toBe("function");
    });
  });

  describe("signIn", () => {
    it("should handle successful sign in with anonymous work", async () => {
      const mockAnonWork = {
        messages: [{ id: "1", content: "test message" }],
        fileSystemData: { "/": {}, "/test.js": { content: "console.log('test')" } },
      };
      const mockProject = { id: "project-123", name: "Test Project" };

      mockSignInAction.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(mockAnonWork);
      mockCreateProject.mockResolvedValue(mockProject);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const response = await result.current.signIn("test@example.com", "password123");
        expect(response).toEqual({ success: true });
      });

      await waitFor(() => {
        expect(mockSignInAction).toHaveBeenCalledWith("test@example.com", "password123");
        expect(mockGetAnonWorkData).toHaveBeenCalled();
        expect(mockCreateProject).toHaveBeenCalledWith({
          name: expect.stringMatching(/^Design from /),
          messages: mockAnonWork.messages,
          data: mockAnonWork.fileSystemData,
        });
        expect(mockClearAnonWork).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith("/project-123");
      });
    });

    it("should handle successful sign in with existing projects", async () => {
      const mockProjects = [
        { id: "project-1", name: "Recent Project" },
        { id: "project-2", name: "Older Project" },
      ];

      mockSignInAction.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(null);
      mockGetProjects.mockResolvedValue(mockProjects);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      await waitFor(() => {
        expect(mockGetProjects).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith("/project-1");
      });
    });

    it("should handle successful sign in with no existing projects", async () => {
      const mockNewProject = { id: "new-project-123", name: "New Design #12345" };

      mockSignInAction.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(null);
      mockGetProjects.mockResolvedValue([]);
      mockCreateProject.mockResolvedValue(mockNewProject);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      await waitFor(() => {
        expect(mockGetProjects).toHaveBeenCalled();
        expect(mockCreateProject).toHaveBeenCalledWith({
          name: expect.stringMatching(/^New Design #\d+$/),
          messages: [],
          data: {},
        });
        expect(mockPush).toHaveBeenCalledWith("/new-project-123");
      });
    });

    it("should handle sign in failure", async () => {
      const errorResult = { success: false, error: "Invalid credentials" };
      mockSignInAction.mockResolvedValue(errorResult);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const response = await result.current.signIn("test@example.com", "wrongpassword");
        expect(response).toEqual(errorResult);
      });

      expect(mockSignInAction).toHaveBeenCalledWith("test@example.com", "wrongpassword");
      expect(mockGetAnonWorkData).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should set loading state during sign in", async () => {
      mockSignInAction.mockImplementation(() => 
        new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
      );
      mockGetAnonWorkData.mockReturnValue(null);
      mockGetProjects.mockResolvedValue([]);
      mockCreateProject.mockResolvedValue({ id: "test", name: "Test" });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.signIn("test@example.com", "password123");
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should handle anonymous work with empty messages", async () => {
      const mockAnonWork = {
        messages: [],
        fileSystemData: { "/": {} },
      };
      const mockProjects = [{ id: "existing-project", name: "Existing" }];

      mockSignInAction.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(mockAnonWork);
      mockGetProjects.mockResolvedValue(mockProjects);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      await waitFor(() => {
        expect(mockCreateProject).not.toHaveBeenCalled();
        expect(mockGetProjects).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith("/existing-project");
      });
    });

    it("should handle errors during post sign-in processing", async () => {
      mockSignInAction.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockImplementation(() => {
        throw new Error("Storage error");
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        // The error should propagate since handlePostSignIn is not wrapped in try-catch
        await expect(result.current.signIn("test@example.com", "password123")).rejects.toThrow("Storage error");
      });

      // Should still set loading to false even if post-processing fails
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("signUp", () => {
    it("should handle successful sign up with anonymous work", async () => {
      const mockAnonWork = {
        messages: [{ id: "1", content: "test message" }],
        fileSystemData: { "/": {}, "/component.jsx": { content: "export default function Component() {}" } },
      };
      const mockProject = { id: "signup-project-123", name: "Test Project" };

      mockSignUpAction.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(mockAnonWork);
      mockCreateProject.mockResolvedValue(mockProject);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const response = await result.current.signUp("newuser@example.com", "password123");
        expect(response).toEqual({ success: true });
      });

      await waitFor(() => {
        expect(mockSignUpAction).toHaveBeenCalledWith("newuser@example.com", "password123");
        expect(mockGetAnonWorkData).toHaveBeenCalled();
        expect(mockCreateProject).toHaveBeenCalledWith({
          name: expect.stringMatching(/^Design from /),
          messages: mockAnonWork.messages,
          data: mockAnonWork.fileSystemData,
        });
        expect(mockClearAnonWork).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith("/signup-project-123");
      });
    });

    it("should handle successful sign up without anonymous work", async () => {
      const mockNewProject = { id: "new-user-project", name: "New Design #54321" };

      mockSignUpAction.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(null);
      mockGetProjects.mockResolvedValue([]);
      mockCreateProject.mockResolvedValue(mockNewProject);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("newuser@example.com", "password123");
      });

      await waitFor(() => {
        expect(mockGetProjects).toHaveBeenCalled();
        expect(mockCreateProject).toHaveBeenCalledWith({
          name: expect.stringMatching(/^New Design #\d+$/),
          messages: [],
          data: {},
        });
        expect(mockPush).toHaveBeenCalledWith("/new-user-project");
      });
    });

    it("should handle sign up failure", async () => {
      const errorResult = { success: false, error: "Email already registered" };
      mockSignUpAction.mockResolvedValue(errorResult);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const response = await result.current.signUp("existing@example.com", "password123");
        expect(response).toEqual(errorResult);
      });

      expect(mockSignUpAction).toHaveBeenCalledWith("existing@example.com", "password123");
      expect(mockGetAnonWorkData).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should set loading state during sign up", async () => {
      mockSignUpAction.mockImplementation(() => 
        new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
      );
      mockGetAnonWorkData.mockReturnValue(null);
      mockGetProjects.mockResolvedValue([]);
      mockCreateProject.mockResolvedValue({ id: "test", name: "Test" });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.signUp("newuser@example.com", "password123");
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("handlePostSignIn", () => {
    it("should prioritize anonymous work over existing projects", async () => {
      const mockAnonWork = {
        messages: [{ id: "1", content: "anon message" }],
        fileSystemData: { "/": {}, "/anon.js": { content: "// anon work" } },
      };
      const mockProjects = [{ id: "existing", name: "Existing Project" }];
      const mockProject = { id: "anon-project", name: "Anon Project" };

      mockSignInAction.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(mockAnonWork);
      mockGetProjects.mockResolvedValue(mockProjects);
      mockCreateProject.mockResolvedValue(mockProject);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      await waitFor(() => {
        expect(mockCreateProject).toHaveBeenCalledWith({
          name: expect.stringMatching(/^Design from /),
          messages: mockAnonWork.messages,
          data: mockAnonWork.fileSystemData,
        });
        expect(mockGetProjects).not.toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith("/anon-project");
      });
    });

    it("should generate unique project names based on current time", async () => {
      const mockAnonWork = {
        messages: [{ id: "1", content: "test" }],
        fileSystemData: { "/": {} },
      };
      const mockProject = { id: "time-project", name: "Time Project" };

      // Mock Date.prototype.toLocaleTimeString
      const mockTimeString = "3:45:30 PM";
      vi.spyOn(Date.prototype, "toLocaleTimeString").mockReturnValue(mockTimeString);

      mockSignInAction.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(mockAnonWork);
      mockCreateProject.mockResolvedValue(mockProject);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      await waitFor(() => {
        expect(mockCreateProject).toHaveBeenCalledWith({
          name: `Design from ${mockTimeString}`,
          messages: mockAnonWork.messages,
          data: mockAnonWork.fileSystemData,
        });
      });
    });

    it("should generate random project names when no existing projects", async () => {
      // Mock Math.random to return predictable value
      vi.spyOn(Math, "random").mockReturnValue(0.12345);

      const mockProject = { id: "random-project", name: "Random Project" };

      mockSignInAction.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(null);
      mockGetProjects.mockResolvedValue([]);
      mockCreateProject.mockResolvedValue(mockProject);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      await waitFor(() => {
        expect(mockCreateProject).toHaveBeenCalledWith({
          name: "New Design #12345", // ~~(0.12345 * 100000) = 12345
          messages: [],
          data: {},
        });
      });
    });
  });

  describe("error handling", () => {
    it("should handle network errors during sign in", async () => {
      mockSignInAction.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await expect(result.current.signIn("test@example.com", "password123")).rejects.toThrow("Network error");
      });

      expect(result.current.isLoading).toBe(false);
    });

    it("should handle network errors during sign up", async () => {
      mockSignUpAction.mockRejectedValue(new Error("Database error"));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await expect(result.current.signUp("test@example.com", "password123")).rejects.toThrow("Database error");
      });

      expect(result.current.isLoading).toBe(false);
    });

    it("should reset loading state even if post-sign-in fails", async () => {
      mockSignInAction.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(null);
      mockGetProjects.mockRejectedValue(new Error("Database error"));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        // The error should propagate since handlePostSignIn is not wrapped in try-catch
        await expect(result.current.signIn("test@example.com", "password123")).rejects.toThrow("Database error");
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle null anonymous work data", async () => {
      const mockProjects = [{ id: "project-1", name: "Project 1" }];

      mockSignInAction.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(null);
      mockGetProjects.mockResolvedValue(mockProjects);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      await waitFor(() => {
        expect(mockCreateProject).not.toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith("/project-1");
      });
    });

    it("should handle empty projects array", async () => {
      const mockProject = { id: "new-project", name: "New Design #99999" };

      mockSignInAction.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(null);
      mockGetProjects.mockResolvedValue([]);
      mockCreateProject.mockResolvedValue(mockProject);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      await waitFor(() => {
        expect(mockCreateProject).toHaveBeenCalledWith({
          name: expect.stringMatching(/^New Design #\d+$/),
          messages: [],
          data: {},
        });
        expect(mockPush).toHaveBeenCalledWith("/new-project");
      });
    });

    it("should handle anonymous work with only filesystem data", async () => {
      const mockAnonWork = {
        messages: [],
        fileSystemData: { 
          "/": {},
          "/component.tsx": { content: "export default function Component() { return <div>Hello</div>; }" },
          "/styles.css": { content: ".container { padding: 1rem; }" }
        },
      };

      mockSignInAction.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(mockAnonWork);
      mockGetProjects.mockResolvedValue([{ id: "existing", name: "Existing" }]);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      await waitFor(() => {
        // Should still go to existing projects since messages.length === 0
        expect(mockCreateProject).not.toHaveBeenCalled();
        expect(mockGetProjects).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith("/existing");
      });
    });
  });
});