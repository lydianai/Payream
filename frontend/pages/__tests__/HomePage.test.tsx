import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import HomePage from "../HomePage";

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
      }))
    },
    news: {
      getNews: vi.fn(() => Promise.resolve({
        news: [],
        total: 0
      }))
    }
  }
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const HomePageWithProviders = () => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe("HomePage Component", () => {
  it("renders the main heading", () => {
    render(<HomePageWithProviders />);
    
    expect(screen.getByText(/Türkiye'nin En Kapsamlı/)).toBeInTheDocument();
    expect(screen.getByText(/Fintech/)).toBeInTheDocument();
    expect(screen.getByText(/Platformu/)).toBeInTheDocument();
  });

  it("renders the hero description", () => {
    render(<HomePageWithProviders />);
    
    expect(screen.getByText(/POS sistemleri, blockchain teknolojileri ve fintech çözümlerini karşılaştırın/)).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<HomePageWithProviders />);
    
    expect(screen.getByRole("link", { name: /fintech çözümlerini keşfet/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ai finans uzmanı/i })).toBeInTheDocument();
  });

  it("displays statistics", () => {
    render(<HomePageWithProviders />);
    
    expect(screen.getByText("80+")).toBeInTheDocument();
    expect(screen.getByText("Fintech Çözümü")).toBeInTheDocument();
    expect(screen.getByText("25K+")).toBeInTheDocument();
    expect(screen.getByText("Aktif Kullanıcı")).toBeInTheDocument();
  });

  it("renders features section", () => {
    render(<HomePageWithProviders />);
    
    expect(screen.getByText("Gelişmiş Arama")).toBeInTheDocument();
    expect(screen.getByText("Gerçek Zamanlı Veriler")).toBeInTheDocument();
    expect(screen.getByText("AI Finans Uzmanı")).toBeInTheDocument();
  });

  it("renders benefits section", () => {
    render(<HomePageWithProviders />);
    
    expect(screen.getByText("Blockchain Güvenliği")).toBeInTheDocument();
    expect(screen.getByText("Anında İşlemler")).toBeInTheDocument();
    expect(screen.getByText("Çoklu Ödeme Desteği")).toBeInTheDocument();
  });

  it("renders footer with company information", () => {
    render(<HomePageWithProviders />);
    
    expect(screen.getByText("PAYREAM")).toBeInTheDocument();
    expect(screen.getByText(/Türkiye'nin en kapsamlı fintech platformu/)).toBeInTheDocument();
  });

  it("has correct navigation links in action buttons", () => {
    render(<HomePageWithProviders />);
    
    const exploreLink = screen.getByRole("link", { name: /fintech çözümlerini keşfet/i });
    const chatLink = screen.getByRole("link", { name: /ai finans uzmanı/i });
    
    expect(exploreLink).toHaveAttribute("href", "/search");
    expect(chatLink).toHaveAttribute("href", "/chat");
  });

  it("renders search box component", () => {
    render(<HomePageWithProviders />);
    
    expect(screen.getByPlaceholderText(/pos, blockchain, fintech çözümü ara/i)).toBeInTheDocument();
  });

  it("renders logo component", () => {
    render(<HomePageWithProviders />);
    
    // Logo should be rendered (check for SVG element)
    expect(document.querySelector("svg")).toBeInTheDocument();
  });
});
