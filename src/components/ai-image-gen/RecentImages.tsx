import React, { useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type RawImageItem = {
  id?: string | number;
  url?: string;
  imageId?: string;
  alt?: string;
  prompt?: string;
};

type RecentImagesProps = {
  images?: RawImageItem[];
};

type PreparedImageItem = {
  id: string | number;
  src: string;
  alt: string;
  prompt: string;
};

const FALLBACK_IMAGES: PreparedImageItem[] = [
  { imageId: 'photo-1555448248-2571daf6344b', alt: 'Artistic Creation', prompt: 'Creative artwork showcasing innovative design techniques and visual effects.' },
  { imageId: 'photo-1507003211169-0a1dd7228f2d', alt: 'Abstract Shapes', prompt: 'Contemporary abstract art featuring bold shapes and color gradients.' },
  { imageId: 'photo-1502134249126-9f3755a50d78', alt: 'Digital Design', prompt: 'Modern digital design with clean lines and minimalist composition.' },
  { imageId: 'photo-1545670723-196ed0954986', alt: 'Creative Portrait', prompt: 'Artistic portrait with dramatic lighting and creative composition.' },
  { imageId: 'photo-1517077304055-6e89abbf09b0', alt: 'Urban Art', prompt: 'Contemporary urban art piece with bold colors and dynamic composition.' },
  { imageId: 'photo-1506905925346-21bda4d32df4', alt: 'Creative Design', prompt: 'Innovative design concept featuring abstract elements and artistic flair.' },
  { imageId: 'photo-1501594907352-04cda38ebc29', alt: 'Digital Graphics', prompt: 'Professional digital graphics with sleek design and visual impact.' },
  { imageId: 'photo-1500462918059-b1a0cb512f1d', alt: 'Artistic Vision', prompt: 'Unique artistic vision combining traditional and digital art techniques.' },
  { imageId: 'photo-1519681393784-d120267933ba', alt: 'Creative Concept', prompt: 'Original creative concept showcasing artistic innovation and style.' },
  { imageId: 'photo-1500462918059-b1a0cb512f1d', alt: 'Visual Art', prompt: 'Striking visual art piece with contemporary design elements.' },
  { imageId: 'photo-1493246507139-91e8fad9978e', alt: 'Digital Creation', prompt: 'Digital art creation featuring modern aesthetics and creative expression.' },
  { imageId: 'photo-1558618666-fcd25c85cd64', alt: 'Startup Ninja Logo', prompt: 'Modern logo design concept in a sharp, dark aesthetic.' },

].map((item, index) => ({
  id: index + 1,
  src: `https://images.unsplash.com/${item.imageId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
  alt: item.alt,
  prompt: item.prompt,
}));

const resolveImageData = (
  rawImages: RawImageItem[] | undefined,
): PreparedImageItem[] => {
  if (!rawImages || rawImages.length === 0) {
    return FALLBACK_IMAGES;
  }

  return rawImages.map((item, index) => {
    const fallback = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    const fallbackId = typeof fallback.id === 'number' ? fallback.id : index + 1;

    const src =
      item.url ??
      (item.imageId
        ? `https://images.unsplash.com/${item.imageId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
        : fallback.src);

    return {
      id: item.id ?? item.imageId ?? fallbackId,
      src,
      alt: item.alt ?? fallback.alt,
      prompt: item.prompt ?? fallback.prompt,
    };
  });
};

const RecentImages: React.FC<RecentImagesProps> = ({ images }) => {
  const preparedImages = useMemo(() => resolveImageData(images), [images]);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const total = preparedImages.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageItems = preparedImages.slice((page - 1) * pageSize, page * pageSize);

  const ImageCard = ({ image }: { image: PreparedImageItem; index: number }) => (
    <article
      className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl border border-[#242424] bg-[#151515] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-red-600/50 hover:shadow-xl"
    >
      <div className="relative w-full">
        <img
          src={image.src}
          alt={image.alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/70 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="text-center">
            <p className="text-xs font-medium text-white sm:text-sm">{image.alt}</p>
            <p className="mt-1 line-clamp-3 text-[10px] leading-tight text-white/80 sm:text-xs">{image.prompt}</p>
          </div>
        </div>
        <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#DC2626] opacity-90 shadow-lg" />
      </div>
    </article>
  );

  return (
    <div className="w-full">
      <div className="mb-3 sm:mb-4 lg:mb-5">
        <h2 className="text-white 
          text-base sm:text-lg md:text-xl lg:text-[20px] 
          font-bold 
          mb-1 sm:mb-2 
          leading-tight font-plus-jakarta">
          Your Recent Images
        </h2>
        <p className="text-[#9CA3AF] 
          text-xs sm:text-sm md:text-base lg:text-[14px] 
          font-normal 
          leading-relaxed font-plus-jakarta lg:leading-[21px]">
          Manage and track all your created images
        </p>
      </div>

      <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
        {pageItems.map((image, index) => (
          <ImageCard key={image.id} image={image} index={index} />
        ))}
      </div>

      {total > 0 && (
        <div className="flex items-center justify-end mt-4 text-sm text-gray-300">
          <div className="flex items-center gap-4">
            <span>
              {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-md text-gray-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:bg-[#FFFFFF0D] border border-[#FFFFFF1A]"
                style={page > 1 ? { background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)', boxShadow: '0px 10.67px 22.22px 0px #7F1D1D80' } : {}}
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                aria-label="Next page"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-md text-gray-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:bg-[#FFFFFF0D] border border-[#FFFFFF1A]"
                style={page < totalPages ? { background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)', boxShadow: '0px 10.67px 22.22px 0px #7F1D1D80' } : {}}
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentImages;