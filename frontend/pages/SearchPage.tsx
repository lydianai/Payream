import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Search, Filter, SlidersHorizontal, Star, TrendingUp, GitCompare, Heart, Plus, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useSearchQuery, useCategoriesQuery } from "../hooks/useOptimizedQuery";
import OptimizedImage from "../components/OptimizedImage";
import type { POSProvider } from "~backend/pos/search";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [minRating, setMinRating] = useState([0]);
  const [maxCommission, setMaxCommission] = useState([5]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const { t } = useTranslation();
  const { toast } = useToast();

  const { data: searchResults, isLoading } = useSearchQuery({
    query: searchTerm, 
    category: category || undefined,
    sortBy,
    minRating: minRating[0],
    maxCommission: maxCommission[0]
  });

  const { data: categories } = useCategoriesQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(query);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value === "all" ? "" : value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && showFilters) {
      setShowFilters(false);
    }
  };

  const toggleProviderSelection = (providerId: string) => {
    setSelectedProviders(prev => {
      if (prev.includes(providerId)) {
        return prev.filter(id => id !== providerId);
      } else {
        if (prev.length >= 4) {
          toast({
            title: "Maksimum Seçim",
            description: "En fazla 4 sağlayıcı karşılaştırabilirsiniz.",
            variant: "destructive",
          });
          return prev;
        }
        return [...prev, providerId];
      }
    });
  };

  const handleCompare = () => {
    if (selectedProviders.length < 2) {
      toast({
        title: "Yetersiz Seçim",
        description: "Karşılaştırma için en az 2 sağlayıcı seçin.",
        variant: "destructive",
      });
      return;
    }
    
    const compareUrl = `/comparison?providers=${selectedProviders.join(",")}`;
    window.open(compareUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen" onKeyDown={handleKeyDown}>
      {/* Search Header */}
      <div className="mb-8">
        <h1 id="main-content" className="text-3xl font-bold text-gray-900 mb-6">
          {t('search.title')}
        </h1>
        
        <form onSubmit={handleSubmit} className="flex gap-4 mb-6" role="search">
          <div className="flex-1 relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" 
              aria-hidden="true"
            />
            <Input
              type="text"
              placeholder={t('search.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              aria-label={t('search.searchPlaceholder')}
            />
          </div>
          <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
            aria-label={t('search.searchButton')}
          >
            <Search className="h-4 w-4 mr-2" aria-hidden="true" />
            {t('search.searchButton')}
          </Button>
        </form>

        {/* Filters */}
        <div 
          className="flex flex-wrap gap-4 items-center mb-4"
          role="region"
          aria-label={t('accessibility.filterControls')}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" aria-hidden="true" />
            <Select value={category || "all"} onValueChange={handleCategoryChange}>
              <SelectTrigger 
                className="w-48 bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500"
                aria-label={t('search.filters.category')}
              >
                <SelectValue placeholder={t('search.filters.categoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all" className="text-gray-900 hover:bg-gray-50">
                  {t('search.filters.allCategories')}
                </SelectItem>
                {categories?.categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name} className="text-gray-900 hover:bg-gray-50">
                    {cat.name} ({cat.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger 
              className="w-48 bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500"
              aria-label={t('search.filters.sorting')}
            >
              <SelectValue placeholder={t('search.filters.sorting')} />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="rating" className="text-gray-900 hover:bg-gray-50">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2" aria-hidden="true" />
                  {t('search.filters.sortByRating')}
                </div>
              </SelectItem>
              <SelectItem value="commission" className="text-gray-900 hover:bg-gray-50">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" aria-hidden="true" />
                  {t('search.filters.sortByCommission')}
                </div>
              </SelectItem>
              <SelectItem value="reviews" className="text-gray-900 hover:bg-gray-50">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
                  Değerlendirme Sayısı
                </div>
              </SelectItem>
              <SelectItem value="name" className="text-gray-900 hover:bg-gray-50">
                {t('search.filters.sortByName')}
              </SelectItem>
              <SelectItem value="established" className="text-gray-900 hover:bg-gray-50">
                {t('search.filters.sortByEstablished')}
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
            aria-expanded={showFilters}
            aria-controls="advanced-filters"
            aria-label={t('search.filters.advancedFilters')}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" aria-hidden="true" />
            {t('search.filters.advancedFilters')}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card 
            id="advanced-filters"
            className="bg-white border-gray-200 p-6 mb-6 shadow-sm"
            role="region"
            aria-label={t('search.filters.advancedFilters')}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label 
                  htmlFor="min-rating-slider"
                  className="text-gray-900 mb-2 block"
                >
                  {t('search.filters.minRating')}: {minRating[0]}
                </Label>
                <Slider
                  id="min-rating-slider"
                  value={minRating}
                  onValueChange={setMinRating}
                  max={5}
                  min={0}
                  step={0.1}
                  className="w-full"
                  aria-label={`${t('search.filters.minRating')}: ${minRating[0]}`}
                />
              </div>
              <div>
                <Label 
                  htmlFor="max-commission-slider"
                  className="text-gray-900 mb-2 block"
                >
                  {t('search.filters.maxCommission')}: %{maxCommission[0]}
                </Label>
                <Slider
                  id="max-commission-slider"
                  value={maxCommission}
                  onValueChange={setMaxCommission}
                  max={5}
                  min={1}
                  step={0.1}
                  className="w-full"
                  aria-label={`${t('search.filters.maxCommission')}: ${maxCommission[0]}%`}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Comparison Bar */}
        {selectedProviders.length > 0 && (
          <Card className="bg-green-50 border-green-200 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <GitCompare className="h-5 w-5 text-green-600" />
                  <span className="text-gray-900 font-medium">
                    {selectedProviders.length} sağlayıcı seçildi
                  </span>
                  <span className="text-green-700 text-sm">
                    (Maksimum 4 sağlayıcı karşılaştırabilirsiniz)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProviders([])}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    Temizle
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCompare}
                    disabled={selectedProviders.length < 2}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <GitCompare className="h-4 w-4 mr-2" />
                    Karşılaştır
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results */}
      <div className="space-y-6">
        {isLoading ? (
          <div 
            className="text-center py-12"
            role="status"
            aria-label={t('search.results.searching')}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">{t('search.results.searching')}</p>
          </div>
        ) : searchResults?.providers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('search.results.noResults')}</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <p className="text-gray-700">
                {searchResults?.total} {t('search.results.found')}
              </p>
              {searchResults?.filters && (
                <div className="text-sm text-gray-600">
                  {t('search.results.avgRating')}: {searchResults.filters.avgRating.toFixed(1)} | 
                  {t('search.results.commissionRange')}: %{searchResults.filters.minCommission}-{searchResults.filters.maxCommission}
                </div>
              )}
            </div>
            
            <div 
              className="grid gap-6"
              role="region"
              aria-label={t('accessibility.searchResults')}
            >
              {searchResults?.providers.map((provider) => (
                <ProviderCard 
                  key={provider.id} 
                  provider={provider} 
                  isSelected={selectedProviders.includes(provider.id)}
                  onToggleSelection={toggleProviderSelection}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface ProviderCardProps {
  provider: POSProvider;
  isSelected: boolean;
  onToggleSelection: (providerId: string) => void;
}

function ProviderCard({ provider, isSelected, onToggleSelection }: ProviderCardProps) {
  const { t } = useTranslation();

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 bg-white border-gray-200 group hover:scale-[1.02] hover:bg-gray-50 focus-within:ring-2 focus-within:ring-green-500 ${
        isSelected ? 'ring-2 ring-green-500 bg-green-50' : ''
      }`}
      role="article"
      aria-labelledby={`provider-${provider.id}-title`}
      aria-describedby={`provider-${provider.id}-description`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelection(provider.id)}
                className="border-gray-400"
                aria-label={`${provider.name} karşılaştırmaya ekle`}
              />
              <OptimizedImage
                src={provider.imageUrl || `/images/${provider.name.toLowerCase()}.png`}
                alt={`${provider.name} logo`}
                className="w-16 h-16 rounded-lg bg-gray-100"
                width={64}
                height={64}
              />
            </div>
            <div>
              <CardTitle 
                id={`provider-${provider.id}-title`}
                className="text-xl text-gray-900 group-hover:text-green-600 transition-colors"
              >
                {provider.name}
              </CardTitle>
              <CardDescription 
                id={`provider-${provider.id}-description`}
                className="mt-1 text-gray-600"
              >
                {provider.description}
              </CardDescription>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <div 
                    className="flex text-yellow-500"
                    role="img"
                    aria-label={`${provider.rating} ${t('accessibility.ratingStars')}`}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(provider.rating) ? "fill-current" : ""
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600" aria-hidden="true">
                    {provider.rating}/5
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{provider.reviewCount} değerlendirme</span>
                </div>
                <Badge variant="outline" className="border-gray-300 text-gray-600">
                  {provider.establishedYear}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              {provider.category}
            </Badge>
            {isSelected && (
              <Badge className="bg-green-600 text-white">
                <GitCompare className="h-3 w-3 mr-1" />
                Seçildi
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-2 text-gray-900">{t('search.provider.features')}</h4>
            <div className="flex flex-wrap gap-2">
              {provider.features.slice(0, 4).map((feature, index) => (
                <Badge key={index} variant="outline" className="border-gray-300 text-gray-600 text-xs">
                  {feature}
                </Badge>
              ))}
              {provider.features.length > 4 && (
                <Badge variant="outline" className="border-gray-300 text-gray-600 text-xs">
                  +{provider.features.length - 4}
                </Badge>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 text-gray-900">{t('search.provider.pricing')}</h4>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-green-600">%{provider.commission}</p>
              <p className="text-sm text-gray-600">{t('search.provider.setup')}: {provider.setupFee}</p>
              <p className="text-sm text-gray-600">{t('search.provider.monthly')}: {provider.monthlyFee}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-gray-900">{t('search.provider.technicalInfo')}</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{t('search.provider.integration')}: {provider.integrationTime}</p>
              <p>{t('search.provider.support')}: {provider.customerSupport}</p>
              <p>{t('search.provider.company')}: {provider.companySize}</p>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button 
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1"
              >
                <Heart className="h-4 w-4 mr-1" />
                Favorile
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white flex-1 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white" 
                asChild
              >
                <a 
                  href={provider.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={`${t('search.provider.viewDetails')} - ${provider.name} ${t('accessibility.openInNewTab')}`}
                >
                  {t('search.provider.viewDetails')}
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">{t('search.provider.supportedCards')}</h5>
              <div className="flex flex-wrap gap-1">
                {provider.supportedCards.map((card, index) => (
                  <Badge key={index} variant="outline" className="border-gray-300 text-gray-600 text-xs">
                    {card}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">{t('search.provider.securityFeatures')}</h5>
              <div className="flex flex-wrap gap-1">
                {provider.securityFeatures.slice(0, 3).map((security, index) => (
                  <Badge key={index} variant="outline" className="border-gray-300 text-gray-600 text-xs">
                    {security}
                  </Badge>
                ))}
                {provider.securityFeatures.length > 3 && (
                  <Badge variant="outline" className="border-gray-300 text-gray-600 text-xs">
                    +{provider.securityFeatures.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Review Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(provider.averageRating) ? "fill-current" : ""
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {provider.averageRating.toFixed(1)} ({provider.reviewCount} değerlendirme)
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              asChild
            >
              <Link to={`/provider/${provider.id}`}>
                <MessageSquare className="h-4 w-4 mr-1" />
                Değerlendirmeleri Gör
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
