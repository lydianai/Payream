import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import backend from '~backend/client';
import ReviewForm from '@/components/ReviewForm';
import ReviewCard from '@/components/ReviewCard';
import ReviewStats from '@/components/ReviewStats';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useBackend } from '@/hooks/useBackend';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { POSProvider } from '~backend/pos/search';

// This is a simplified user type for the frontend
interface User {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  provider: string;
}

export default function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const authenticatedBackend = useBackend();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const updateUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (e) {
          console.error("Failed to parse user data from localStorage", e);
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    updateUser();
    window.addEventListener('authChange', updateUser);
    return () => window.removeEventListener('authChange', updateUser);
  }, []);

  const { data: providerData, isLoading: isLoadingProvider } = useQuery({
    queryKey: ['provider', id],
    queryFn: async () => {
      // The backend doesn't have a getProviderById endpoint.
      // We use the search endpoint to find the provider.
      const results = await backend.pos.search({ query: '', limit: 100 });
      return results.providers.find(p => p.id === id);
    },
    enabled: !!id,
  });

  const { data: reviewsData, isLoading: isLoadingReviews, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id, user?.id], // Add user.id to key to refetch on login/logout
    queryFn: () => authenticatedBackend.review.listReviews({ providerId: id }),
    enabled: !!id,
  });

  const userHasReviewed = reviewsData?.reviews.some(review => review.userId === user?.id);

  const handleReviewSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['reviews', id] });
    setShowReviewForm(false);
  };

  if (isLoadingProvider) {
    return <LoadingSpinner />;
  }

  if (!providerData) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Provider not found</h2>
        <Link to="/search" className="text-green-600 hover:underline mt-4 inline-block">
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <Link to="/search" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Aramaya Geri Dön
      </Link>
      <header className="mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <img src={providerData.imageUrl} alt={`${providerData.name} logo`} className="w-20 h-20 rounded-lg" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{providerData.name}</h1>
            <p className="text-lg text-gray-600">{providerData.description}</p>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Değerlendirmeler</h2>
              {user && !userHasReviewed && !showReviewForm && (
                <Button onClick={() => setShowReviewForm(true)}>Değerlendirme Yaz</Button>
              )}
            </div>
            
            {user && showReviewForm && (
              <ReviewForm 
                providerId={providerData.id} 
                providerName={providerData.name} 
                onSuccess={handleReviewSuccess}
                onCancel={() => setShowReviewForm(false)}
              />
            )}
            {!user && <p className="text-gray-600 bg-gray-100 p-4 rounded-md">Değerlendirme yazmak veya oylamak için giriş yapmalısınız.</p>}
            
            <div className="space-y-4 mt-6">
              {isLoadingReviews ? <LoadingSpinner /> :
                reviewsData?.reviews.length === 0 ? (
                  <p className="text-gray-500">Henüz değerlendirme yok. İlk değerlendirmeyi siz yapın!</p>
                ) : (
                  reviewsData?.reviews.map(review => (
                    <ReviewCard 
                      key={review.id} 
                      review={review} 
                      currentUserId={user?.id} 
                      onVoteUpdate={refetchReviews} 
                      onDelete={refetchReviews}
                    />
                  ))
                )
              }
            </div>
          </section>
        </main>
        <aside className="space-y-6">
          {reviewsData && (
            <ReviewStats 
              averageRating={reviewsData.averageRating}
              totalReviews={reviewsData.total}
              ratingDistribution={reviewsData.ratingDistribution}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
