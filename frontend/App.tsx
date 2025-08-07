import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";
import "./i18n";
import SkipLink from "./components/SkipLink";
import Header from "./components/Header";
import AssistantRobot from "./components/AssistantRobot";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load pages for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const ComparisonPage = lazy(() => import("./pages/ComparisonPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const BanksPage = lazy(() => import("./pages/BanksPage"));
const ProviderDetailPage = lazy(() => import("./pages/ProviderDetailPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

// Create query client with optimized caching strategies
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for critical data
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-white">
          <SkipLink />
          <Header />
          <main id="main-content" role="main">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/comparison" element={<ComparisonPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/banks" element={<BanksPage />} />
                <Route path="/provider/:id" element={<ProviderDetailPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </Suspense>
          </main>
          <AssistantRobot />
          <Toaster />
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
