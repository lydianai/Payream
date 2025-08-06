import { api } from "encore.dev/api";

export interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
}

export interface CategoriesResponse {
  categories: Category[];
}

// Retrieves all available POS categories.
export const getCategories = api<void, CategoriesResponse>(
  { expose: true, method: "GET", path: "/categories" },
  async () => {
    const categories: Category[] = [
      {
        id: "sanal-pos",
        name: "Sanal POS",
        description: "Geleneksel online ödeme sistemleri",
        count: 15
      },
      {
        id: "banka-pos",
        name: "Banka POS",
        description: "Banka tabanlı POS sistemleri",
        count: 12
      },
      {
        id: "odeme-sistemi",
        name: "Ödeme Sistemi",
        description: "Alternatif ödeme çözümleri",
        count: 18
      },
      {
        id: "fintech-pos",
        name: "Fintech POS",
        description: "Yeni nesil fintech çözümleri",
        count: 8
      },
      {
        id: "yerli-cozum",
        name: "Yerli Çözüm",
        description: "Türk teknoloji şirketleri",
        count: 6
      },
      {
        id: "developer-first",
        name: "Developer-First",
        description: "Geliştiriciler için optimize edilmiş",
        count: 4
      },
      {
        id: "blockchain-pos",
        name: "Blockchain POS",
        description: "Kripto para ve blockchain destekli",
        count: 3
      }
    ];

    return { categories };
  }
);
