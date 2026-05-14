import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/admin';
import type {
  DashboardStats
} from '../types/admin';

/**
 * Custom hook for fetching admin dashboard data
 */
export const useAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const statsRes = await adminService.getDashboardStats();

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      } else {
        setError(statsRes.message || "Failed to fetch dashboard stats");
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]); 

  return {
    stats,
    loading,
    error,
    refresh: fetchDashboardData
  };
};
