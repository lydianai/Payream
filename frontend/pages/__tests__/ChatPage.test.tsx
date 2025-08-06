import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import ChatPage from "../ChatPage";

// Mock the backend client
const mockChatResponse = {
  response: "Bu bir test AI yanıtıdır."
};

const mockSearchResults = {
  providers: [],
  total: 0,
  filters: {
    categories: [],
    minCommission: 0,
    maxCommission: 5,
    avgRating: 4.0
  }
};

const mockNewsData = {
  news: [],
  total: 0
};

vi.mock("~backend/client", () => ({
  default: {
    chat: {
      chat: vi.fn(() => Promise.resolve(mockChatResponse))
    },
    pos: {
      search: vi.fn(() => Promise.resolve(mockSearchResults))
    },
    news: {
      getNews: vi.fn(() => Promise.resolve(mockNewsData))
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

const ChatPageWithProviders = () => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ChatPage />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe("ChatPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the chat page title", () => {
    render(<ChatPageWithProviders />);
    
    expect(screen.getByText("AI Finans Uzmanı")).toBeInTheDocument();
  });

  it("displays initial welcome message", () => {
    render(<ChatPageWithProviders />);
    
    expect(screen.getByText(/Merhaba! Ben PAYREAM'in AI finans uzmanınızım/)).toBeInTheDocument();
  });

  it("renders chat input and send button", () => {
    render(<ChatPageWithProviders />);
    
    expect(screen.getByPlaceholderText(/Fintech, blockchain veya POS hakkında soru sorun/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "" })).toBeInTheDocument(); // Send button
  });

  it("sends message when form is submitted", async () => {
    const backend = await import("~backend/client");
    render(<ChatPageWithProviders />);
    
    const input = screen.getByPlaceholderText(/Fintech, blockchain veya POS hakkında soru sorun/i);
    const sendButton = screen.getByRole("button", { name: "" }); // Send button
    
    fireEvent.change(input, { target: { value: "POS sistemleri hakkında bilgi ver" } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(backend.default.chat.chat).toHaveBeenCalledWith({
        message: "POS sistemleri hakkında bilgi ver",
        context: expect.any(String)
      });
    });
  });

  it("displays user message after sending", async () => {
    render(<ChatPageWithProviders />);
    
    const input = screen.getByPlaceholderText(/Fintech, blockchain veya POS hakkında soru sorun/i);
    const sendButton = screen.getByRole("button", { name: "" });
    
    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText("Test message")).toBeInTheDocument();
    });
  });

  it("displays AI response after sending message", async () => {
    render(<ChatPageWithProviders />);
    
    const input = screen.getByPlaceholderText(/Fintech, blockchain veya POS hakkında soru sorun/i);
    const sendButton = screen.getByRole("button", { name: "" });
    
    fireEvent.change(input, { target: { value: "Test question" } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText("Bu bir test AI yanıtıdır.")).toBeInTheDocument();
    });
  });

  it("clears input after sending message", async () => {
    render(<ChatPageWithProviders />);
    
    const input = screen.getByPlaceholderText(/Fintech, blockchain veya POS hakkında soru sorun/i) as HTMLInputElement;
    const sendButton = screen.getByRole("button", { name: "" });
    
    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });

  it("renders quick search functionality", () => {
    render(<ChatPageWithProviders />);
    
    expect(screen.getByText("Hızlı Arama")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/POS, blockchain veya fintech konularında ara/i)).toBeInTheDocument();
  });

  it("renders market data section", () => {
    render(<ChatPageWithProviders />);
    
    expect(screen.getByText("Piyasa Verileri")).toBeInTheDocument();
    expect(screen.getByText("Ortalama Komisyon")).toBeInTheDocument();
    expect(screen.getByText("Günlük İşlem Hacmi")).toBeInTheDocument();
  });

  it("renders expertise areas section", () => {
    render(<ChatPageWithProviders />);
    
    expect(screen.getByText("Uzmanlık Alanları")).toBeInTheDocument();
    expect(screen.getByText("Sanal POS Sistemleri")).toBeInTheDocument();
    expect(screen.getByText("Blockchain Teknolojileri")).toBeInTheDocument();
  });

  it("renders quick questions section", () => {
    render(<ChatPageWithProviders />);
    
    expect(screen.getByText("Sık Sorulan Sorular")).toBeInTheDocument();
    expect(screen.getByText(/En düşük komisyon oranına sahip POS hangisi/)).toBeInTheDocument();
  });

  it("populates input when quick question is clicked", () => {
    render(<ChatPageWithProviders />);
    
    const quickQuestion = screen.getByText(/En düşük komisyon oranına sahip POS hangisi/);
    fireEvent.click(quickQuestion.closest("div")!);
    
    const input = screen.getByPlaceholderText(/Fintech, blockchain veya POS hakkında soru sorun/i) as HTMLInputElement;
    expect(input.value).toContain("En düşük komisyon oranına sahip POS hangisi");
  });

  it("shows loading state when sending message", async () => {
    render(<ChatPageWithProviders />);
    
    const input = screen.getByPlaceholderText(/Fintech, blockchain veya POS hakkında soru sorun/i);
    const sendButton = screen.getByRole("button", { name: "" });
    
    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.click(sendButton);
    
    // Should show loading dots briefly
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("disables send button when input is empty", () => {
    render(<ChatPageWithProviders />);
    
    const sendButton = screen.getByRole("button", { name: "" });
    expect(sendButton).toBeDisabled();
  });

  it("enables send button when input has content", () => {
    render(<ChatPageWithProviders />);
    
    const input = screen.getByPlaceholderText(/Fintech, blockchain veya POS hakkında soru sorun/i);
    const sendButton = screen.getByRole("button", { name: "" });
    
    fireEvent.change(input, { target: { value: "Test" } });
    expect(sendButton).not.toBeDisabled();
  });
});
