import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { ListItem, ChildItem } from '../data/items';

// Collection names
const ITEMS_COLLECTION = 'shopping-items';

// In-memory cache
const itemsCache = new Map<string, ListItem[]>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cacheTimestamps = new Map<string, number>();

// Firestore document interface
export interface FirestoreItem extends Omit<ListItem, 'id'> {
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Local storage utilities for offline support
const getLocalStorageKey = (userId: string) => `firestore-cache-${userId}`;

const saveToLocalStorage = (userId: string, items: ListItem[]) => {
  try {
    localStorage.setItem(getLocalStorageKey(userId), JSON.stringify({
      items,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

const loadFromLocalStorage = (userId: string): ListItem[] | null => {
  try {
    const stored = localStorage.getItem(getLocalStorageKey(userId));
    if (stored) {
      const data = JSON.parse(stored);
      // Return cached data if it's less than 1 hour old
      if (Date.now() - data.timestamp < 60 * 60 * 1000) {
        return data.items;
      }
    }
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
  }
  return null;
};

// Database operations for shopping items
export class FirestoreService {
  
  // Check if cache is valid
  private static isCacheValid(userId: string): boolean {
    const timestamp = cacheTimestamps.get(userId);
    return timestamp ? (Date.now() - timestamp) < CACHE_DURATION : false;
  }

  // Get all items for a user with caching and fallbacks
  static async getUserItems(userId: string, useCache: boolean = true): Promise<ListItem[]> {
    // 1. Return from memory cache if valid
    if (useCache && this.isCacheValid(userId) && itemsCache.has(userId)) {
      console.log('📋 Returning items from memory cache');
      return itemsCache.get(userId)!;
    }

    // 2. Try to return from localStorage while fetching from Firestore
    const cachedItems = loadFromLocalStorage(userId);
    if (cachedItems && useCache) {
      console.log('💾 Returning items from localStorage cache');
      // Return cached data immediately, but also fetch fresh data in background
      this.fetchFreshData(userId);
      return cachedItems;
    }

    // 3. Fetch from Firestore
    return this.fetchFreshData(userId);
  }

  // Fetch fresh data from Firestore
  private static async fetchFreshData(userId: string): Promise<ListItem[]> {
    try {
      console.log('🔥 Fetching fresh data from Firestore');
      const itemsRef = collection(db, ITEMS_COLLECTION);
      const q = query(itemsRef, where('userId', '==', userId));
      
      const querySnapshot = await getDocs(q);
      const items: ListItem[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreItem;
        items.push({
          id: doc.id,
          name: data.name,
          quantity: data.quantity,
          description: data.description,
          childItems: data.childItems || []
        });
      });
      
      // Update caches
      itemsCache.set(userId, items);
      cacheTimestamps.set(userId, Date.now());
      saveToLocalStorage(userId, items);
      
      return items;
    } catch (error) {
      console.error('Error fetching user items:', error);
      
      // If online fetch fails, try localStorage as last resort
      const fallbackItems = loadFromLocalStorage(userId);
      if (fallbackItems) {
        console.log('⚠️ Using fallback data from localStorage');
        return fallbackItems;
      }
      
      throw error;
    }
  }

  // Set up real-time listener for items
  static setupRealtimeListener(userId: string, callback: (items: ListItem[]) => void): () => void {
    const itemsRef = collection(db, ITEMS_COLLECTION);
    const q = query(itemsRef, where('userId', '==', userId));
    
    return onSnapshot(q, (querySnapshot) => {
      const items: ListItem[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreItem;
        items.push({
          id: doc.id,
          name: data.name,
          quantity: data.quantity,
          description: data.description,
          childItems: data.childItems || []
        });
      });
      
      // Update caches
      itemsCache.set(userId, items);
      cacheTimestamps.set(userId, Date.now());
      saveToLocalStorage(userId, items);
      
      callback(items);
    }, (error) => {
      console.error('Real-time listener error:', error);
    });
  }

  // Get a single item by ID with caching
  static async getItemById(itemId: string, userId: string): Promise<ListItem | null> {
    try {
      // First check if we have it in cache
      const cachedItems = itemsCache.get(userId);
      if (cachedItems && this.isCacheValid(userId)) {
        const cachedItem = cachedItems.find(item => item.id === itemId);
        if (cachedItem) {
          console.log('📋 Returning item from cache');
          return cachedItem;
        }
      }

      // Fetch from Firestore
      const itemRef = doc(db, ITEMS_COLLECTION, itemId);
      const itemSnap = await getDoc(itemRef);
      
      if (itemSnap.exists()) {
        const data = itemSnap.data() as FirestoreItem;
        if (data.userId !== userId) {
          throw new Error('Unauthorized access to item');
        }
        
        return {
          id: itemSnap.id,
          name: data.name,
          quantity: data.quantity,
          description: data.description,
          childItems: data.childItems || []
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  }

  // Create a new item with optimistic updates
  static async createItem(item: Omit<ListItem, 'id'>, userId: string): Promise<string> {
    // Generate temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticItem: ListItem = { ...item, id: tempId };
    
    try {
      // Add to cache immediately for instant UI update
      const cachedItems = itemsCache.get(userId) || [];
      const updatedItems = [optimisticItem, ...cachedItems];
      itemsCache.set(userId, updatedItems);
      
      // Create in Firestore
      const now = Timestamp.now();
      const firestoreItem: FirestoreItem = {
        ...item,
        userId,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, ITEMS_COLLECTION), firestoreItem);
      
      // Replace temporary item with real one
      const finalItems = updatedItems.map(i => 
        i.id === tempId ? { ...i, id: docRef.id } : i
      );
      itemsCache.set(userId, finalItems);
      saveToLocalStorage(userId, finalItems);
      
      return docRef.id;
    } catch (error) {
      // Remove optimistic update on error
      const cachedItems = itemsCache.get(userId) || [];
      const rollbackItems = cachedItems.filter(i => i.id !== tempId);
      itemsCache.set(userId, rollbackItems);
      
      console.error('Error creating item:', error);
      throw error;
    }
  }

  // Delete an item with optimistic updates
  static async deleteItem(itemId: string, userId: string): Promise<void> {
    // Store the item before deleting for potential rollback
    const cachedItems = itemsCache.get(userId) || [];
    const deletedItem = cachedItems.find(item => item.id === itemId);
    
    try {
      // Remove from cache immediately for instant UI update
      const optimisticItems = cachedItems.filter(item => item.id !== itemId);
      itemsCache.set(userId, optimisticItems);
      
      // Delete from Firestore
      const itemRef = doc(db, ITEMS_COLLECTION, itemId);
      await deleteDoc(itemRef);
      
      // Update localStorage
      saveToLocalStorage(userId, optimisticItems);
    } catch (error) {
      // Restore item on error
      if (deletedItem) {
        const currentItems = itemsCache.get(userId) || [];
        itemsCache.set(userId, [...currentItems, deletedItem]);
      }
      
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  // Add a child item with optimistic updates
  static async addChildItem(itemId: string, childItem: ChildItem, userId: string): Promise<void> {
    try {
      // Update cache immediately
      const cachedItems = itemsCache.get(userId) || [];
      const updatedItems = cachedItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            childItems: [...(item.childItems || []), childItem]
          };
        }
        return item;
      });
      
      itemsCache.set(userId, updatedItems);
      
      // Update Firestore
      const item = await this.getItemById(itemId, userId);
      if (!item) throw new Error('Parent item not found');

      const updatedChildItems = [...(item.childItems || []), childItem];
      await this.updateItem(itemId, { childItems: updatedChildItems });
      
      // Update localStorage
      saveToLocalStorage(userId, updatedItems);
    } catch (error) {
      // Rollback on error
      await this.getUserItems(userId, false); // Force refresh from server
      console.error('Error adding child item:', error);
      throw error;
    }
  }

  // Remove a child item with optimistic updates
  static async removeChildItem(itemId: string, childItemId: string, userId: string): Promise<void> {
    try {
      // Update cache immediately
      const cachedItems = itemsCache.get(userId) || [];
      const updatedItems = cachedItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            childItems: (item.childItems || []).filter(child => child.id !== childItemId)
          };
        }
        return item;
      });
      
      itemsCache.set(userId, updatedItems);
      
      // Update Firestore
      const item = await this.getItemById(itemId, userId);
      if (!item) throw new Error('Parent item not found');

      const updatedChildItems = (item.childItems || []).filter((child: ChildItem) => child.id !== childItemId);
      await this.updateItem(itemId, { childItems: updatedChildItems });
      
      // Update localStorage
      saveToLocalStorage(userId, updatedItems);
    } catch (error) {
      // Rollback on error
      await this.getUserItems(userId, false); // Force refresh from server
      console.error('Error removing child item:', error);
      throw error;
    }
  }

  // Update a specific child item within a parent item
  static async updateChildItem(itemId: string, childItemId: string, updates: Partial<ChildItem>, userId: string): Promise<void> {
    try {
      const item = await this.getItemById(itemId, userId);
      if (!item) {
        throw new Error('Parent item not found');
      }

      const updatedChildItems = (item.childItems || []).map((child: ChildItem) => 
        child.id === childItemId ? { ...child, ...updates } : child
      );

      await this.updateItem(itemId, { childItems: updatedChildItems });
    } catch (error) {
      console.error('Error updating child item:', error);
      throw error;
    }
  }

  // Update an existing item
  static async updateItem(itemId: string, updates: Partial<Omit<ListItem, 'id'>>): Promise<void> {
    try {
      const itemRef = doc(db, ITEMS_COLLECTION, itemId);
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  // Clear cache (useful for logout)
  static clearCache(userId: string): void {
    itemsCache.delete(userId);
    cacheTimestamps.delete(userId);
    localStorage.removeItem(getLocalStorageKey(userId));
  }

  // Preload data (call this early in app lifecycle)
  static async preloadUserData(userId: string): Promise<void> {
    try {
      await this.getUserItems(userId, false);
    } catch (error) {
      console.warn('Failed to preload user data:', error);
    }
  }
}
