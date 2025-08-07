import { describe, it, expect, beforeEach, vi } from "vitest";
import { chat } from "./chat";
import { secret } from "encore.dev/config";

// Mock fetch globally
global.fetch = vi.fn();

// Mock Encore secrets
vi.mock("encore.dev/config", () => ({
  secret: vi.fn((name: string) => () => `mock-secret-${name}`),
}));

describe("Chat API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return AI response for valid request", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "Bu bir test yanıtıdır."
            }
          }
        ]
      })
    };

    (global.fetch as any).mockResolvedValueOnce(mockResponse);

    const result = await chat({
      message: "POS sistemleri hakkında bilgi ver",
      context: "Test context"
    });

    expect(result.response).toBe("Bu bir test yanıtıdır.");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.openai.com/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Authorization": "Bearer mock-secret-OpenAIKey",
          "Content-Type": "application/json"
        }
      })
    );
  });

  it("should handle OpenAI API errors gracefully", async () => {
    const mockResponse = {
      ok: false,
      status: 429
    };

    (global.fetch as any).mockResolvedValueOnce(mockResponse);

    const result = await chat({
      message: "Test message"
    });

    expect(result.response).toBe("Üzgünüm, teknik bir sorun yaşandı. Lütfen daha sonra tekrar deneyin.");
  });

  it("should handle network errors gracefully", async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

    const result = await chat({
      message: "Test message"
    });

    expect(result.response).toBe("Üzgünüm, teknik bir sorun yaşandı. Lütfen daha sonra tekrar deneyin.");
  });

  it("should include context in the request when provided", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "Yanıt"
            }
          }
        ]
      })
    };

    (global.fetch as any).mockResolvedValueOnce(mockResponse);

    await chat({
      message: "Test message",
      context: "Test context"
    });

    const fetchCall = (global.fetch as any).mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);
    
    expect(requestBody.messages[1].content).toContain("Bağlam: Test context");
    expect(requestBody.messages[1].content).toContain("Soru: Test message");
  });

  it("should handle missing response content", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: null
            }
          }
        ]
      })
    };

    (global.fetch as any).mockResolvedValueOnce(mockResponse);

    const result = await chat({
      message: "Test message"
    });

    expect(result.response).toBe("Üzgünüm, şu anda yanıt veremiyorum.");
  });
});
