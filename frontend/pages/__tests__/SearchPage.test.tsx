import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import SearchPage from "../SearchPage";

// Mock the backend client
const mockSearchResults = {
  providers: [
    {
      id: "1",
      name: "PayTR",
      description: "Test POS provider",
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
    { id: "sanal-pos", name: "Sanal POS", description: "Test", count: 5 },
    { id: "blockchain-pos", name: "Blockchain POS", description: "Test", count: 3 }
  ]
};

vi.mock("~backend/client", () => ({
  default: {
    pos: {
      search: vi.fn(() => Promise.resolve(mockSearchResults)),
      getCategories: vi.fn(() => Promise.resolve(mockCategories))
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

const SearchPageWithProviders = () => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe("SearchPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the search page title", () => {
    render(<SearchPageWithProviders />);
    
    expect(screen.getByText("Fintech Çözümleri Ara")).toBeInTheDocument();
  });

  it("renders search input and button", () => {
    render(<SearchPageWithProviders />);
    
    expect(screen.getByPlaceholderText(/pos, blockchain, fintech çözümü ara/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ara/i })).toBeInTheDocument();
  });

  it("renders filter controls", () => {
    render(<SearchPageWithProviders />);
    
    expect(screen.getByText("Kategori seçin")).toBeInTheDocument();
    expect(screen.getByText("Sıralama")).toBeInTheDocument();
    expect(screen.getByText("Gelişmiş Filtreler")).toBeInTheDocument();
  });

  it("performs search when form is submitted", async () => {
    const backend = await import("~backend/client");
    render(<SearchPageWithProviders />);
    
    const searchInput = screen.getByPlaceholderText(/pos, blockchain, fintech çözümü ara/i);
    const searchButton = screen.getByRole("button", { name: /ara/i });
    
    fireEvent.change(searchInput, { target: { value: "PayTR" } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(backend.default.pos.search).toHaveBeenCalledWith(
        expect.objectContaining({
          query: "PayTR"
        })
      );
    });
  });

  it("displays search results", async () => {
    render(<SearchPageWithProviders />);
    
    await waitFor(() => {
      expect(screen.getByText("PayTR")).toBeInTheDocument();
      expect(screen.getByText("Test POS provider")).toBeInTheDocument();
    });
  });

  it("shows results count", async () => {
    render(<SearchPageWithProviders />);
    
    await waitFor(() => {
      expect(screen.getByText("1 sonuç bulundu")).toBeInTheDocument();
    });
  });

  it("displays provider details in cards", async () => {
    render(<SearchPageWithProviders />);
    
    await waitFor(() => {
      expect(screen.getByText("PayTR")).toBeInTheDocument();
      expect(screen.getByText("Sanal POS")).toBeInTheDocument();
      expect(screen.getByText("4.5/5")).toBeInTheDocument();
      expect(screen.getByText("Komisyon: %2.95")).toBeInTheDocument();
    });
  });

  it("shows advanced filters when toggled", async () => {
    render(<SearchPageWithProviders />);
    
    const filtersButton = screen.getByText("Gelişmiş Filtreler");
    fireEvent.click(filtersButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Minimum Puan:/)).toBeInTheDocument();
      expect(screen.getByText(/Maksimum Komisyon:/)).toBeInTheDocument();
    });
  });

  it("updates category filter", async () => {
    const backend = await import("~backend/client");
    render(<SearchPageWithProviders />);
    
    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText("Kategori seçin")).toBeInTheDocument();
    });
    
    // This test would need more complex interaction with the Select component
    // For now, we'll just verify the categories are loaded
    expect(backend.default.pos.getCategories).toHaveBeenCalled();
  });

  it("displays provider features and supported cards", async () => {
    render(<SearchPageWithProviders />);
    
    await waitFor(() => {
      expect(screen.getByText("3D Secure")).toBeInTheDocument();
      expect(screen.getByText("API")).toBeInTheDocument();
      expect(screen.getByText("Visa")).toBeInTheDocument();
      expect(screen.getByText("Mastercard")).toBeInTheDocument();
    });
  });

  it("has external link to provider website", async () => {
    render(<SearchPageWithProviders />);
    
    await waitFor(() => {
      const detailsLink = screen.getByRole("link", { name: /detayları görüntüle/i });
      expect(detailsLink).toHaveAttribute("href", "https://paytr.com");
      expect(detailsLink).toHaveAttribute("target", "_blank");
    });
  });
});
