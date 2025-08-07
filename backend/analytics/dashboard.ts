import { api } from "encore.dev/api";
import { pos, news } from "~encore/clients";
import type { NewsItem } from "../news/news";
import type { POSProvider } from "../pos/search";

// --- Data Structures for the Dashboard ---

interface Kpi {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
}

interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

interface CommissionTrend {
  name: string;
  data: TimeSeriesDataPoint[];
}

interface PopularityMetric {
  name: string;
  value: number;
}

interface CategoryDistribution {
  name: string;
  count: number;
}

interface FeatureAdoption {
  name: string;
  percentage: number;
}

interface Insight {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'success';
}

export interface DashboardData {
  kpis: Kpi[];
  commissionTrends: CommissionTrend[];
  providerPopularity: PopularityMetric[];
  categoryDistribution: CategoryDistribution[];
  featureAdoption: FeatureAdoption[];
  industryInsights: Insight[];
}

// --- API Endpoint ---

// getDashboardData retrieves all data needed for the analytics dashboard.
export const getDashboardData = api<void, DashboardData>(
  { expose: true, method: "GET", path: "/analytics/dashboard" },
  async () => {
    // Fetch data from other services
    const [allProvidersResponse, categoriesResponse, newsResponse] = await Promise.all([
      pos.search({ query: "", limit: 100 }),
      pos.getCategories(),
      news.getNews({ limit: 20 })
    ]);

    const allProviders = allProvidersResponse.providers;
    const categories = categoriesResponse.categories;

    // --- KPIs ---
    const totalProviders = allProviders.length;
    const avgCommission = allProviders.reduce((acc, p) => acc + p.commission, 0) / totalProviders;
    const avgRating = allProviders.reduce((acc, p) => acc + p.rating, 0) / totalProviders;
    const newsCount = newsResponse.total;

    const kpis: Kpi[] = [
      { title: "Toplam Sağlayıcı", value: totalProviders.toString(), change: "+2 son ay", changeType: 'increase' },
      { title: "Ortalama Komisyon", value: `%${avgCommission.toFixed(2)}`, change: "-0.1%", changeType: 'decrease' },
      { title: "Ortalama Puan", value: avgRating.toFixed(2), change: "+0.05", changeType: 'increase' },
      { title: "Haber Sayısı (Son 30 gün)", value: newsCount.toString(), change: "+5", changeType: 'increase' },
    ];

    // --- Commission Trends (Mocked Data) ---
    const commissionTrends = generateCommissionTrends(allProviders);

    // --- Provider Popularity ---
    const providerPopularity = allProviders
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 10)
      .map(p => ({ name: p.name, value: p.reviewCount }));

    // --- Category Distribution ---
    const categoryDistribution = categories.map(c => ({
      name: c.name,
      count: c.count,
    }));

    // --- Feature Adoption ---
    const featureAdoption = calculateFeatureAdoption(allProviders);

    // --- Industry Insights ---
    const industryInsights = generateInsights(allProviders, newsResponse.news);

    return {
      kpis,
      commissionTrends,
      providerPopularity,
      categoryDistribution,
      featureAdoption,
      industryInsights,
    };
  }
);

// --- Helper Functions ---

function generateCommissionTrends(providers: POSProvider[]): CommissionTrend[] {
  const trends: CommissionTrend[] = [];
  const topProviders = providers.slice(0, 3); // Trend for top 3 providers

  topProviders.forEach(provider => {
    const data: TimeSeriesDataPoint[] = [];
    let currentCommission = provider.commission;
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      data.push({
        date: date.toISOString().substring(0, 7), // YYYY-MM
        value: parseFloat(currentCommission.toFixed(2)),
      });
      // Simulate slight random changes
      currentCommission += (Math.random() - 0.5) * 0.1;
      currentCommission = Math.max(1.5, Math.min(4.0, currentCommission));
    }
    trends.push({ name: provider.name, data });
  });

  return trends;
}

function calculateFeatureAdoption(providers: POSProvider[]): FeatureAdoption[] {
  const featureCount: Record<string, number> = {};
  providers.forEach(provider => {
    provider.features.forEach((feature: string) => {
      featureCount[feature] = (featureCount[feature] || 0) + 1;
    });
  });

  return Object.entries(featureCount)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / providers.length) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10);
}

function generateInsights(providers: POSProvider[], news: NewsItem[]): Insight[] {
  const insights: Insight[] = [];
  if (providers.length === 0) return insights;

  const avgCommission = providers.reduce((acc, p) => acc + p.commission, 0) / providers.length;
  const highestCommissionProvider = providers.reduce((max, p) => p.commission > max.commission ? p : max, providers[0]);
  const lowestCommissionProvider = providers.reduce((min, p) => p.commission < min.commission ? p : min, providers[0]);

  insights.push({
    title: "Komisyon Oranları",
    description: `Piyasa ortalaması %${avgCommission.toFixed(2)}. En düşük oran ${lowestCommissionProvider.name}'de (%${lowestCommissionProvider.commission}), en yüksek ise ${highestCommissionProvider.name}'de (%${highestCommissionProvider.commission}).`,
    severity: 'info',
  });

  const blockchainProviders = providers.filter(p => p.category.toLowerCase().includes('blockchain'));
  if (blockchainProviders.length > 0) {
    insights.push({
      title: "Blockchain Yükselişte",
      description: `${blockchainProviders.length} sağlayıcı artık blockchain ve kripto para ödemelerini destekliyor. Bu alandaki rekabet artıyor.`,
      severity: 'success',
    });
  }

  const latestNews = news[0];
  if (latestNews) {
    insights.push({
      title: "Güncel Gelişme",
      description: `"${latestNews.title}" başlıklı haber, ${latestNews.category} sektöründeki önemli bir gelişmeye işaret ediyor.`,
      severity: 'info',
    });
  }

  const highRatedLowReview = providers.find(p => p.rating > 4.5 && p.reviewCount < 30);
  if (highRatedLowReview) {
    insights.push({
      title: "Gizli Cevher Uyarısı",
      description: `${highRatedLowReview.name}, yüksek puana (${highRatedLowReview.rating}) rağmen az sayıda değerlendirmeye (${highRatedLowReview.reviewCount}) sahip. Gözden kaçırılmaması gereken bir potansiyel.`,
      severity: 'warning',
    });
  }

  return insights;
}
