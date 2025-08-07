import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, MessageCircle, Menu, X, Building, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import LanguageSelector from "./LanguageSelector";
import UserMenu from "./UserMenu";

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

  const navLinks = [
    { to: "/", label: t('navigation.home'), icon: null },
    { to: "/search", label: t('navigation.search'), icon: Search },
    { to: "/banks", label: "Bankalar", icon: Building },
    { to: "/analytics", label: t('navigation.analytics'), icon: BarChart3 },
    { to: "/chat", label: t('navigation.chat'), icon: MessageCircle },
  ];

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
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-md px-2 py-1 ${
                  location.pathname === link.to
                    ? "text-green-600"
                    : "text-gray-700 hover:text-green-600"
                }`}
                aria-current={location.pathname === link.to ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector />
            <UserMenu />
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
            <div className="flex flex-col space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className={`flex items-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white rounded-md px-3 py-2 ${
                    location.pathname === link.to
                      ? "text-green-600 bg-green-50"
                      : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                  }`}
                  aria-current={location.pathname === link.to ? "page" : undefined}
                >
                  {link.icon && <link.icon className="h-4 w-4 mr-3" aria-hidden="true" />}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
