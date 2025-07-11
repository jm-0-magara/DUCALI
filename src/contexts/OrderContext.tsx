// src/contexts/OrderContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order } from '../types';
import { useAuth } from './AuthContext';
import { PLATFORM_SETTINGS } from '../data/constants';

interface OrderContextType {
  orders: Order[];
  createOrder: (orderData: CreateOrderData) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  updateOrderStatus: (orderId: string, status: Order['status'], progress?: number) => Promise<{ success: boolean; error?: string }>;
  getCustomerOrders: (customerId: string) => Order[];
  getArtisanOrders: (artisanId: string) => Order[];
  sendQuote: (orderId: string, price: string, timeline: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
  acceptQuote: (orderId: string) => Promise<{ success: boolean; error?: string }>;
  completeOrder: (orderId: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

interface CreateOrderData {
  artisanId: string;
  artisanName: string;
  artisanImage?: string;
  customerId: string;
  customerName: string;
  service: string;
  description: string;
  budget?: string;
  timeline?: string;
  attachments?: string;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load orders from localStorage on mount
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem(PLATFORM_SETTINGS.localStorageKeys.orders || 'ducali_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    try {
      localStorage.setItem(PLATFORM_SETTINGS.localStorageKeys.orders || 'ducali_orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  }, [orders]);

  const createOrder = async (orderData: CreateOrderData) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        artisan: orderData.artisanName,
        artisanImage: orderData.artisanImage,
        customer: orderData.customerName,
        service: orderData.service,
        description: orderData.description,
        status: 'Quote Requested',
        orderDate: new Date().toISOString(),
        price: 'TBD',
        priority: 'medium',
        // Include the additional fields
        budget: orderData.budget,
        timeline: orderData.timeline,
        attachments: orderData.attachments
      };

      setOrders(prev => [...prev, newOrder]);
      
      return { success: true, orderId: newOrder.id };
    } catch (error) {
      return { success: false, error: 'Failed to create order. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], progress?: number) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status,
              progress: progress !== undefined ? progress : order.progress,
              ...(status === 'Completed' && { completedDate: new Date().toISOString() })
            }
          : order
      ));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update order status.' };
    } finally {
      setIsLoading(false);
    }
  };

  const sendQuote = async (orderId: string, price: string, timeline: string, notes?: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: 'Pending Review',
              price: price,
              estimatedCompletion: timeline,
              description: notes ? `${order.description}\n\nArtisan Notes: ${notes}` : order.description
            }
          : order
      ));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to send quote.' };
    } finally {
      setIsLoading(false);
    }
  };

  const acceptQuote = async (orderId: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: 'In Progress',
              progress: 0
            }
          : order
      ));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to accept quote.' };
    } finally {
      setIsLoading(false);
    }
  };

  const completeOrder = async (orderId: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: 'Completed',
              progress: 100,
              completedDate: new Date().toISOString()
            }
          : order
      ));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to complete order.' };
    } finally {
      setIsLoading(false);
    }
  };

  const getCustomerOrders = (customerId: string) => {
    return orders.filter(order => {
      // For now, match by customer name since we don't have customer IDs in orders yet
      // In a real app, you'd match by customer ID
      return user?.name === order.customer;
    });
  };

  const getArtisanOrders = (artisanId: string) => {
    return orders.filter(order => {
      // For now, match by artisan name since we don't have artisan IDs in orders yet
      // In a real app, you'd match by artisan ID
      return user?.name === order.artisan;
    });
  };

  const value: OrderContextType = {
    orders,
    createOrder,
    updateOrderStatus,
    getCustomerOrders,
    getArtisanOrders,
    sendQuote,
    acceptQuote,
    completeOrder,
    isLoading
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}