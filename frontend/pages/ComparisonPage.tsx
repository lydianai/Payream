import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  GitCompare, 
  Calculator, 
  TrendingUp, 
  Star, 
  Check, 
  X, 
  DollarSign, 
  Clock, 
  Shield, 
  Zap,
  BarChart3,
  Settings,
  Building,
  CreditCard,
  Globe,
  Code,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Download,
  Share2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { ComparisonProvider } from "~backend/pos/compare";

interface CalculatorInputs {
  businessSize: string;
  monthlyVolume: number;
  averageTransaction: number;
  transactionsPerMonth: number;
  chargebackRate: number;
  refundRate: number;
  projectionMonths: number;
}

interface ROIProjection {
  providerId: string;
  providerName: string;
  totalCosts: number;
  monthlyCosts: number;
  savings: number;
  roi: number;
  paybackPeriod: number;
  breakdown: {
    setupCosts: number;
    monthlyFees: number;
    transactionFees: number;
    commissionFees: number;
    chargebackFees: number;
    refundFees: number;
  };
}

export default function ComparisonPage() {
  const [searchParams] = useSearchParams();
  const [calculatorInputs, setCalculatorInputs] = useState<CalculatorInputs>({
    businessSize: "medium",
    monthlyVolume: 100000,
    averageTransaction: 150,
    transactionsPerMonth: 667,
    chargebackRate: 0.5,
    refundRate: 2.0,
    projectionMonths: 12
  });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    pricing: true,
    features: false,
    integration: false,
    performance: false,
    compliance: false
  });
  const { toast } = useToast();
  const { t } = useTranslation();

  const providerIds = searchParams.get("providers")?.split(",") || [];

  const { data: comparison, isLoading } = useQuery({
    queryKey: ["comparison", providerIds.join(",")],
    queryFn: () => backend.pos.compare({ providerIds: providerIds.join(",") }),
    enabled: providerIds.length > 0
  });

  useEffect(() => {
    const volume = calculatorInputs.monthlyVolume;
    const avgTransaction = calculatorInputs.averageTransaction;
    setCalculatorInputs(prev => ({
      ...prev,
      transactionsPerMonth: Math.round(volume / avgTransaction)
    }));
  }, [calculatorInputs.monthlyVolume, calculatorInputs.averageTransaction]);

  const calculateROI = (provider: ComparisonProvider): ROIProjection => {
    const { monthlyVolume, transactionsPerMonth, chargebackRate, refundRate, projectionMonths } = calculatorInputs;
    
    const setupCosts = provider.pricing.setupFeeAmount;
    const monthlyFees = provider.pricing.monthlyFeeAmount * projectionMonths;
    const transactionFees = provider.pricing.transactionFee * transactionsPerMonth * projectionMonths;
    const commissionFees = (monthlyVolume * provider.pricing.commission / 100) * projectionMonths;
    const chargebackFees = provider.pricing.chargebackFee * (transactionsPerMonth * chargebackRate / 100) * projectionMonths;
    const refundFees = provider.pricing.refundFee * (transactionsPerMonth * refundRate / 100) * projectionMonths;

    // Apply volume discounts
    let discountRate = 0;
    for (const discount of provider.pricing.volumeDiscounts) {
      if (monthlyVolume >= discount.threshold) {
        discountRate = discount.discount;
      }
    }
    
    const discountAmount = commissionFees * discountRate;
    const totalCosts = setupCosts + monthlyFees + transactionFees + commissionFees + chargebackFees + refundFees - discountAmount;
    const monthlyCosts = totalCosts / projectionMonths;

    // Calculate savings compared to highest cost provider
    const baseCost = monthlyVolume * 0.035 * projectionMonths; // 3.5% baseline
    const savings = Math.max(0, baseCost - totalCosts);
    const roi = savings > 0 ? (savings / totalCosts) * 100 : 0;
    const paybackPeriod = savings > 0 ? totalCosts / (savings / projectionMonths) : 0;

    return {
      providerId: provider.id,
      providerName: provider.name,
      totalCosts,
      monthlyCosts,
      savings,
      roi,
      paybackPeriod,
      breakdown: {
        setupCosts,
        monthlyFees,
        transactionFees,
        commissionFees: commissionFees - discountAmount,
        chargebackFees,
        refundFees
      }
    };
  };

  const getComplexityColor = (complexity: number) => {
    if (complexity <= 3) return "text-green-600";
    if (complexity <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getComplexityLabel = (complexity: number) => {
    if (complexity <= 3) return "Kolay";
    if (complexity <= 6) return "Orta";
    return "Zor";
  };

  const getSuitabilityScore = (provider: ComparisonProvider, businessSize: string) => {
    switch (businessSize) {
      case "small": return provider.businessSuitability.smallBusiness;
      case "medium": return provider.businessSuitability.mediumBusiness;
      case "large": return provider.businessSuitability.largeBusiness;
      case "enterprise": return provider.businessSuitability.enterprise;
      default: return provider.businessSuitability.mediumBusiness;
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const exportComparison = () => {
    if (!comparison) return;
    
    const data = {
      providers: comparison.providers.map(p => ({
        name: p.name,
        category: p.category,
        rating: p.rating,
        commission: p.commission,
        setupFee: p.setupFee,
        monthlyFee: p.monthlyFee
      })),
      calculatorInputs,
      roiProjections: comparison.providers.map(calculateROI)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pos-comparison.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Karşılaştırma Dışa Aktarıldı",
      description: "Karşılaştırma verileri JSON formatında indirildi.",
    });
  };

  const shareComparison = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link Kopyalandı",
        description: "Karşılaştırma linki panoya kopyalandı.",
      });
    });
  };

  if (providerIds.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
        <div className="text-center">
          <GitCompare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">POS Karşılaştırması</h1>
          <p className="text-gray-600 mb-6">
            Karşılaştırmak için en az 2 POS sağlayıcısı seçin.
          </p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link to="/search">POS Ara</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!comparison || comparison.providers.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Karşılaştırma Bulunamadı</h1>
          <p className="text-gray-600 mb-6">
            Seçilen POS sağlayıcıları bulunamadı.
          </p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link to="/search">POS Ara</Link>
          </Button>
        </div>
      </div>
    );
  }

  const roiProjections = comparison.providers.map(calculateROI);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <GitCompare className="h-8 w-8 mr-3 text-green-600" />
            POS Karşılaştırması
          </h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={shareComparison}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Paylaş
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportComparison}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Dışa Aktar
            </Button>
          </div>
        </div>
        <p className="text-lg text-gray-600">
          {comparison.providers.length} POS sağlayıcısının detaylı karşılaştırması
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 mb-8">
          <TabsTrigger value="overview" className="text-gray-900">Genel Bakış</TabsTrigger>
          <TabsTrigger value="calculator" className="text-gray-900">Maliyet Hesaplayıcı</TabsTrigger>
          <TabsTrigger value="features" className="text-gray-900">Özellik Matrisi</TabsTrigger>
          <TabsTrigger value="integration" className="text-gray-900">Entegrasyon</TabsTrigger>
          <TabsTrigger value="performance" className="text-gray-900">Performans</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Provider Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparison.providers.map((provider) => (
              <Card key={provider.id} className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-600">
                        {provider.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-gray-900">{provider.name}</CardTitle>
                      <Badge variant="outline" className="border-gray-300 text-gray-600 mt-1">
                        {provider.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(provider.rating) ? "fill-current" : ""
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {provider.rating}/5
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-green-600">
                      %{provider.commission}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Kurulum:</span>
                      <span className="text-gray-900">{provider.setupFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Aylık:</span>
                      <span className="text-gray-900">{provider.monthlyFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Entegrasyon:</span>
                      <span className="text-gray-900">{provider.integrationTime}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">İş Uygunluğu:</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Küçük İşletme</span>
                        <span className="text-gray-900">{getSuitabilityScore(provider, "small")}/10</span>
                      </div>
                      <Progress 
                        value={getSuitabilityScore(provider, "small") * 10} 
                        className="h-1"
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    asChild
                  >
                    <a href={provider.websiteUrl} target="_blank" rel="noopener noreferrer">
                      Detayları Görüntüle
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Comparison */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Hızlı Karşılaştırma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-gray-600 py-2">Özellik</th>
                      {comparison.providers.map((provider) => (
                        <th key={provider.id} className="text-center text-gray-600 py-2">
                          {provider.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b border-gray-200">
                      <td className="text-gray-700 py-2">Komisyon Oranı</td>
                      {comparison.providers.map((provider) => (
                        <td key={provider.id} className="text-center text-gray-900 py-2">
                          %{provider.commission}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="text-gray-700 py-2">Kurulum Ücreti</td>
                      {comparison.providers.map((provider) => (
                        <td key={provider.id} className="text-center text-gray-900 py-2">
                          {provider.setupFee}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="text-gray-700 py-2">Entegrasyon Süresi</td>
                      {comparison.providers.map((provider) => (
                        <td key={provider.id} className="text-center text-gray-900 py-2">
                          {provider.integrationTime}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="text-gray-700 py-2">Müşteri Desteği</td>
                      {comparison.providers.map((provider) => (
                        <td key={provider.id} className="text-center text-gray-900 py-2">
                          {provider.customerSupport}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calculator Inputs */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-green-600" />
                  Maliyet Hesaplayıcı
                </CardTitle>
                <CardDescription className="text-gray-600">
                  İşletme bilgilerinizi girerek ROI hesaplaması yapın
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="business-size" className="text-gray-900">İşletme Büyüklüğü</Label>
                  <Select
                    value={calculatorInputs.businessSize}
                    onValueChange={(value) => setCalculatorInputs(prev => ({ ...prev, businessSize: value }))}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="small" className="text-gray-900">Küçük İşletme</SelectItem>
                      <SelectItem value="medium" className="text-gray-900">Orta Ölçekli</SelectItem>
                      <SelectItem value="large" className="text-gray-900">Büyük İşletme</SelectItem>
                      <SelectItem value="enterprise" className="text-gray-900">Kurumsal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="monthly-volume" className="text-gray-900">
                    Aylık İşlem Hacmi (₺): {calculatorInputs.monthlyVolume.toLocaleString()}
                  </Label>
                  <Slider
                    value={[calculatorInputs.monthlyVolume]}
                    onValueChange={(value) => setCalculatorInputs(prev => ({ ...prev, monthlyVolume: value[0] }))}
                    max={5000000}
                    min={10000}
                    step={10000}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="avg-transaction" className="text-gray-900">Ortalama İşlem Tutarı (₺)</Label>
                  <Input
                    id="avg-transaction"
                    type="number"
                    value={calculatorInputs.averageTransaction}
                    onChange={(e) => setCalculatorInputs(prev => ({ 
                      ...prev, 
                      averageTransaction: Number(e.target.value) 
                    }))}
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>

                <div>
                  <Label className="text-gray-900">
                    Aylık İşlem Sayısı: {calculatorInputs.transactionsPerMonth.toLocaleString()}
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Otomatik hesaplanır (Hacim ÷ Ortalama İşlem)
                  </p>
                </div>

                <div>
                  <Label htmlFor="chargeback-rate" className="text-gray-900">
                    Chargeback Oranı (%): {calculatorInputs.chargebackRate}
                  </Label>
                  <Slider
                    value={[calculatorInputs.chargebackRate]}
                    onValueChange={(value) => setCalculatorInputs(prev => ({ ...prev, chargebackRate: value[0] }))}
                    max={5}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="refund-rate" className="text-gray-900">
                    İade Oranı (%): {calculatorInputs.refundRate}
                  </Label>
                  <Slider
                    value={[calculatorInputs.refundRate]}
                    onValueChange={(value) => setCalculatorInputs(prev => ({ ...prev, refundRate: value[0] }))}
                    max={10}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="projection-months" className="text-gray-900">Projeksiyon Süresi (Ay)</Label>
                  <Select
                    value={calculatorInputs.projectionMonths.toString()}
                    onValueChange={(value) => setCalculatorInputs(prev => ({ 
                      ...prev, 
                      projectionMonths: Number(value) 
                    }))}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="6" className="text-gray-900">6 Ay</SelectItem>
                      <SelectItem value="12" className="text-gray-900">12 Ay</SelectItem>
                      <SelectItem value="24" className="text-gray-900">24 Ay</SelectItem>
                      <SelectItem value="36" className="text-gray-900">36 Ay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* ROI Results */}
            <div className="lg:col-span-2 space-y-6">
              {roiProjections.map((projection) => (
                <Card key={projection.providerId} className="bg-white border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center justify-between">
                      <span>{projection.providerName}</span>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className={`${
                            projection.roi > 0 ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'
                          }`}
                        >
                          ROI: {projection.roi.toFixed(1)}%
                        </Badge>
                        <span className="text-lg font-semibold text-green-600">
                          ₺{projection.totalCosts.toLocaleString()}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Toplam Maliyet ({calculatorInputs.projectionMonths} ay):</span>
                          <span className="text-gray-900 font-semibold">
                            ₺{projection.totalCosts.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Aylık Ortalama:</span>
                          <span className="text-gray-900">₺{projection.monthlyCosts.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Potansiyel Tasarruf:</span>
                          <span className={`${projection.savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₺{projection.savings.toLocaleString()}
                          </span>
                        </div>
                        {projection.paybackPeriod > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Geri Ödeme Süresi:</span>
                            <span className="text-gray-900">
                              {projection.paybackPeriod.toFixed(1)} ay
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-gray-900 font-medium mb-3">Maliyet Dağılımı:</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Kurulum:</span>
                            <span className="text-gray-900">₺{projection.breakdown.setupCosts.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Aylık Ücretler:</span>
                            <span className="text-gray-900">₺{projection.breakdown.monthlyFees.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">İşlem Ücretleri:</span>
                            <span className="text-gray-900">₺{projection.breakdown.transactionFees.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Komisyon:</span>
                            <span className="text-gray-900">₺{projection.breakdown.commissionFees.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Chargeback:</span>
                            <span className="text-gray-900">₺{projection.breakdown.chargebackFees.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">İadeler:</span>
                            <span className="text-gray-900">₺{projection.breakdown.refundFees.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Özellik Matrisi</CardTitle>
              <CardDescription className="text-gray-600">
                Tüm sağlayıcıların özelliklerinin detaylı karşılaştırması
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Features by Category */}
                {['Security', 'Technical', 'Payment Methods', 'Business', 'Innovation'].map((category) => {
                  const categoryFeatures = comparison.comparisonMatrix.features.filter(f => f.category === category);
                  if (categoryFeatures.length === 0) return null;

                  return (
                    <Collapsible key={category} defaultOpen>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <h3 className="text-gray-900 font-medium">{category}</h3>
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left text-gray-600 py-2">Özellik</th>
                                {comparison.providers.map((provider) => (
                                  <th key={provider.id} className="text-center text-gray-600 py-2">
                                    {provider.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {categoryFeatures.map((feature) => (
                                <tr key={feature.name} className="border-b border-gray-200">
                                  <td className="text-gray-700 py-2">{feature.name}</td>
                                  {comparison.providers.map((provider) => (
                                    <td key={provider.id} className="text-center py-2">
                                      {typeof feature.providers[provider.id] === 'boolean' ? (
                                        feature.providers[provider.id] ? (
                                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                                        ) : (
                                          <X className="h-4 w-4 text-red-600 mx-auto" />
                                        )
                                      ) : (
                                        <span className="text-gray-900">
                                          {feature.providers[provider.id]}
                                        </span>
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}

                {/* Supported Cards */}
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <h3 className="text-gray-900 font-medium flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Desteklenen Kartlar
                    </h3>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="grid gap-4">
                      {comparison.providers.map((provider) => (
                        <div key={provider.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <span className="text-gray-900 font-medium">{provider.name}</span>
                          <div className="flex flex-wrap gap-1">
                            {provider.supportedCards.map((card) => (
                              <Badge key={card} variant="outline" className="border-gray-300 text-gray-600 text-xs">
                                {card}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Tab */}
        <TabsContent value="integration" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Integration Complexity */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Code className="h-5 w-5 mr-2 text-green-600" />
                  Entegrasyon Karmaşıklığı
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comparison.providers.map((provider) => (
                  <div key={provider.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">{provider.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getComplexityColor(provider.integration.complexity)}`}>
                          {getComplexityLabel(provider.integration.complexity)}
                        </span>
                        <span className="text-gray-600 text-sm">
                          {provider.integration.complexity}/10
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={provider.integration.complexity * 10} 
                      className="h-2"
                    />
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <span>Süre: {provider.integration.timeToLive} gün</span>
                      <span>API: {provider.integration.apiType}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Integration Features */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Entegrasyon Özellikleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left text-gray-600 py-2">Özellik</th>
                        {comparison.providers.map((provider) => (
                          <th key={provider.id} className="text-center text-gray-600 py-2">
                            {provider.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.comparisonMatrix.integration.map((aspect) => (
                        <tr key={aspect.aspect} className="border-b border-gray-200">
                          <td className="text-gray-700 py-2">{aspect.aspect}</td>
                          {comparison.providers.map((provider) => (
                            <td key={provider.id} className="text-center py-2">
                              {typeof aspect.providers[provider.id] === 'boolean' ? (
                                aspect.providers[provider.id] ? (
                                  <Check className="h-4 w-4 text-green-600 mx-auto" />
                                ) : (
                                  <X className="h-4 w-4 text-red-600 mx-auto" />
                                )
                              ) : (
                                <span className="text-gray-900">
                                  {aspect.providers[provider.id]}
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Business Suitability */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Building className="h-5 w-5 mr-2 text-green-600" />
                İş Uygunluğu Skorları
              </CardTitle>
              <CardDescription className="text-gray-600">
                Farklı işletme türleri için uygunluk skorları (1-10 arası)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {['Küçük İşletme', 'Orta Ölçekli', 'Büyük İşletme', 'Kurumsal'].map((businessType) => (
                  <div key={businessType} className="space-y-3">
                    <h4 className="text-gray-900 font-medium">{businessType}</h4>
                    {comparison.providers.map((provider) => {
                      const score = getSuitabilityScore(provider, businessType.toLowerCase().replace(' ', ''));
                      return (
                        <div key={provider.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-700">{provider.name}</span>
                            <span className="text-gray-900">{score}/10</span>
                          </div>
                          <Progress value={score * 10} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                  Performans Metrikleri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {comparison.providers.map((provider) => (
                  <div key={provider.id} className="space-y-3">
                    <h4 className="text-gray-900 font-medium">{provider.name}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Uptime:</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={provider.performance.uptime} className="flex-1 h-2" />
                          <span className="text-gray-900">{provider.performance.uptime}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Yanıt Süresi:</span>
                        <p className="text-gray-900">{provider.performance.responseTime}ms</p>
                      </div>
                      <div>
                        <span className="text-gray-600">İşlem Kapasitesi:</span>
                        <p className="text-gray-900">{provider.performance.throughput} TPS</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Küresel Kapsam:</span>
                        <p className="text-gray-900">{provider.performance.globalCoverage.length} bölge</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Compliance */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Uyumluluk ve Sertifikalar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['PCI DSS', 'GDPR', 'KVKK', 'ISO 27001', 'SOC 2'].map((standard) => (
                    <div key={standard} className="space-y-2">
                      <h5 className="text-gray-900 font-medium">{standard}</h5>
                      <div className="flex space-x-4">
                        {comparison.providers.map((provider) => {
                          const isCompliant = provider.compliance[standard.toLowerCase().replace(/\s/g, '') as keyof typeof provider.compliance];
                          return (
                            <div key={provider.id} className="flex items-center space-x-2">
                              <span className="text-gray-700 text-sm">{provider.name}:</span>
                              {isCompliant ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <X className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Global Coverage */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-green-600" />
                Küresel Kapsam
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {comparison.providers.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-900 font-medium">{provider.name}</span>
                    <div className="flex flex-wrap gap-1">
                      {provider.performance.globalCoverage.map((region) => (
                        <Badge key={region} variant="outline" className="border-gray-300 text-gray-600 text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
