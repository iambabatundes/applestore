const requestCache = new Map();

const getRequestKey = (config) =>
  `${config.method}:${config.url}:${JSON.stringify(config.data)}`;

export const deduplicateRequest = async (client, config) => {
  const key = getRequestKey(config);
  if (requestCache.has(key)) {
    return requestCache.get(key);
  }
  const promise = client(config);
  requestCache.set(key, promise);
  try {
    const result = await promise;
    requestCache.delete(key);
    return result;
  } catch (error) {
    requestCache.delete(key);
    throw error;
  }
};
