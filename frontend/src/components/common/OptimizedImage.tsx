import { ResponsiveImage } from '../../utils/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}

const OptimizedImage = ({ src, alt, className = '', sizes }: OptimizedImageProps) => {
  return (
    <div className="relative">
      <ResponsiveImage
        src={src}
        alt={alt}
        className={`max-w-full h-auto ${className}`}
        sizes={sizes}
        loading="lazy"
      />
    </div>
  );
};

export default OptimizedImage;
