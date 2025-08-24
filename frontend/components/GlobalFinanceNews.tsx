import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  country: string;
  date: string;
}

export default function GlobalFinanceNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        // Örnek: payream.xyz API'den gerçek finans haberleri çekiliyor
        const res = await fetch("https://payream.xyz/api/finance-news?limit=12");
        const data = await res.json();
        setNews(data.news || []);
      } catch {
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <section className="py-12 bg-gray-50" aria-labelledby="global-finance-news-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white border-gray-200 shadow-xl">
          <CardHeader>
            <CardTitle id="global-finance-news-title" className="text-2xl text-gray-900">
              Dünya Finans Gelişmeleri & Haber Akışı
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Gerçek zamanlı olarak devletlerin ve global finans dünyasının en güncel haberleri. Tüm haberler <a href="https://payream.xyz" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">payream.xyz</a> üzerinden SEO uyumlu linklerle sunulmaktadır.
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
            ) : news.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Şu anda haber bulunamadı.</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <Card className="h-full bg-gray-50 border-gray-200 hover:bg-green-50 transition-all duration-300 hover:scale-105 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-900 group-hover:text-green-700">
                          {item.title}
                        </CardTitle>
                        <p className="text-xs text-gray-500 mt-1">{item.country} | {new Date(item.date).toLocaleDateString('tr-TR')}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 text-sm line-clamp-3">{item.summary}</p>
                        <span className="text-green-600 text-xs mt-2 block">Kaynak: payream.xyz</span>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
