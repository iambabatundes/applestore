/**
 * Centralized endpoint builder utility
 * Provides consistent endpoint construction across all services
 */

/**
 * Creates an endpoint builder function for a specific resource
 * @param {string} resource - The base resource name (e.g., 'products', 'users', 'orders')
 * @param {string} version - Optional API version prefix (e.g., 'v1', 'v2')
 * @returns {function} - Endpoint builder function
 */
export function createEndpointBuilder(resource, version = null) {
  const baseResource = version ? `/${version}/${resource}` : `/${resource}`;

  return (path = "") => {
    // Ensure path starts with / if provided
    const normalizedPath = path && !path.startsWith("/") ? `/${path}` : path;
    return `${baseResource}${normalizedPath}`;
  };
}

/**
 * Pre-built endpoint builders for common resources
 * These can be imported directly by services
 */
export const EndpointBuilders = {
  // Public resources
  products: createEndpointBuilder("products"),
  categories: createEndpointBuilder("categories"),
  tags: createEndpointBuilder("tags"),
  geolocation: createEndpointBuilder("geolocation"),
  promotions: createEndpointBuilder("promotions"),
  reviews: createEndpointBuilder("reviews"),

  // User resources (typically prefixed with user context)
  user: {
    profile: createEndpointBuilder("user/profile"),
    orders: createEndpointBuilder("user/orders"),
    cart: createEndpointBuilder("user/cart"),
    wishlist: createEndpointBuilder("user/wishlist"),
    addresses: createEndpointBuilder("user/addresses"),
    payments: createEndpointBuilder("user/payment-methods"),
    subscriptions: createEndpointBuilder("user/subscriptions"),
    notifications: createEndpointBuilder("user/notifications"),
    support: createEndpointBuilder("user/support"),
    loyalty: createEndpointBuilder("user/loyalty"),
  },

  // Admin resources
  admin: {
    products: createEndpointBuilder("admin/products"),
    users: createEndpointBuilder("admin/users"),
    orders: createEndpointBuilder("admin/orders"),
    categories: createEndpointBuilder("admin/categories"),
    promotions: createEndpointBuilder("admin/promotions"),
    analytics: createEndpointBuilder("admin/analytics"),
    settings: createEndpointBuilder("admin/settings"),
  },

  // Mobile-specific endpoints
  mobile: {
    sync: createEndpointBuilder("mobile/sync", "v1"),
    push: createEndpointBuilder("mobile/push", "v1"),
    offline: createEndpointBuilder("mobile/offline", "v1"),
  },

  // Authentication endpoints
  auth: {
    login: createEndpointBuilder("auth/login"),
    logout: createEndpointBuilder("auth/logout"),
    register: createEndpointBuilder("auth/register"),
    refresh: createEndpointBuilder("auth/refresh"),
    forgot: createEndpointBuilder("auth/forgot-password"),
    reset: createEndpointBuilder("auth/reset-password"),
    verify: createEndpointBuilder("auth/verify-email"),
  },
};

/**
 * Dynamic endpoint builder with parameter substitution
 * Useful for endpoints with dynamic segments
 */
export class DynamicEndpointBuilder {
  constructor(resource, version = null) {
    this.resource = resource;
    this.version = version;
    this.baseResource = version ? `/${version}/${resource}` : `/${resource}`;
  }

  /**
   * Build endpoint with parameter substitution
   * @param {string} template - Endpoint template with :param placeholders
   * @param {Object} params - Parameters to substitute
   * @returns {string} - Built endpoint
   *
   * @example
   * const builder = new DynamicEndpointBuilder('users');
   * builder.build('/:userId/orders/:orderId', { userId: 123, orderId: 456 })
   * // Returns: /users/123/orders/456
   */
  build(template = "", params = {}) {
    let endpoint = `${this.baseResource}${template}`;

    // Replace :param placeholders with actual values
    Object.entries(params).forEach(([key, value]) => {
      const placeholder = `:${key}`;
      if (endpoint.includes(placeholder)) {
        endpoint = endpoint.replace(placeholder, encodeURIComponent(value));
      }
    });

    // Check for unresolved parameters
    const unresolvedParams = endpoint.match(/:[\w]+/g);
    if (unresolvedParams) {
      console.warn(
        `Unresolved parameters in endpoint: ${unresolvedParams.join(", ")}`
      );
    }

    return endpoint;
  }

  /**
   * Build simple endpoint (same as createEndpointBuilder result)
   */
  simple(path = "") {
    const normalizedPath = path && !path.startsWith("/") ? `/${path}` : path;
    return `${this.baseResource}${normalizedPath}`;
  }
}

/**
 * Endpoint builder with query parameter handling
 */
export class QueryEndpointBuilder extends DynamicEndpointBuilder {
  /**
   * Build endpoint with automatic query string generation
   * @param {string} path - Endpoint path
   * @param {Object} queryParams - Query parameters to append
   * @returns {string} - Built endpoint with query string
   */
  buildWithQuery(path = "", queryParams = {}) {
    const endpoint = this.simple(path);

    const validParams = Object.entries(queryParams)
      .filter(
        ([key, value]) => value !== null && value !== undefined && value !== ""
      )
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    return validParams ? `${endpoint}?${validParams}` : endpoint;
  }
}

/**
 * Endpoint registry for centralized endpoint management
 * Useful for large applications with many endpoints
 */
export class EndpointRegistry {
  constructor() {
    this.builders = new Map();
  }

  /**
   * Register an endpoint builder
   */
  register(name, resource, version = null) {
    this.builders.set(name, createEndpointBuilder(resource, version));
    return this;
  }

  /**
   * Get an endpoint builder by name
   */
  get(name) {
    const builder = this.builders.get(name);
    if (!builder) {
      throw new Error(
        `Endpoint builder '${name}' not found. Available builders: ${Array.from(
          this.builders.keys()
        ).join(", ")}`
      );
    }
    return builder;
  }

  /**
   * Build an endpoint using registered builder
   */
  build(name, path = "") {
    return this.get(name)(path);
  }

  /**
   * List all registered builders
   */
  list() {
    return Array.from(this.builders.keys());
  }
}

/**
 * Default registry instance with common endpoints pre-registered
 */
export const defaultRegistry = new EndpointRegistry()
  .register("products", "products")
  .register("users", "users")
  .register("orders", "orders")
  .register("categories", "categories")
  .register("geolocation", "geolocation")
  .register("auth", "auth")
  .register("admin-products", "admin/products")
  .register("admin-users", "admin/users")
  .register("user-profile", "user/profile")
  .register("user-orders", "user/orders");

/**
 * Utility functions for common endpoint patterns
 */
export const EndpointUtils = {
  /**
   * Create CRUD endpoints for a resource
   */
  createCrudEndpoints(resource) {
    const builder = createEndpointBuilder(resource);
    return {
      list: () => builder(),
      create: () => builder(),
      get: (id) => builder(`/${id}`),
      update: (id) => builder(`/${id}`),
      delete: (id) => builder(`/${id}`),
    };
  },

  /**
   * Create nested resource endpoints
   */
  createNestedEndpoints(parentResource, childResource) {
    const builder = createEndpointBuilder(parentResource);
    return {
      list: (parentId) => builder(`/${parentId}/${childResource}`),
      create: (parentId) => builder(`/${parentId}/${childResource}`),
      get: (parentId, childId) =>
        builder(`/${parentId}/${childResource}/${childId}`),
      update: (parentId, childId) =>
        builder(`/${parentId}/${childResource}/${childId}`),
      delete: (parentId, childId) =>
        builder(`/${parentId}/${childResource}/${childId}`),
    };
  },

  /**
   * Create search/filter endpoints
   */
  createSearchEndpoints(resource) {
    const builder = createEndpointBuilder(resource);
    return {
      search: () => builder("/search"),
      filter: () => builder("/filter"),
      category: (categoryId) => builder(`/category/${categoryId}`),
      tag: (tagId) => builder(`/tag/${tagId}`),
    };
  },
};

// Export convenience functions
export default {
  create: createEndpointBuilder,
  builders: EndpointBuilders,
  Dynamic: DynamicEndpointBuilder,
  Query: QueryEndpointBuilder,
  Registry: EndpointRegistry,
  registry: defaultRegistry,
  utils: EndpointUtils,
};
