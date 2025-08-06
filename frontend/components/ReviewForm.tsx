import { useState } from "react";
import { Star, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useBackend } from "../hooks/useBackend";
import type { Review } from "~backend/review/create";

interface ReviewFormProps {
  providerId: string;
  providerName: string;
  existingReview?: Review;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ 
  providerId, 
  providerName, 
  existingReview, 
  onSuccess, 
  onCancel 
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [content, setContent] = useState(existingReview?.content || "");
  const [pros, setPros] = useState<string[]>(existingReview?.pros || []);
  const [cons, setCons] = useState<string[]>(existingReview?.cons || []);
  const [newPro, setNewPro] = useState("");
  const [newCon, setNewCon] = useState("");
  const [usageDuration, setUsageDuration] = useState(existingReview?.usageDuration || "");
  const [businessSize, setBusinessSize] = useState(existingReview?.businessSize || "");
  const [useCase, setUseCase] = useState(existingReview?.useCase || "");
  const [wouldRecommend, setWouldRecommend] = useState(existingReview?.wouldRecommend ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const backend = useBackend();

  const addPro = () => {
    if (newPro.trim() && pros.length < 5) {
      setPros([...pros, newPro.trim()]);
      setNewPro("");
    }
  };

  const removePro = (index: number) => {
    setPros(pros.filter((_, i) => i !== index));
  };

  const addCon = () => {
    if (newCon.trim() && cons.length < 5) {
      setCons([...cons, newCon.trim()]);
      setNewCon("");
    }
  };

  const removeCon = (index: number) => {
    setCons(cons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Hata",
        description: "Lütfen bir puan verin.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Hata",
        description: "Başlık ve içerik alanları zorunludur.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (existingReview) {
        await backend.review.updateReview({
          reviewId: existingReview.id,
          rating,
          title: title.trim(),
          content: content.trim(),
          pros,
          cons,
          usageDuration,
          businessSize,
          useCase,
          wouldRecommend
        });
        
        toast({
          title: "Değerlendirme Güncellendi",
          description: "Değerlendirmeniz başarıyla güncellendi ve moderasyon için gönderildi.",
        });
      } else {
        await backend.review.createReview({
          providerId,
          providerName,
          rating,
          title: title.trim(),
          content: content.trim(),
          pros,
          cons,
          usageDuration,
          businessSize,
          useCase,
          wouldRecommend
        });
        
        toast({
          title: "Değerlendirme Gönderildi",
          description: "Değerlendirmeniz moderasyon için gönderildi ve onaylandıktan sonra yayınlanacak.",
        });
      }
      
      onSuccess?.();
    } catch (error: any) {
      console.error("Review submission error:", error);
      toast({
        title: "Hata",
        description: error.message || "Değerlendirme gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900">
          {existingReview ? "Değerlendirmeyi Düzenle" : `${providerName} için Değerlendirme Yaz`}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-gray-900 mb-2 block">Puan *</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating 
                        ? "text-yellow-500 fill-current" 
                        : "text-gray-300"
                    } hover:text-yellow-400 transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-gray-600">
                {rating > 0 && `${rating}/5`}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-gray-900">Başlık *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Değerlendirmeniz için kısa bir başlık"
              maxLength={255}
              className="bg-white border-gray-300 text-gray-900"
              required
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/255 karakter</p>
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content" className="text-gray-900">Değerlendirme *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Deneyiminizi detaylı olarak paylaşın..."
              rows={6}
              maxLength={5000}
              className="bg-white border-gray-300 text-gray-900"
              required
            />
            <p className="text-xs text-gray-500 mt-1">{content.length}/5000 karakter</p>
          </div>

          {/* Pros */}
          <div>
            <Label className="text-gray-900 mb-2 block">Artıları</Label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={newPro}
                  onChange={(e) => setNewPro(e.target.value)}
                  placeholder="Bir artı ekleyin..."
                  className="bg-white border-gray-300 text-gray-900"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
                />
                <Button
                  type="button"
                  onClick={addPro}
                  disabled={!newPro.trim() || pros.length >= 5}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {pros.map((pro, index) => (
                  <Badge key={index} className="bg-green-100 text-green-700 pr-1">
                    {pro}
                    <button
                      type="button"
                      onClick={() => removePro(index)}
                      className="ml-1 hover:text-green-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500">En fazla 5 artı ekleyebilirsiniz</p>
            </div>
          </div>

          {/* Cons */}
          <div>
            <Label className="text-gray-900 mb-2 block">Eksileri</Label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={newCon}
                  onChange={(e) => setNewCon(e.target.value)}
                  placeholder="Bir eksi ekleyin..."
                  className="bg-white border-gray-300 text-gray-900"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
                />
                <Button
                  type="button"
                  onClick={addCon}
                  disabled={!newCon.trim() || cons.length >= 5}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cons.map((con, index) => (
                  <Badge key={index} className="bg-red-100 text-red-700 pr-1">
                    {con}
                    <button
                      type="button"
                      onClick={() => removeCon(index)}
                      className="ml-1 hover:text-red-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500">En fazla 5 eksi ekleyebilirsiniz</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="usageDuration" className="text-gray-900">Kullanım Süresi</Label>
              <Select value={usageDuration} onValueChange={setUsageDuration}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="1-3 ay">1-3 ay</SelectItem>
                  <SelectItem value="3-6 ay">3-6 ay</SelectItem>
                  <SelectItem value="6-12 ay">6-12 ay</SelectItem>
                  <SelectItem value="1-2 yıl">1-2 yıl</SelectItem>
                  <SelectItem value="2+ yıl">2+ yıl</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="businessSize" className="text-gray-900">İşletme Büyüklüğü</Label>
              <Select value={businessSize} onValueChange={setBusinessSize}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="Bireysel">Bireysel</SelectItem>
                  <SelectItem value="Küçük İşletme">Küçük İşletme (1-10 kişi)</SelectItem>
                  <SelectItem value="Orta İşletme">Orta İşletme (11-50 kişi)</SelectItem>
                  <SelectItem value="Büyük İşletme">Büyük İşletme (51-200 kişi)</SelectItem>
                  <SelectItem value="Kurumsal">Kurumsal (200+ kişi)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="useCase" className="text-gray-900">Kullanım Alanı</Label>
              <Select value={useCase} onValueChange={setUseCase}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="E-ticaret">E-ticaret</SelectItem>
                  <SelectItem value="Fiziksel Mağaza">Fiziksel Mağaza</SelectItem>
                  <SelectItem value="Hizmet Sektörü">Hizmet Sektörü</SelectItem>
                  <SelectItem value="Abonelik">Abonelik Modeli</SelectItem>
                  <SelectItem value="Marketplace">Marketplace</SelectItem>
                  <SelectItem value="Diğer">Diğer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recommendation */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recommend"
              checked={wouldRecommend}
              onCheckedChange={(checked) => setWouldRecommend(checked as boolean)}
            />
            <Label htmlFor="recommend" className="text-gray-900">
              Bu POS sistemini başkalarına tavsiye ederim
            </Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                İptal
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting 
                ? "Gönderiliyor..." 
                : existingReview 
                  ? "Güncelle" 
                  : "Değerlendirme Gönder"
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
