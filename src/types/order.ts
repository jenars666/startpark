export type DateValue =
  | Date
  | string
  | number
  | {
      toDate: () => Date;
    }
  | null
  | undefined;

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'failed';

export type PaymentMethod =
  | 'razorpay'
  | 'cash_on_delivery'
  | 'store_pickup'
  | 'upi_transfer';

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  createdAt: DateValue;
  updatedAt: DateValue;
  customer: OrderCustomer;
  shippingAddress: ShippingAddress;
  notes?: string;
  discountCode?: string;
  discountAmount?: number;
  loyaltyProcessed?: boolean;
}

export interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  img: string;
  category?: string;
}

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Review {
  id: string;
  productId: string | number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface DiscountCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount?: number;
  expiresAt?: Date;
  active: boolean;
}
