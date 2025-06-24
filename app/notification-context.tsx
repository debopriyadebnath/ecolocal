'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { useUser } from './user-context'

interface INotification {
  _id: string
  user: string
  type: 'order' | 'chat' | 'system' | 'impact'
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: string
  updatedAt: string
}

interface NotificationContextType {
  notifications: INotification[]
  unreadCount: number
  hasPermission: boolean
  requestPermission: () => void
  sendNotification: (title: string, message: string, type?: string) => void
  markAsRead: (id: string) => Promise<void>
  loadNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ 
  children 
}: { 
  children: React.ReactNode
}) {
  const { user } = useUser()
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [hasPermission, setHasPermission] = useState(false)
  const toast = useToast()

  useEffect(() => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setHasPermission(true)
      }
    }

    if (user?.id) {
      loadNotifications()
    }
  }, [user?.id])

  const loadNotifications = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/notifications?userId=${user.id}&unreadOnly=false`)
      if (!response.ok) throw new Error('Failed to load notifications')
      
      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error('Error loading notifications:', error)
      toast({
        title: 'Error',
        description: 'Failed to load notifications',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission()
      setHasPermission(permission === 'granted')
      
      if (permission === 'granted') {
        toast({
          title: 'Notifications enabled',
          description: 'You will now receive notifications about important updates',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }

  const sendNotification = async (title: string, message: string, type: string = 'system') => {
    if (!user?.id) return

    try {
      // Save notification to database
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: user.id,
          type,
          title,
          message,
        })
      })

      if (!response.ok) throw new Error('Failed to save notification')
      
      // Show browser notification if permitted
      if (hasPermission) {
        new Notification(title, {
          body: message,
          icon: '/সবুজহাট.png',
        })
      }

      // Show toast notification
      toast({
        title: title,
        description: message,
        status: type as any,
        duration: 5000,
        isClosable: true,
      })

      // Reload notifications
      await loadNotifications()
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PUT'
      })

      if (!response.ok) throw new Error('Failed to mark notification as read')

      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount,
        hasPermission, 
        requestPermission, 
        sendNotification,
        markAsRead,
        loadNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
