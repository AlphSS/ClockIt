import { useState, useEffect, useCallback, useRef } from "react";
import { fetchStays } from "../services/staysApi";
import { buildFilterQuery } from "../utils/stayHelpers";

const DEFAULT_FILTERS = {
  search: "",
  location: "",
  minPrice: "",
  maxPrice: "",
  bhk: "any",
  furnishing: "all",
  propertyType: "all",
  occupancy: "any",
  gender: "any",
  maxDistance: "",
  bathrooms: "any",
  amenities: [],
  sort: "recommended",
};

export function useStays(initialFilters = {}) {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initialFilters });
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const debounceRef = useRef(null);

  const load = useCallback(async (currentFilters, currentPage, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const params = buildFilterQuery(currentFilters);
      params.page = currentPage;
      params.limit = 12;

      const res = await fetchStays(params);
      setStays((prev) => (append ? [...prev, ...(res.data || [])] : res.data || []));
      setHasMore(res.pagination?.hasMore || false);
      setTotal(res.pagination?.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced refetch whenever filters change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      load(filters, 1, false);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [filters, load]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    load(filters, nextPage, true);
  }, [filters, page, load]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    stays,
    loading,
    error,
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    loadMore,
    hasMore,
    total,
    page,
  };
}
