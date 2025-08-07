import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../App";

// Mock the backend client
vi.mock("~backend/client", () => ({
  default: {
    pos: {
      search: vi.fn(() => Promise.resolve({
        providers: [],
        total: 0,
        filters: {
          categories: [],
          minCommission: 0,
          maxCommission: 5,
          avgRating: 4.0
        }
      })),
      getCategories: vi.fn(() => Promise.resolve({
        categories: []
      }))
    },
    news: {
      getNews: vi.fn(() => Promise.resolve({
        news: [],
        total: 0
      }))
    },
    chat: {
      chat: vi.fn(() => Promise.resolve({
        response: "Test response"
      }))
    }
  }
}));

describe("App Component", () => {
  it("renders without crashing", () => {
    render(<App />);
    
    // Should render the header
    expect(screen.getByText("PAYREAM")).toBeInTheDocument();
  });

  it("renders header navigation", () => {
    render(<App />);
    
    expect(screen.getByText("Ana Sayfa")).toBeInTheDocument();
    expect(screen.getByText("POS Ara")).toBeInTheDocument();
    expect(screen.getByText("AI Finans Uzmanı")).toBeInTheDocument();
  });

  it("renders assistant robot", () => {
    render(<App />);
    
    // Should render the robot button
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has correct routing structure", async () => {
    render(<App />);
    
    // Should be on home page by default
    expect(await screen.findByText(/Türkiye'nin En Kapsamlı/)).toBeInTheDocument();
  });

  it("provides query client to children", () => {
    render(<App />);
    
    // Should not throw errors related to missing QueryClient
    expect(screen.getByText("PAYREAM")).toBeInTheDocument();
  });

  it("renders with white theme", () => {
    const { container } = render(<App />);
    
    expect(container.querySelector('.min-h-screen')).toHaveClass("bg-white");
  });
});
