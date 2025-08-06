import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Logo from "../Logo";

describe("Logo Component", () => {
  it("renders with default props", () => {
    const { container } = render(<Logo />);
    
    const logoContainer = container.firstChild as HTMLElement;
    expect(logoContainer).toHaveClass("w-12", "h-12");
  });

  it("renders with small size", () => {
    const { container } = render(<Logo size="sm" />);
    
    const logoContainer = container.firstChild as HTMLElement;
    expect(logoContainer).toHaveClass("w-8", "h-8");
  });

  it("renders with large size", () => {
    const { container } = render(<Logo size="lg" />);
    
    const logoContainer = container.firstChild as HTMLElement;
    expect(logoContainer).toHaveClass("w-16", "h-16");
  });

  it("renders with animation by default", () => {
    const { container } = render(<Logo />);
    
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("animate-pulse");
  });

  it("renders without animation when disabled", () => {
    const { container } = render(<Logo animated={false} />);
    
    const svg = container.querySelector("svg");
    expect(svg).not.toHaveClass("animate-pulse");
  });

  it("contains SVG elements", () => {
    const { container } = render(<Logo />);
    
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("circle")).toBeInTheDocument();
    expect(container.querySelector("path")).toBeInTheDocument();
    expect(container.querySelector("rect")).toBeInTheDocument();
  });
});
