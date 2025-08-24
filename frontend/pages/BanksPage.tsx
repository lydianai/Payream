import { useState } from "react";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Building, Shield, Users, TrendingUp, Star, ExternalLink, Search, Filter, Calendar, MapPin, Phone, Mail, Globe, CreditCard, Zap, Lock, Database, Monitor, CheckCircle, Award, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function BanksPage() {

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("customers");
  const [favorites, setFavorites] = useState<string[]>([]);
  const { t } = useTranslation();

  const banks = [
    {
      id: "ziraat",
      name: "Ziraat Bankası",
      logo: "/images/banks/ziraat.png",
      established: 1863,
      customers: "25M+",
      branches: 1800,
      category: "Kamu Bankası",
      rating: 4.2,
      assets: "₺850B",
      description: "Türkiye'nin en köklü ve en büyük bankası",
      website: "https://www.ziraatbank.com.tr",
      phone: "+90 444 0 100",
      email: "info@ziraatbank.com.tr",
      headquarters: "Ankara",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "Taksit İmkanı", "QR Kod Ödeme"],
      securityLevel: 95,
      integrationTime: "3-5 gün",
      commission: 2.8,
      advantages: ["En geniş şube ağı", "Devlet güvencesi", "Tarihsel güvenilirlik", "Kapsamlı hizmet ağı"]
    },
    {
      id: "garanti",
      name: "Garanti BBVA",
      logo: "/images/banks/garanti.png",
      established: 1946,
      customers: "18M+",
      branches: 850,
      category: "Özel Banka",
      rating: 4.5,
      assets: "₺520B",
      description: "Teknoloji odaklı modern bankacılık",
      website: "https://www.garantibbva.com.tr",
      phone: "+90 444 0 333",
      email: "info@garantibbva.com.tr",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "Contactless", "API Entegrasyonu"],
      securityLevel: 98,
      integrationTime: "2-3 gün",
      commission: 2.9,
      advantages: ["Güçlü teknoloji altyapısı", "Hızlı entegrasyon", "7/24 destek", "Uluslararası ağ"]
    },
    {
      id: "isbank",
      name: "Türkiye İş Bankası",
      logo: "/images/banks/isbank.png",
      established: 1924,
      customers: "15M+",
      branches: 1200,
      category: "Özel Banka",
      rating: 4.3,
      assets: "₺680B",
      description: "Türkiye'nin ilk milli bankası",
      website: "https://www.isbank.com.tr",
      phone: "+90 444 0 724",
      email: "info@isbank.com.tr",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "Maximum Kart", "Chip & PIN"],
      securityLevel: 96,
      integrationTime: "3-4 gün",
      commission: 3.0,
      advantages: ["Köklü geçmiş", "Güvenilir altyapı", "Geniş ATM ağı", "Kurumsal çözümler"]
    },
    {
      id: "akbank",
      name: "Akbank",
      logo: "/images/banks/akbank.png",
      established: 1948,
      customers: "17M+",
      branches: 750,
      category: "Özel Banka",
      rating: 4.4,
      assets: "₺480B",
      description: "Yenilikçi dijital bankacılık",
      website: "https://www.akbank.com",
      phone: "+90 444 0 200",
      email: "info@akbank.com",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "Axess", "Dijital Cüzdan"],
      securityLevel: 97,
      integrationTime: "2-3 gün",
      commission: 2.95,
      advantages: ["Dijital öncülük", "Hızlı işlem", "Mobil bankacılık", "Fintech entegrasyonu"]
    },
    {
      id: "yapikredi",
      name: "Yapı Kredi Bankası",
      logo: "/images/banks/yapikredi.png",
      established: 1944,
      customers: "16M+",
      branches: 800,
      category: "Özel Banka",
      rating: 4.1,
      assets: "₺420B",
      description: "Güçlü finansal çözümler",
      website: "https://www.yapikredi.com.tr",
      phone: "+90 444 0 444",
      email: "info@yapikredi.com.tr",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "World Kart", "Temassız Ödeme"],
      securityLevel: 94,
      integrationTime: "3-4 gün",
      commission: 3.1,
      advantages: ["Güçlü kredi portföyü", "Uluslararası bağlantılar", "Kurumsal bankacılık", "Yatırım danışmanlığı"]
    },
    {
      id: "halkbank",
      name: "Halkbank",
      logo: "/images/banks/halkbank.png",
      established: 1933,
      customers: "20M+",
      branches: 1000,
      category: "Kamu Bankası",
      rating: 4.0,
      assets: "₺650B",
      description: "Halkın bankası, güvenilir çözümler",
      website: "https://www.halkbank.com.tr",
      phone: "+90 444 0 400",
      email: "info@halkbank.com.tr",
      headquarters: "Ankara",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "Paraf Kart", "KOBİ Çözümleri"],
      securityLevel: 93,
      integrationTime: "4-5 gün",
      commission: 2.85,
      advantages: ["KOBİ odaklı", "Uygun faiz oranları", "Devlet desteği", "Geniş hizmet ağı"]
    },
    {
      id: "vakifbank",
      name: "VakıfBank",
      logo: "/images/banks/vakifbank.png",
      established: 1954,
      customers: "14M+",
      branches: 900,
      category: "Kamu Bankası",
      rating: 4.2,
      assets: "₺580B",
      description: "Güçlü ve güvenilir bankacılık",
      website: "https://www.vakifbank.com.tr",
      phone: "+90 444 0 600",
      email: "info@vakifbank.com.tr",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "BonusFlaş", "Kurumsal Çözümler"],
      securityLevel: 95,
      integrationTime: "3-4 gün",
      commission: 2.9,
      advantages: ["Güçlü sermaye yapısı", "Kurumsal bankacılık", "Uluslararası ağ", "Teknoloji yatırımları"]
    },
    {
      id: "denizbank",
      name: "Denizbank",
      logo: "/images/banks/denizbank.png",
      established: 1997,
      customers: "8M+",
      branches: 650,
      category: "Özel Banka",
      rating: 4.3,
      assets: "₺280B",
      description: "Müşteri odaklı modern bankacılık",
      website: "https://www.denizbank.com",
      phone: "+90 444 0 800",
      email: "info@denizbank.com",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "Bonus Kart", "Hızlı Entegrasyon"],
      securityLevel: 96,
      integrationTime: "1-2 gün",
      commission: 3.2,
      advantages: ["Hızlı hizmet", "Müşteri memnuniyeti", "Esnek çözümler", "Dijital bankacılık"]
    },
    {
      id: "qnb",
      name: "QNB Finansbank",
      logo: "/images/banks/qnb.png",
      established: 1987,
      customers: "6M+",
      branches: 500,
      category: "Özel Banka",
      rating: 4.2,
      assets: "₺320B",
      description: "Uluslararası bankacılık deneyimi",
      website: "https://www.qnbfinansbank.com",
      phone: "+90 444 0 900",
      email: "info@qnbfinansbank.com",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "Finanscard", "Uluslararası İşlemler"],
      securityLevel: 97,
      integrationTime: "2-3 gün",
      commission: 3.0,
      advantages: ["Uluslararası ağ", "Güçlü sermaye", "Teknoloji odaklı", "Kurumsal çözümler"]
    },
    {
      id: "ing",
      name: "İNG Bank",
      logo: "/images/banks/ing.png",
      established: 1984,
      customers: "4M+",
      branches: 300,
      category: "Yabancı Banka",
      rating: 4.6,
      assets: "₺180B",
      description: "Dijital bankacılıkta öncü",
      website: "https://www.ing.com.tr",
      phone: "+90 444 0 464",
      email: "info@ing.com.tr",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "Dijital Çözümler", "API First"],
      securityLevel: 99,
      integrationTime: "1-2 gün",
      commission: 3.3,
      advantages: ["Dijital öncülük", "Yenilikçi çözümler", "Hızlı entegrasyon", "Uluslararası standartlar"]
    },
    {
      id: "hsbc",
      name: "HSBC Turkey",
      logo: "/images/banks/hsbc.png",
      established: 1990,
      customers: "2M+",
      branches: 100,
      category: "Yabancı Banka",
      rating: 4.4,
      assets: "₺120B",
      description: "Küresel bankacılık deneyimi",
      website: "https://www.hsbc.com.tr",
      phone: "+90 444 0 472",
      email: "info@hsbc.com.tr",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "Premier Banking", "Küresel Ağ"],
      securityLevel: 98,
      integrationTime: "2-3 gün",
      commission: 3.4,
      advantages: ["Küresel ağ", "Premium hizmet", "Uluslararası standartlar", "Wealth management"]
    },
    {
      id: "sekerbank",
      name: "Şekerbank",
      logo: "/images/banks/sekerbank.png",
      established: 1953,
      customers: "3M+",
      branches: 400,
      category: "Özel Banka",
      rating: 4.0,
      assets: "₺90B",
      description: "Tarım ve KOBİ odaklı bankacılık",
      website: "https://www.sekerbank.com.tr",
      phone: "+90 444 0 700",
      email: "info@sekerbank.com.tr",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "Tarım Kartı", "KOBİ Çözümleri"],
      securityLevel: 92,
      integrationTime: "3-4 gün",
      commission: 2.7,
      advantages: ["Tarım odaklı", "KOBİ uzmanı", "Uygun komisyonlar", "Esnek çözümler"]
    },
    {
      id: "teb",
      name: "TEB",
      logo: "/images/banks/teb.png",
      established: 1927,
      customers: "5M+",
      branches: 450,
      category: "Özel Banka",
      rating: 4.1,
      assets: "₺200B",
      description: "Teknoloji ve inovasyonda öncü",
      website: "https://www.teb.com.tr",
      phone: "+90 444 0 832",
      email: "info@teb.com.tr",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "BNP Paribas Ağı", "Teknoloji Odaklı"],
      securityLevel: 96,
      integrationTime: "2-3 gün",
      commission: 3.1,
      advantages: ["Teknoloji odaklı", "Uluslararası bağlantılar", "İnovatif çözümler", "Hızlı hizmet"]
    },
    {
      id: "odeabank",
      name: "Odeabank",
      logo: "/images/banks/odeabank.png",
      established: 2012,
      customers: "1M+",
      branches: 150,
      category: "Özel Banka",
      rating: 4.3,
      assets: "₺60B",
      description: "Yeni nesil dijital bankacılık",
      website: "https://www.odeabank.com.tr",
      phone: "+90 444 0 632",
      email: "info@odeabank.com.tr",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "Dijital Öncelik", "Hızlı Entegrasyon"],
      securityLevel: 95,
      integrationTime: "1-2 gün",
      commission: 3.0,
      advantages: ["Dijital DNA", "Hızlı karar", "Esnek yapı", "Müşteri odaklı"]
    },
    {
      id: "fibabanka",
      name: "Fibabanka",
      logo: "/images/banks/fibabanka.png",
      established: 1984,
      customers: "800K+",
      branches: 80,
      category: "Özel Banka",
      rating: 4.2,
      assets: "₺45B",
      description: "Kurumsal ve ticari bankacılık",
      website: "https://www.fibabanka.com.tr",
      phone: "+90 444 0 342",
      email: "info@fibabanka.com.tr",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "Kurumsal Çözümler", "Ticari Bankacılık"],
      securityLevel: 94,
      integrationTime: "2-3 gün",
      commission: 2.9,
      advantages: ["Kurumsal odaklı", "Ticari bankacılık", "Özel çözümler", "Uzman kadro"]
    },
    {
      id: "burgan",
      name: "Burgan Bank",
      logo: "/images/banks/burgan.png",
      established: 1992,
      customers: "600K+",
      branches: 100,
      category: "Yabancı Banka",
      rating: 4.1,
      assets: "₺35B",
      description: "Kuveyt kökenli güçlü bankacılık",
      website: "https://www.burgan.com.tr",
      phone: "+90 444 0 287",
      email: "info@burgan.com.tr",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "İslami Bankacılık", "Körfez Ağı"],
      securityLevel: 93,
      integrationTime: "3-4 gün",
      commission: 3.2,
      advantages: ["Körfez bağlantısı", "İslami bankacılık", "Güçlü sermaye", "Özel hizmet"]
    },
    {
      id: "icbc",
      name: "ICBC Turkey",
      logo: "/images/banks/icbc.png",
      established: 2015,
      customers: "400K+",
      branches: 50,
      category: "Yabancı Banka",
      rating: 4.0,
      assets: "₺25B",
      description: "Çin kökenli küresel bankacılık",
      website: "https://www.icbc.com.tr",
      phone: "+90 444 0 422",
      email: "info@icbc.com.tr",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "Çin Ağı", "Uluslararası Ticaret"],
      securityLevel: 91,
      integrationTime: "3-5 gün",
      commission: 3.3,
      advantages: ["Çin bağlantısı", "Uluslararası ticaret", "Güçlü sermaye", "Küresel ağ"]
    },
    {
      id: "anadolubank",
      name: "Anadolubank",
      logo: "/images/banks/anadolubank.png",
      established: 1996,
      customers: "500K+",
      branches: 120,
      category: "Özel Banka",
      rating: 3.9,
      assets: "₺30B",
      description: "Anadolu'nun güçlü bankası",
      website: "https://www.anadolubank.com.tr",
      phone: "+90 444 0 262",
      email: "info@anadolubank.com.tr",
      headquarters: "İstanbul",
      posFeatures: ["Sanal POS", "Mobil POS", "3D Secure", "Bölgesel Odak", "KOBİ Desteği"],
      securityLevel: 90,
      integrationTime: "4-5 gün",
      commission: 2.8,
      advantages: ["Bölgesel güç", "KOBİ odaklı", "Uygun fiyatlar", "Yerel hizmet"]
    }
  ];

  const filteredBanks = banks
    .filter(bank => 
      bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(bank => selectedCategory === "all" || bank.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case "customers":
          return parseInt(b.customers.replace(/[^\d]/g, '')) - parseInt(a.customers.replace(/[^\d]/g, ''));
        case "rating":
          return b.rating - a.rating;
        case "established":
          return a.established - b.established;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const categories = ["all", ...Array.from(new Set(banks.map(bank => bank.category)))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
          <Building className="h-8 w-8 mr-3 text-green-600" />
          PAYREAM Entegre Bankalar
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Türkiye'nin 18 büyük bankasının sanal POS sistemleri tek platformda. 
          Güvenli, hızlı ve kolay entegrasyon ile tüm bankacılık işlemlerinizi yönetin.
        </p>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Banka adı veya kategori ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300 text-gray-900"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-900">
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="all" className="text-gray-900">Tüm Kategoriler</SelectItem>
              {categories.slice(1).map((category) => (
                <SelectItem key={category} value={category} className="text-gray-900">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-900">
              <SelectValue placeholder="Sıralama" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="customers" className="text-gray-900">Müşteri Sayısı</SelectItem>
              <SelectItem value="rating" className="text-gray-900">Puan</SelectItem>
              <SelectItem value="established" className="text-gray-900">Kuruluş Yılı</SelectItem>
              <SelectItem value="name" className="text-gray-900">İsim</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">18</div>
              <div className="text-sm text-green-700">Entegre Banka</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">150M+</div>
              <div className="text-sm text-blue-700">Toplam Müşteri</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">₺5T+</div>
              <div className="text-sm text-purple-700">Toplam Aktif</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">99.9%</div>
              <div className="text-sm text-orange-700">Güvenlik Skoru</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Management Dashboard Info */}
      <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center">
            <Monitor className="h-6 w-6 mr-2 text-green-600" />
            PAYREAM Yönetim Paneli Avantajları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tek Çatı Yönetim</h3>
              <p className="text-sm text-gray-600">18 bankanın tüm POS işlemlerini tek panelden yönetin</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Hızlı Entegrasyon</h3>
              <p className="text-sm text-gray-600">1-5 gün arası hızlı entegrasyon süreci</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Üst Düzey Güvenlik</h3>
              <p className="text-sm text-gray-600">PCI DSS Level 1 ve 256-bit SSL şifreleme</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gerçek Zamanlı Analiz</h3>
              <p className="text-sm text-gray-600">Detaylı raporlama ve performans analizi</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBanks.map((bank) => (
          <Card key={bank.id} className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center relative">
                  <img 
                    src={bank.logo} 
                    alt={`${bank.name} logo`}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<svg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'><rect width='48' height='48' rx='12' fill='#e5e7eb'/><text x='50%' y='55%' text-anchor='middle' fill='#6b7280' font-size='20' font-family='Arial' dy='.3em'>${bank.name.charAt(0)}</text></svg>`;
                      }
                    }}
                  />
                  {favorites.includes(bank.id) && (
                    <Heart className="absolute top-1 right-1 h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-900 flex items-center">
                    {bank.name}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="ml-2"
                      aria-label="Favorilere ekle/kaldır"
                      onClick={() => setFavorites(favs => favs.includes(bank.id) ? favs.filter(id => id !== bank.id) : [...favs, bank.id])}
                    >
                      <Heart className={`h-5 w-5 ${favorites.includes(bank.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-gray-600">{bank.description}</CardDescription>
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(bank.rating) ? "fill-current" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{bank.rating}/5</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                  <TabsTrigger value="overview" className="text-xs">Genel</TabsTrigger>
                  <TabsTrigger value="pos" className="text-xs">POS</TabsTrigger>
                  <TabsTrigger value="contact" className="text-xs">İletişim</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Kuruluş:</span>
                      <p className="font-medium text-gray-900">{bank.established}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Müşteri:</span>
                      <p className="font-medium text-gray-900">{bank.customers}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Şube:</span>
                      <p className="font-medium text-gray-900">{bank.branches}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Aktif:</span>
                      <p className="font-medium text-gray-900">{bank.assets}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-gray-300 text-gray-600">
                    {bank.category}
                  </Badge>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Avantajlar:</h4>
                    <div className="space-y-1">
                      {bank.advantages.slice(0, 2).map((advantage, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                          {advantage}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="pos" className="mt-4 space-y-3">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Güvenlik Seviyesi:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={bank.securityLevel} className="flex-1 h-2" />
                        <span className="text-sm font-medium text-gray-900">{bank.securityLevel}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Entegrasyon:</span>
                        <p className="font-medium text-gray-900">{bank.integrationTime}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Komisyon:</span>
                        <p className="font-medium text-green-600">%{bank.commission}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 mb-2 block">POS Özellikleri:</span>
                      <div className="flex flex-wrap gap-1">
                        {bank.posFeatures.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-gray-300 text-gray-600">
                            {feature}
                          </Badge>
                        ))}
                        {bank.posFeatures.length > 3 && (
                          <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                            +{bank.posFeatures.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contact" className="mt-4 space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-400 mr-2" />
                      <a 
                        href={bank.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Web Sitesi
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{bank.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{bank.email}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{bank.headquarters}</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  asChild
                >
                  <a href={bank.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Banka Detayları
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Features */}
      <Card className="mt-12 bg-gradient-to-r from-gray-50 to-green-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 text-center flex items-center justify-center">
            <Shield className="h-6 w-6 mr-2 text-green-600" />
            PAYREAM Güvenlik Altyapısı
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Tüm bankalar için tek standart güvenlik protokolü
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">PCI DSS Level 1</h3>
              <p className="text-sm text-gray-600">En yüksek güvenlik standardı sertifikası</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">256-bit SSL</h3>
              <p className="text-sm text-gray-600">Bankacılık seviyesi şifreleme teknolojisi</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">ISO 27001</h3>
              <p className="text-sm text-gray-600">Bilgi güvenliği yönetim sistemi</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Monitor className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">7/24 İzleme</h3>
              <p className="text-sm text-gray-600">Sürekli güvenlik kontrolü ve izleme</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
