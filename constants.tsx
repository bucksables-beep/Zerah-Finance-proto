
import { Transaction, Wallet } from './types';

export const INITIAL_WALLETS: Wallet[] = [
  {
    currency: 'USD',
    label: 'US Dollar',
    balance: 12450.00,
    symbol: '$',
    flagUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoF6D8y7lrZdYdQ9xuxVDOBKawVE0kYNjHECZMmKkNm83JfarO5i9Y3NgGpc-GY4fH28rHoFUZcrtNbGqVB13hziI62eaYuJ2BGs-Z_vnT2_kk-Gec9ojXjO4cjYZiXpKzxWWrfSQN9EmN3bD1ZPTnjgdB1fI-5w8Dz1dSPoIOlPNijwQcqs3oUuQb_0x4b4OIlJnPT4tPi_yKPhJ5IudV5Z0WNziERaDdMS-6CIvEIZwCLdf-bemP-cY-AsVkdTvEtMGbAwej2WMA',
    color: 'bg-primary',
    bankAccount: {
      institution: 'Zerah Global Trust',
      accountName: 'Alex Thompson',
      details: [
        { label: 'Routing Number', value: '021000021', isCopyable: true },
        { label: 'Account Number', value: '7482910394', isCopyable: true },
        { label: 'Swift Code', value: 'ZERAHUS33', isCopyable: true }
      ]
    }
  },
  {
    currency: 'EUR',
    label: 'Euro',
    balance: 8230.50,
    symbol: '€',
    flagUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1hr7ylQPb0b9NF44Ks3TAPF8RcWc_bUMuRs49wnaYVZLDh50qmsO6ygaCtQ3xMipl-F8QtWNhMz9YkFS51SK-ttmrReqhul2_Einztf0HTiQ5ndkXgo56PKnmdI-fv3wlZ_zaMh4qWSbDf6BJ3s3WvzZB-uDkKn6briopREb7prp3uCpoDp42l6mgTymPdmjqDv5WASQ9Ox4d8wr5qU1r05Ea23jpTMcksUntsmAb-vxTwnMhFOUCNFBcnll6Asser6-vDg_MVuxx',
    color: 'bg-white dark:bg-surface-dark',
    bankAccount: {
      institution: 'Zerah Europe SE',
      accountName: 'Alex Thompson',
      details: [
        { label: 'IBAN', value: 'DE89 3704 0044 0532 0130 00', isCopyable: true },
        { label: 'BIC', value: 'ZERADEFF', isCopyable: true }
      ]
    }
  },
  {
    currency: 'GBP',
    label: 'British Pound',
    balance: 4120.00,
    symbol: '£',
    flagUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9i7dY5Sob6iUB1EHN-Koa2sySRh_CV0VpRoCMbgcdkN1XHqIHQefRLtZfTE0BA9ixzFBGaGpCrDzkyayutbcUTE_orWbreImvZTBuiC132uE9s3YtAFdYv1ske9Q0XgpkmFDaFrgPzP6-WUlzhQri9r9cVFbsIfUM27VluNL38BVKQhtF8UkOzuhr2jRkKjsu5j3299vd2fs_PY3WpCvOpwBcmGmMWoD7CCL0dPdVl-iegQVA5CWkmL4WyfYMG4y451yweufBousl',
    color: 'bg-white dark:bg-surface-dark',
    bankAccount: {
      institution: 'Zerah UK Ltd',
      accountName: 'Alex Thompson',
      details: [
        { label: 'Sort Code', value: '40-05-15', isCopyable: true },
        { label: 'Account Number', value: '83920184', isCopyable: true }
      ]
    }
  }
];

export const AVAILABLE_CURRENCIES = [
  {
    currency: 'NGN',
    label: 'Nigerian Naira',
    symbol: '₦',
    flagUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6nUcfd4IketzNuR6aBfGSjjVjLc54Um9uCNVrS07a_3jO3f_TKXJxFpyJOqWZYpitye0S3KArDO-_MsSA9QIpIRZutK4T151eNOUHDtiqLp1gWMjI3oKFKTlqQOSFrS7_zsbVLyorB83fl2GXm-IpyYZliOXd4lYy521DwcfN8YEWFK3B5j1PB65OCgUxfl2h03B3xYE-rNHcJpcveEssEf5rHxTusH9FSnzxbLkpHi0iXbsu6g9CO5a2QQp2Ya5cfSGP5VcJq63U',
    bankAccount: {
      institution: 'Wema Bank (Zerah)',
      accountName: 'Alex Thompson (ZRH)',
      details: [
        { label: 'Account Number', value: '0123456789', isCopyable: true },
        { label: 'Account Type', value: 'Virtual Savings' }
      ]
    }
  },
  {
    currency: 'JPY',
    label: 'Japanese Yen',
    symbol: '¥',
    flagUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_5W1QO0rR1S6_vO9Zk_8Y6-T-m-J-v-L-v-R-Q-T-m-J-v-L-v-R-Q-T-m-J-v-L-v-R-Q-T-m-J-v-L-v',
    bankAccount: {
      institution: 'Zerah Japan GK',
      accountName: 'アレックス トンプソン',
      details: [
        { label: 'Bank Code', value: '0001', isCopyable: true },
        { label: 'Branch Code', value: '123', isCopyable: true },
        { label: 'Account Number', value: '7654321', isCopyable: true }
      ]
    }
  },
  {
    currency: 'AUD',
    label: 'Australian Dollar',
    symbol: '$',
    flagUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9i7dY5Sob6iUB1EHN-Koa2sySRh_CV0VpRoCMbgcdkN1XHqIHQefRLtZfTE0BA9ixzFBGaGpCrDzkyayutbcUTE_orWbreImvZTBuiC132uE9s3YtAFdYv1ske9Q0XgpkmFDaFrgPzP6-WUlzhQri9r9cVFbsIfUM27VluNL38BVKQhtF8UkOzuhr2jRkKjsu5j3299vd2fs_PY3WpCvOpwBcmGmMWoD7CCL0dPdVl-iegQVA5CWkmL4WyfYMG4y451yweufBousl',
    bankAccount: {
      institution: 'Zerah Australia Pty Ltd',
      accountName: 'Alex Thompson',
      details: [
        { label: 'BSB Number', value: '062-000', isCopyable: true },
        { label: 'Account Number', value: '1234 5678', isCopyable: true },
        { label: 'SWIFT Code', value: 'ZERAAU2S', isCopyable: true }
      ]
    }
  },
  {
    currency: 'CNY',
    label: 'Chinese Yuan',
    symbol: '¥',
    flagUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2e8D_fS9C7u_Y8C-T-k-h_R-Q-T-m-J-v-L-v-R-Q-T-m-J-v-L-v-R-Q-T-m-J-v-L-v-R-Q-T-m-J-v-L-v',
    bankAccount: {
      institution: 'Zerah China Ltd',
      accountName: '艾利克斯 汤普森',
      details: [
        { label: 'CNAPS Code', value: '102100000030', isCopyable: true },
        { label: 'Account Number', value: '6222 0210 0100 1234 567', isCopyable: true }
      ]
    }
  }
];

export const RECENT_ACTIVITY: Transaction[] = [
  {
    id: '1',
    name: 'Apple Store',
    date: 'Oct 24, 2:45 PM',
    amount: -1299.00,
    currency: 'USD',
    type: 'expense',
    icon: 'shopping_bag'
  },
  {
    id: '2',
    name: 'Le Bistro Paris',
    date: 'Oct 23, 8:12 PM',
    amount: -45.50,
    currency: 'EUR',
    type: 'expense',
    icon: 'restaurant'
  },
  {
    id: '3',
    name: 'Salary Deposit',
    date: 'Oct 22, 9:00 AM',
    amount: 4500.00,
    currency: 'USD',
    type: 'income',
    icon: 'arrow_downward'
  },
  {
    id: '4',
    name: 'Transport for London',
    date: 'Oct 21, 5:30 PM',
    amount: -8.20,
    currency: 'GBP',
    type: 'expense',
    icon: 'train'
  }
];
