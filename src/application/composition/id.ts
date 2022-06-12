let i = 0;

/**
 * Very primitive globally unique ID generator.
 */
// We could use UUIDs, but due to being single-threaded an incrementing number should be enough.
export const useId = (): string => `v-${++i}`;
