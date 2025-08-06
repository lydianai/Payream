import { describe, it, expect } from "vitest";
import { search } from "./search";

describe("POS Search API", () => {
  it("should return all providers when no query is provided", async () => {
    const result = await search({ query: "" });

    expect(result.providers).toBeDefined();
    expect(result.total).toBeGreaterThan(0);
    expect(result.filters).toBeDefined();
  });

  it("should filter providers by query", async () => {
    const result = await search({ query: "PayTR" });

    expect(result.providers.some(p => p.name.includes("PayTR"))).toBe(true);
  });

  it("should filter by category", async () => {
    const result = await search({ query: "", category: "Sanal POS" });

    expect(result.providers.every(p => p.category === "Sanal POS")).toBe(true);
  });

  it("should filter by minimum rating", async () => {
    const result = await search({ query: "", minRating: 4.0 });

    expect(result.providers.every(p => p.rating >= 4.0)).toBe(true);
  });

  it("should filter by maximum commission", async () => {
    const result = await search({ query: "", maxCommission: 3.0 });

    expect(result.providers.every(p => p.commission <= 3.0)).toBe(true);
  });

  it("should sort by commission when specified", async () => {
    const result = await search({ query: "", sortBy: "commission" });

    for (let i = 0; i < result.providers.length - 1; i++) {
      expect(result.providers[i].commission).toBeLessThanOrEqual(result.providers[i + 1].commission);
    }
  });

  it("should sort by rating when specified", async () => {
    const result = await search({ query: "", sortBy: "rating" });

    for (let i = 0; i < result.providers.length - 1; i++) {
      expect(result.providers[i].rating).toBeGreaterThanOrEqual(result.providers[i + 1].rating);
    }
  });

  it("should respect the limit parameter", async () => {
    const result = await search({ query: "", limit: 3 });

    expect(result.providers.length).toBeLessThanOrEqual(3);
  });

  it("should return providers with all required fields", async () => {
    const result = await search({ query: "", limit: 1 });

    const provider = result.providers[0];
    expect(provider).toHaveProperty("id");
    expect(provider).toHaveProperty("name");
    expect(provider).toHaveProperty("description");
    expect(provider).toHaveProperty("category");
    expect(provider).toHaveProperty("features");
    expect(provider).toHaveProperty("pricing");
    expect(provider).toHaveProperty("rating");
    expect(provider).toHaveProperty("commission");
    expect(provider).toHaveProperty("supportedCards");
    expect(Array.isArray(provider.features)).toBe(true);
    expect(Array.isArray(provider.supportedCards)).toBe(true);
  });

  it("should return correct filter metadata", async () => {
    const result = await search({ query: "" });

    expect(result.filters.categories).toBeDefined();
    expect(Array.isArray(result.filters.categories)).toBe(true);
    expect(typeof result.filters.minCommission).toBe("number");
    expect(typeof result.filters.maxCommission).toBe("number");
    expect(typeof result.filters.avgRating).toBe("number");
  });

  it("should search in multiple fields", async () => {
    const result = await search({ query: "blockchain" });

    const hasBlockchainInName = result.providers.some(p => 
      p.name.toLowerCase().includes("blockchain")
    );
    const hasBlockchainInFeatures = result.providers.some(p => 
      p.features.some(f => f.toLowerCase().includes("blockchain"))
    );
    const hasBlockchainInCategory = result.providers.some(p => 
      p.category.toLowerCase().includes("blockchain")
    );

    expect(hasBlockchainInName || hasBlockchainInFeatures || hasBlockchainInCategory).toBe(true);
  });
});
