import { useEffect } from 'react';

const SEO = ({ title, description }) => {
  useEffect(() => {
    const fullTitle = title 
      ? `${title} | Friends Garden AG Church, Kollidam`
      : 'Friends Garden AG Church | A Place to Belong, Believe, and Become';
    
    document.title = fullTitle;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};

export default SEO;
