import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function AssistantRobot() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const { t } = useTranslation();

  const messages = t('assistant.messages', { returnObjects: true }) as string[];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [messages.length]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isExpanded) {
      setIsExpanded(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50" onKeyDown={handleKeyDown}>
      {isExpanded ? (
        <Card 
          className="w-80 bg-white border-gray-200 shadow-2xl"
          role="dialog"
          aria-labelledby="assistant-title"
          aria-describedby="assistant-message"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle 
                id="assistant-title"
                className="text-gray-900 text-sm flex items-center"
              >
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-2 animate-bounce">
                  <Bot className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                {t('assistant.title')}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-gray-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
                aria-label={t('common.close')}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p 
                id="assistant-message"
                className="text-gray-700 text-sm animate-fade-in"
                aria-live="polite"
                aria-atomic="true"
              >
                {messages[currentMessage]}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                asChild 
                className="bg-green-600 hover:bg-green-700 text-white flex-1 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
              >
                <Link to="/chat" aria-label={t('header.chatButton')}>
                  <MessageCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                  {t('assistant.chatButton')}
                </Link>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                asChild 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
              >
                <Link to="/search" aria-label={t('header.searchButton')}>
                  {t('assistant.searchButton')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={handleToggle}
          className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-2xl animate-bounce focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
          aria-label={t('assistant.toggleAssistant')}
          aria-expanded={isExpanded}
        >
          <div className="relative">
            <Bot className="h-8 w-8" aria-hidden="true" />
            <div 
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"
              aria-hidden="true"
            ></div>
          </div>
        </Button>
      )}
    </div>
  );
}
