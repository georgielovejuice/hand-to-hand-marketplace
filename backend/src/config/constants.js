// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// File upload limits
export const FILE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
};

// Default profile picture
export const DEFAULT_PROFILE_PICTURE =
  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

// Item statuses
export const ITEM_STATUS = {
  ACTIVE: "active",
  SOLD: "sold",
  REMOVED: "removed",
};
