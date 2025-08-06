import { Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ReviewStatsProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}

export default function ReviewStats({ 
  averageRating, 
  totalReviews, 
  ratingDistribution 
}: ReviewStatsProps) {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Değerlendirme İstatistikleri
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center text-yellow-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < Math.floor(averageRating) ? "fill-current" : ""
                }`}
              />
            ))}
          </div>
          <p className="text-gray-600">
            {totalReviews} değerlendirme
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Puan Dağılımı</h4>
          {ratingDistribution.map((item) => (
            <div key={item.rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-12">
                <span className="text-sm text-gray-600">{item.rating}</span>
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
              </div>
              <div className="flex-1">
                <Progress value={item.percentage} className="h-2" />
              </div>
              <div className="w-12 text-right">
                <span className="text-sm text-gray-600">{item.count}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {ratingDistribution
                .filter(item => item.rating >= 4)
                .reduce((sum, item) => sum + item.percentage, 0)}%
            </div>
            <p className="text-sm text-gray-600">Olumlu</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {ratingDistribution
                .filter(item => item.rating <= 2)
                .reduce((sum, item) => sum + item.percentage, 0)}%
            </div>
            <p className="text-sm text-gray-600">Olumsuz</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
