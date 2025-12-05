import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/admin';
import type {
  DashboardStats,
  AIModel,
  RealtimeUsageData,
  SystemAlert
} from '../types/admin';

/**
 * Custom hook for fetching admin dashboard data
 */
export const useAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [aiUsage, setAIUsage] = useState<AIModel[]>([]);
  const [realtimeUsage, setRealtimeUsage] = useState<RealtimeUsageData | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true); // Track if this is the first load
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      // Only show loading spinner on initial load, not on auto-refresh
      if (initialLoad) {
        setLoading(true);
      }
      setError(null);

      console.log('🔄 Fetching admin dashboard data...');

      // Fetch all dashboard data in parallel
      const [statsRes, aiUsageRes, realtimeRes, alertsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAIUsage(),
        adminService.getRealtimeUsage(),
        adminService.getSystemAlerts()
      ]);

      console.log('📊 Dashboard Stats Response:', statsRes);
      console.log('🤖 AI Usage Response:', aiUsageRes);
      console.log('⚡ Realtime Usage Response:', realtimeRes);
      console.log('🚨 Alerts Response:', alertsRes);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      } else {
        console.error('❌ Stats failed:', statsRes.message);
      }

      if (aiUsageRes.success && aiUsageRes.data) {
        setAIUsage(aiUsageRes.data);
      } else {
        console.error('❌ AI Usage failed:', aiUsageRes.message);
      }

      if (realtimeRes.success && realtimeRes.data) {
        setRealtimeUsage(realtimeRes.data);
      } else {
        console.error('❌ Realtime Usage failed:', realtimeRes.message);
      }

      if (alertsRes.success && alertsRes.data) {
        setAlerts(alertsRes.data);
      } else {
        console.error('❌ Alerts failed:', alertsRes.message);
      }

    } catch (err: any) {
      console.error('❌ Dashboard fetch error:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
      setInitialLoad(false); 
    }
  }, [initialLoad]);

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []); 

  return {
    stats,
    aiUsage,
    realtimeUsage,
    alerts,
    loading,
    error,
    refresh: fetchDashboardData
  };
};

/**
 * Custom hook for fetching realtime usage with timeframe selection
 */
export const useRealtimeUsage = (initialTimeframe: string = 'week') => {
  const [data, setData] = useState<RealtimeUsageData | null>(null);
  const [timeframe, setTimeframe] = useState(initialTimeframe);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getRealtimeUsage(timeframe);

      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Failed to fetch realtime usage');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch realtime usage');
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    timeframe,
    setTimeframe,
    loading,
    error,
    refresh: fetchData
  };
};
