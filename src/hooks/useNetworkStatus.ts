import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
  connectionType: string | null;
  effectiveType: string | null;
  downlink: number | null;
  rtt: number | null;
}

export function useNetworkStatus(showToasts = true) {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    wasOffline: false,
    connectionType: null,
    effectiveType: null,
    downlink: null,
    rtt: null,
  });

  const updateNetworkInfo = useCallback(() => {
    const connection = (navigator as any).connection || 
                       (navigator as any).mozConnection || 
                       (navigator as any).webkitConnection;

    setStatus(prev => ({
      ...prev,
      connectionType: connection?.type || null,
      effectiveType: connection?.effectiveType || null,
      downlink: connection?.downlink || null,
      rtt: connection?.rtt || null,
    }));
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      if (showToasts) {
        toast.success('Back online', {
          description: 'Your connection has been restored.',
        });
      }
      updateNetworkInfo();
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false, wasOffline: true }));
      if (showToasts) {
        toast.warning('You are offline', {
          description: 'Some features may be unavailable.',
          duration: Infinity,
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for connection changes
    const connection = (navigator as any).connection || 
                       (navigator as any).mozConnection || 
                       (navigator as any).webkitConnection;

    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
      updateNetworkInfo();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, [showToasts, updateNetworkInfo]);

  const isSlowConnection = useCallback(() => {
    if (!status.effectiveType) return false;
    return ['slow-2g', '2g'].includes(status.effectiveType);
  }, [status.effectiveType]);

  return {
    ...status,
    isSlowConnection: isSlowConnection(),
  };
}

export default useNetworkStatus;
