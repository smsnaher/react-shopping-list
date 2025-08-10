export interface Item {
  id: string
  name: string
  quantity: number
  description?: string
}

export const items: Item[] = [
  { 
    id: 'apples', 
    name: 'Apples', 
    quantity: 2, 
    description: 'Fresh red apples, perfect for snacking or baking.' 
  },
  { 
    id: 'bananas', 
    name: 'Bananas', 
    quantity: 5, 
    description: 'Ripe yellow bananas, great for smoothies and breakfast.' 
  },
  { 
    id: 'oranges', 
    name: 'Oranges', 
    quantity: 3, 
    description: 'Juicy oranges packed with vitamin C.' 
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
