import { useTranslation } from "react-i18next";
import { Calendar, Clock, ExternalLink, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNewsQuery } from "../hooks/useOptimizedQuery";
import OptimizedImage from "./OptimizedImage";

export default function NewsSection() {
  const { t } = useTranslation();
  
  const { data: newsData, isLoading } = useNewsQuery({ limit: 6 });

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('home.news.title')}
            </h2>
          </div>
          <div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="status"
            aria-label={t('accessibility.loading')}
          >
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-gray-100 border-gray-200">
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
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50" aria-labelledby="news-section-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="news-section-title" className="text-3xl font-bold text-gray-900 mb-4">
            <TrendingUp className="inline-block h-8 w-8 mr-2 text-green-600" aria-hidden="true" />
            {t('home.news.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('home.news.subtitle')}
          </p>
        </div>

        <div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="region"
          aria-label={t('home.news.title')}
        >
          {newsData?.news.map((news) => (
            <Card 
              key={news.id} 
              className="bg-white border-gray-200 group hover:bg-gray-50 transition-all duration-300 hover:scale-105 focus-within:ring-2 focus-within:ring-green-500"
              role="article"
              aria-labelledby={`news-${news.id}-title`}
              aria-describedby={`news-${news.id}-summary`}
            >
              <CardHeader>
                <div className="mb-4">
                  <OptimizedImage
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-48 rounded-lg"
                    width={400}
                    height={192}
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant="secondary" 
                    className={`${
                      news.category === 'Blockchain' ? 'bg-green-100 text-green-700' :
                      news.category === 'POS Sistemleri' ? 'bg-green-100 text-green-700' :
                      'bg-green-100 text-green-700'
                    }`}
                  >
                    {news.category}
                  </Badge>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                    <span aria-label={`${news.readTime} ${t('home.news.readTime')}`}>
                      {news.readTime} dk
                    </span>
                  </div>
                </div>
                <CardTitle 
                  id={`news-${news.id}-title`}
                  className="text-gray-900 text-lg leading-tight group-hover:text-green-600 transition-colors"
                >
                  {news.title}
                </CardTitle>
                <CardDescription 
                  id={`news-${news.id}-summary`}
                  className="text-gray-600"
                >
                  {news.summary}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
                    <time dateTime={news.publishDate.toISOString()}>
                      {news.publishDate.toLocaleDateString('tr-TR')}
                    </time>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {news.source}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {news.tags.slice(0, 3).map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs border-gray-300 text-gray-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4 w-full text-green-600 hover:text-green-700 hover:bg-green-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
                  aria-label={`${t('home.news.readMore')} - ${news.title}`}
                >
                  <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                  {t('home.news.readMore')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
          >
            {t('home.news.viewAll')}
          </Button>
        </div>
      </div>
    </section>
  );
}
