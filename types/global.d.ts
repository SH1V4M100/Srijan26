interface CashfreeResult {
    error?: { message: string };
    redirect?: boolean;
    paymentDetails?: {
      orderId: string;
      paymentId: string;
      paymentStatus: string;
    };
  }
  
  interface CashfreeSDK {
    (config: { mode: string }): {
      checkout(options: { paymentSessionId: string; redirectTarget: string }): Promise<CashfreeResult>;
    };
  }
  
  declare global {
    interface Window {
      Cashfree?: CashfreeSDK;
    }
  }
  
  export {};
  