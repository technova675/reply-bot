
import Image from 'next/image';
import { cn } from '@/lib/utils';

type MediaGridProps = {
  images: string[];
  isLCP?: boolean;
};

const ImageComponent = ({ src, alt, priority, className }: { src: string, alt: string, priority: boolean, className?: string }) => (
  <div className={cn("relative w-full h-full", className)}>
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={priority}
    />
  </div>
);

export default function MediaGrid({ images, isLCP = false }: MediaGridProps) {
  const imageCount = images.length;

  if (imageCount === 0) {
    return null;
  }

  if (imageCount === 1) {
    return (
      <div className="relative max-h-[510px] w-full">
         <Image
            src={images[0]}
            alt="Tweet image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="!relative object-contain w-full h-auto"
            priority={isLCP}
          />
      </div>
    );
  }

  if (imageCount === 2) {
    return (
      <div className="flex h-[250px] md:h-[300px] gap-0.5">
        <ImageComponent src={images[0]} alt="Tweet image 1" priority={isLCP} />
        <ImageComponent src={images[1]} alt="Tweet image 2" priority={false} />
      </div>
    );
  }
  
  if (imageCount === 3) {
    return (
      <div className="flex h-[250px] md:h-[300px] gap-0.5">
        <ImageComponent src={images[0]} alt="Tweet image 1" priority={isLCP} />
        <div className="flex flex-col w-1/2 gap-0.5">
          <ImageComponent src={images[1]} alt="Tweet image 2" priority={false} className="h-1/2" />
          <ImageComponent src={images[2]} alt="Tweet image 3" priority={false} className="h-1/2" />
        </div>
      </div>
    );
  }

  // 4 images
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-[300px] md:h-[400px]">
      <ImageComponent src={images[0]} alt="Tweet image 1" priority={isLCP} />
      <ImageComponent src={images[1]} alt="Tweet image 2" priority={false} />
      <ImageComponent src={images[2]} alt="Tweet image 3" priority={false} />
      <ImageComponent src={images[3]} alt="Tweet image 4" priority={false} />
    </div>
  );
}
