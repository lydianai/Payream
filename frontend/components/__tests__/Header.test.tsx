import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Header from "../Header";

const HeaderWithRouter = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
);

describe("Header Component", () => {
  it("renders the PAYREAM logo and title", () => {
    render(<HeaderWithRouter />);
    
    expect(screen.getByText("PAYREAM")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<HeaderWithRouter />);
    
    expect(screen.getByText("Ana Sayfa")).toBeInTheDocument();
    expect(screen.getByText("POS Ara")).toBeInTheDocument();
    expect(screen.getByText("AI Finans Uzmanı")).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<HeaderWithRouter />);
    
    expect(screen.getByRole("link", { name: /ara/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /finans uzmanı/i })).toBeInTheDocument();
  });

  it("has correct navigation links", () => {
    render(<HeaderWithRouter />);
    
    const homeLink = screen.getByRole("link", { name: /ana sayfa/i });
    const searchLink = screen.getByRole("link", { name: /pos ara/i });
    const chatLink = screen.getByRole("link", { name: /ai finans uzmanı/i });

    expect(homeLink).toHaveAttribute("href", "/");
    expect(searchLink).toHaveAttribute("href", "/search");
    expect(chatLink).toHaveAttribute("href", "/chat");
  });
});
