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
