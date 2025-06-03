import React from 'react';

const LazyImage = React.memo(({ src, alt, className, onError }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const imageRef = React.useRef(null);

  React.useEffect(() => {
    if (!imageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (imageRef.current) {
              imageRef.current.src = src;
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(imageRef.current);
    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [src]);

  return (
    <img
      ref={imageRef}
      className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      onError={onError}
      loading="lazy"
      decoding="async"
    />
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
