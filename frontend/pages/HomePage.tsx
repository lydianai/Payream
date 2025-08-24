import { Helmet } from "react-helmet";
import { useResponsiveFix } from "../hooks/useResponsiveFix";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, MessageCircle, TrendingUp, Shield, Zap, CreditCard, ArrowRight, CheckCircle, Newspaper, BarChart3, Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram, ExternalLink, Users, Award, Clock, Globe, Building, Lock, Database, Layers, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchBox from "../components/SearchBox";
import FeaturedProviders from "../components/FeaturedProviders";
import NewsSection from "../components/NewsSection";
import GlobalFinanceNews from "../components/GlobalFinanceNews";
import Logo from "../components/Logo";

export default function HomePage() {
  useResponsiveFix();
  const { t } = useTranslation();

  const banks = [
    { name: "Türkiye İş Bankası", logo: "/images/banks/isbank.png", established: 1924, customers: "15M+" },
    { name: "Garanti BBVA", logo: "/images/banks/garanti.png", established: 1946, customers: "18M+" },
    { name: "Akbank", logo: "/images/banks/akbank.png", established: 1948, customers: "17M+" },
    { name: "Yapı Kredi Bankası", logo: "/images/banks/yapikredi.png", established: 1944, customers: "16M+" },
    { name: "Ziraat Bankası", logo: "/images/banks/ziraat.png", established: 1863, customers: "25M+" },
    { name: "Halkbank", logo: "/images/banks/halkbank.png", established: 1933, customers: "20M+" },
    { name: "VakıfBank", logo: "/images/banks/vakifbank.png", established: 1954, customers: "14M+" },
    { name: "Denizbank", logo: "/images/banks/denizbank.png", established: 1997, customers: "8M+" },
    { name: "QNB Finansbank", logo: "/images/banks/qnb.png", established: 1987, customers: "6M+" },
    { name: "İNG Bank", logo: "/images/banks/ing.png", established: 1984, customers: "4M+" },
    { name: "HSBC Turkey", logo: "/images/banks/hsbc.png", established: 1990, customers: "2M+" },
    { name: "Şekerbank", logo: "/images/banks/sekerbank.png", established: 1953, customers: "3M+" },
    { name: "TEB", logo: "/images/banks/teb.png", established: 1927, customers: "5M+" },
    { name: "Odeabank", logo: "/images/banks/odeabank.png", established: 2012, customers: "1M+" },
    { name: "Fibabanka", logo: "/images/banks/fibabanka.png", established: 1984, customers: "800K+" },
    { name: "Burgan Bank", logo: "/images/banks/burgan.png", established: 1992, customers: "600K+" },
    { name: "ICBC Turkey", logo: "/images/banks/icbc.png", established: 2015, customers: "400K+" },
    { name: "Anadolubank", logo: "/images/banks/anadolubank.png", established: 1996, customers: "500K+" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 relative overflow-hidden">
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-500 rounded-full opacity-10 animate-bounce" style={{ animationDelay: "0s", animationDuration: "3s" }}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-green-400 rounded-full opacity-10 animate-bounce" style={{ animationDelay: "1s", animationDuration: "4s" }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-600 rounded-full opacity-10 animate-bounce" style={{ animationDelay: "2s", animationDuration: "5s" }}></div>
          <div className="absolute top-60 left-1/3 w-8 h-8 bg-green-500 rounded-full opacity-10 animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "3.5s" }}></div>
          <div className="absolute bottom-40 right-1/3 w-14 h-14 bg-green-400 rounded-full opacity-10 animate-bounce" style={{ animationDelay: "1.5s", animationDuration: "4.5s" }}></div>
          
          {/* Floating credit cards with enhanced animation */}
          <div className="absolute top-32 right-1/4 animate-float">
            <CreditCard className="w-8 h-8 text-green-500 opacity-20 animate-pulse" />
          </div>
          <div className="absolute bottom-32 left-1/3 animate-float" style={{ animationDelay: "1.5s" }}>
            <CreditCard className="w-6 h-6 text-green-400 opacity-20 animate-pulse" />
          </div>
          <div className="absolute top-1/2 right-10 animate-float" style={{ animationDelay: "3s" }}>
            <Shield className="w-7 h-7 text-green-600 opacity-20 animate-pulse" />
          </div>
          <div className="absolute bottom-1/4 left-20 animate-float" style={{ animationDelay: "2.5s" }}>
            <Zap className="w-5 h-5 text-green-500 opacity-20 animate-pulse" />
          </div>

          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 gap-4 h-full">
              {[...Array(144)].map((_, i) => (
                <div 
                  key={i} 
                  className="border border-green-500 animate-pulse" 
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "4s"
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Moving gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-green-500 to-green-400 rounded-full opacity-10 animate-ping" style={{ animationDuration: "6s" }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-green-600 to-green-500 rounded-full opacity-10 animate-ping" style={{ animationDelay: "3s", animationDuration: "8s" }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="animate-bounce" style={{ animationDuration: "2s" }}>
              <Logo size="lg" animated={true} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            {t('home.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.5s" }}>
            {t('home.subtitle')}
          </p>
          <p className="text-lg text-green-600 font-semibold mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.7s" }}>
            Türkiye'nin 18 büyük bankasının sanal POS sistemleri tek çatı altında!
          </p>
          
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "1s" }}>
            <SearchBox />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "1.5s" }}>
            <Button 
              size="lg" 
              asChild 
              className="bg-green-600 hover:bg-green-700 text-white group transform hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
            >
              <Link to="/search">
                <Search className="h-5 w-5 mr-2 group-hover:animate-spin" aria-hidden="true" />
                {t('home.exploreButton')}
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              asChild 
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 group transform hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
            >
              <Link to="/chat">
                <MessageCircle className="h-5 w-5 mr-2 group-hover:animate-bounce" aria-hidden="true" />
                {t('home.chatButton')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Animated Stats Bar */}
      <section 
        className="py-8 bg-gradient-to-r from-green-600 via-green-500 to-green-600 relative overflow-hidden"
        aria-labelledby="stats-title"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-green-600 animate-gradient-x" aria-hidden="true"></div>
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="flex animate-pulse">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 h-full bg-white mx-2 animate-bounce" 
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "2s"
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 id="stats-title" className="sr-only">Platform İstatistikleri</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div className="group transform hover:scale-110 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold mb-2 animate-pulse" aria-hidden="true">18</div>
              <div className="text-green-100">Entegre Banka</div>
            </div>
            <div className="group transform hover:scale-110 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold mb-2 animate-pulse" style={{ animationDelay: "0.5s" }} aria-hidden="true">150M+</div>
              <div className="text-green-100">Toplam Müşteri</div>
            </div>
            <div className="group transform hover:scale-110 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold mb-2 animate-pulse" style={{ animationDelay: "1s" }} aria-hidden="true">₺50B</div>
              <div className="text-green-100">Günlük İşlem Hacmi</div>
            </div>
            <div className="group transform hover:scale-110 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold mb-2 animate-pulse" style={{ animationDelay: "1.5s" }} aria-hidden="true">7/24</div>
              <div className="text-green-100">Güvenli Altyapı</div>
            </div>
          </div>
        </div>
      </section>

      {/* Banking Integration Section */}
      <section className="py-20 bg-white relative overflow-hidden" aria-labelledby="banking-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="banking-title" className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
              <Building className="inline-block h-8 w-8 mr-2 text-green-600" aria-hidden="true" />
              Türkiye'nin En Büyük Bankalarıyla Entegrasyon
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
              18 büyük bankanın sanal POS sistemlerini tek platformda yönetin. PAYREAM ile tüm bankacılık işlemlerinizi güvenle gerçekleştirin.
            </p>
          </div>

          {/* Banks Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
            {banks.map((bank, index) => (
              <Card 
                key={bank.name} 
                className="bg-white border-gray-200 group hover:bg-gray-50 transition-all duration-500 hover:scale-105 hover:shadow-xl animate-fade-in focus-within:ring-2 focus-within:ring-green-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-green-50 transition-colors">
                    <img 
                      src={bank.logo} 
                      alt={`${bank.name} logo`}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-lg font-bold text-gray-600">${bank.name.charAt(0)}</span>`;
                        }
                      }}
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                    {bank.name}
                  </h3>
                  <p className="text-xs text-gray-600">{bank.customers} müşteri</p>
                  <Badge variant="outline" className="mt-2 border-gray-300 text-gray-600 text-xs">
                    {bank.established}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Management Dashboard Preview */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900 flex items-center justify-center">
                <Monitor className="h-6 w-6 mr-2 text-green-600" />
                PAYREAM Yönetim Paneli
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Tüm bankaları tek çatı altında yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Database className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Merkezi Yönetim</h3>
                  <p className="text-gray-600">
                    18 bankanın tüm POS işlemlerini tek panelden kontrol edin. Gerçek zamanlı raporlama ve analiz.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Layers className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Çoklu Entegrasyon</h3>
                  <p className="text-gray-600">
                    Farklı banka API'lerini tek arayüzde birleştirin. Kolay geçiş ve yedekleme sistemi.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Üst Düzey Güvenlik</h3>
                  <p className="text-gray-600">
                    256-bit SSL şifreleme, PCI DSS uyumluluğu ve çok faktörlü kimlik doğrulama.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Güvenlik Altyapısı</h4>
                <div className="grid md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                  // ...existing code...
                    <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">PCI DSS Level 1</p>
                    <p className="text-xs text-gray-600">En yüksek güvenlik standardı</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Lock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">256-bit SSL</p>
                    <p className="text-xs text-gray-600">Bankacılık seviyesi şifreleme</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Database className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">ISO 27001</p>
                    <p className="text-xs text-gray-600">Bilgi güvenliği yönetimi</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <Monitor className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">7/24 İzleme</p>
                    <p className="text-xs text-gray-600">Sürekli güvenlik kontrolü</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section 
        className="py-20 bg-gray-50 relative overflow-hidden"
        aria-labelledby="features-title"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 id="features-title" className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
              {t('home.features.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center bg-white border-gray-200 group hover:bg-gray-50 transition-all duration-500 hover:scale-105 hover:rotate-1 animate-fade-in focus-within:ring-2 focus-within:ring-green-500" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:animate-spin group-hover:bg-green-200 transition-all duration-500">
                  <Search className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <CardTitle className="text-gray-900 group-hover:text-green-600 transition-colors">
                  {t('home.features.advancedSearch.title')}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {t('home.features.advancedSearch.description')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center bg-white border-gray-200 group hover:bg-gray-50 transition-all duration-500 hover:scale-105 hover:-rotate-1 animate-fade-in focus-within:ring-2 focus-within:ring-green-500" style={{ animationDelay: "0.4s" }}>
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:animate-bounce group-hover:bg-green-200 transition-all duration-500">
                  <BarChart3 className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <CardTitle className="text-gray-900 group-hover:text-green-600 transition-colors">
                  {t('home.features.realTimeData.title')}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {t('home.features.realTimeData.description')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center bg-white border-gray-200 group hover:bg-gray-50 transition-all duration-500 hover:scale-105 hover:rotate-1 animate-fade-in focus-within:ring-2 focus-within:ring-green-500" style={{ animationDelay: "0.6s" }}>
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse group-hover:bg-green-200 transition-all duration-500">
                  <MessageCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <CardTitle className="text-gray-900 group-hover:text-green-600 transition-colors">
                  {t('home.features.aiExpert.title')}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {t('home.features.aiExpert.description')}
                </CardDescription>
              </CardHeader>
                        <Helmet>
                          <title>Payream - Sanal POS ve Finans Platformu</title>
                          <meta name="description" content="Türkiye ve dünya genelinde sanal POS, finans, haber ve kullanıcı değerlendirmeleri platformu." />
                          <meta name="keywords" content="sanal pos, finans, haber, kullanıcı değerlendirmeleri, Türkiye, global" />
                          <link rel="canonical" href="https://payream.com/" />
                          <meta property="og:title" content="Payream - Sanal POS ve Finans Platformu" />
                          <meta property="og:description" content="Türkiye ve dünya genelinde sanal POS, finans, haber ve kullanıcı değerlendirmeleri platformu." />
                          <meta property="og:type" content="website" />
                          <meta property="og:url" content="https://payream.com/" />
                          <meta property="og:image" content="https://payream.com/public/images/og-image.png" />
                          <meta name="twitter:card" content="summary_large_image" />
                          <meta name="twitter:title" content="Payream - Sanal POS ve Finans Platformu" />
                          <meta name="twitter:description" content="Türkiye ve dünya genelinde sanal POS, finans, haber ve kullanıcı değerlendirmeleri platformu." />
                          <meta name="twitter:image" content="https://payream.com/public/images/og-image.png" />
                          <meta name="robots" content="index, follow" />
                          <meta name="google-site-verification" content="GOOGLE_VERIFICATION_CODE" />
                          <meta name="bingbot" content="index, follow" />
                          <link rel="alternate" hrefLang="tr" href="https://payream.com/" />
                          <link rel="alternate" hrefLang="en" href="https://payream.com/en" />
                          <script type="application/ld+json">
                            {`
                              {
                                "@context": "https://schema.org",
                                "@type": "WebSite",
                                "name": "Payream",
                                "url": "https://payream.com/",
                                "description": "Türkiye ve dünya genelinde sanal POS, finans, haber ve kullanıcı değerlendirmeleri platformu."
                              }
                            `}
                          </script>
                        </Helmet>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Fintech Benefits Section */}
      <section 
        className="py-20 bg-white relative overflow-hidden"
        aria-labelledby="benefits-title"
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-10 right-10 w-32 h-32 border border-green-500 rounded-full opacity-10 animate-spin" style={{ animationDuration: "20s" }}></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 border border-green-400 rounded-full opacity-10 animate-spin" style={{ animationDuration: "15s", animationDirection: "reverse" }}></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 border border-green-600 rounded-full opacity-5 animate-ping" style={{ animationDuration: "10s" }}></div>
          
          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-500 rounded-full animate-float opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 id="benefits-title" className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
              {t('home.benefits.title')}
            </h2>
            <p className="text-lg text-gray-600 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {t('home.benefits.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: t('home.benefits.blockchainSecurity.title'),
                description: t('home.benefits.blockchainSecurity.description'),
                color: "text-green-600",
                delay: "0.1s"
              },
              {
                icon: Zap,
                title: t('home.benefits.instantTransactions.title'),
                description: t('home.benefits.instantTransactions.description'),
                color: "text-green-500",
                delay: "0.2s"
              },
              {
                icon: CreditCard,
                title: t('home.benefits.multiPayment.title'),
                description: t('home.benefits.multiPayment.description'),
                color: "text-green-600",
                delay: "0.3s"
              },
              {
                icon: TrendingUp,
                title: t('home.benefits.lowCosts.title'),
                description: t('home.benefits.lowCosts.description'),
                color: "text-green-500",
                delay: "0.4s"
              },
              {
                icon: CheckCircle,
                title: t('home.benefits.apiFirst.title'),
                description: t('home.benefits.apiFirst.description'),
                color: "text-green-600",
                delay: "0.5s"
              },
              {
                icon: Newspaper,
                title: t('home.benefits.latestNews.title'),
                description: t('home.benefits.latestNews.description'),
                color: "text-green-500",
                delay: "0.6s"
              }
            ].map((benefit, index) => (
              <Card 
                key={index} 
                className="bg-white border-gray-200 group hover:bg-gray-50 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in focus-within:ring-2 focus-within:ring-green-500" 
                style={{ animationDelay: benefit.delay }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:animate-bounce group-hover:bg-green-200 transition-all duration-300">
                      <benefit.icon className={`h-6 w-6 ${benefit.color} group-hover:animate-pulse`} aria-hidden="true" />
                    </div>
                    <CardTitle className="text-gray-900 text-lg group-hover:text-green-600 transition-colors">
                      {benefit.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 mt-2">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

  {/* News Section */}
  <NewsSection />
  {/* Dünya Finans Gelişmeleri & Haber Akışı */}
  <GlobalFinanceNews />

      {/* Featured Providers */}
      <section 
        className="py-20 bg-white"
        aria-labelledby="providers-title"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="providers-title" className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
              {t('home.providers.title')}
            </h2>
            <p className="text-lg text-gray-600 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {t('home.providers.subtitle')}
            </p>
          </div>
          <FeaturedProviders />
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section 
        className="py-20 bg-gradient-to-r from-green-600 to-green-500 relative overflow-hidden"
        aria-labelledby="cta-title"
      >
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-600 via-green-500 to-green-600 animate-gradient-x"></div>
        </div>
        
        {/* Animated elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-white rounded-full opacity-20 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 id="cta-title" className="text-3xl font-bold text-white mb-4 animate-fade-in">
            {t('home.cta.title')}
          </h2>
          <p className="text-lg text-green-100 mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <Button 
              size="lg" 
              asChild 
              className="bg-white text-green-600 hover:bg-gray-100 group transform hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600"
            >
              <Link to="/search">
                <Search className="h-5 w-5 mr-2 group-hover:animate-spin" aria-hidden="true" />
                {t('home.cta.exploreButton')}
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              asChild 
              className="border-white text-white hover:bg-white hover:text-green-600 group transform hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600"
            >
              <Link to="/chat">
                <MessageCircle className="h-5 w-5 mr-2 group-hover:animate-bounce" aria-hidden="true" />
                {t('home.cta.chatButton')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Detailed Footer */}
      <footer className="bg-white border-t border-gray-200" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Logo size="sm" animated={true} />
                <span className="text-xl font-bold text-gray-900">PAYREAM</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t('footer.company.description')}
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" aria-hidden="true" />
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" aria-hidden="true" />
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-green-600" aria-hidden="true" />
                {t('footer.services.title')}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/search" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  >
                    <ArrowRight className="h-3 w-3 mr-2" aria-hidden="true" />
                    {t('footer.services.posComparison')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/chat" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  >
                    <ArrowRight className="h-3 w-3 mr-2" aria-hidden="true" />
                    {t('footer.services.aiConsulting')}
                  </Link>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  >
                    <ArrowRight className="h-3 w-3 mr-2" aria-hidden="true" />
                    {t('footer.services.blockchainAnalysis')}
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  >
                    <ArrowRight className="h-3 w-3 mr-2" aria-hidden="true" />
                    {t('footer.services.defiReview')}
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  >
                    <ArrowRight className="h-3 w-3 mr-2" aria-hidden="true" />
                    {t('footer.services.fintechNews')}
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  >
                    <ArrowRight className="h-3 w-3 mr-2" aria-hidden="true" />
                    {t('footer.services.apiGuide')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
                <Newspaper className="h-4 w-4 mr-2 text-green-600" aria-hidden="true" />
                {t('footer.resources.title')}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" aria-hidden="true" />
                    {t('footer.resources.fintechGuide')}
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" aria-hidden="true" />
                    {t('footer.resources.blockchainEducation')}
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" aria-hidden="true" />
                    {t('footer.resources.posSetupGuide')}
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" aria-hidden="true" />
                    {t('footer.resources.defiGuide')}
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" aria-hidden="true" />
                    {t('footer.resources.securityBestPractices')}
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" aria-hidden="true" />
                    {t('footer.resources.faq')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Stats */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-green-600" aria-hidden="true" />
                {t('footer.contact.title')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600 text-sm">
                  <Mail className="h-4 w-4 mr-2 text-green-600" aria-hidden="true" />
                  <a 
                    href="mailto:info@payream.com"
                    className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  >
                    info@payream.com
                  </a>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Phone className="h-4 w-4 mr-2 text-green-600" aria-hidden="true" />
                  <a 
                    href="tel:+90540 003 1453"
                    className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                  >
                    +90 (540) 003 1453
                  </a>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-green-600" aria-hidden="true" />
                  Alanya / Antalya , Türkiye
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Globe className="h-4 w-4 mr-2 text-green-600" aria-hidden="true" />
                  <a 
                    href="https://www.payream.com"
                    className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.payream.com
                  </a>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-gray-900 font-medium mb-3 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-green-600" aria-hidden="true" />
                  {t('footer.stats.title')}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1 text-green-600" aria-hidden="true" />
                    <span className="text-gray-600">150M+ {t('footer.stats.users')}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-3 w-3 mr-1 text-green-600" aria-hidden="true" />
                    <span className="text-gray-600">18 {t('footer.stats.solutions')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-green-600" aria-hidden="true" />
                    <span className="text-gray-600">7/24 {t('footer.stats.support')}</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" aria-hidden="true" />
                    <span className="text-gray-600">₺50B {t('footer.stats.volume')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-600">
                <a 
                  href="#" 
                  className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                >
                  {t('footer.legal.privacy')}
                </a>
                <a 
                  href="#" 
                  className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                >
                  {t('footer.legal.terms')}
                </a>
                <a 
                  href="#" 
                  className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                >
                  {t('footer.legal.cookies')}
                </a>
                <a 
                  href="#" 
                  className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                >
                  {t('footer.legal.kvkk')}
                </a>
                <a 
                  href="#" 
                  className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                >
                  {t('footer.legal.legal')}
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
                  <span className="text-sm text-gray-600">{t('footer.status.systemActive')}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {t('footer.status.lastUpdate')}: {new Date().toLocaleDateString('tr-TR')}
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                © 2025 PAYREAM - {t('footer.copyright')} | {t('footer.developer')}: 
                <span className="text-green-600 font-medium ml-1">EMRAH SARDAG</span>
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {t('footer.mission')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
