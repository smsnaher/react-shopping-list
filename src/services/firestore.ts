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
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Item, ChildItem } from '../data/items';

// Collection names
const ITEMS_COLLECTION = 'shopping-items';

// Firestore document interface
export interface FirestoreItem extends Omit<Item, 'id'> {
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Database operations for shopping items
export class FirestoreService {
  
  // Get all items for a user
  static async getUserItems(userId: string): Promise<Item[]> {
    try {
      const itemsRef = collection(db, ITEMS_COLLECTION);
      const q = query(
        itemsRef,
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const items: Item[] = [];
      
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
      
      return items;
    } catch (error) {
      console.error('Error fetching user items:', error);
      throw error;
    }
  }

  // Get a single item by ID
  static async getItemById(itemId: string, userId: string): Promise<Item | null> {
    try {
      const itemRef = doc(db, ITEMS_COLLECTION, itemId);
      const itemSnap = await getDoc(itemRef);
      
      if (itemSnap.exists()) {
        const data = itemSnap.data() as FirestoreItem;
        // Verify this item belongs to the user
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

  // Create a new item
  static async createItem(item: Omit<Item, 'id'>, userId: string): Promise<string> {
    try {
      const now = Timestamp.now();
      const firestoreItem: FirestoreItem = {
        ...item,
        userId,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, ITEMS_COLLECTION), firestoreItem);
      return docRef.id;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }

  // Update an existing item
  static async updateItem(itemId: string, updates: Partial<Omit<Item, 'id'>>, userId: string): Promise<void> {
    try {
      const itemRef = doc(db, ITEMS_COLLECTION, itemId);
      
      // First verify the item belongs to the user
      const itemSnap = await getDoc(itemRef);
      if (!itemSnap.exists()) {
        throw new Error('Item not found');
      }
      
      const data = itemSnap.data() as FirestoreItem;
      if (data.userId !== userId) {
        throw new Error('Unauthorized access to item');
      }
      
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  // Delete an item
  static async deleteItem(itemId: string, userId: string): Promise<void> {
    try {
      const itemRef = doc(db, ITEMS_COLLECTION, itemId);
      
      // First verify the item belongs to the user
      const itemSnap = await getDoc(itemRef);
      if (!itemSnap.exists()) {
        throw new Error('Item not found');
      }
      
      const data = itemSnap.data() as FirestoreItem;
      if (data.userId !== userId) {
        throw new Error('Unauthorized access to item');
      }
      
      await deleteDoc(itemRef);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  // Add a child item to an existing item
  static async addChildItem(itemId: string, childItem: ChildItem, userId: string): Promise<void> {
    try {
      const item = await this.getItemById(itemId, userId);
      if (!item) {
        throw new Error('Parent item not found');
      }

      const updatedChildItems = [...(item.childItems || []), childItem];
      await this.updateItem(itemId, { childItems: updatedChildItems }, userId);
    } catch (error) {
      console.error('Error adding child item:', error);
      throw error;
    }
  }

  // Remove a child item from an existing item
  static async removeChildItem(itemId: string, childItemId: string, userId: string): Promise<void> {
    try {
      const item = await this.getItemById(itemId, userId);
      if (!item) {
        throw new Error('Parent item not found');
      }

      const updatedChildItems = (item.childItems || []).filter((child: ChildItem) => child.id !== childItemId);
      await this.updateItem(itemId, { childItems: updatedChildItems }, userId);
    } catch (error) {
      console.error('Error removing child item:', error);
      throw error;
    }
  }
}
