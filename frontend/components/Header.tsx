import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, MessageCircle, Menu, X, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import LanguageSelector from "./LanguageSelector";

export default function Header() {
  const location = useLocation();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeMobileMenu();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-md"
            aria-label={t('header.logo')}
          >
            <Logo size="sm" />
            <span className="text-xl font-semibold text-gray-900">PAYREAM</span>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center space-x-8"
            role="navigation"
            aria-label={t('navigation.mainNavigation')}
          >
            <Link
              to="/"
              className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-md px-2 py-1 ${
                location.pathname === "/"
                  ? "text-green-600"
                  : "text-gray-700 hover:text-green-600"
              }`}
              aria-current={location.pathname === "/" ? "page" : undefined}
            >
              {t('navigation.home')}
            </Link>
            <Link
              to="/search"
              className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-md px-2 py-1 ${
                location.pathname === "/search"
                  ? "text-green-600"
                  : "text-gray-700 hover:text-green-600"
              }`}
              aria-current={location.pathname === "/search" ? "page" : undefined}
            >
              {t('navigation.search')}
            </Link>
            <Link
              to="/banks"
              className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-md px-2 py-1 ${
                location.pathname === "/banks"
                  ? "text-green-600"
                  : "text-gray-700 hover:text-green-600"
              }`}
              aria-current={location.pathname === "/banks" ? "page" : undefined}
            >
              Bankalar
            </Link>
            <Link
              to="/chat"
              className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-md px-2 py-1 ${
                location.pathname === "/chat"
                  ? "text-green-600"
                  : "text-gray-700 hover:text-green-600"
              }`}
              aria-current={location.pathname === "/chat" ? "page" : undefined}
            >
              {t('navigation.chat')}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
            >
              <Link to="/search" aria-label={t('header.searchButton')}>
                <Search className="h-4 w-4 mr-2" aria-hidden="true" />
                {t('common.search')}
              </Link>
            </Button>
            <Button 
              size="sm" 
              asChild 
              className="bg-green-600 hover:bg-green-700 text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
            >
              <Link to="/chat" aria-label={t('header.chatButton')}>
                <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                {t('navigation.chat')}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              onKeyDown={handleKeyDown}
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
              aria-label={t('header.toggleMobileMenu')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden py-4 border-t border-gray-200"
            role="navigation"
            aria-label={t('navigation.mainNavigation')}
          >
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-md px-2 py-2 ${
                  location.pathname === "/"
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                }`}
                aria-current={location.pathname === "/" ? "page" : undefined}
              >
                {t('navigation.home')}
              </Link>
              <Link
                to="/search"
                onClick={closeMobileMenu}
                className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-md px-2 py-2 ${
                  location.pathname === "/search"
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                }`}
                aria-current={location.pathname === "/search" ? "page" : undefined}
              >
                {t('navigation.search')}
              </Link>
              <Link
                to="/banks"
                onClick={closeMobileMenu}
                className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-md px-2 py-2 ${
                  location.pathname === "/banks"
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                }`}
                aria-current={location.pathname === "/banks" ? "page" : undefined}
              >
                Bankalar
              </Link>
              <Link
                to="/chat"
                onClick={closeMobileMenu}
                className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-md px-2 py-2 ${
                  location.pathname === "/chat"
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                }`}
                aria-current={location.pathname === "/chat" ? "page" : undefined}
              >
                {t('navigation.chat')}
              </Link>
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 justify-start"
                >
                  <Link to="/search" onClick={closeMobileMenu} aria-label={t('header.searchButton')}>
                    <Search className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('common.search')}
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  asChild 
                  className="bg-green-600 hover:bg-green-700 text-white justify-start"
                >
                  <Link to="/chat" onClick={closeMobileMenu} aria-label={t('header.chatButton')}>
                    <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('navigation.chat')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
