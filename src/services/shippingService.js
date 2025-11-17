// services/shippingService.js

import {
  publicHttpService,
  adminHttpService,
  userHttpService,
} from "./http/index.js";

const shippingRatesPath = "/api/shipping/rates";
const shippingZonesPath = "/api/shipping/zones";
const shippingCarriersPath = "/api/shipping/carriers";

function shippingRateUrl(id) {
  return `${shippingRatesPath}/${id}`;
}

function shippingZoneUrl(id) {
  return `${shippingZonesPath}/${id}`;
}

function shippingCarrierUrl(id) {
  return `${shippingCarriersPath}/${id}`;
}

function handleError(error, context = "") {
  const errorDetails = {
    message: error.message || "An error occurred",
    code: "UNKNOWN_ERROR",
    statusCode: null,
    validationErrors: null,
    context,
  };

  if (error.response) {
    errorDetails.message = error.response.data?.message || errorDetails.message;
    errorDetails.code = error.response.data?.code || "API_ERROR";
    errorDetails.statusCode = error.response.status;
    errorDetails.validationErrors = error.response.data?.errors;
  } else if (!error.response && error.request) {
    errorDetails.code = "NETWORK_ERROR";
    errorDetails.message = "Network error - please check your connection";
  }

  console.error(`${context}:`, errorDetails);
  return errorDetails;
}

export async function getAllShippingRates(params = {}) {
  try {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    // Filters
    if (params.isActive !== undefined)
      queryParams.append("isActive", params.isActive);
    if (params.carrier) queryParams.append("carrier", params.carrier);
    if (params.shippingZone)
      queryParams.append("shippingZone", params.shippingZone);
    if (params.pricingType)
      queryParams.append("pricingType", params.pricingType);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.search) queryParams.append("search", params.search);

    const url = queryParams.toString()
      ? `${shippingRatesPath}?${queryParams.toString()}`
      : shippingRatesPath;

    const { data } = await adminHttpService.get(url);
    return data;
  } catch (err) {
    throw handleError(err, "Failed to fetch shipping rates");
  }
}

export async function getShippingRate(rateId) {
  try {
    const { data } = await adminHttpService.get(shippingRateUrl(rateId));
    return data;
  } catch (err) {
    throw handleError(err, "Failed to fetch shipping rate");
  }
}

export async function saveShippingRate(rateData) {
  try {
    const { data } = await adminHttpService.post(shippingRatesPath, rateData);
    return data;
  } catch (err) {
    throw handleError(err, "Failed to create shipping rate");
  }
}

export async function updateShippingRate(rateId, rateData) {
  try {
    const { data } = await adminHttpService.put(
      shippingRateUrl(rateId),
      rateData
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to update shipping rate");
  }
}

export async function deleteShippingRate(rateId) {
  try {
    const { data } = await adminHttpService.delete(shippingRateUrl(rateId));
    return data;
  } catch (err) {
    throw handleError(err, "Failed to delete shipping rate");
  }
}

export async function bulkUpdateShippingRates(rates) {
  try {
    const { data } = await adminHttpService.put(`${shippingRatesPath}/bulk`, {
      rates,
    });
    return data;
  } catch (err) {
    throw handleError(err, "Failed to bulk update shipping rates");
  }
}

export async function bulkDeleteShippingRates(rateIds) {
  try {
    const { data } = await adminHttpService.post(
      `${shippingRatesPath}/bulk-delete`,
      { rateIds }
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to bulk delete shipping rates");
  }
}

export async function toggleShippingRateActive(rateId, isActive) {
  try {
    const { data } = await adminHttpService.patch(
      `${shippingRateUrl(rateId)}/toggle-active`,
      { isActive }
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to toggle rate status");
  }
}

export async function getShippingRatesByCarrier(carrier) {
  try {
    return await getAllShippingRates({ carrier });
  } catch (err) {
    throw handleError(err, "Failed to fetch shipping rates by carrier");
  }
}

export async function getShippingRatesByRegion(region) {
  try {
    // First, find zones matching the region
    const zones = await getAllShippingZones();
    const zone = zones.data?.find(
      (z) =>
        z.regions?.some((r) =>
          r.toLowerCase().includes(region.toLowerCase())
        ) || z.name.toLowerCase().includes(region.toLowerCase())
    );

    if (zone) {
      return await getAllShippingRates({ shippingZone: zone._id });
    }

    return {
      success: false,
      data: [],
      message: `No shipping rates found for region: ${region}`,
    };
  } catch (err) {
    throw handleError(err, "Failed to fetch shipping rates by region");
  }
}

export async function getAllShippingZones(params = {}) {
  try {
    const queryParams = new URLSearchParams();

    if (params.isActive !== undefined)
      queryParams.append("isActive", params.isActive);
    if (params.type) queryParams.append("type", params.type);
    if (params.country) queryParams.append("country", params.country);
    if (params.search) queryParams.append("search", params.search);

    const url = queryParams.toString()
      ? `${shippingZonesPath}?${queryParams.toString()}`
      : shippingZonesPath;

    const { data } = await adminHttpService.get(url);
    return data;
  } catch (err) {
    throw handleError(err, "Failed to fetch shipping zones");
  }
}

export async function getShippingZone(zoneId) {
  try {
    const { data } = await adminHttpService.get(shippingZoneUrl(zoneId));
    return data;
  } catch (err) {
    throw handleError(err, "Failed to fetch shipping zone");
  }
}

export async function saveShippingZone(zoneData) {
  try {
    const { data } = await adminHttpService.post(shippingZonesPath, zoneData);
    return data;
  } catch (err) {
    throw handleError(err, "Failed to create shipping zone");
  }
}

export async function updateShippingZone(zoneId, zoneData) {
  try {
    const { data } = await adminHttpService.put(
      shippingZoneUrl(zoneId),
      zoneData
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to update shipping zone");
  }
}

export async function deleteShippingZone(zoneId) {
  try {
    const { data } = await adminHttpService.delete(shippingZoneUrl(zoneId));
    return data;
  } catch (err) {
    throw handleError(err, "Failed to delete shipping zone");
  }
}

export async function bulkDeleteShippingZones(zoneIds) {
  try {
    const { data } = await adminHttpService.post(
      `${shippingZonesPath}/bulk-delete`,
      { zoneIds }
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to bulk delete shipping zones");
  }
}

export async function getShippingZonesByCountry(country) {
  try {
    return await getAllShippingZones({ country });
  } catch (err) {
    throw handleError(err, "Failed to fetch zones by country");
  }
}

export async function detectShippingZone(address) {
  try {
    const { data } = await publicHttpService.post(
      `${shippingZonesPath}/detect`,
      { address }
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to detect shipping zone");
  }
}

export async function calculateShippingRates(orderData, shippingAddress) {
  try {
    const { data } = await publicHttpService.post(
      `${shippingRatesPath}/calculate`,
      {
        orderData,
        shippingAddress,
      }
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to calculate shipping rates");
  }
}

export async function getUserShippingOptions(cartItems, shippingAddress) {
  try {
    const { data } = await userHttpService.post(
      `${shippingRatesPath}/options`,
      {
        items: cartItems,
        address: shippingAddress,
      }
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to get user shipping options");
  }
}

export async function estimateShippingCost(params) {
  try {
    const { data } = await publicHttpService.post(
      `${shippingRatesPath}/estimate`,
      params
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to estimate shipping cost");
  }
}

export async function compareShippingRates(orderData, addresses) {
  try {
    const { data } = await publicHttpService.post(
      `${shippingRatesPath}/compare`,
      {
        orderData,
        addresses,
      }
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to compare shipping rates");
  }
}

export async function calculateShipping(destination, items, weight = null) {
  try {
    const orderData = {
      items,
      weight:
        weight || items.reduce((sum, item) => sum + (item.weight || 0), 0),
      subtotal: items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      ),
      totalItems: items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    };

    return await calculateShippingRates(orderData, destination);
  } catch (err) {
    throw handleError(err, "Failed to calculate shipping");
  }
}

export async function validateAddress(address) {
  try {
    const { data } = await publicHttpService.post(
      `${shippingRatesPath}/validate-address`,
      { address }
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to validate address");
  }
}

export async function geocodeAddress(address) {
  try {
    const { data } = await publicHttpService.post(
      `${shippingRatesPath}/geocode`,
      { address }
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to geocode address");
  }
}

export async function reverseGeocodeAddress(latitude, longitude) {
  try {
    const { data } = await publicHttpService.post(
      `${shippingRatesPath}/reverse-geocode`,
      { latitude, longitude }
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to reverse geocode");
  }
}

export async function calculateDistance(origin, destination, unit = "km") {
  try {
    const { data } = await publicHttpService.post(
      `${shippingRatesPath}/calculate-distance`,
      { origin, destination, unit }
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to calculate distance");
  }
}

export async function getDeliveryEstimate(
  origin,
  destination,
  serviceLevel = "standard"
) {
  try {
    const { data } = await publicHttpService.post(
      `${shippingRatesPath}/delivery-estimate`,
      { origin, destination, serviceLevel }
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to get delivery estimate");
  }
}

export async function validateAndNormalizeAddress(address) {
  try {
    const validation = await validateAddress(address);

    if (validation.success && validation.normalizedAddress) {
      return {
        isValid: true,
        address: validation.normalizedAddress,
        suggestions: validation.suggestions || [],
      };
    }

    return {
      isValid: false,
      address: address,
      suggestions: validation.suggestions || [],
      errors: validation.errors || [],
    };
  } catch (err) {
    throw handleError(err, "Failed to validate and normalize address");
  }
}

export async function trackShipment(trackingNumber, carrier = null) {
  try {
    const url = carrier
      ? `${shippingRatesPath}/track/${trackingNumber}?carrier=${carrier}`
      : `${shippingRatesPath}/track/${trackingNumber}`;

    const { data } = await publicHttpService.get(url);
    return data;
  } catch (err) {
    throw handleError(err, "Failed to track shipment");
  }
}

export async function trackMultipleShipments(trackingNumbers) {
  try {
    const { data } = await publicHttpService.post(
      `${shippingRatesPath}/track/bulk`,
      { trackingNumbers }
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to track multiple shipments");
  }
}

export async function getTrackingHistory(trackingNumber) {
  try {
    const { data } = await publicHttpService.get(
      `${shippingRatesPath}/track/${trackingNumber}/history`
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to get tracking history");
  }
}

export async function subscribeToTrackingUpdates(
  trackingNumber,
  notificationChannel
) {
  try {
    const { data } = await userHttpService.post(
      `${shippingRatesPath}/track/${trackingNumber}/subscribe`,
      { notificationChannel }
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to subscribe to tracking updates");
  }
}

export async function getAllCarriers() {
  try {
    const { data } = await adminHttpService.get(shippingCarriersPath);
    return data;
  } catch (err) {
    throw handleError(err, "Failed to fetch carriers");
  }
}

export async function getCarrier(carrierId) {
  try {
    const { data } = await adminHttpService.get(shippingCarrierUrl(carrierId));
    return data;
  } catch (err) {
    throw handleError(err, "Failed to fetch carrier");
  }
}

export async function saveCarrier(carrierData) {
  try {
    const { data } = await adminHttpService.post(
      shippingCarriersPath,
      carrierData
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to create carrier");
  }
}

export async function updateCarrier(carrierId, carrierData) {
  try {
    const { data } = await adminHttpService.put(
      shippingCarrierUrl(carrierId),
      carrierData
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to update carrier");
  }
}

export async function deleteCarrier(carrierId) {
  try {
    const { data } = await adminHttpService.delete(
      shippingCarrierUrl(carrierId)
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to delete carrier");
  }
}

export async function testCarrierConnection(carrierId) {
  try {
    const { data } = await adminHttpService.post(
      `${shippingCarrierUrl(carrierId)}/test-connection`
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to test carrier connection");
  }
}

export async function clearShippingCaches() {
  try {
    const { data } = await adminHttpService.post(
      `${shippingRatesPath}/cache/clear`
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to clear shipping caches");
  }
}

export async function clearShippingCacheByType(cacheType) {
  try {
    const { data } = await adminHttpService.post(
      `${shippingRatesPath}/cache/clear/${cacheType}`
    );
    return data;
  } catch (err) {
    throw handleError(err, `Failed to clear ${cacheType} cache`);
  }
}

export async function getShippingCacheStats() {
  try {
    const { data } = await adminHttpService.get(
      `${shippingRatesPath}/cache/stats`
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to get cache stats");
  }
}

export async function warmupShippingCache(cacheTypes = []) {
  try {
    const { data } = await adminHttpService.post(
      `${shippingRatesPath}/cache/warmup`,
      { cacheTypes }
    );
    return data;
  } catch (err) {
    throw handleError(err, "Failed to warmup cache");
  }
}

export async function getShippingRates(params = {}) {
  return getAllShippingRates(params);
}

export async function getCheapestShippingOption(destination, items) {
  try {
    const result = await calculateShipping(destination, items);

    if (!result.success || !result.data || result.data.length === 0) {
      return null;
    }

    return result.data.reduce((cheapest, current) => {
      return (current.totalCost || 0) < (cheapest.totalCost || 0)
        ? current
        : cheapest;
    });
  } catch (err) {
    throw handleError(err, "Failed to get cheapest shipping option");
  }
}

export async function getFastestShippingOption(destination, items) {
  try {
    const result = await calculateShipping(destination, items);

    if (!result.success || !result.data || result.data.length === 0) {
      return null;
    }

    return result.data.reduce((fastest, current) => {
      const fastestDays = fastest.estimatedDays || Infinity;
      const currentDays = current.estimatedDays || Infinity;
      return currentDays < fastestDays ? current : fastest;
    });
  } catch (err) {
    throw handleError(err, "Failed to get fastest shipping option");
  }
}

export function isInternationalShipping(address, baseCountry = "US") {
  return address.country && address.country !== baseCountry;
}

export function formatShippingCost(cost, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(cost);
  } catch (error) {
    return `${currency} ${Number(cost).toFixed(2)}`;
  }
}

export function calculateTotalWeight(items) {
  return items.reduce((total, item) => {
    const itemWeight = item.weight || 0;
    const quantity = item.quantity || 1;
    return total + itemWeight * quantity;
  }, 0);
}

export function isFreeShippingEligible(orderTotal, threshold) {
  return orderTotal >= threshold;
}

export function groupShippingRatesByCarrier(rates) {
  return rates.reduce((grouped, rate) => {
    const carrier = rate.carrier || "Unknown";
    if (!grouped[carrier]) {
      grouped[carrier] = [];
    }
    grouped[carrier].push(rate);
    return grouped;
  }, {});
}

export function sortShippingRatesByPrice(rates, order = "asc") {
  return [...rates].sort((a, b) => {
    const priceA = a.totalCost || a.price || 0;
    const priceB = b.totalCost || b.price || 0;
    return order === "asc" ? priceA - priceB : priceB - priceA;
  });
}

export function sortShippingRatesByDeliveryTime(rates, order = "asc") {
  return [...rates].sort((a, b) => {
    const daysA = a.estimatedDays || a.deliveryDays || Infinity;
    const daysB = b.estimatedDays || b.deliveryDays || Infinity;
    return order === "asc" ? daysA - daysB : daysB - daysA;
  });
}

export function filterShippingRatesByPriceRange(rates, minPrice, maxPrice) {
  return rates.filter((rate) => {
    const price = rate.totalCost || rate.price || 0;
    return price >= minPrice && price <= maxPrice;
  });
}

export function filterShippingRatesByDeliveryTime(rates, minDays, maxDays) {
  return rates.filter((rate) => {
    const days = rate.estimatedDays || rate.deliveryDays || Infinity;
    return days >= minDays && days <= maxDays;
  });
}

export function getRecommendedShippingOption(rates, preferences = {}) {
  if (!rates || rates.length === 0) return null;

  const priority = preferences.priority || "balanced";

  if (priority === "price") {
    return sortShippingRatesByPrice(rates, "asc")[0];
  }

  if (priority === "speed") {
    return sortShippingRatesByDeliveryTime(rates, "asc")[0];
  }

  // Balanced approach: normalize price and delivery time, then score
  const normalizedRates = rates.map((rate) => {
    const price = rate.totalCost || rate.price || 0;
    const days = rate.estimatedDays || rate.deliveryDays || 0;

    // Simple scoring: lower is better
    const priceScore =
      price / Math.max(...rates.map((r) => r.totalCost || r.price || 1));
    const speedScore =
      days /
      Math.max(...rates.map((r) => r.estimatedDays || r.deliveryDays || 1));

    return {
      ...rate,
      score: (priceScore + speedScore) / 2,
    };
  });

  return normalizedRates.sort((a, b) => a.score - b.score)[0];
}

export async function getShippingComparison(destination, items) {
  try {
    const result = await calculateShipping(destination, items);

    if (!result.success || !result.data || result.data.length === 0) {
      return {
        success: false,
        message: "No shipping options available",
        data: null,
      };
    }

    const rates = result.data;

    return {
      success: true,
      data: {
        cheapest: sortShippingRatesByPrice(rates, "asc")[0],
        fastest: sortShippingRatesByDeliveryTime(rates, "asc")[0],
        recommended: getRecommendedShippingOption(rates),
        allOptions: rates,
      },
    };
  } catch (err) {
    throw handleError(err, "Failed to get shipping comparison");
  }
}

export function validateShippingRateData(rateData) {
  const errors = {};

  if (!rateData.name || rateData.name.trim() === "") {
    errors.name = "Rate name is required";
  }

  if (!rateData.pricingType) {
    errors.pricingType = "Pricing type is required";
  }

  if (rateData.baseRate === undefined || rateData.baseRate < 0) {
    errors.baseRate = "Base rate must be 0 or greater";
  }

  if (rateData.pricingType === "distance-based" && !rateData.ratePerMile) {
    errors.ratePerMile = "Rate per mile is required for distance-based pricing";
  }

  if (rateData.pricingType === "weight-based" && !rateData.ratePerKg) {
    errors.ratePerKg = "Rate per kg is required for weight-based pricing";
  }

  if (!rateData.isGlobal && !rateData.shippingZone && !rateData.storeLocation) {
    errors.location =
      "Either shipping zone or store location is required for non-global rates";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateShippingZoneData(zoneData) {
  const errors = {};

  if (!zoneData.name || zoneData.name.trim() === "") {
    errors.name = "Zone name is required";
  }

  if (!zoneData.type) {
    errors.type = "Zone type is required";
  }

  if (!zoneData.countries || zoneData.countries.length === 0) {
    errors.countries = "At least one country is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function parseTrackingNumber(trackingNumber) {
  const patterns = {
    ups: /^1Z[A-Z0-9]{16}$/,
    fedex: /^[0-9]{12,14}$/,
    usps: /^(94|93|92|94|95)[0-9]{20}$/,
    dhl: /^[0-9]{10,11}$/,
  };

  for (const [carrier, pattern] of Object.entries(patterns)) {
    if (pattern.test(trackingNumber)) {
      return { carrier, trackingNumber, isValid: true };
    }
  }

  return { carrier: null, trackingNumber, isValid: false };
}

export function formatTrackingStatus(status) {
  const statusMap = {
    pending: "Pending",
    picked_up: "Picked Up",
    in_transit: "In Transit",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    failed: "Delivery Failed",
    returned: "Returned to Sender",
    cancelled: "Cancelled",
  };

  return statusMap[status] || status;
}

export function calculateEstimatedDeliveryDate(
  estimatedDays,
  shipDate = new Date()
) {
  const earliest = new Date(shipDate);
  earliest.setDate(earliest.getDate() + estimatedDays);

  const latest = new Date(shipDate);
  latest.setDate(latest.getDate() + estimatedDays + 1);

  return {
    earliest: earliest.toLocaleDateString(),
    latest: latest.toLocaleDateString(),
    estimatedDays,
  };
}

export function isBusinessDay(date) {
  const day = date.getDay();
  return day !== 0 && day !== 6; // Not Sunday (0) or Saturday (6)
}

export function calculateBusinessDays(startDate, endDate) {
  let count = 0;
  const current = new Date(startDate);

  while (current <= endDate) {
    if (isBusinessDay(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

export function getShippingRateStatistics(rates) {
  if (!rates || rates.length === 0) {
    return {
      count: 0,
      averagePrice: 0,
      minPrice: 0,
      maxPrice: 0,
      averageDeliveryDays: 0,
    };
  }

  const prices = rates.map((r) => r.totalCost || r.price || 0);
  const deliveryDays = rates
    .map((r) => r.estimatedDays || r.deliveryDays || 0)
    .filter((d) => d > 0);

  return {
    count: rates.length,
    averagePrice: prices.reduce((a, b) => a + b, 0) / prices.length,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    averageDeliveryDays:
      deliveryDays.length > 0
        ? deliveryDays.reduce((a, b) => a + b, 0) / deliveryDays.length
        : 0,
  };
}

export async function batchCalculateShipping(orders) {
  try {
    const calculations = orders.map((order) =>
      calculateShipping(order.destination, order.items, order.weight).catch(
        (err) => ({
          success: false,
          error: err.message,
          orderId: order.id,
        })
      )
    );

    return await Promise.all(calculations);
  } catch (err) {
    throw handleError(err, "Failed to batch calculate shipping");
  }
}

export function generateShippingLabelData(shipment) {
  return {
    trackingNumber: shipment.trackingNumber,
    carrier: shipment.carrier,
    serviceLevel: shipment.serviceLevel,
    from: shipment.origin,
    to: shipment.destination,
    packageDetails: {
      weight: shipment.weight,
      dimensions: shipment.dimensions,
      description: shipment.description,
    },
    shipDate: shipment.shipDate || new Date().toISOString(),
    estimatedDelivery: shipment.estimatedDelivery,
    barcode: shipment.trackingNumber,
  };
}

export function calculateDimensionalWeight(dimensions, divisor = 139) {
  if (
    !dimensions ||
    !dimensions.length ||
    !dimensions.width ||
    !dimensions.height
  ) {
    return 0;
  }

  const { length, width, height } = dimensions;
  return (length * width * height) / divisor;
}

export function calculateBillableWeight(actualWeight, dimensions) {
  const dimWeight = calculateDimensionalWeight(dimensions);
  return Math.max(actualWeight, dimWeight);
}
