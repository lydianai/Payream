import { describe, it, expect } from "vitest";
import { getNews } from "./news";

describe("News API", () => {
  it("should return all news when no filters are applied", async () => {
    const result = await getNews({});

    expect(result.news).toBeDefined();
    expect(result.total).toBeGreaterThan(0);
    expect(result.news.length).toBeLessThanOrEqual(10); // Default limit
  });

  it("should respect the limit parameter", async () => {
    const result = await getNews({ limit: 3 });

    expect(result.news.length).toBe(3);
  });

  it("should filter by category", async () => {
    const result = await getNews({ category: "Blockchain" });

    expect(result.news.every(news => news.category === "Blockchain")).toBe(true);
  });

  it("should return news sorted by date (newest first)", async () => {
    const result = await getNews({});

    for (let i = 0; i < result.news.length - 1; i++) {
      const currentDate = result.news[i].publishDate.getTime();
      const nextDate = result.news[i + 1].publishDate.getTime();
      expect(currentDate).toBeGreaterThanOrEqual(nextDate);
    }
  });

  it("should return empty array for non-existent category", async () => {
    const result = await getNews({ category: "NonExistentCategory" });

    expect(result.news).toHaveLength(0);
  });

  it("should return news with all required fields", async () => {
    const result = await getNews({ limit: 1 });

    const news = result.news[0];
    expect(news).toHaveProperty("id");
    expect(news).toHaveProperty("title");
    expect(news).toHaveProperty("summary");
    expect(news).toHaveProperty("content");
    expect(news).toHaveProperty("category");
    expect(news).toHaveProperty("publishDate");
    expect(news).toHaveProperty("source");
    expect(news).toHaveProperty("imageUrl");
    expect(news).toHaveProperty("tags");
    expect(news).toHaveProperty("readTime");
    expect(Array.isArray(news.tags)).toBe(true);
    expect(typeof news.readTime).toBe("number");
  });

  it("should handle case-insensitive category filtering", async () => {
    const result = await getNews({ category: "blockchain" });

    expect(result.news.every(news => news.category.toLowerCase() === "blockchain")).toBe(true);
  });
});
