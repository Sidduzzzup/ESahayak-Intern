// Simple in-memory data store for demo purposes
import { buyerCreateSchema } from '@/lib/schemas';
import { z } from 'zod';

type Buyer = z.infer<typeof buyerCreateSchema>;
type StoredBuyer = Buyer & { id: string; updatedAt: Date; ownerId: string };

// Mock data storage
let buyers: StoredBuyer[] = [
  {
    id: '1',
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '9876543210',
    city: 'Chandigarh',
    propertyType: 'Apartment',
    bhk: '2',
    purpose: 'Buy',
    budgetMin: 5000000,
    budgetMax: 8000000,
    timeline: '3-6m',
    source: 'Website',
    status: 'New',
    notes: 'Looking for a 2BHK apartment in Sector 17',
    tags: ['first-time-buyer', 'urgent'],
    ownerId: 'demo-user',
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '8765432109',
    city: 'Mohali',
    propertyType: 'Villa',
    bhk: '3',
    purpose: 'Buy',
    budgetMin: 12000000,
    budgetMax: 18000000,
    timeline: '0-3m',
    source: 'Referral',
    status: 'Qualified',
    notes: 'Interested in luxury villas with garden',
    tags: ['luxury', 'garden'],
    ownerId: 'demo-user',
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    fullName: 'Rahul Gupta',
    email: 'rahul.gupta@email.com',
    phone: '7654321098',
    city: 'Zirakpur',
    propertyType: 'Plot',
    bhk: undefined,
    purpose: 'Buy',
    budgetMin: 3000000,
    budgetMax: 5000000,
    timeline: '>6m',
    source: 'Walk-in',
    status: 'Contacted',
    notes: 'Looking for residential plot for future construction',
    tags: ['investment'],
    ownerId: 'demo-user',
    updatedAt: new Date('2024-01-25'),
  }
] as StoredBuyer[];

let nextId = 4;

export const mockData = {
  // Get all buyers with filtering
  getBuyers: (filters: {
    search?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
  } = {}) => {
    let filtered = [...buyers];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(buyer => 
        buyer.fullName.toLowerCase().includes(search) ||
        buyer.email?.toLowerCase().includes(search) ||
        buyer.phone.includes(search)
      );
    }

    if (filters.city) {
      filtered = filtered.filter(buyer => buyer.city === filters.city);
    }

    if (filters.propertyType) {
      filtered = filtered.filter(buyer => buyer.propertyType === filters.propertyType);
    }

    if (filters.status) {
      filtered = filtered.filter(buyer => buyer.status === filters.status);
    }

    if (filters.timeline) {
      filtered = filtered.filter(buyer => buyer.timeline === filters.timeline);
    }

    return filtered;
  },

  // Get buyer by ID
  getBuyer: (id: string) => {
    return buyers.find(buyer => buyer.id === id);
  },

  // Add new buyer
  addBuyer: (buyerData: Buyer) => {
    const newBuyer = {
      ...buyerData,
      id: nextId.toString(),
      updatedAt: new Date(),
      ownerId: 'demo-user'
    };
    nextId++;
    buyers.push(newBuyer);
    return newBuyer;
  },

  // Update buyer
  updateBuyer: (id: string, updates: Partial<Buyer>) => {
    const index = buyers.findIndex(buyer => buyer.id === id);
    if (index === -1) return null;
    
    buyers[index] = {
      ...buyers[index],
      ...updates,
      updatedAt: new Date()
    };
    return buyers[index];
  },

  // Delete buyer
  deleteBuyer: (id: string) => {
    const index = buyers.findIndex(buyer => buyer.id === id);
    if (index === -1) return false;
    
    buyers.splice(index, 1);
    return true;
  },

  // Add multiple buyers (for CSV import)
  addBuyers: (buyersData: Buyer[]) => {
    const newBuyers = buyersData.map(buyerData => ({
      ...buyerData,
      id: nextId.toString(),
      updatedAt: new Date(),
      ownerId: 'demo-user'
    }));
    
    buyersData.forEach(() => nextId++);
    buyers.push(...newBuyers);
    return newBuyers.length;
  },

  // Get total count
  getCount: (filters: any = {}) => {
    return mockData.getBuyers(filters).length;
  }
};