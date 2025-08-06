import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, languageCode: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLanguageChange(languageCode);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          aria-label={t('accessibility.languageSelector')}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <Globe className="h-4 w-4 mr-2" aria-hidden="true" />
          <span className="mr-1" aria-hidden="true">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white border-gray-200"
        role="menu"
        aria-label={t('accessibility.languageSelector')}
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            onKeyDown={(e) => handleKeyDown(e, language.code)}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer focus:bg-gray-50 focus:text-gray-900"
            role="menuitem"
            tabIndex={0}
          >
            <span className="mr-2" aria-hidden="true">{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            {i18n.language === language.code && (
              <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
