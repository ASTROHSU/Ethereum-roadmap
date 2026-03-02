import { useEffect } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
}

export const useMetaTags = ({
  title,
  description,
  url = window.location.href,
  image = '/og-cover.png',
  type = 'website'
}: MetaTagsProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const updateNameTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update description
    updateNameTag('description', description);

    // Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:url', url);
    updateMetaTag('og:type', type);
    updateMetaTag('og:image', image);
    updateMetaTag('og:site_name', '以太坊升級地圖');

    // Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:url', url);
    updateMetaTag('twitter:creator', '@wolovim');

    // Cleanup function to restore original meta tags when component unmounts
    return () => {
      // Restore default title
      document.title = '以太坊升級地圖';

      // Restore default meta tags
      updateNameTag('description', '對照以太坊升級藍圖與你的痛點，了解每個解法與預計實現時間。升級到哪了？一次看懂。');
      updateMetaTag('og:title', '以太坊升級地圖');
      updateMetaTag('og:description', '對照以太坊升級藍圖與你的痛點，了解每個解法與預計實現時間。升級到哪了？一次看懂。');
      updateMetaTag('og:url', 'https://astrophsu.github.io/Ethereum-roadmap/');
      updateMetaTag('og:image', '/og-cover.png');
      updateMetaTag('twitter:title', '以太坊升級地圖');
      updateMetaTag('twitter:description', '對照以太坊升級藍圖與你的痛點，了解每個解法與預計實現時間。升級到哪了？一次看懂。');
      updateMetaTag('twitter:url', 'https://astrophsu.github.io/Ethereum-roadmap/');
    };
  }, [title, description, url, image, type]);
};