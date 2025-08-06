import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";

export interface SearchRequest {
  query: Query<string>;
  category?: Query<string>;
  limit?: Query<number>;
  sortBy?: Query<string>;
  minRating?: Query<number>;
  maxCommission?: Query<number>;
}

export interface POSProvider {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  pricing: string;
  rating: number;
  imageUrl: string;
  websiteUrl: string;
  commission: number;
  setupFee: string;
  monthlyFee: string;
  supportedCards: string[];
  integrationTime: string;
  securityFeatures: string[];
  apiDocumentation: string;
  customerSupport: string;
  companySize: string;
  establishedYear: number;
  reviewCount: number;
  averageRating: number;
}

export interface SearchResponse {
  providers: POSProvider[];
  total: number;
  filters: {
    categories: string[];
    minCommission: number;
    maxCommission: number;
    avgRating: number;
  };
}

// Searches for POS providers based on query and filters.
export const search = api<SearchRequest, SearchResponse>(
  { expose: true, method: "GET", path: "/search" },
  async (req) => {
    const limit = req.limit || 10;
    const query = req.query.toLowerCase();
    
    // Mock data - in a real app this would come from a database
    const allProviders: POSProvider[] = [
      {
        id: "1",
        name: "PayTR",
        description: "Türkiye'nin önde gelen sanal POS çözümü",
        category: "Sanal POS",
        features: ["3D Secure", "Taksit İmkanı", "Mobil Ödeme", "API Entegrasyonu", "Fraud Koruması"],
        pricing: "Komisyon: %2.95",
        rating: 4.5,
        imageUrl: "/images/paytr.png",
        websiteUrl: "https://paytr.com",
        commission: 2.95,
        setupFee: "Ücretsiz",
        monthlyFee: "₺0",
        supportedCards: ["Visa", "Mastercard", "Troy", "American Express"],
        integrationTime: "1-2 gün",
        securityFeatures: ["3D Secure 2.0", "SSL Sertifikası", "PCI DSS", "Tokenization"],
        apiDocumentation: "Detaylı API dokümantasyonu",
        customerSupport: "7/24 Türkçe Destek",
        companySize: "Büyük Ölçekli",
        establishedYear: 2013,
        reviewCount: 127,
        averageRating: 4.3
      },
      {
        id: "2",
        name: "iyzico",
        description: "Kolay entegrasyon ile ödeme çözümleri",
        category: "Ödeme Sistemi",
        features: ["Hızlı Entegrasyon", "Çoklu Ödeme", "Fraud Koruması", "Raporlama", "Marketplace Desteği"],
        pricing: "Komisyon: %2.99",
        rating: 4.3,
        imageUrl: "/images/iyzico.png",
        websiteUrl: "https://iyzico.com",
        commission: 2.99,
        setupFee: "Ücretsiz",
        monthlyFee: "₺0",
        supportedCards: ["Visa", "Mastercard", "Troy"],
        integrationTime: "30 dakika",
        securityFeatures: ["3D Secure", "SSL", "PCI DSS Level 1", "Machine Learning Fraud"],
        apiDocumentation: "RESTful API + SDK",
        customerSupport: "İş Saatleri Destek",
        companySize: "Orta Ölçekli",
        establishedYear: 2012,
        reviewCount: 89,
        averageRating: 4.1
      },
      {
        id: "3",
        name: "Garanti BBVA POS",
        description: "Güvenilir banka POS sistemi",
        category: "Banka POS",
        features: ["Banka Güvencesi", "7/24 Destek", "Yüksek Güvenlik", "Detaylı Raporlar", "Şube Desteği"],
        pricing: "Komisyon: %3.20",
        rating: 4.1,
        imageUrl: "/images/garanti.png",
        websiteUrl: "https://garanti.com.tr",
        commission: 3.20,
        setupFee: "₺500",
        monthlyFee: "₺50",
        supportedCards: ["Visa", "Mastercard", "Troy", "Bonus Card"],
        integrationTime: "3-5 gün",
        securityFeatures: ["3D Secure", "Banka Güvenlik Protokolleri", "EMV", "Chip & PIN"],
        apiDocumentation: "Banka API Dokümantasyonu",
        customerSupport: "7/24 Banka Desteği",
        companySize: "Kurumsal",
        establishedYear: 1946,
        reviewCount: 203,
        averageRating: 4.0
      },
      {
        id: "4",
        name: "Akbank POS",
        description: "Akbank sanal POS çözümleri",
        category: "Banka POS",
        features: ["Kolay Kurulum", "Mobil Uyumlu", "Güvenli Ödeme", "İstatistikler", "Axess Entegrasyonu"],
        pricing: "Komisyon: %3.15",
        rating: 4.0,
        imageUrl: "/images/akbank.png",
        websiteUrl: "https://akbank.com",
        commission: 3.15,
        setupFee: "₺300",
        monthlyFee: "₺40",
        supportedCards: ["Visa", "Mastercard", "Troy", "Axess"],
        integrationTime: "2-4 gün",
        securityFeatures: ["3D Secure", "SSL", "Banka Güvenlik", "Risk Yönetimi"],
        apiDocumentation: "XML/JSON API",
        customerSupport: "İş Saatleri + Acil Durum",
        companySize: "Kurumsal",
        establishedYear: 1948,
        reviewCount: 156,
        averageRating: 3.9
      },
      {
        id: "5",
        name: "Paratika",
        description: "Gelişmiş ödeme teknolojileri",
        category: "Ödeme Sistemi",
        features: ["AI Fraud Koruması", "Çoklu Para Birimi", "API First", "Analytics", "Blockchain Desteği"],
        pricing: "Komisyon: %2.85",
        rating: 4.4,
        imageUrl: "/images/paratika.png",
        websiteUrl: "https://paratika.com",
        commission: 2.85,
        setupFee: "Ücretsiz",
        monthlyFee: "₺0",
        supportedCards: ["Visa", "Mastercard", "Troy", "UnionPay"],
        integrationTime: "1 gün",
        securityFeatures: ["AI Fraud Detection", "3D Secure 2.0", "Blockchain Security", "Biometric Auth"],
        apiDocumentation: "GraphQL + REST API",
        customerSupport: "7/24 Teknik Destek",
        companySize: "Teknoloji Odaklı",
        establishedYear: 2016,
        reviewCount: 67,
        averageRating: 4.2
      },
      {
        id: "6",
        name: "Sipay",
        description: "Yenilikçi ödeme çözümleri",
        category: "Fintech POS",
        features: ["QR Kod Ödeme", "Contactless", "Mobil Wallet", "Kripto Desteği", "DeFi Entegrasyonu"],
        pricing: "Komisyon: %2.75",
        rating: 4.2,
        imageUrl: "/images/sipay.png",
        websiteUrl: "https://sipay.com.tr",
        commission: 2.75,
        setupFee: "Ücretsiz",
        monthlyFee: "₺0",
        supportedCards: ["Visa", "Mastercard", "Troy", "Bitcoin", "Ethereum"],
        integrationTime: "2 saat",
        securityFeatures: ["Blockchain Security", "Smart Contracts", "Multi-Sig", "Cold Storage"],
        apiDocumentation: "Web3 API + Traditional",
        customerSupport: "7/24 Kripto Uzmanı",
        companySize: "Fintech Startup",
        establishedYear: 2019,
        reviewCount: 34,
        averageRating: 4.4
      },
      {
        id: "7",
        name: "Param",
        description: "BKM destekli yerli ödeme sistemi",
        category: "Yerli Çözüm",
        features: ["Troy Kart Desteği", "BKM Express", "Yerli Teknoloji", "Hızlı Transfer", "QR Ödeme"],
        pricing: "Komisyon: %2.50",
        rating: 4.0,
        imageUrl: "/images/param.png",
        websiteUrl: "https://param.com.tr",
        commission: 2.50,
        setupFee: "Ücretsiz",
        monthlyFee: "₺0",
        supportedCards: ["Troy", "Visa", "Mastercard"],
        integrationTime: "1 gün",
        securityFeatures: ["BKM Güvenlik", "3D Secure", "Yerli Şifreleme", "KVKK Uyumlu"],
        apiDocumentation: "Türkçe API Dokümantasyonu",
        customerSupport: "Türkçe 7/24 Destek",
        companySize: "Yerli Girişim",
        establishedYear: 2017,
        reviewCount: 45,
        averageRating: 3.8
      },
      {
        id: "8",
        name: "Craftgate",
        description: "Geliştiriciler için ödeme altyapısı",
        category: "Developer-First",
        features: ["No-Code Setup", "Webhook Support", "Multi-Tenant", "White Label", "Blockchain Analytics"],
        pricing: "Komisyon: %2.90",
        rating: 4.6,
        imageUrl: "/images/craftgate.png",
        websiteUrl: "https://craftgate.io",
        commission: 2.90,
        setupFee: "Ücretsiz",
        monthlyFee: "₺0",
        supportedCards: ["Visa", "Mastercard", "Troy", "Stablecoin"],
        integrationTime: "15 dakika",
        securityFeatures: ["OAuth 2.0", "JWT Tokens", "Rate Limiting", "DDoS Protection"],
        apiDocumentation: "OpenAPI 3.0 + Postman",
        customerSupport: "Developer Community + Support",
        companySize: "Tech Startup",
        establishedYear: 2020,
        reviewCount: 23,
        averageRating: 4.5
      }
    ];

    let filteredProviders = allProviders;

    // Filter by query
    if (query) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.name.toLowerCase().includes(query) ||
        provider.description.toLowerCase().includes(query) ||
        provider.features.some(feature => feature.toLowerCase().includes(query)) ||
        provider.category.toLowerCase().includes(query) ||
        provider.supportedCards.some(card => card.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (req.category) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.category.toLowerCase() === req.category?.toLowerCase()
      );
    }

    // Filter by minimum rating
    if (req.minRating) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.rating >= req.minRating!
      );
    }

    // Filter by maximum commission
    if (req.maxCommission) {
      filteredProviders = filteredProviders.filter(provider =>
        provider.commission <= req.maxCommission!
      );
    }

    // Sort providers
    const sortBy = req.sortBy || "rating";
    filteredProviders.sort((a, b) => {
      switch (sortBy) {
        case "commission":
          return a.commission - b.commission;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        case "established":
          return b.establishedYear - a.establishedYear;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        default:
          return b.rating - a.rating;
      }
    });

    // Calculate filters
    const categories = [...new Set(allProviders.map(p => p.category))];
    const commissions = allProviders.map(p => p.commission);
    const ratings = allProviders.map(p => p.rating);

    return {
      providers: filteredProviders.slice(0, limit),
      total: filteredProviders.length,
      filters: {
        categories,
        minCommission: Math.min(...commissions),
        maxCommission: Math.max(...commissions),
        avgRating: ratings.reduce((a, b) => a + b, 0) / ratings.length
      }
    };
  }
);
