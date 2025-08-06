import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2" role="search">
      <div className="flex-1 relative">
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" 
          aria-hidden="true"
        />
        <Input
          type="text"
          placeholder={t('home.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 h-12 text-lg bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          aria-label={t('home.searchPlaceholder')}
        />
      </div>
      <Button 
        type="submit" 
        size="lg" 
        className="bg-green-600 hover:bg-green-700 text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
        aria-label={t('search.searchButton')}
      >
        <Search className="h-5 w-5 mr-2" aria-hidden="true" />
        {t('common.search')}
      </Button>
    </form>
  );
}
