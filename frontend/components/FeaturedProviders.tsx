import { useTranslation } from "react-i18next";
import { ExternalLink, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOptimizedQuery } from "../hooks/useOptimizedQuery";
import OptimizedImage from "./OptimizedImage";

export default function FeaturedProviders() {
  const { t } = useTranslation();
  
  const { data: searchResults, isLoading } = useOptimizedQuery(
    ["featured-providers"],
    async () => {
      const backend = await import("~backend/client");
      return backend.default.pos.search({ query: "", limit: 6 });
    },
    { cacheStrategy: 'aggressive' } // Featured providers don't change often
  );

  if (isLoading) {
    return (
      <div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="status"
        aria-label={t('accessibility.loading')}
      >
        {[...Array(6)].map((_, i) => (
          <Card 
            key={i} 
            className="animate-pulse bg-gray-100 border-gray-200"
            data-testid="loading-card"
          >
            <CardHeader>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-300 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div 
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="region"
      aria-label={t('home.providers.title')}
    >
      {searchResults?.providers.map((provider) => (
        <Card 
          key={provider.id} 
          className="hover:shadow-lg transition-all duration-300 bg-white border-gray-200 group hover:scale-105 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-green-500"
          role="article"
          aria-labelledby={`provider-${provider.id}-title`}
          aria-describedby={`provider-${provider.id}-description`}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <OptimizedImage
                  src={provider.imageUrl || `/images/${provider.name.toLowerCase()}.png`}
                  alt={`${provider.name} logo`}
                  className="w-12 h-12 rounded-lg bg-gray-100"
                  width={48}
                  height={48}
                />
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  {provider.category}
                </Badge>
              </div>
            </div>
            <CardTitle 
              id={`provider-${provider.id}-title`}
              className="text-lg text-gray-900"
            >
              {provider.name}
            </CardTitle>
            <CardDescription 
              id={`provider-${provider.id}-description`}
              className="text-gray-600"
            >
              {provider.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div 
                  className="flex text-yellow-500 mr-2"
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
                <span className="text-sm text-gray-600" aria-hidden="true">
                  {provider.rating}/5
                </span>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {t('home.providers.pricing')}
                </p>
                <p className="text-lg font-semibold text-green-600">
                  {provider.pricing}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {t('home.providers.features')}
                </p>
                <div className="flex flex-wrap gap-1">
                  {provider.features.slice(0, 3).map((feature, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs border-gray-300 text-gray-600"
                    >
                      {feature}
                    </Badge>
                  ))}
                  {provider.features.length > 3 && (
                    <Badge 
                      variant="outline" 
                      className="text-xs border-gray-300 text-gray-600"
                    >
                      +{provider.features.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:animate-pulse focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white" 
                variant="outline" 
                asChild
              >
                <a 
                  href={provider.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={`${t('home.providers.viewDetails')} - ${provider.name} ${t('accessibility.openInNewTab')}`}
                >
                  <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                  {t('home.providers.viewDetails')}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
