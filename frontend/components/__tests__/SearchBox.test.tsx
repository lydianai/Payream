import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import SearchBox from "../SearchBox";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const SearchBoxWithRouter = () => (
  <BrowserRouter>
    <SearchBox />
  </BrowserRouter>
);

describe("SearchBox Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input and button", () => {
    render(<SearchBoxWithRouter />);
    
    expect(screen.getByPlaceholderText(/pos, blockchain, fintech çözümü ara/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ara/i })).toBeInTheDocument();
  });

  it("updates input value when typing", () => {
    render(<SearchBoxWithRouter />);
    
    const input = screen.getByPlaceholderText(/pos, blockchain, fintech çözümü ara/i);
    fireEvent.change(input, { target: { value: "PayTR" } });
    
    expect(input).toHaveValue("PayTR");
  });

  it("navigates to search page on form submission", async () => {
    render(<SearchBoxWithRouter />);
    
    const input = screen.getByPlaceholderText(/pos, blockchain, fintech çözümü ara/i);
    const button = screen.getByRole("button", { name: /ara/i });
    
    fireEvent.change(input, { target: { value: "blockchain" } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/search?q=blockchain");
    });
  });

  it("does not navigate with empty query", () => {
    render(<SearchBoxWithRouter />);
    
    const button = screen.getByRole("button", { name: /ara/i });
    fireEvent.click(button);
    
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("handles form submission with Enter key", async () => {
    render(<SearchBoxWithRouter />);
    
    const input = screen.getByPlaceholderText(/pos, blockchain, fintech çözümü ara/i);
    
    fireEvent.change(input, { target: { value: "fintech" } });
    fireEvent.submit(input.closest("form")!);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/search?q=fintech");
    });
  });

  it("trims whitespace from query", async () => {
    render(<SearchBoxWithRouter />);
    
    const input = screen.getByPlaceholderText(/pos, blockchain, fintech çözümü ara/i);
    const button = screen.getByRole("button", { name: /ara/i });
    
    fireEvent.change(input, { target: { value: "  test query  " } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/search?q=test%20query");
    });
  });
});
