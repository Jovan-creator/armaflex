// IndexedDB utility for offline data storage
class OfflineStorage {
  private dbName = 'ArmafleXHotelDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  // Store names for different types of offline data
  private stores = {
    reservations: 'offline_reservations',
    serviceRequests: 'offline_service_requests',
    profileUpdates: 'offline_profile_updates',
    cachedData: 'cached_data',
    settings: 'app_settings',
  };

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create stores if they don't exist
        Object.values(this.stores).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { 
              keyPath: 'id', 
              autoIncrement: true 
            });
            
            // Add indexes for common queries
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('type', 'type', { unique: false });
            store.createIndex('synced', 'synced', { unique: false });
          }
        });
      };
    });
  }

  // Generic method to store data
  async store(storeName: keyof typeof this.stores, data: any): Promise<number> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores[storeName]], 'readwrite');
      const store = transaction.objectStore(this.stores[storeName]);
      
      const item = {
        ...data,
        timestamp: new Date().toISOString(),
        synced: false,
        id: Date.now() + Math.random(), // Simple ID generation
      };

      const request = store.add(item);

      request.onsuccess = () => {
        console.log(`Stored offline data in ${storeName}:`, item.id);
        resolve(request.result as number);
      };

      request.onerror = () => {
        console.error(`Failed to store offline data in ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  // Get all items from a store
  async getAll(storeName: keyof typeof this.stores): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores[storeName]], 'readonly');
      const store = transaction.objectStore(this.stores[storeName]);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`Failed to get data from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  // Get unsynced items
  async getUnsynced(storeName: keyof typeof this.stores): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores[storeName]], 'readonly');
      const store = transaction.objectStore(this.stores[storeName]);
      const index = store.index('synced');
      const request = index.getAll(false);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`Failed to get unsynced data from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  // Mark item as synced
  async markSynced(storeName: keyof typeof this.stores, id: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores[storeName]], 'readwrite');
      const store = transaction.objectStore(this.stores[storeName]);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.synced = true;
          item.syncedAt = new Date().toISOString();
          
          const putRequest = store.put(item);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve(); // Item doesn't exist, consider it synced
        }
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    });
  }

  // Remove item
  async remove(storeName: keyof typeof this.stores, id: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores[storeName]], 'readwrite');
      const store = transaction.objectStore(this.stores[storeName]);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log(`Removed item from ${storeName}:`, id);
        resolve();
      };

      request.onerror = () => {
        console.error(`Failed to remove item from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  // Clear all data from a store
  async clear(storeName: keyof typeof this.stores): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores[storeName]], 'readwrite');
      const store = transaction.objectStore(this.stores[storeName]);
      const request = store.clear();

      request.onsuccess = () => {
        console.log(`Cleared all data from ${storeName}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`Failed to clear ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  // Store cached API response
  async cacheApiResponse(url: string, data: any, ttl: number = 3600000): Promise<void> { // Default 1 hour TTL
    const cacheItem = {
      url,
      data,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + ttl).toISOString(),
      type: 'api_cache',
    };

    await this.store('cachedData', cacheItem);
  }

  // Get cached API response
  async getCachedApiResponse(url: string): Promise<any | null> {
    const allCached = await this.getAll('cachedData');
    const cached = allCached.find(item => item.url === url && item.type === 'api_cache');
    
    if (!cached) return null;
    
    // Check if expired
    if (new Date() > new Date(cached.expiresAt)) {
      await this.remove('cachedData', cached.id);
      return null;
    }
    
    return cached.data;
  }

  // Store app settings
  async storeSetting(key: string, value: any): Promise<void> {
    const setting = {
      key,
      value,
      type: 'app_setting',
    };

    // Remove existing setting with same key
    const existing = await this.getSetting(key);
    if (existing) {
      await this.remove('settings', existing.id);
    }

    await this.store('settings', setting);
  }

  // Get app setting
  async getSetting(key: string): Promise<any | null> {
    const allSettings = await this.getAll('settings');
    const setting = allSettings.find(item => item.key === key && item.type === 'app_setting');
    return setting ? setting.value : null;
  }

  // Check if we have offline data pending sync
  async hasPendingSync(): Promise<boolean> {
    const stores: (keyof typeof this.stores)[] = ['reservations', 'serviceRequests', 'profileUpdates'];
    
    for (const storeName of stores) {
      const unsynced = await this.getUnsynced(storeName);
      if (unsynced.length > 0) {
        return true;
      }
    }
    
    return false;
  }

  // Get total size of offline data (approximate)
  async getStorageSize(): Promise<number> {
    let totalSize = 0;
    
    for (const storeName of Object.keys(this.stores) as (keyof typeof this.stores)[]) {
      const data = await this.getAll(storeName);
      totalSize += JSON.stringify(data).length;
    }
    
    return totalSize;
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorage();

// Convenience methods for specific operations
export const offlineOperations = {
  // Store offline reservation
  storeOfflineReservation: async (reservationData: any) => {
    return offlineStorage.store('reservations', {
      type: 'reservation',
      data: reservationData,
    });
  },

  // Store offline service request
  storeOfflineServiceRequest: async (serviceData: any) => {
    return offlineStorage.store('serviceRequests', {
      type: 'service_request', 
      data: serviceData,
    });
  },

  // Store offline profile update
  storeOfflineProfileUpdate: async (profileData: any) => {
    return offlineStorage.store('profileUpdates', {
      type: 'profile_update',
      data: profileData,
    });
  },

  // Get all pending operations for display
  getPendingOperations: async () => {
    const [reservations, serviceRequests, profileUpdates] = await Promise.all([
      offlineStorage.getUnsynced('reservations'),
      offlineStorage.getUnsynced('serviceRequests'),
      offlineStorage.getUnsynced('profileUpdates'),
    ]);

    return {
      reservations,
      serviceRequests,
      profileUpdates,
      total: reservations.length + serviceRequests.length + profileUpdates.length,
    };
  },
};
