const ABSOLUTE_IMAGE_URL_REGEX = /^(?:https?:|data:|blob:|chrome-extension:)/i;

export const resolveProfilePictureUrl = (picture?: string | null): string | null => {
  if (!picture || !picture.trim()) {
    return null;
  }

  const trimmedPicture = picture.trim();

  if (ABSOLUTE_IMAGE_URL_REGEX.test(trimmedPicture)) {
    return trimmedPicture;
  }

  const baseUrl = import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    return trimmedPicture.startsWith('/') ? trimmedPicture : `/${trimmedPicture}`;
  }

  try {
    return new URL(trimmedPicture, baseUrl).href;
  } catch (error) {
    console.warn('Failed to build absolute profile picture URL:', error);
    const sanitizedBase = baseUrl.replace(/\/+$/, '');
    const sanitizedPath = trimmedPicture.startsWith('/') ? trimmedPicture : `/${trimmedPicture}`;
    return `${sanitizedBase}${sanitizedPath}`;
  }
};
