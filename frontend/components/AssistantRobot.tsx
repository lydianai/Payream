import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function AssistantRobot() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    ws.current = new WebSocket("wss://payream.com/ws/chat"); // WebSocket endpoint
    ws.current.onopen = () => {
      setMessages((prev) => [...prev, { sender: "assistant", text: t('assistant.welcome') }]);
    };
    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, { sender: "assistant", text: event.data }]);
    };
    ws.current.onerror = () => {
      setMessages((prev) => [...prev, { sender: "assistant", text: t('assistant.error') }]);
    };
    return () => {
      ws.current?.close();
    };
  }, [t]);

  const sendMessage = () => {
    if (input.trim() && ws.current?.readyState === 1) {
      ws.current.send(input);
      setMessages((prev) => [...prev, { sender: "user", text: input }]);
      setInput("");
    }
  };

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
            <div className="bg-gray-50 rounded-lg p-3 h-48 overflow-y-auto">
              {messages.map((msg, idx) => (
                <p key={idx} className={`text-sm ${msg.sender === 'assistant' ? 'text-green-700' : 'text-gray-900'} mb-2`}>
                  <strong>{msg.sender === 'assistant' ? t('assistant.title') : t('assistant.you')}:</strong> {msg.text}
                </p>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 border rounded px-2 py-1 text-sm"
                placeholder={t('assistant.inputPlaceholder')}
                onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              />
              <Button size="sm" onClick={sendMessage} className="bg-green-600 text-white">
                Gönder
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
