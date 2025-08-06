import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "../App";

// Mock the backend client with realistic data
const mockSearchResults = {
  providers: [
    {
      id: "1",
      name: "PayTR",
      description: "Türkiye'nin önde gelen sanal POS çözümü",
      category: "Sanal POS",
      features: ["3D Secure", "API", "Mobile"],
      pricing: "Komisyon: %2.95",
      rating: 4.5,
      websiteUrl: "https://paytr.com",
      commission: 2.95,
      setupFee: "Ücretsiz",
      monthlyFee: "₺0",
      supportedCards: ["Visa", "Mastercard"],
      integrationTime: "1-2 gün",
      securityFeatures: ["3D Secure", "SSL"],
      customerSupport: "7/24",
      companySize: "Büyük",
      establishedYear: 2013
    }
  ],
  total: 1,
  filters: {
    categories: ["Sanal POS"],
    minCommission: 2.95,
    maxCommission: 2.95,
    avgRating: 4.5
  }
};

const mockCategories = {
  categories: [
    { id: "sanal-pos", name: "Sanal POS", description: "Test", count: 5 }
  ]
};

const mockNews = {
  news: [
    {
      id: "1",
      title: "TCMB Dijital Türk Lirası Pilot Uygulamasını Başlattı",
      summary: "Test summary",
      content: "Test content",
      category: "Blockchain",
      publishDate: new Date(),
      source: "TCMB",
      imageUrl: "/test.jpg",
      tags: ["CBDC"],
      readTime: 3
    }
  ],
  total: 1
};

const mockChatResponse = {
  response: "PayTR, Türkiye'nin önde gelen sanal POS sağlayıcılarından biridir."
};

vi.mock("~backend/client", () => ({
  default: {
    pos: {
      search: vi.fn(() => Promise.resolve(mockSearchResults)),
      getCategories: vi.fn(() => Promise.resolve(mockCategories))
    },
    news: {
      getNews: vi.fn(() => Promise.resolve(mockNews))
    },
    chat: {
      chat: vi.fn(() => Promise.resolve(mockChatResponse))
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

const AppWithProviders = () => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

describe("User Flow Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("completes the search flow from homepage", async () => {
    render(<AppWithProviders />);
    
    // User starts on homepage
    expect(screen.getByText(/Türkiye'nin En Kapsamlı/)).toBeInTheDocument();
    
    // User searches for POS systems
    const searchInput = screen.getByPlaceholderText(/pos, blockchain, fintech çözümü ara/i);
    const searchButton = screen.getByRole("button", { name: /ara/i });
    
    fireEvent.change(searchInput, { target: { value: "PayTR" } });
    fireEvent.click(searchButton);
    
    // User should be redirected to search page with results
    await waitFor(() => {
      expect(screen.getByText("Fintech Çözümleri Ara")).toBeInTheDocument();
    });
  });

  it("completes the chat interaction flow", async () => {
    render(<AppWithProviders />);
    
    // User navigates to chat page
    const chatLink = screen.getByRole("link", { name: /ai finans uzmanı/i });
    fireEvent.click(chatLink);
    
    await waitFor(() => {
      expect(screen.getByText("AI Finans Uzmanı")).toBeInTheDocument();
    });
    
    // User sends a message
    const chatInput = screen.getByPlaceholderText(/Fintech, blockchain veya POS hakkında soru sorun/i);
    const sendButton = screen.getByRole("button", { name: "" }); // Send button
    
    fireEvent.change(chatInput, { target: { value: "PayTR hakkında bilgi ver" } });
    fireEvent.click(sendButton);
    
    // User should see their message and AI response
    await waitFor(() => {
      expect(screen.getByText("PayTR hakkında bilgi ver")).toBeInTheDocument();
      expect(screen.getByText(/PayTR, Türkiye'nin önde gelen/)).toBeInTheDocument();
    });
  });

  it("completes the assistant robot interaction", async () => {
    render(<AppWithProviders />);
    
    // User clicks on the robot assistant
    const robotButton = screen.getByRole("button");
    fireEvent.click(robotButton);
    
    // Assistant should expand
    await waitFor(() => {
      expect(screen.getByText("PAYREAM Asistanı")).toBeInTheDocument();
    });
    
    // User clicks on chat button
    const chatButton = screen.getByRole("link", { name: /sohbet et/i });
    fireEvent.click(chatButton);
    
    // Should navigate to chat page
    await waitFor(() => {
      expect(screen.getByText("AI Finans Uzmanı")).toBeInTheDocument();
    });
  });

  it("completes the news browsing flow", async () => {
    render(<AppWithProviders />);
    
    // User should see news section on homepage
    await waitFor(() => {
      expect(screen.getByText("Fintech ve Blockchain Haberleri")).toBeInTheDocument();
      expect(screen.getByText("TCMB Dijital Türk Lirası Pilot Uygulamasını Başlattı")).toBeInTheDocument();
    });
    
    // User can see news categories and details
    expect(screen.getByText("Blockchain")).toBeInTheDocument();
    expect(screen.getByText("3 dk")).toBeInTheDocument();
  });

  it("completes the provider comparison flow", async () => {
    render(<AppWithProviders />);
    
    // User navigates to search page
    const searchLink = screen.getByRole("link", { name: /pos ara/i });
    fireEvent.click(searchLink);
    
    await waitFor(() => {
      expect(screen.getByText("Fintech Çözümleri Ara")).toBeInTheDocument();
    });
    
    // User should see provider results
    await waitFor(() => {
      expect(screen.getByText("PayTR")).toBeInTheDocument();
      expect(screen.getByText("Komisyon: %2.95")).toBeInTheDocument();
      expect(screen.getByText("4.5/5")).toBeInTheDocument();
    });
    
    // User can view provider details
    expect(screen.getByText("3D Secure")).toBeInTheDocument();
    expect(screen.getByText("Visa")).toBeInTheDocument();
    
    // User can visit provider website
    const detailsLink = screen.getByRole("link", { name: /detayları görüntüle/i });
    expect(detailsLink).toHaveAttribute("href", "https://paytr.com");
  });

  it("handles navigation between all pages", async () => {
    render(<AppWithProviders />);
    
    // Start on homepage
    expect(screen.getByText(/Türkiye'nin En Kapsamlı/)).toBeInTheDocument();
    
    // Navigate to search page
    const searchNavLink = screen.getByRole("link", { name: /pos ara/i });
    fireEvent.click(searchNavLink);
    
    await waitFor(() => {
      expect(screen.getByText("Fintech Çözümleri Ara")).toBeInTheDocument();
    });
    
    // Navigate to chat page
    const chatNavLink = screen.getByRole("link", { name: /ai finans uzmanı/i });
    fireEvent.click(chatNavLink);
    
    await waitFor(() => {
      expect(screen.getByText("AI Finans Uzmanı")).toBeInTheDocument();
    });
    
    // Navigate back to homepage
    const homeNavLink = screen.getByRole("link", { name: /ana sayfa/i });
    fireEvent.click(homeNavLink);
    
    await waitFor(() => {
      expect(screen.getByText(/Türkiye'nin En Kapsamlı/)).toBeInTheDocument();
    });
  });

  it("handles error states gracefully", async () => {
    // Mock error responses
    const backend = await import("~backend/client");
    vi.mocked(backend.default.chat.chat).mockRejectedValueOnce(new Error("Network error"));
    
    render(<AppWithProviders />);
    
    // Navigate to chat
    const chatLink = screen.getByRole("link", { name: /ai finans uzmanı/i });
    fireEvent.click(chatLink);
    
    await waitFor(() => {
      expect(screen.getByText("AI Finans Uzmanı")).toBeInTheDocument();
    });
    
    // Try to send a message that will fail
    const chatInput = screen.getByPlaceholderText(/Fintech, blockchain veya POS hakkında soru sorun/i);
    const sendButton = screen.getByRole("button", { name: "" });
    
    fireEvent.change(chatInput, { target: { value: "Test message" } });
    fireEvent.click(sendButton);
    
    // Should handle error gracefully (no crash)
    await waitFor(() => {
      expect(screen.getByText("Test message")).toBeInTheDocument();
    });
  });

  it("maintains state across navigation", async () => {
    render(<AppWithProviders />);
    
    // User performs a search
    const searchInput = screen.getByPlaceholderText(/pos, blockchain, fintech çözümü ara/i);
    fireEvent.change(searchInput, { target: { value: "blockchain" } });
    
    // Navigate to chat page
    const chatLink = screen.getByRole("link", { name: /ai finans uzmanı/i });
    fireEvent.click(chatLink);
    
    await waitFor(() => {
      expect(screen.getByText("AI Finans Uzmanı")).toBeInTheDocument();
    });
    
    // Navigate back to homepage
    const homeLink = screen.getByRole("link", { name: /ana sayfa/i });
    fireEvent.click(homeLink);
    
    await waitFor(() => {
      expect(screen.getByText(/Türkiye'nin En Kapsamlı/)).toBeInTheDocument();
    });
    
    // Search input should be cleared (new instance)
    const newSearchInput = screen.getByPlaceholderText(/pos, blockchain, fintech çözümü ara/i) as HTMLInputElement;
    expect(newSearchInput.value).toBe("");
  });
});
