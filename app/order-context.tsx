'use client'

import React, { createContext, useContext, useState } from 'react'

interface Order {
  id: string
  status: 'pending' | 'accepted' | 'cancelled' | 'completed'
  vendorId: string
  items: Array<{ id: string; name: string; quantity: number }>
}

interface OrderContextType {
  orders: Order[]
  activeOrder: Order | null
  setActiveOrder: (order: Order | null) => void
  updateOrderStatus: (orderId: string, status: Order['status']) => void
  addOrder: (order: Omit<Order, 'id' | 'status'>) => void
}

const OrderContext = createContext<OrderContextType | null>(null)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ))
    if (activeOrder?.id === orderId) {
      setActiveOrder({ ...activeOrder, status })
    }
  }

  const addOrder = (orderData: Omit<Order, 'id' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substring(7),
      status: 'pending'
    }
    setOrders([...orders, newOrder])
  }

  return (
    <OrderContext.Provider value={{ 
      orders, 
      activeOrder, 
      setActiveOrder, 
      updateOrderStatus,
      addOrder
    }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}