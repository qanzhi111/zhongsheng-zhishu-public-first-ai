import { useState, useEffect, useCallback } from 'react';

/**
 * 数据获取Hook
 * @param {Function} apiFunction - API调用函数
 * @param {Array} params - API函数参数
 * @returns {Object} { data, loading, error, refetch }
 */
const useApi = (apiFunction, params = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...params);
      setData(result);
    } catch (err) {
      setError(err.message || '获取数据失败');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useApi;
