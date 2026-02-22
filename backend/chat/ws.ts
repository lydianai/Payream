import { Service } from "encore.dev/service";
import { WebSocketServer } from "ws";
import { secret } from "encore.dev/config";

const openAIKey = secret("OpenAIKey");

const service = new Service("chat-ws");

const wss = new WebSocketServer({ port: 8081 }); // Gerekirse portu ayarlayın

wss.on("connection", (ws) => {
  ws.on("message", async (message: string) => {
    // AI API ile yanıt al
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
              content: `Sen PAYREAM'in uzman finans ve POS danışmanısın. Türkçe yanıt ver.`
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });
      if (!response.ok) {
        ws.send("AI API hatası: " + response.status);
        return;
      }
      const data = await response.json();
      ws.send(data.choices[0]?.message?.content || "Üzgünüm, şu anda yanıt veremiyorum.");
    } catch (error) {
      ws.send("Teknik bir hata oluştu.");
    }
  });
  ws.send("Payream Asistan'a hoş geldiniz! Sorunuzu yazabilirsiniz.");
});

export default service;
