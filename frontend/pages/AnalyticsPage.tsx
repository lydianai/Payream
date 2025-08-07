import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, BarChart3, CheckCircle, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
import backend from "~backend/client";
import type { DashboardData } from "~backend/analytics/dashboard";
import { useTranslation } from "react-i18next";
import { Progress } from "@/components/ui/progress";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#d0ed57', '#ffc658'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-lg text-sm">
        <p className="label font-bold text-gray-800">{`${label}`}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color }}>{`${pld.name}: ${pld.value}`}</p>
        ))}
      </div>
    );
  }
  return null;
};

const KpiCard = ({ title, value, change, changeType }: { title: string, value: string, change: string, changeType: 'increase' | 'decrease' | 'neutral' }) => {
  const changeColor = changeType === 'increase' ? 'text-green-600' : changeType === 'decrease' ? 'text-red-600' : 'text-gray-500';
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <p className={`text-xs ${changeColor}`}>{change}</p>
      </CardContent>
    </Card>
  );
};

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["analyticsDashboard"],
    queryFn: () => backend.analytics.getDashboardData(),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Failed to load analytics data</h2>
          <p className="mt-2 text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">No analytics data available.</h2>
      </div>
    );
  }

  const { kpis, commissionTrends, providerPopularity, categoryDistribution, featureAdoption, industryInsights } = data;

  const translatedKpis = [
    { ...kpis[0], title: t('analytics.kpis.totalProviders') },
    { ...kpis[1], title: t('analytics.kpis.avgCommission') },
    { ...kpis[2], title: t('analytics.kpis.avgRating') },
    { ...kpis[3], title: t('analytics.kpis.newsCount') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-green-600" />
            {t('analytics.title')}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {t('analytics.subtitle')}
          </p>
        </header>

        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {translatedKpis.map((kpi, index) => (
            <KpiCard key={index} {...kpi} />
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <main className="lg:col-span-2 space-y-6">
            {/* Commission Trends */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">{t('analytics.commissionTrends.title')}</CardTitle>
                <CardDescription className="text-gray-600">{t('analytics.commissionTrends.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={commissionTrends[0]?.data.map((_, i) => {
                    const point: any = { date: commissionTrends[0].data[i].date };
                    commissionTrends.forEach(trend => {
                      point[trend.name] = trend.data[i]?.value;
                    });
                    return point;
                  })}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['auto', 'auto']} tickFormatter={(value) => `${value}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {commissionTrends.map((trend, index) => (
                      <Line key={trend.name} type="monotone" dataKey={trend.name} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Provider Popularity */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">{t('analytics.providerPopularity.title')}</CardTitle>
                <CardDescription className="text-gray-600">{t('analytics.providerPopularity.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={providerPopularity} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="value" name={t('analytics.providerPopularity.yAxisLabel')} fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Category Distribution */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">{t('analytics.categoryDistribution.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Feature Adoption */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">{t('analytics.featureAdoption.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {featureAdoption.map((feature, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{feature.name}</span>
                        <span className="text-gray-900 font-semibold">{feature.percentage}%</span>
                      </div>
                      <Progress value={feature.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Industry Insights */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('analytics.industryInsights.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industryInsights.map((insight, index) => (
              <Card key={index} className={`bg-white border-l-4 ${
                insight.severity === 'success' ? 'border-green-500' :
                insight.severity === 'warning' ? 'border-yellow-500' :
                'border-blue-500'
              }`}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-gray-900">
                    {insight.severity === 'success' && <CheckCircle className="h-5 w-5 mr-2 text-green-500" />}
                    {insight.severity === 'warning' && <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />}
                    {insight.severity === 'info' && <Info className="h-5 w-5 mr-2 text-blue-500" />}
                    {insight.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
