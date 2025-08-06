import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";

export interface NewsRequest {
  category?: Query<string>;
  limit?: Query<number>;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  publishDate: Date;
  source: string;
  imageUrl: string;
  tags: string[];
  readTime: number;
}

export interface NewsResponse {
  news: NewsItem[];
  total: number;
}

// Retrieves latest news about POS systems, blockchain and fintech in Turkey.
export const getNews = api<NewsRequest, NewsResponse>(
  { expose: true, method: "GET", path: "/news" },
  async (req) => {
    const limit = req.limit || 10;
    
    // Mock news data - in a real app this would come from a database or news API
    const allNews: NewsItem[] = [
      {
        id: "1",
        title: "TCMB Dijital Türk Lirası Pilot Uygulamasını Başlattı",
        summary: "Merkez Bankası, dijital para birimi için pilot uygulamayı 2024'te başlatacağını duyurdu.",
        content: "Türkiye Cumhuriyet Merkez Bankası (TCMB), dijital Türk Lirası (CBDC) için pilot uygulamayı başlattı. Bu gelişme, Türkiye'nin dijital ödeme sistemlerindeki dönüşümünü hızlandıracak.",
        category: "Blockchain",
        publishDate: new Date("2024-01-15"),
        source: "TCMB",
        imageUrl: "/images/tcmb-news.jpg",
        tags: ["CBDC", "Dijital Para", "Merkez Bankası", "Blockchain"],
        readTime: 3
      },
      {
        id: "2",
        title: "Troy Kart Kullanımı %45 Arttı",
        summary: "Yerli ödeme sistemi Troy, 2023 yılında kullanım oranını önemli ölçüde artırdı.",
        content: "BKM verilerine göre Troy kart kullanımı geçen yıla göre %45 artış gösterdi. Yerli ödeme sisteminin yaygınlaşması devam ediyor.",
        category: "POS Sistemleri",
        publishDate: new Date("2024-01-12"),
        source: "BKM",
        imageUrl: "/images/troy-news.jpg",
        tags: ["Troy", "Yerli Ödeme", "BKM", "İstatistik"],
        readTime: 2
      },
      {
        id: "3",
        title: "Fintech Yatırımları 2023'te Rekor Kırdı",
        summary: "Türkiye'deki fintech şirketlerine yapılan yatırımlar geçen yıl 2.5 milyar dolara ulaştı.",
        content: "Türkiye fintech sektörü 2023 yılında toplam 2.5 milyar dolar yatırım aldı. Bu rakam, sektörün büyüme potansiyelini gösteriyor.",
        category: "Fintech",
        publishDate: new Date("2024-01-10"),
        source: "Fintech İstanbul",
        imageUrl: "/images/fintech-investment.jpg",
        tags: ["Yatırım", "Fintech", "Startup", "Büyüme"],
        readTime: 4
      },
      {
        id: "4",
        title: "Blockchain Tabanlı Kimlik Doğrulama Sistemi",
        summary: "Yeni blockchain kimlik sistemi, POS işlemlerinde güvenliği artıracak.",
        content: "Türk teknoloji şirketi, blockchain tabanlı kimlik doğrulama sistemini geliştirdi. Sistem, POS işlemlerinde fraud riskini %80 azaltıyor.",
        category: "Blockchain",
        publishDate: new Date("2024-01-08"),
        source: "TechCrunch Türkiye",
        imageUrl: "/images/blockchain-id.jpg",
        tags: ["Blockchain", "Kimlik", "Güvenlik", "Fraud"],
        readTime: 5
      },
      {
        id: "5",
        title: "QR Kod Ödemeler %200 Büyüdü",
        summary: "Pandemi sonrası QR kod ile yapılan ödemeler dramatik şekilde arttı.",
        content: "Temassız ödeme trendinin etkisiyle QR kod ödemeler 2023'te %200 büyüme gösterdi. Özellikle küçük işletmeler bu sistemi benimsiyor.",
        category: "POS Sistemleri",
        publishDate: new Date("2024-01-05"),
        source: "Ödeme Sistemleri Derneği",
        imageUrl: "/images/qr-payments.jpg",
        tags: ["QR Kod", "Temassız Ödeme", "Büyüme", "Küçük İşletme"],
        readTime: 3
      },
      {
        id: "6",
        title: "DeFi Protokolleri Türkiye'de Yaygınlaşıyor",
        summary: "Merkezi olmayan finans protokolleri, geleneksel bankacılığa alternatif oluyor.",
        content: "DeFi protokolleri Türkiye'de hızla yaygınlaşıyor. Özellikle genç yatırımcılar bu sistemleri tercih ediyor.",
        category: "Blockchain",
        publishDate: new Date("2024-01-03"),
        source: "Kripto Para Derneği",
        imageUrl: "/images/defi-turkey.jpg",
        tags: ["DeFi", "Kripto", "Yatırım", "Blockchain"],
        readTime: 6
      },
      {
        id: "7",
        title: "Açık Bankacılık API'leri Genişliyor",
        summary: "Bankalar, açık bankacılık API'lerini geliştirerek fintech entegrasyonunu artırıyor.",
        content: "Türk bankaları açık bankacılık API'lerini genişletiyor. Bu gelişme, fintech şirketlerinin yenilikçi çözümler geliştirmesini sağlıyor.",
        category: "Fintech",
        publishDate: new Date("2024-01-01"),
        source: "Bankacılık Düzenleme ve Denetleme Kurumu",
        imageUrl: "/images/open-banking.jpg",
        tags: ["Açık Bankacılık", "API", "Entegrasyon", "Fintech"],
        readTime: 4
      },
      {
        id: "8",
        title: "NFT Ödemeler POS Sistemlerine Entegre Ediliyor",
        summary: "İlk kez NFT'ler ile ödeme yapılabilen POS sistemi Türkiye'de test ediliyor.",
        content: "Türk teknoloji şirketi, NFT'ler ile ödeme yapılabilen POS sistemini geliştirdi. Sistem, dijital varlıkların günlük ödemelerde kullanımını mümkün kılıyor.",
        category: "Blockchain",
        publishDate: new Date("2023-12-28"),
        source: "Web3 Türkiye",
        imageUrl: "/images/nft-payments.jpg",
        tags: ["NFT", "Web3", "Dijital Varlık", "Ödeme"],
        readTime: 5
      }
    ];

    let filteredNews = allNews;

    // Filter by category
    if (req.category) {
      filteredNews = filteredNews.filter(news =>
        news.category.toLowerCase() === req.category?.toLowerCase()
      );
    }

    // Sort by publish date (newest first)
    filteredNews.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

    return {
      news: filteredNews.slice(0, limit),
      total: filteredNews.length
    };
  }
);
