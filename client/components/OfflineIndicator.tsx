import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { offlineOperations } from '@/utils/offlineStorage';
import {
  Wifi,
  WifiOff,
  Cloud,
  CloudOff,
  Sync,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  X,
} from 'lucide-react';

// Hook for network status detection
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      console.log('Network: Back online');
      setIsOnline(true);
      setWasOffline(true);
      
      // Trigger background sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
          registration.sync.register('offline-data-sync');
        });
      }
      
      // Clear offline flag after a short delay
      setTimeout(() => setWasOffline(false), 3000);
    };

    const handleOffline = () => {
      console.log('Network: Gone offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}

interface OfflineIndicatorProps {
  position?: 'top' | 'bottom';
  compact?: boolean;
}

export function OfflineIndicator({ position = 'top', compact = false }: OfflineIndicatorProps) {
  const { t } = useTranslation();
  const { isOnline, wasOffline } = useNetworkStatus();
  const [pendingOperations, setPendingOperations] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Load pending operations when going offline or on mount
    if (!isOnline) {
      loadPendingOperations();
    }
  }, [isOnline]);

  const loadPendingOperations = async () => {
    try {
      const operations = await offlineOperations.getPendingOperations();
      setPendingOperations(operations);
    } catch (error) {
      console.error('Failed to load pending operations:', error);
    }
  };

  const retrySync = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('manual-sync');
        loadPendingOperations(); // Refresh pending operations
      } catch (error) {
        console.error('Manual sync failed:', error);
      }
    }
  };

  // Don't show anything if online and no recent offline state
  if (isOnline && !wasOffline && !pendingOperations?.total) {
    return null;
  }

  const positionClasses = position === 'top' 
    ? 'top-4 left-1/2 transform -translate-x-1/2' 
    : 'bottom-4 right-4';

  return (
    <div className={`fixed ${positionClasses} z-50 max-w-sm`}>
      {/* Offline Status Alert */}
      {!isOnline && (
        <Alert className="mb-2 border-red-200 bg-red-50">
          <WifiOff className="h-4 w-4 text-red-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-medium text-red-800">
                {t('messages.connectionError', 'Connection Error')}
              </span>
              <p className="text-xs text-red-600 mt-1">
                You're working offline. Changes will sync when connection is restored.
              </p>
            </div>
            {pendingOperations?.total > 0 && (
              <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2">
                    <Database className="h-3 w-3 mr-1" />
                    {pendingOperations.total}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Pending Offline Changes</DialogTitle>
                  </DialogHeader>
                  <OfflineDataDetails 
                    pendingOperations={pendingOperations} 
                    onRetry={retrySync}
                  />
                </DialogContent>
              </Dialog>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Back Online Notification */}
      {wasOffline && isOnline && (
        <Alert className="mb-2 border-green-200 bg-green-50">
          <Wifi className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <span className="font-medium text-green-800">
              Connection restored!
            </span>
            <p className="text-xs text-green-600 mt-1">
              Syncing your offline changes...
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Pending Operations Indicator (when online but have pending data) */}
      {isOnline && pendingOperations?.total > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sync className="h-4 w-4 text-yellow-600 animate-spin" />
                <span className="text-sm font-medium text-yellow-800">
                  Syncing {pendingOperations.total} changes...
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={retrySync}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Detailed view of pending offline operations
function OfflineDataDetails({ 
  pendingOperations, 
  onRetry 
}: { 
  pendingOperations: any; 
  onRetry: () => void;
}) {
  const { t } = useTranslation();

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'reservation':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'service_request':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'profile_update':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Database className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          {pendingOperations.total} pending changes
        </Badge>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <Sync className="h-3 w-3 mr-1" />
          Retry Sync
        </Button>
      </div>

      {/* Reservations */}
      {pendingOperations.reservations.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2">Reservations ({pendingOperations.reservations.length})</h4>
          <div className="space-y-2">
            {pendingOperations.reservations.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  {getOperationIcon(item.type)}
                  <span className="text-sm">New reservation</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(item.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Requests */}
      {pendingOperations.serviceRequests.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2">Service Requests ({pendingOperations.serviceRequests.length})</h4>
          <div className="space-y-2">
            {pendingOperations.serviceRequests.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  {getOperationIcon(item.type)}
                  <span className="text-sm">Service request</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(item.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Updates */}
      {pendingOperations.profileUpdates.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2">Profile Updates ({pendingOperations.profileUpdates.length})</h4>
          <div className="space-y-2">
            {pendingOperations.profileUpdates.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  {getOperationIcon(item.type)}
                  <span className="text-sm">Profile update</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(item.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 pt-2 border-t">
        These changes were made while offline and will be synchronized when your connection is restored.
      </div>
    </div>
  );
}

// PWA Install Prompt Component
export function PWAInstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Cloud className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Install App</h4>
              <p className="text-sm text-blue-700 mt-1">
                Install Armaflex Hotel for offline access and a better experience.
              </p>
              <div className="flex space-x-2 mt-3">
                <Button size="sm" onClick={handleInstallClick}>
                  Install
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowInstallPrompt(false)}
                >
                  Later
                </Button>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowInstallPrompt(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
