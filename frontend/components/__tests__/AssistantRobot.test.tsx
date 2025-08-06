import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import AssistantRobot from "../AssistantRobot";

const AssistantRobotWithRouter = () => (
  <BrowserRouter>
    <AssistantRobot />
  </BrowserRouter>
);

describe("AssistantRobot Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the robot button initially", () => {
    render(<AssistantRobotWithRouter />);
    
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("expands when robot button is clicked", () => {
    render(<AssistantRobotWithRouter />);
    
    const robotButton = screen.getByRole("button");
    fireEvent.click(robotButton);
    
    expect(screen.getByText("PAYREAM Asistanı")).toBeInTheDocument();
    expect(screen.getByText("Sohbet Et")).toBeInTheDocument();
    expect(screen.getByText("POS Ara")).toBeInTheDocument();
  });

  it("collapses when close button is clicked", () => {
    render(<AssistantRobotWithRouter />);
    
    // Expand first
    const robotButton = screen.getByRole("button");
    fireEvent.click(robotButton);
    
    // Then collapse
    const closeButton = screen.getByRole("button", { name: "" }); // X button
    fireEvent.click(closeButton);
    
    expect(screen.queryByText("PAYREAM Asistanı")).not.toBeInTheDocument();
  });

  it("cycles through messages", async () => {
    render(<AssistantRobotWithRouter />);
    
    // Expand the assistant
    const robotButton = screen.getByRole("button");
    fireEvent.click(robotButton);
    
    const initialMessage = screen.getByText(/Merhaba! Ben PAYREAM asistanınızım/);
    expect(initialMessage).toBeInTheDocument();
    
    // Fast forward time to trigger message change
    vi.advanceTimersByTime(4000);
    
    await waitFor(() => {
      expect(screen.getByText(/Size POS sistemleri konusunda yardımcı olabilirim/)).toBeInTheDocument();
    });
  });

  it("has correct navigation links", () => {
    render(<AssistantRobotWithRouter />);
    
    // Expand the assistant
    const robotButton = screen.getByRole("button");
    fireEvent.click(robotButton);
    
    const chatLink = screen.getByRole("link", { name: /sohbet et/i });
    const searchLink = screen.getByRole("link", { name: /pos ara/i });
    
    expect(chatLink).toHaveAttribute("href", "/chat");
    expect(searchLink).toHaveAttribute("href", "/search");
  });

  it("displays animated elements", () => {
    render(<AssistantRobotWithRouter />);
    
    const robotButton = screen.getByRole("button");
    expect(robotButton).toHaveClass("animate-bounce");
  });
});
