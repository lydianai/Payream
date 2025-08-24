import React from "react";

const footerLinks = [
  { name: "Ana Sayfa", href: "/", seo: true },
  { name: "Bankalar", href: "/banks", seo: true },
  { name: "POS Karşılaştırma", href: "/comparison", seo: true },
  { name: "Haberler", href: "/news", seo: true },
  { name: "Analizler", href: "/analytics", seo: true },
  { name: "Gizlilik Politikası", href: "/privacy", seo: true },
  { name: "Kullanım Şartları", href: "/terms", seo: true },
  { name: "İletişim", href: "/contact", seo: true },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 mt-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-lg font-bold mb-3 text-green-400">Payream Sanal POS Sistemleri</h2>
          <p className="text-sm text-gray-300 mb-4">
            Payream, Türkiye ve dünya genelinde sanal POS, finansal teknoloji, banka karşılaştırma ve kullanıcı değerlendirmeleri sunan profesyonel bir platformdur. Tüm bankaların sanal POS çözümlerini tek çatı altında, güvenli ve hızlı şekilde sunar.
          </p>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Payream. Tüm hakları saklıdır.</p>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-3 text-green-300">Site Haritası</h3>
          <ul className="space-y-2">
            {footerLinks.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="hover:text-green-400 transition-colors underline underline-offset-2"
                  rel={link.seo ? "nofollow" : undefined}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-3 text-green-300">İletişim & Sosyal</h3>
          <ul className="space-y-2">
            <li>
              <a href="mailto:info@payream.com" className="hover:text-green-400 transition-colors underline underline-offset-2">info@payream.com</a>
            </li>
            <li>
              <a href="tel:+90444123456" className="hover:text-green-400 transition-colors underline underline-offset-2">+90 444 123 456</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/payream" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors underline underline-offset-2">LinkedIn</a>
            </li>
            <li>
              <a href="https://twitter.com/payream" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors underline underline-offset-2">Twitter</a>
            </li>
            <li>
              <a href="https://www.instagram.com/payream" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors underline underline-offset-2">Instagram</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-800">
        SEO: Tüm linkler arama motorları için optimize edilmiştir. Payream, finansal teknoloji ve sanal POS aramalarında üst sıralarda yer almak için profesyonel SEO altyapısı kullanır.
      </div>
    </footer>
  );
}
