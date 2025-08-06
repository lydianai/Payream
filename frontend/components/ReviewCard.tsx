import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, Flag, Edit, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useBackend } from "../hooks/useBackend";
import type { Review } from "~backend/review/create";

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  onVoteUpdate?: () => void;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

export default function ReviewCard({ 
  review, 
  currentUserId, 
  onVoteUpdate, 
  onEdit, 
  onDelete 
}: ReviewCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const { toast } = useToast();
  const backend = useBackend();

  const handleVote = async (voteType: 'helpful' | 'unhelpful') => {
    if (!currentUserId) {
      toast({
        title: "Giriş Gerekli",
        description: "Oy vermek için giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
      return;
    }

    setIsVoting(true);
    try {
      await backend.review.voteReview({
        reviewId: review.id,
        voteType
      });
      
      toast({
        title: "Oy Kaydedildi",
        description: "Oyunuz başarıyla kaydedildi.",
      });
      
      onVoteUpdate?.();
    } catch (error) {
      console.error("Vote error:", error);
      toast({
        title: "Hata",
        description: "Oy verirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  const handleReport = async () => {
    if (!currentUserId) {
      toast({
        title: "Giriş Gerekli",
        description: "Şikayet etmek için giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
      return;
    }

    setIsReporting(true);
    try {
      await backend.review.reportReview({
        reviewId: review.id,
        reason: "inappropriate",
        description: "Kullanıcı tarafından uygunsuz olarak işaretlendi"
      });
      
      toast({
        title: "Şikayet Gönderildi",
        description: "Şikayetiniz moderasyon ekibine iletildi.",
      });
    } catch (error) {
      console.error("Report error:", error);
      toast({
        title: "Hata",
        description: "Şikayet gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsReporting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bu değerlendirmeyi silmek istediğinizden emin misiniz?")) {
      try {
        await backend.review.deleteReview({ reviewId: review.id });
        toast({
          title: "Değerlendirme Silindi",
          description: "Değerlendirmeniz başarıyla silindi.",
        });
        onDelete?.(review.id);
      } catch (error) {
        console.error("Delete error:", error);
        toast({
          title: "Hata",
          description: "Değerlendirme silinirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    }
  };

  const isOwnReview = currentUserId === review.userId;

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.userImageUrl} alt={review.userName} />
              <AvatarFallback>{review.userName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                {review.isVerified && (
                  <CheckCircle className="h-4 w-4 text-green-600" title="Doğrulanmış kullanıcı" />
                )}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "fill-current" : ""
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-gray-300 text-gray-600">
              {review.businessSize}
            </Badge>
            <Badge variant="outline" className="border-gray-300 text-gray-600">
              {review.usageDuration}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>
          <p className="text-gray-700 leading-relaxed">{review.content}</p>
        </div>

        {review.pros.length > 0 && (
          <div>
            <h4 className="font-medium text-green-700 mb-2 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Artıları
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {review.pros.map((pro, index) => (
                <li key={index}>{pro}</li>
              ))}
            </ul>
          </div>
        )}

        {review.cons.length > 0 && (
          <div>
            <h4 className="font-medium text-red-700 mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Eksileri
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {review.cons.map((con, index) => (
                <li key={index}>{con}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('helpful')}
                disabled={isVoting || isOwnReview}
                className={`${
                  review.userVote === 'helpful' 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {review.helpfulCount}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('unhelpful')}
                disabled={isVoting || isOwnReview}
                className={`${
                  review.userVote === 'unhelpful' 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                {review.unhelpfulCount}
              </Button>
            </div>

            {!isOwnReview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReport}
                disabled={isReporting}
                className="text-gray-600 hover:text-red-600"
              >
                <Flag className="h-4 w-4 mr-1" />
                Şikayet Et
              </Button>
            )}
          </div>

          {isOwnReview && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(review)}
                className="text-gray-600 hover:text-blue-600"
              >
                <Edit className="h-4 w-4 mr-1" />
                Düzenle
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-gray-600 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Sil
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Kullanım süresi: {review.usageDuration}</span>
            <span>Kullanım alanı: {review.useCase}</span>
          </div>
          
          {review.wouldRecommend ? (
            <Badge className="bg-green-100 text-green-700">
              Tavsiye ediyor
            </Badge>
          ) : (
            <Badge variant="outline" className="border-red-300 text-red-600">
              Tavsiye etmiyor
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
