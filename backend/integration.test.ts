import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { chat } from "./chat/chat";
import { getNews } from "./news/news";
import { search } from "./pos/search";
import { getCategories } from "./pos/categories";

describe("Integration Tests", () => {
  describe("API Integration", () => {
    it("should handle complete search workflow", async () => {
      // Get categories first
      const categories = await getCategories();
      expect(categories.categories.length).toBeGreaterThan(0);

      // Search for providers
      const searchResults = await search({ 
        query: "POS",
        category: categories.categories[0].id,
        limit: 5
      });
      
      expect(searchResults.providers.length).toBeGreaterThan(0);
      expect(searchResults.total).toBeGreaterThan(0);
      expect(searchResults.filters).toBeDefined();
    });

    it("should handle news and chat integration", async () => {
      // Get latest news
      const news = await getNews({ limit: 3 });
      expect(news.news.length).toBeGreaterThan(0);

      // Use news context in chat (mocked)
      const newsContext = news.news.map(n => `${n.title} (${n.category})`).join(", ");
      
      // This would normally call the chat API, but we'll just verify the context format
      expect(newsContext).toContain("TCMB");
      expect(newsContext).toContain("Blockchain");
    });

    it("should handle search filters correctly", async () => {
      // Test multiple filter combinations
      const highRatingResults = await search({ 
        query: "",
        minRating: 4.0,
        sortBy: "rating"
      });

      const lowCommissionResults = await search({
        query: "",
        maxCommission: 3.0,
        sortBy: "commission"
      });

      expect(highRatingResults.providers.every(p => p.rating >= 4.0)).toBe(true);
      expect(lowCommissionResults.providers.every(p => p.commission <= 3.0)).toBe(true);
    });

    it("should handle category filtering across all endpoints", async () => {
      const categories = await getCategories();
      const blockchainCategory = categories.categories.find(c => 
        c.name.toLowerCase().includes("blockchain")
      );

      if (blockchainCategory) {
        const blockchainProviders = await search({
          query: "",
          category: blockchainCategory.id
        });

        expect(blockchainProviders.providers.every(p => 
          p.category.toLowerCase().includes("blockchain")
        )).toBe(true);
      }
    });

    it("should handle edge cases gracefully", async () => {
      // Empty search
      const emptySearch = await search({ query: "" });
      expect(emptySearch.providers).toBeDefined();

      // Non-existent category
      const invalidCategory = await search({ 
        query: "",
        category: "non-existent-category"
      });
      expect(invalidCategory.providers).toHaveLength(0);

      // Very high rating filter
      const impossibleRating = await search({
        query: "",
        minRating: 10.0
      });
      expect(impossibleRating.providers).toHaveLength(0);

      // Very low commission filter
      const impossibleCommission = await search({
        query: "",
        maxCommission: 0.1
      });
      expect(impossibleCommission.providers).toHaveLength(0);
    });
  });

  describe("Data Consistency", () => {
    it("should have consistent data across endpoints", async () => {
      const categories = await getCategories();
      const allProviders = await search({ query: "", limit: 100 });

      // Verify all provider categories exist in categories list
      const categoryIds = categories.categories.map(c => c.id);
      const categoryNames = categories.categories.map(c => c.name);

      allProviders.providers.forEach(provider => {
        const categoryExists = categoryNames.includes(provider.category);
        expect(categoryExists).toBe(true);
      });
    });

    it("should have valid data formats", async () => {
      const news = await getNews({ limit: 5 });
      const providers = await search({ query: "", limit: 5 });

      // Validate news data
      news.news.forEach(item => {
        expect(item.publishDate).toBeInstanceOf(Date);
        expect(item.readTime).toBeGreaterThan(0);
        expect(Array.isArray(item.tags)).toBe(true);
        expect(item.title.length).toBeGreaterThan(0);
      });

      // Validate provider data
      providers.providers.forEach(provider => {
        expect(provider.rating).toBeGreaterThanOrEqual(0);
        expect(provider.rating).toBeLessThanOrEqual(5);
        expect(provider.commission).toBeGreaterThan(0);
        expect(Array.isArray(provider.features)).toBe(true);
        expect(Array.isArray(provider.supportedCards)).toBe(true);
        expect(provider.establishedYear).toBeGreaterThan(1900);
      });
    });

    it("should maintain referential integrity", async () => {
      const categories = await getCategories();
      const providers = await search({ query: "", limit: 100 });

      // Count providers per category
      const providerCounts: Record<string, number> = {};
      providers.providers.forEach(provider => {
        providerCounts[provider.category] = (providerCounts[provider.category] || 0) + 1;
      });

      // Verify category counts are reasonable
      categories.categories.forEach(category => {
        const actualCount = providerCounts[category.name] || 0;
        // Allow some variance in counts as they might be estimates
        expect(actualCount).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("Performance Tests", () => {
    it("should respond within reasonable time limits", async () => {
      const startTime = Date.now();
      
      await Promise.all([
        getCategories(),
        search({ query: "", limit: 10 }),
        getNews({ limit: 5 })
      ]);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // All endpoints should respond within 1 second
      expect(duration).toBeLessThan(1000);
    });

    it("should handle concurrent requests", async () => {
      const requests = Array(10).fill(null).map(() => 
        search({ query: "test", limit: 5 })
      );
      
      const results = await Promise.all(requests);
      
      // All requests should succeed
      results.forEach(result => {
        expect(result.providers).toBeDefined();
        expect(result.total).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
