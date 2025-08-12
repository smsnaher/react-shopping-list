export interface ChildItem {
  id: string
  title: string
  price: number
}

export interface Item {
  id: string
  name: string
  quantity: number
  description?: string
  childItems?: ChildItem[]
}

export const items: Item[] = [
  { 
    id: 'apples', 
    name: 'Apples', 
    quantity: 2, 
    description: 'Fresh red apples, perfect for snacking or baking.',
    childItems: []
  },
  { 
    id: 'bananas', 
    name: 'Bananas', 
    quantity: 5, 
    description: 'Ripe yellow bananas, great for smoothies and breakfast.',
    childItems: []
  },
  { 
    id: 'oranges', 
    name: 'Oranges', 
    quantity: 3, 
    description: 'Juicy oranges packed with vitamin C.',
    childItems: []
  },
]

export const getItemById = (id: string): Item | undefined => {
  return items.find(item => item.id === id)
}

export const getItemName = (id: string): string => {
  const item = getItemById(id)
  return item ? item.name : id.charAt(0).toUpperCase() + id.slice(1)
}

export const generateItemId = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()
}

export const generateChildItemId = (title: string): string => {
  return 'child-' + title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()
}

// localStorage utilities
const STORAGE_KEY = 'shopping-list-items'

export const loadItemsFromStorage = (): Item[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading items from localStorage:', error)
  }
  return items // Return default items if nothing in storage or error
}

export const saveItemsToStorage = (itemsToSave: Item[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsToSave))
  } catch (error) {
    console.error('Error saving items to localStorage:', error)
  }
}

export const getItemByIdFromList = (id: string, itemsList: Item[]): Item | undefined => {
  return itemsList.find(item => item.id === id)
}

export const updateItemInStorage = (updatedItem: Item): void => {
  try {
    const items = loadItemsFromStorage()
    const updatedItems = items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    )
    saveItemsToStorage(updatedItems)
  } catch (error) {
    console.error('Error updating item in localStorage:', error)
  }
}

export const addChildItemToItem = (parentItemId: string, childItem: ChildItem): Item | null => {
  try {
    const items = loadItemsFromStorage()
    const parentItem = items.find(item => item.id === parentItemId)
    
    if (parentItem) {
      if (!parentItem.childItems) {
        parentItem.childItems = []
      }
      parentItem.childItems.push(childItem)
      updateItemInStorage(parentItem)
      return parentItem
    }
    return null
  } catch (error) {
    console.error('Error adding child item:', error)
    return null
  }
}

export const removeChildItemFromItem = (parentItemId: string, childItemId: string): Item | null => {
  try {
    const items = loadItemsFromStorage()
    const parentItem = items.find(item => item.id === parentItemId)
    
    if (parentItem && parentItem.childItems) {
      parentItem.childItems = parentItem.childItems.filter(child => child.id !== childItemId)
      updateItemInStorage(parentItem)
      return parentItem
    }
    return null
  } catch (error) {
    console.error('Error removing child item:', error)
    return null
  }
}
