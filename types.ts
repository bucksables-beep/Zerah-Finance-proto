
export enum View {
  HOME = 'home',
  WALLETS = 'wallets',
  SEND = 'send',
  CARDS = 'cards',
  ENGINE = 'engine',
  CONVERT = 'convert',
  RECEIVE = 'receive',
  TRANSACTION_DETAILS = 'transaction_details',
  PROFILE = 'profile',
  NOTIFICATIONS = 'notifications'
}

export interface BankDetail {
  label: string;
  value: string;
  isCopyable?: boolean;
}

export interface BankAccount {
  institution: string;
  accountName: string;
  details: BankDetail[];
}

export interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'NGN';
  type: 'expense' | 'income';
  icon: string;
  status?: 'Completed' | 'Pending' | 'Failed';
  reference?: string;
}

export interface Wallet {
  currency: string;
  label: string;
  balance: number;
  symbol: string;
  flagUrl: string;
  color: string;
  bankAccount?: BankAccount;
}

export interface Card {
  id: string;
  lastFour: string;
  pan: string;
  cvv: string;
  expiry: string;
  holder: string;
  currency: string;
  isFrozen: boolean;
  type: 'Platinum' | 'Gold' | 'Black';
  color: string;
}
