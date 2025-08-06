import { describe, it, expect } from "vitest";
import { getCategories } from "./categories";

describe("Categories API", () => {
  it("should return all available categories", async () => {
    const result = await getCategories();

    expect(result.categories).toBeDefined();
    expect(Array.isArray(result.categories)).toBe(true);
    expect(result.categories.length).toBeGreaterThan(0);
  });

  it("should return categories with all required fields", async () => {
    const result = await getCategories();

    result.categories.forEach(category => {
      expect(category).toHaveProperty("id");
      expect(category).toHaveProperty("name");
      expect(category).toHaveProperty("description");
      expect(category).toHaveProperty("count");
      expect(typeof category.id).toBe("string");
      expect(typeof category.name).toBe("string");
      expect(typeof category.description).toBe("string");
      expect(typeof category.count).toBe("number");
    });
  });

  it("should include expected categories", async () => {
    const result = await getCategories();

    const categoryNames = result.categories.map(c => c.name);
    expect(categoryNames).toContain("Sanal POS");
    expect(categoryNames).toContain("Blockchain POS");
    expect(categoryNames).toContain("Fintech POS");
  });

  it("should have positive counts for all categories", async () => {
    const result = await getCategories();

    result.categories.forEach(category => {
      expect(category.count).toBeGreaterThan(0);
    });
  });
});
