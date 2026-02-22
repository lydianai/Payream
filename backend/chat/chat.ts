import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

// TODO: Set this secret in the Encore Cloud dashboard.
const openAIKey = secret("OpenAIKey");

export interface ChatRequest {
  message: string;
  context?: string;
}

export interface ChatResponse {
  response: string;
}

// Provides AI-powered support for POS and finance-related questions.
export const chat = api<ChatRequest, ChatResponse>(
  { expose: true, method: "POST", path: "/chat" },
  async (req) => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAIKey()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `Sen PAYREAM'in uzman finans ve POS danışmanısın. Türkiye'deki sanal POS sistemleri, blockchain teknolojileri, fintech çözümleri ve finansal teknolojiler konusunda uzmanısın. 

Uzmanlık alanların:
- Sanal POS sistemleri ve karşılaştırmaları
- Blockchain ve kripto para teknolojileri
- Fintech çözümleri ve yenilikçi ödeme sistemleri
- Türkiye'deki finansal teknoloji haberleri
- PCI DSS, 3D Secure gibi güvenlik standartları
- API entegrasyonları ve teknik detaylar
- Komisyon oranları ve maliyet analizleri
- Dijital bankacılık ve açık bankacılık
- DeFi (Decentralized Finance) protokolleri
- NFT ve Web3 ödeme sistemleri

Türkiye'deki güncel fintech gelişmelerini takip ediyorsun ve kullanıcılara en uygun çözümleri öneriyorsun. Profesyonel, bilgili ve yardımsever bir ton kullan. Türkçe yanıt ver.`
            },
            {
              role: "user",
              content: req.context ? `Bağlam: ${req.context}\n\nSoru: ${req.message}` : req.message
            }
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        response: data.choices[0]?.message?.content || "Üzgünüm, şu anda yanıt veremiyorum."
      };
    } catch (error) {
      console.error("Chat error:", error);
      return {
        response: "Üzgünüm, teknik bir sorun yaşandı. Lütfen daha sonra tekrar deneyin."
      };
    }
  }
);
