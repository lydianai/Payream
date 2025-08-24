import { useState, useEffect, useRef } from "react";
import { useResponsiveFix } from "../hooks/useResponsiveFix";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Send, Bot, User, TrendingUp, DollarSign, Shield, Zap, Search, BarChart3, Clock, Star, Activity, Globe, Cpu, CreditCard, Smartphone, Building, Code, Coins, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useSearchQuery, useNewsQuery } from "../hooks/useOptimizedQuery";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatPage() {
  useResponsiveFix();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([{
      id: "1",
      content: t('chat.welcomeMessage'),
      isUser: false,
      timestamp: new Date()
    }]);
  }, [t]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fetch search results for AI context with optimized caching
  const { data: searchResults } = useSearchQuery({
    query: searchQuery,
    limit: 5
  });

  // Fetch latest news for AI context with background refresh
  const { data: newsData } = useNewsQuery({ limit: 3 });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      // Add context from search results and news
      let context = "";
      if (searchResults?.providers.length) {
        context += `Mevcut POS sağlayıcıları: ${searchResults.providers.map(p => `${p.name} (${p.category}, %${p.commission} komisyon)`).join(", ")}. `;
      }
      if (newsData?.news.length) {
        context += `Son haberler: ${newsData.news.map(n => `${n.title} (${n.category})`).join(", ")}.`;
      }
      
      const backend = await import('~backend/client');
      return backend.default.chat.chat({ message, context });
    },
    onSuccess: (data) => {
      const botMessage: Message = {
        id: Date.now().toString() + "-bot",
        content: data.response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      toast({
        title: t('common.error'),
        description: t('chat.errors.sendFailed'),
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(input);
    setInput("");
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    setInput(query);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setInput("");
    }
  };

  const marketData = [
    { name: t('chat.marketData.avgCommission'), value: "2.89%", change: "-0.05%", trend: "down" },
    { name: t('chat.marketData.dailyVolume'), value: "₺2.5M", change: "+12.3%", trend: "up" },
    { name: t('chat.marketData.activePOS'), value: "80+", change: "+5", trend: "up" },
    { name: t('chat.marketData.blockchainSupport'), value: "35%", change: "+8%", trend: "up" }
  ];

  const expertiseAreas = [
    { area: t('chat.expertise.virtualPOS'), level: 95, color: "bg-blue-500" },
    { area: t('chat.expertise.blockchain'), level: 90, color: "bg-purple-500" },
    { area: t('chat.expertise.defi'), level: 85, color: "bg-green-500" },
    { area: t('chat.expertise.crypto'), level: 88, color: "bg-yellow-500" },
    { area: t('chat.expertise.fintech'), level: 92, color: "bg-indigo-500" },
    { area: t('chat.expertise.api'), level: 87, color: "bg-cyan-500" },
    { area: t('chat.expertise.security'), level: 93, color: "bg-red-500" },
    { area: t('chat.expertise.costAnalysis'), level: 89, color: "bg-orange-500" }
  ];

  const quickQuestions = [
    {
      icon: DollarSign,
      question: "En düşük komisyon oranına sahip POS hangisi?",
      color: "text-green-500",
      category: t('chat.quickQuestions.categories.cost'),
      description: "Komisyon oranları ve maliyet karşılaştırması"
    },
    {
      icon: Shield,
      question: "Blockchain tabanlı güvenli ödeme sistemleri nelerdir?",
      color: "text-blue-500",
      category: t('chat.quickQuestions.categories.security'),
      description: "Güvenlik protokolleri ve blockchain teknolojileri"
    },
    {
      icon: TrendingUp,
      question: "DeFi protokolleri nasıl çalışır ve avantajları nelerdir?",
      color: "text-purple-500",
      category: t('chat.quickQuestions.categories.blockchain'),
      description: "Merkezi olmayan finans ve DeFi ekosistemi"
    },
    {
      icon: Zap,
      question: "NFT ödemelerini destekleyen POS sistemleri var mı?",
      color: "text-yellow-500",
      category: t('chat.quickQuestions.categories.innovation'),
      description: "NFT ve Web3 ödeme teknolojileri"
    },
    {
      icon: BarChart3,
      question: "2024 fintech trendleri nelerdir?",
      color: "text-indigo-500",
      category: t('chat.quickQuestions.categories.trend'),
      description: "Güncel fintech gelişmeleri ve piyasa analizi"
    },
    {
      icon: Globe,
      question: "Açık bankacılık API'leri nasıl kullanılır?",
      color: "text-cyan-500",
      category: t('chat.quickQuestions.categories.api'),
      description: "API entegrasyonları ve açık bankacılık"
    },
    {
      icon: CreditCard,
      question: "Sanal POS entegrasyonu nasıl yapılır?",
      color: "text-blue-500",
      category: t('chat.quickQuestions.categories.integration'),
      description: "Teknik entegrasyon süreçleri ve dokümantasyon"
    },
    {
      icon: Smartphone,
      question: "Mobil ödeme çözümleri hangileridir?",
      color: "text-green-500",
      category: t('chat.quickQuestions.categories.mobile'),
      description: "Mobil ödeme sistemleri ve QR kod teknolojileri"
    },
    {
      icon: Building,
      question: "Kurumsal POS çözümleri nelerdir?",
      color: "text-gray-500",
      category: t('chat.quickQuestions.categories.corporate'),
      description: "Büyük ölçekli işletmeler için POS sistemleri"
    },
    {
      icon: Code,
      question: "POS API dokümantasyonu nasıl okunur?",
      color: "text-purple-500",
      category: t('chat.quickQuestions.categories.developer'),
      description: "Geliştiriciler için teknik rehberler"
    },
    {
      icon: Coins,
      question: "Kripto para ödemeleri nasıl entegre edilir?",
      color: "text-yellow-500",
      category: t('chat.quickQuestions.categories.crypto'),
      description: "Kripto para ve stablecoin entegrasyonları"
    },
    {
      icon: Lock,
      question: "PCI DSS uyumluluğu nasıl sağlanır?",
      color: "text-red-500",
      category: t('chat.quickQuestions.categories.compliance'),
      description: "Güvenlik standartları ve uyumluluk gereksinimleri"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen" onKeyDown={handleKeyDown}>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 id="main-content" className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
              <Bot className="h-10 w-10 mr-3 text-green-600" aria-hidden="true" />
              {t('chat.title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('chat.subtitle')}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-green-600 mb-2">
              <div className="w-3 h-3 bg-green-600 rounded-full mr-2 animate-pulse" aria-hidden="true"></div>
              <span className="font-semibold">{t('chat.status.online')}</span>
            </div>
            <div className="text-gray-500 text-sm">
              <Clock className="h-4 w-4 inline mr-1" aria-hidden="true" />
              <time dateTime={currentTime.toISOString()}>
                {currentTime.toLocaleTimeString('tr-TR')}
              </time>
            </div>
          </div>
        </div>

        {/* Quick Search */}
        <Card className="bg-white border-gray-200 mb-6 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 text-lg flex items-center">
              <Search className="h-5 w-5 mr-2 text-green-600" aria-hidden="true" />
              {t('chat.quickSearch.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder={t('chat.quickSearch.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                aria-label={t('chat.quickSearch.placeholder')}
              />
              <Button 
                onClick={() => handleQuickSearch(searchQuery)}
                className="bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
                aria-label={t('common.search')}
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            {searchResults?.providers.length ? (
              <div className="mt-3 space-y-2">
                <p className="text-sm text-gray-600">
                  {searchResults.total} {t('chat.quickSearch.resultsFound')}:
                </p>
                {searchResults.providers.slice(0, 3).map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                    <div>
                      <span className="text-gray-900 font-medium">{provider.name}</span>
                      <Badge variant="outline" className="ml-2 border-gray-300 text-gray-600 text-xs">
                        {provider.category}
                      </Badge>
                    </div>
                    <span className="text-green-600 font-semibold">%{provider.commission}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[700px] flex flex-col bg-white border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-gray-900">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3">
                    <Bot className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-lg">PAYREAM {t('chat.title')}</div>
                    <div className="text-sm text-gray-600 font-normal">Yapay Zeka Destekli Danışman</div>
                  </div>
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-green-600">
                    <Activity className="h-4 w-4 mr-1" aria-hidden="true" />
                    {t('chat.status.active')}
                  </div>
                  <Badge variant="outline" className="border-green-500 text-green-600">
                    <Cpu className="h-3 w-3 mr-1" aria-hidden="true" />
                    GPT-4 Powered
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div 
                className="flex-1 overflow-y-auto space-y-4 p-6"
                role="log"
                aria-label={t('accessibility.chatMessages')}
                aria-live="polite"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                    role="article"
                    aria-label={message.isUser ? t('accessibility.userMessage') : t('accessibility.aiMessage')}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.isUser
                          ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                          : "bg-gray-50 text-gray-900 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {!message.isUser && (
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="h-4 w-4 text-white" aria-hidden="true" />
                          </div>
                        )}
                        {message.isUser && (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="h-4 w-4 text-gray-600" aria-hidden="true" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.isUser ? "text-green-100" : "text-gray-500"
                          }`}>
                            <time dateTime={message.timestamp.toISOString()}>
                              {message.timestamp.toLocaleTimeString('tr-TR')}
                            </time>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {chatMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" aria-hidden="true" />
                        </div>
                        <div className="flex space-x-1" aria-label={t('chat.input.sending')}>
                          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('chat.input.placeholder')}
                    disabled={chatMutation.isPending}
                    className="flex-1 bg-white border-gray-300 text-gray-900 placeholder-gray-500 h-12 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    aria-label={t('chat.input.placeholder')}
                  />
                  <Button 
                    type="submit" 
                    disabled={!input.trim() || chatMutation.isPending}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white h-12 px-6 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
                    aria-label={t('chat.input.send')}
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Market Data */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" aria-hidden="true" />
                {t('chat.marketData.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{data.name}</p>
                    <p className="text-gray-900 font-semibold">{data.value}</p>
                  </div>
                  <div className={`flex items-center text-sm ${
                    data.trend === 'up' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    <TrendingUp 
                      className={`h-3 w-3 mr-1 ${data.trend === 'down' ? 'rotate-180' : ''}`} 
                      aria-hidden="true"
                    />
                    {data.change}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Expertise Areas */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 text-lg flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" aria-hidden="true" />
                {t('chat.expertise.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expertiseAreas.map((expertise, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{expertise.area}</span>
                      <span className="text-gray-900 font-semibold">{expertise.level}%</span>
                    </div>
                    <Progress 
                      value={expertise.level} 
                      className="h-2"
                      aria-label={`${expertise.area}: ${expertise.level}%`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Latest News */}
          {newsData?.news.length ? (
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 text-lg flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-green-600" aria-hidden="true" />
                  {t('chat.latestNews.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {newsData.news.slice(0, 3).map((news) => (
                  <div key={news.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                    <h4 className="text-gray-900 text-sm font-medium mb-1 line-clamp-2">
                      {news.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          news.category === 'Blockchain' ? 'border-purple-300 text-purple-600' :
                          news.category === 'POS Sistemleri' ? 'border-blue-300 text-blue-600' :
                          'border-green-300 text-green-600'
                        }`}
                      >
                        {news.category}
                      </Badge>
                      <span className="text-gray-500 text-xs">
                        <time dateTime={news.publishDate.toISOString()}>
                          {news.publishDate.toLocaleDateString('tr-TR')}
                        </time>
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      {/* Quick Questions Section - Moved to bottom */}
      <div className="mt-12">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 text-2xl text-center mb-4">
              {t('chat.quickQuestions.title')}
            </CardTitle>
            <p className="text-gray-600 text-center">
              {t('chat.quickQuestions.subtitle')}
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-gray-100 mb-6">
                <TabsTrigger value="all" className="text-sm">{t('chat.quickQuestions.tabs.all')}</TabsTrigger>
                <TabsTrigger value="pos" className="text-sm">{t('chat.quickQuestions.tabs.pos')}</TabsTrigger>
                <TabsTrigger value="blockchain" className="text-sm">{t('chat.quickQuestions.tabs.blockchain')}</TabsTrigger>
                <TabsTrigger value="fintech" className="text-sm">{t('chat.quickQuestions.tabs.fintech')}</TabsTrigger>
                <TabsTrigger value="technical" className="text-sm">{t('chat.quickQuestions.tabs.technical')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickQuestions.map((item, index) => (
                    <Card
                      key={index}
                      className="bg-gray-50 border-gray-200 hover:bg-gray-100 transition-all duration-300 hover:scale-105 cursor-pointer focus-within:ring-2 focus-within:ring-green-500"
                      onClick={() => setInput(item.question)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setInput(item.question);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`${item.question} - ${item.description}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <item.icon className={`h-5 w-5 ${item.color}`} aria-hidden="true" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-gray-900 font-medium mb-1 text-sm leading-tight">
                              {item.question}
                            </h4>
                            <p className="text-gray-600 text-xs mb-2">
                              {item.description}
                            </p>
                            <Badge variant="outline" className="border-gray-300 text-gray-600 text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="pos" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickQuestions.filter(q => [
                    t('chat.quickQuestions.categories.cost'), 
                    t('chat.quickQuestions.categories.security'), 
                    t('chat.quickQuestions.categories.integration'), 
                    t('chat.quickQuestions.categories.mobile'), 
                    t('chat.quickQuestions.categories.corporate')
                  ].includes(q.category)).map((item, index) => (
                    <Card
                      key={index}
                      className="bg-gray-50 border-gray-200 hover:bg-gray-100 transition-all duration-300 hover:scale-105 cursor-pointer focus-within:ring-2 focus-within:ring-green-500"
                      onClick={() => setInput(item.question)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setInput(item.question);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`${item.question} - ${item.description}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <item.icon className={`h-5 w-5 ${item.color}`} aria-hidden="true" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-gray-900 font-medium mb-1 text-sm leading-tight">
                              {item.question}
                            </h4>
                            <p className="text-gray-600 text-xs mb-2">
                              {item.description}
                            </p>
                            <Badge variant="outline" className="border-gray-300 text-gray-600 text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="blockchain" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickQuestions.filter(q => [
                    t('chat.quickQuestions.categories.blockchain'), 
                    t('chat.quickQuestions.categories.innovation'), 
                    t('chat.quickQuestions.categories.crypto')
                  ].includes(q.category)).map((item, index) => (
                    <Card
                      key={index}
                      className="bg-gray-50 border-gray-200 hover:bg-gray-100 transition-all duration-300 hover:scale-105 cursor-pointer focus-within:ring-2 focus-within:ring-green-500"
                      onClick={() => setInput(item.question)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setInput(item.question);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`${item.question} - ${item.description}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <item.icon className={`h-5 w-5 ${item.color}`} aria-hidden="true" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-gray-900 font-medium mb-1 text-sm leading-tight">
                              {item.question}
                            </h4>
                            <p className="text-gray-600 text-xs mb-2">
                              {item.description}
                            </p>
                            <Badge variant="outline" className="border-gray-300 text-gray-600 text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="fintech" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickQuestions.filter(q => [
                    t('chat.quickQuestions.categories.trend'), 
                    t('chat.quickQuestions.categories.api')
                  ].includes(q.category)).map((item, index) => (
                    <Card
                      key={index}
                      className="bg-gray-50 border-gray-200 hover:bg-gray-100 transition-all duration-300 hover:scale-105 cursor-pointer focus-within:ring-2 focus-within:ring-green-500"
                      onClick={() => setInput(item.question)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setInput(item.question);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`${item.question} - ${item.description}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <item.icon className={`h-5 w-5 ${item.color}`} aria-hidden="true" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-gray-900 font-medium mb-1 text-sm leading-tight">
                              {item.question}
                            </h4>
                            <p className="text-gray-600 text-xs mb-2">
                              {item.description}
                            </p>
                            <Badge variant="outline" className="border-gray-300 text-gray-600 text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="technical" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickQuestions.filter(q => [
                    t('chat.quickQuestions.categories.developer'), 
                    t('chat.quickQuestions.categories.compliance')
                  ].includes(q.category)).map((item, index) => (
                    <Card
                      key={index}
                      className="bg-gray-50 border-gray-200 hover:bg-gray-100 transition-all duration-300 hover:scale-105 cursor-pointer focus-within:ring-2 focus-within:ring-green-500"
                      onClick={() => setInput(item.question)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setInput(item.question);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`${item.question} - ${item.description}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <item.icon className={`h-5 w-5 ${item.color}`} aria-hidden="true" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-gray-900 font-medium mb-1 text-sm leading-tight">
                              {item.question}
                            </h4>
                            <p className="text-gray-600 text-xs mb-2">
                              {item.description}
                            </p>
                            <Badge variant="outline" className="border-gray-300 text-gray-600 text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
