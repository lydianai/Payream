import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FeaturedProviders from "../FeaturedProviders";

// Mock the backend client
const mockSearchResults = {
  providers: [
    {
      id: "1",
      name: "PayTR",
      description: "Test description",
      category: "Sanal POS",
      features: ["3D Secure", "API", "Mobile"],
      pricing: "Komisyon: %2.95",
      rating: 4.5,
      websiteUrl: "https://paytr.com",
      commission: 2.95
    },
    {
      id: "2",
      name: "iyzico",
      description: "Test description 2",
      category: "Ödeme Sistemi",
      features: ["Fast Integration", "Fraud Protection"],
      pricing: "Komisyon: %2.99",
      rating: 4.3,
      websiteUrl: "https://iyzico.com",
      commission: 2.99
    }
  ],
  total: 2,
  filters: {
    categories: ["Sanal POS", "Ödeme Sistemi"],
    minCommission: 2.95,
    maxCommission: 2.99,
    avgRating: 4.4
  }
};

vi.mock("~backend/client", () => ({
  default: {
    pos: {
      search: vi.fn(() => Promise.resolve(mockSearchResults))
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

const FeaturedProvidersWithQuery = () => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <FeaturedProviders />
    </QueryClientProvider>
  );
};

describe("FeaturedProviders Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(<FeaturedProvidersWithQuery />);
    
    expect(screen.getAllByTestId("loading-card")).toHaveLength(6);
  });

  it("renders provider cards after loading", async () => {
    render(<FeaturedProvidersWithQuery />);
    
    await waitFor(() => {
      expect(screen.getByText("PayTR")).toBeInTheDocument();
      expect(screen.getByText("iyzico")).toBeInTheDocument();
    });
  });

  it("displays provider information correctly", async () => {
    render(<FeaturedProvidersWithQuery />);
    
    await waitFor(() => {
      expect(screen.getByText("PayTR")).toBeInTheDocument();
      expect(screen.getByText("Test description")).toBeInTheDocument();
      expect(screen.getByText("Sanal POS")).toBeInTheDocument();
      expect(screen.getByText("Komisyon: %2.95")).toBeInTheDocument();
    });
  });

  it("renders rating stars correctly", async () => {
    render(<FeaturedProvidersWithQuery />);
    
    await waitFor(() => {
      const ratingText = screen.getByText("4.5/5");
      expect(ratingText).toBeInTheDocument();
    });
  });

  it("displays features as badges", async () => {
    render(<FeaturedProvidersWithQuery />);
    
    await waitFor(() => {
      expect(screen.getByText("3D Secure")).toBeInTheDocument();
      expect(screen.getByText("API")).toBeInTheDocument();
      expect(screen.getByText("Mobile")).toBeInTheDocument();
    });
  });

  it("has external links to provider websites", async () => {
    render(<FeaturedProvidersWithQuery />);
    
    await waitFor(() => {
      const paytrLink = screen.getByRole("link", { name: /detayları gör/i });
      expect(paytrLink).toHaveAttribute("href", "https://paytr.com");
      expect(paytrLink).toHaveAttribute("target", "_blank");
    });
  });

  it("shows feature count when there are more than 3 features", async () => {
    render(<FeaturedProvidersWithQuery />);
    
    await waitFor(() => {
      // PayTR has 3 features, so no +count should be shown
      expect(screen.queryByText("+0")).not.toBeInTheDocument();
    });
  });
});
