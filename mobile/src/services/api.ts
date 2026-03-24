import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://localhost:3000/api';

// For demo purposes - in production, use environment variables
// Use your local IP for Android emulator or simulator
const getApiBaseUrl = () => API_BASE_URL;

class ApiService {
  private token: string | null = null;

  async setToken(token: string): Promise<void> {
    this.token = token;
    await SecureStore.setItemAsync('auth_token', token);
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await SecureStore.getItemAsync('auth_token');
    }
    return this.token;
  }

  async clearToken(): Promise<void> {
    this.token = null;
    await SecureStore.deleteItemAsync('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();
    const url = `${getApiBaseUrl()}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async bootstrapSession(authCode: string) {
    return this.request<any>('/auth/session/bootstrap', {
      method: 'POST',
      body: JSON.stringify({ code: authCode }),
    });
  }

  async getUser() {
    return this.request<any>('/users/me');
  }

  // Phone verification
  async requestPhoneVerification(phone: string) {
    return this.request<any>('/verification/phone/request', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyPhone(phone: string, code: string) {
    return this.request<any>('/verification/phone/confirm', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
  }

  // PIN
  async setPin(pin: string) {
    return this.request<any>('/security/pin/setup', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
  }

  async verifyPin(pin: string) {
    return this.request<any>('/security/pin/verify', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
  }

  // Wallet
  async getWallet() {
    return this.request<any>('/wallet');
  }

  async getBalance() {
    return this.request<any>('/wallet/balance');
  }

  // Transfers
  async validateRecipient(phone: string) {
    return this.request<any>('/transfers/nerra/validate-recipient', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async transferToNerra(data: { recipient: string; amount: number; narration: string; pin: string }) {
    return this.request<any>('/transfers/nerra', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async transferToBank(data: { bankCode: string; accountNumber: string; amount: number; narration: string; pin: string }) {
    return this.request<any>('/transfers/bank', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTransactions(limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    return this.request<any>(`/transfers?${params}`);
  }

  // Beneficiaries
  async getBeneficiaries() {
    return this.request<any>('/beneficiaries');
  }

  async addBeneficiary(data: any) {
    return this.request<any>('/beneficiaries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Airtime & Data
  async getAirtimeProducts() {
    return this.request<any>('/purchases/airtime');
  }

  async getDataProducts() {
    return this.request<any>('/purchases/data');
  }

  async purchaseAirtime(network: string, phone: string, amount: number) {
    return this.request<any>('/purchases/airtime', {
      method: 'POST',
      body: JSON.stringify({ network, phone, amount }),
    });
  }

  async purchaseData(network: string, phone: string, planCode: string) {
    return this.request<any>('/purchases/data', {
      method: 'POST',
      body: JSON.stringify({ network, phone, planCode }),
    });
  }

  // Bills
  async getBillCategories() {
    return this.request<any>('/bills/categories');
  }

  async getBillers(categoryId?: string) {
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    return this.request<any>(`/bills/billers${params}`);
  }

  async payBill(billerId: string, customerReference: string, amount: number) {
    return this.request<any>('/bills/pay', {
      method: 'POST',
      body: JSON.stringify({ billerId, customerReference, amount }),
    });
  }

  // Cards
  async getCards() {
    return this.request<any>('/cards');
  }

  async createCard(currency?: string) {
    return this.request<any>('/cards', {
      method: 'POST',
      body: JSON.stringify({ currency }),
    });
  }

  async freezeCard(cardId: string) {
    return this.request<any>(`/cards/${cardId}/freeze`, { method: 'POST' });
  }

  async unfreezeCard(cardId: string) {
    return this.request<any>(`/cards/${cardId}/unfreeze`, { method: 'POST' });
  }

  async fundCard(cardId: string, amount: number) {
    return this.request<any>(`/cards/${cardId}/fund`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Notifications
  async getNotifications(limit?: number) {
    const params = limit ? `?limit=${limit}` : '';
    return this.request<any>(`/notifications${params}`);
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, { method: 'POST' });
  }

  // Onboarding
  async getOnboardingSlides() {
    return this.request<any>('/onboarding/slides');
  }

  async completeOnboarding() {
    return this.request<any>('/onboarding/complete', { method: 'POST' });
  }
}

export const api = new ApiService();