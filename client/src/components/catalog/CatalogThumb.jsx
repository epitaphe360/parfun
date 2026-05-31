import React, { useEffect, useState } from 'react';

const CatalogThumb = ({ src, fallbackSrc, alt, accentColor, size = 'md' }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setFailed(false);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    setFailed(true);
  };

  if (failed || !currentSrc) {
    return (
      <div className={`catalog-thumb-fallback ${size}`}>
        <span>{alt?.charAt(0) ?? '?'}</span>
      </div>
    );
  }

  return (
    <div className={`catalog-thumb-img-wrap ${size}`}>
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={handleError}
      />
      {accentColor && <span className="catalog-thumb-accent" style={{ background: accentColor }} />}
    </div>
  );
};

export default CatalogThumb;
