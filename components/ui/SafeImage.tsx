"use client";

import { ImgHTMLAttributes, ReactNode, useEffect, useState } from 'react';

interface SafeImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src?: string | null;
  alt: string;
  fallback: ReactNode;
}

export default function SafeImage({
  src,
  alt,
  fallback,
  onError,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <>{fallback}</>;
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
