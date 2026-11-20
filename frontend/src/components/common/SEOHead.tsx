import React, { useEffect } from 'react';
import { ToolMeta } from '../../types';

interface SEOHeadProps {
  tool?: ToolMeta;
  customTitle?: string;
  customDescription?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  tool,
  customTitle,
  customDescription,
}) => {
  const title =
    customTitle ||
    (tool ? `${tool.seoTitle} | SimplePDF` : 'SimplePDF — Online PDF Tools for Document Productivity');

  const description =
    customDescription ||
    (tool
      ? tool.description
      : 'Every PDF tool you need, 100% free and easy to use. Merge, split, compress, convert, rotate, unlock, and protect PDF files in seconds with in-browser privacy.');

  useEffect(() => {
    // 1. Update document title
    document.title = title;

    // 2. Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // 3. Update or inject Schema.org JSON-LD structured data
    let scriptTag = document.getElementById('seo-json-ld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'seo-json-ld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = tool
      ? {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: tool.name,
          url: `https://simplepdf.com${tool.path}`,
          description: tool.longDescription,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'All',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          featureList: tool.howToSteps.join('; '),
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'SimplePDF',
          url: 'https://simplepdf.com',
          description: 'All-in-one online PDF productivity platform.',
          applicationCategory: 'ProductivityApplication',
          operatingSystem: 'All',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        };

    scriptTag.text = JSON.stringify(schemaData);
  }, [title, description, tool]);

  return null;
};
