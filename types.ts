import React from 'react';

export enum AdType {
  ORGANIC = 'ORGANIC',
  LOCAL = 'LOCAL',   // R$ 1.90/dia
  PREMIUM = 'PREMIUM' // R$ 3.90/dia - Top of list
}

export interface StoreReview {
  id: string;
  user: string;
  rating: number;
  text: string;
  date: string;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  distance: string;
  adType: AdType;
  description: string;
  cashback?: number; // Percentage
  isMarketplace?: boolean; // Determines if it appears in "Achadinhos"
  price?: number; // Price for the "Achadinho" item/deal
  
  // Detailed fields
  address?: string;
  phone?: string;
  hours?: string;
  gallery?: string[];
  reviews?: StoreReview[];
  verified?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  slug: string;
}

export interface Story {
  id: string;
  name: string;
  image: string;
  isLive?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  image: string;
  followers: string;
  verified: boolean;
}

export interface ServiceLead {
  id: string;
  title: string; // e.g., "Pintura de Apartamento"
  category: string;
  urgency: 'Baixa' | 'Média' | 'Alta';
  priceToUnlock: number; // Fixed at R$ 3.90 for V1.0
  maskedName: string; // "João S."
  district: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface Transaction {
  id: string;
  storeName: string;
  date: string;
  amount: number;
  cashbackAmount: number;
  status: 'completed' | 'pending';
}