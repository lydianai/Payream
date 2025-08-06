import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";

export interface ComparisonRequest {
  providerIds: Query<string>;
}

export interface ComparisonProvider {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  commission: number;
  setupFee: string;
  monthlyFee: string;
  features: string[];
  supportedCards: string[];
  integrationTime: string;
  securityFeatures: string[];
  apiDocumentation: string;
  customerSupport: string;
  companySize: string;
  establishedYear: number;
  websiteUrl: string;
  imageUrl: string;
  pricing: {
    commission: number;
    setupFeeAmount: number;
    monthlyFeeAmount: number;
    transactionFee: number;
    chargebackFee: number;
    refundFee: number;
    minimumVolume: number;
    volumeDiscounts: {
      threshold: number;
      discount: number;
    }[];
  };
  integration: {
    complexity: number; // 1-10 scale
    timeToLive: number; // days
    technicalSupport: string;
    documentation: string;
    sdkAvailable: boolean;
    apiType: string;
    webhookSupport: boolean;
    testEnvironment: boolean;
  };
  businessSuitability: {
    smallBusiness: number; // 1-10 scale
    mediumBusiness: number;
    largeBusiness: number;
    enterprise: number;
    ecommerce: number;
    retail: number;
    subscription: number;
    marketplace: number;
  };
  compliance: {
    pciDss: boolean;
    gdpr: boolean;
    kvkk: boolean;
    iso27001: boolean;
    soc2: boolean;
  };
  performance: {
    uptime: number; // percentage
    responseTime: number; // milliseconds
    throughput: number; // transactions per second
    globalCoverage: string[];
  };
}

export interface ComparisonResponse {
  providers: ComparisonProvider[];
  comparisonMatrix: {
    features: {
      name: string;
      category: string;
      providers: Record<string, boolean | string | number>;
    }[];
    pricing: {
      metric: string;
      providers: Record<string, number | string>;
    }[];
    integration: {
      aspect: string;
      providers: Record<string, number | string | boolean>;
    }[];
  };
}

// Compares multiple POS providers with detailed metrics.
export const compare = api<ComparisonRequest, ComparisonResponse>(
  { expose: true, method: "GET", path: "/compare" },
  async (req) => {
    const providerIds = req.providerIds.split(',').filter(id => id.trim());
    
    // Mock detailed provider data for comparison
    const allProviders: ComparisonProvider[] = [
      {
        id: "1",
        name: "PayTR",
        description: "Türkiye'nin önde gelen sanal POS çözümü",
        category: "Sanal POS",
        rating: 4.5,
        commission: 2.95,
        setupFee: "Ücretsiz",
        monthlyFee: "₺0",
        features: ["3D Secure", "Taksit İmkanı", "Mobil Ödeme", "API Entegrasyonu", "Fraud Koruması"],
        supportedCards: ["Visa", "Mastercard", "Troy", "American Express"],
        integrationTime: "1-2 gün",
        securityFeatures: ["3D Secure 2.0", "SSL Sertifikası", "PCI DSS", "Tokenization"],
        apiDocumentation: "Detaylı API dokümantasyonu",
        customerSupport: "7/24 Türkçe Destek",
        companySize: "Büyük Ölçekli",
        establishedYear: 2013,
        websiteUrl: "https://paytr.com",
        imageUrl: "/images/paytr.png",
        pricing: {
          commission: 2.95,
          setupFeeAmount: 0,
          monthlyFeeAmount: 0,
          transactionFee: 0.50,
          chargebackFee: 25,
          refundFee: 2,
          minimumVolume: 0,
          volumeDiscounts: [
            { threshold: 100000, discount: 0.1 },
            { threshold: 500000, discount: 0.2 },
            { threshold: 1000000, discount: 0.3 }
          ]
        },
        integration: {
          complexity: 3,
          timeToLive: 2,
          technicalSupport: "7/24",
          documentation: "Excellent",
          sdkAvailable: true,
          apiType: "REST",
          webhookSupport: true,
          testEnvironment: true
        },
        businessSuitability: {
          smallBusiness: 9,
          mediumBusiness: 8,
          largeBusiness: 7,
          enterprise: 6,
          ecommerce: 9,
          retail: 8,
          subscription: 7,
          marketplace: 8
        },
        compliance: {
          pciDss: true,
          gdpr: true,
          kvkk: true,
          iso27001: false,
          soc2: false
        },
        performance: {
          uptime: 99.9,
          responseTime: 150,
          throughput: 1000,
          globalCoverage: ["Turkey", "Europe"]
        }
      },
      {
        id: "2",
        name: "iyzico",
        description: "Kolay entegrasyon ile ödeme çözümleri",
        category: "Ödeme Sistemi",
        rating: 4.3,
        commission: 2.99,
        setupFee: "Ücretsiz",
        monthlyFee: "₺0",
        features: ["Hızlı Entegrasyon", "Çoklu Ödeme", "Fraud Koruması", "Raporlama", "Marketplace Desteği"],
        supportedCards: ["Visa", "Mastercard", "Troy"],
        integrationTime: "30 dakika",
        securityFeatures: ["3D Secure", "SSL", "PCI DSS Level 1", "Machine Learning Fraud"],
        apiDocumentation: "RESTful API + SDK",
        customerSupport: "İş Saatleri Destek",
        companySize: "Orta Ölçekli",
        establishedYear: 2012,
        websiteUrl: "https://iyzico.com",
        imageUrl: "/images/iyzico.png",
        pricing: {
          commission: 2.99,
          setupFeeAmount: 0,
          monthlyFeeAmount: 0,
          transactionFee: 0.49,
          chargebackFee: 30,
          refundFee: 1.5,
          minimumVolume: 0,
          volumeDiscounts: [
            { threshold: 50000, discount: 0.05 },
            { threshold: 250000, discount: 0.15 },
            { threshold: 750000, discount: 0.25 }
          ]
        },
        integration: {
          complexity: 2,
          timeToLive: 0.5,
          technicalSupport: "Business Hours",
          documentation: "Excellent",
          sdkAvailable: true,
          apiType: "REST",
          webhookSupport: true,
          testEnvironment: true
        },
        businessSuitability: {
          smallBusiness: 10,
          mediumBusiness: 9,
          largeBusiness: 7,
          enterprise: 5,
          ecommerce: 10,
          retail: 7,
          subscription: 8,
          marketplace: 10
        },
        compliance: {
          pciDss: true,
          gdpr: true,
          kvkk: true,
          iso27001: false,
          soc2: false
        },
        performance: {
          uptime: 99.8,
          responseTime: 120,
          throughput: 800,
          globalCoverage: ["Turkey"]
        }
      },
      {
        id: "3",
        name: "Garanti BBVA POS",
        description: "Güvenilir banka POS sistemi",
        category: "Banka POS",
        rating: 4.1,
        commission: 3.20,
        setupFee: "₺500",
        monthlyFee: "₺50",
        features: ["Banka Güvencesi", "7/24 Destek", "Yüksek Güvenlik", "Detaylı Raporlar", "Şube Desteği"],
        supportedCards: ["Visa", "Mastercard", "Troy", "Bonus Card"],
        integrationTime: "3-5 gün",
        securityFeatures: ["3D Secure", "Banka Güvenlik Protokolleri", "EMV", "Chip & PIN"],
        apiDocumentation: "Banka API Dokümantasyonu",
        customerSupport: "7/24 Banka Desteği",
        companySize: "Kurumsal",
        establishedYear: 1946,
        websiteUrl: "https://garanti.com.tr",
        imageUrl: "/images/garanti.png",
        pricing: {
          commission: 3.20,
          setupFeeAmount: 500,
          monthlyFeeAmount: 50,
          transactionFee: 0.75,
          chargebackFee: 50,
          refundFee: 5,
          minimumVolume: 10000,
          volumeDiscounts: [
            { threshold: 500000, discount: 0.1 },
            { threshold: 2000000, discount: 0.2 },
            { threshold: 5000000, discount: 0.3 }
          ]
        },
        integration: {
          complexity: 7,
          timeToLive: 4,
          technicalSupport: "7/24",
          documentation: "Good",
          sdkAvailable: false,
          apiType: "SOAP/REST",
          webhookSupport: false,
          testEnvironment: true
        },
        businessSuitability: {
          smallBusiness: 5,
          mediumBusiness: 7,
          largeBusiness: 9,
          enterprise: 10,
          ecommerce: 6,
          retail: 9,
          subscription: 5,
          marketplace: 4
        },
        compliance: {
          pciDss: true,
          gdpr: true,
          kvkk: true,
          iso27001: true,
          soc2: true
        },
        performance: {
          uptime: 99.95,
          responseTime: 200,
          throughput: 2000,
          globalCoverage: ["Turkey", "Europe", "Global"]
        }
      },
      {
        id: "5",
        name: "Paratika",
        description: "Gelişmiş ödeme teknolojileri",
        category: "Ödeme Sistemi",
        rating: 4.4,
        commission: 2.85,
        setupFee: "Ücretsiz",
        monthlyFee: "₺0",
        features: ["AI Fraud Koruması", "Çoklu Para Birimi", "API First", "Analytics", "Blockchain Desteği"],
        supportedCards: ["Visa", "Mastercard", "Troy", "UnionPay"],
        integrationTime: "1 gün",
        securityFeatures: ["AI Fraud Detection", "3D Secure 2.0", "Blockchain Security", "Biometric Auth"],
        apiDocumentation: "GraphQL + REST API",
        customerSupport: "7/24 Teknik Destek",
        companySize: "Teknoloji Odaklı",
        establishedYear: 2016,
        websiteUrl: "https://paratika.com",
        imageUrl: "/images/paratika.png",
        pricing: {
          commission: 2.85,
          setupFeeAmount: 0,
          monthlyFeeAmount: 0,
          transactionFee: 0.45,
          chargebackFee: 20,
          refundFee: 1,
          minimumVolume: 0,
          volumeDiscounts: [
            { threshold: 200000, discount: 0.15 },
            { threshold: 1000000, discount: 0.25 },
            { threshold: 2000000, discount: 0.35 }
          ]
        },
        integration: {
          complexity: 4,
          timeToLive: 1,
          technicalSupport: "7/24",
          documentation: "Excellent",
          sdkAvailable: true,
          apiType: "GraphQL/REST",
          webhookSupport: true,
          testEnvironment: true
        },
        businessSuitability: {
          smallBusiness: 8,
          mediumBusiness: 9,
          largeBusiness: 9,
          enterprise: 8,
          ecommerce: 9,
          retail: 7,
          subscription: 9,
          marketplace: 8
        },
        compliance: {
          pciDss: true,
          gdpr: true,
          kvkk: true,
          iso27001: true,
          soc2: false
        },
        performance: {
          uptime: 99.9,
          responseTime: 100,
          throughput: 1500,
          globalCoverage: ["Turkey", "Europe", "Asia"]
        }
      },
      {
        id: "6",
        name: "Sipay",
        description: "Yenilikçi ödeme çözümleri",
        category: "Fintech POS",
        rating: 4.2,
        commission: 2.75,
        setupFee: "Ücretsiz",
        monthlyFee: "₺0",
        features: ["QR Kod Ödeme", "Contactless", "Mobil Wallet", "Kripto Desteği", "DeFi Entegrasyonu"],
        supportedCards: ["Visa", "Mastercard", "Troy", "Bitcoin", "Ethereum"],
        integrationTime: "2 saat",
        securityFeatures: ["Blockchain Security", "Smart Contracts", "Multi-Sig", "Cold Storage"],
        apiDocumentation: "Web3 API + Traditional",
        customerSupport: "7/24 Kripto Uzmanı",
        companySize: "Fintech Startup",
        establishedYear: 2019,
        websiteUrl: "https://sipay.com.tr",
        imageUrl: "/images/sipay.png",
        pricing: {
          commission: 2.75,
          setupFeeAmount: 0,
          monthlyFeeAmount: 0,
          transactionFee: 0.35,
          chargebackFee: 15,
          refundFee: 0.5,
          minimumVolume: 0,
          volumeDiscounts: [
            { threshold: 100000, discount: 0.1 },
            { threshold: 500000, discount: 0.2 },
            { threshold: 1500000, discount: 0.3 }
          ]
        },
        integration: {
          complexity: 5,
          timeToLive: 0.1,
          technicalSupport: "7/24",
          documentation: "Good",
          sdkAvailable: true,
          apiType: "Web3/REST",
          webhookSupport: true,
          testEnvironment: true
        },
        businessSuitability: {
          smallBusiness: 9,
          mediumBusiness: 8,
          largeBusiness: 6,
          enterprise: 4,
          ecommerce: 10,
          retail: 6,
          subscription: 8,
          marketplace: 7
        },
        compliance: {
          pciDss: true,
          gdpr: true,
          kvkk: true,
          iso27001: false,
          soc2: false
        },
        performance: {
          uptime: 99.7,
          responseTime: 80,
          throughput: 500,
          globalCoverage: ["Turkey", "Global"]
        }
      }
    ];

    const providers = allProviders.filter(p => providerIds.includes(p.id));

    // Generate comparison matrix
    const comparisonMatrix = {
      features: [
        {
          name: "3D Secure",
          category: "Security",
          providers: Object.fromEntries(providers.map(p => [
            p.id, 
            p.securityFeatures.some(f => f.includes("3D Secure"))
          ]))
        },
        {
          name: "API Integration",
          category: "Technical",
          providers: Object.fromEntries(providers.map(p => [
            p.id, 
            p.features.includes("API Entegrasyonu") || p.features.includes("API First")
          ]))
        },
        {
          name: "Mobile Payment",
          category: "Payment Methods",
          providers: Object.fromEntries(providers.map(p => [
            p.id, 
            p.features.some(f => f.includes("Mobil"))
          ]))
        },
        {
          name: "Fraud Protection",
          category: "Security",
          providers: Object.fromEntries(providers.map(p => [
            p.id, 
            p.features.some(f => f.includes("Fraud")) || p.securityFeatures.some(f => f.includes("Fraud"))
          ]))
        },
        {
          name: "Blockchain Support",
          category: "Innovation",
          providers: Object.fromEntries(providers.map(p => [
            p.id, 
            p.features.some(f => f.includes("Blockchain")) || p.supportedCards.includes("Bitcoin")
          ]))
        },
        {
          name: "Marketplace Support",
          category: "Business",
          providers: Object.fromEntries(providers.map(p => [
            p.id, 
            p.features.some(f => f.includes("Marketplace"))
          ]))
        }
      ],
      pricing: [
        {
          metric: "Commission Rate (%)",
          providers: Object.fromEntries(providers.map(p => [p.id, p.pricing.commission]))
        },
        {
          metric: "Setup Fee (₺)",
          providers: Object.fromEntries(providers.map(p => [p.id, p.pricing.setupFeeAmount]))
        },
        {
          metric: "Monthly Fee (₺)",
          providers: Object.fromEntries(providers.map(p => [p.id, p.pricing.monthlyFeeAmount]))
        },
        {
          metric: "Transaction Fee (₺)",
          providers: Object.fromEntries(providers.map(p => [p.id, p.pricing.transactionFee]))
        },
        {
          metric: "Chargeback Fee (₺)",
          providers: Object.fromEntries(providers.map(p => [p.id, p.pricing.chargebackFee]))
        }
      ],
      integration: [
        {
          aspect: "Complexity (1-10)",
          providers: Object.fromEntries(providers.map(p => [p.id, p.integration.complexity]))
        },
        {
          aspect: "Integration Time (days)",
          providers: Object.fromEntries(providers.map(p => [p.id, p.integration.timeToLive]))
        },
        {
          aspect: "SDK Available",
          providers: Object.fromEntries(providers.map(p => [p.id, p.integration.sdkAvailable]))
        },
        {
          aspect: "Webhook Support",
          providers: Object.fromEntries(providers.map(p => [p.id, p.integration.webhookSupport]))
        },
        {
          aspect: "Test Environment",
          providers: Object.fromEntries(providers.map(p => [p.id, p.integration.testEnvironment]))
        }
      ]
    };

    return {
      providers,
      comparisonMatrix
    };
  }
);
