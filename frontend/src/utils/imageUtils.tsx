import { FC } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const ResponsiveImage: FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = '100vw',
  className = '',
  loading = 'lazy',
}) => {
  // Function to generate srcSet for WebP format
  const generateWebPSrcSet = (imagePath: string) => {
    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths
      .map((width) => {
        // In a real app, you would use a proper image service to generate these URLs
        const webpUrl = `${imagePath}?width=${width}&format=webp`;
        return `${webpUrl} ${width}w`;
      })
      .join(', ');
  };

  // Function to generate srcSet for fallback format (e.g., JPEG)
  const generateFallbackSrcSet = (imagePath: string) => {
    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths
      .map((width) => {
        // In a real app, you would use a proper image service to generate these URLs
        const jpegUrl = `${imagePath}?width=${width}`;
        return `${jpegUrl} ${width}w`;
      })
      .join(', ');
  };

  return (
    <picture>
      <source type="image/webp" srcSet={generateWebPSrcSet(src)} sizes={sizes} />
      <source type="image/jpeg" srcSet={generateFallbackSrcSet(src)} sizes={sizes} />
      <img src={src} alt={alt} className={className} loading={loading} decoding="async" />
    </picture>
  );
};

export const optimizeImageUrl = (url: string, width: number, format: 'webp' | 'jpeg' = 'webp') => {
  // In a real app, you would use a proper image service to generate these URLs
  return `${url}?width=${width}&format=${format}`;
};
