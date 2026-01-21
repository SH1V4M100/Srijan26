// 'use client';

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { Session } from '@/types/all';

// interface PaymentConfig {
//   createOrderApi: string;      // e.g. "/api/create-merch-order"
//   verifyOrderApi: string;      // e.g. "/api/verify-merch-payment"
//   price: number;
//   createOrderPayload: any;     // { merchandise: "SHIRT", size }
//   itemName: string;            // "T-Shirt", "Workshop XYZ"
//   requiresSize?: boolean;
//   successRedirect?: string;    // defaults to "/dashboard"
// }

// interface UsePaymentReturn {
//   session: Session | null;
//   itemDetail: string | null;   // shirtSize, workshop attendees, etc.
//   isReady: boolean;
//   isLoading: boolean;
//   buttonText: string;
//   isButtonDisabled: boolean;
//   onPaymentClick: () => Promise<void>;
//   paymentDialogRef: React.RefObject<HTMLDialogElement>;
// }

// export function usePayment(config: PaymentConfig): UsePaymentReturn {
//   const router = useRouter();
//   const [session, setSession] = useState<Session | null>(null);
//   const [itemDetail, setItemDetail] = useState<string | null>(null);
//   const [isScriptLoaded, setIsScriptLoaded] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const paymentDialogRef = useRef<HTMLDialogElement>(null);

//   // Load session + user data + Cashfree SDK
//   useEffect(() => {
//     const init = async () => {
//       try {
//         const sessionRes = await fetch("/api/get-session");
//         const sessionData = await sessionRes.json();
//         setSession(sessionData.session);

//         if (sessionData.session) {
//           const userRes = await fetch("/api/find-user", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ session: sessionData.session }),
//           });
//           if (userRes.ok) {
//             const userData = await userRes.json();
//             setItemDetail(config.requiresSize ? userData.shirtSize : null);
//           }
//         }
//       } catch (err) {
//         console.error("Init error:", err);
//         setSession(null);
//       } finally {
//         // Load Cashfree SDK once
//         if (!document.querySelector('script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]')) {
//           const script = document.createElement('script');
//           script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
//           script.onload = () => setIsScriptLoaded(true);
//           document.head.appendChild(script);
//         } else {
//           setIsScriptLoaded(true);
//         }
//       }
//     };

//     init();
//   }, [config.requiresSize]);

//   const handlePayment = useCallback(async () => {
//     const CASHFREE_CLIENT_ID = process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID!;
//     if (!CASHFREE_CLIENT_ID || !isScriptLoaded || typeof window === "undefined" || !window.Cashfree) {
//       alert("Payment system not ready. Please refresh.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // 1. Create order
//       const res = await fetch(config.createOrderApi, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(config.createOrderPayload),
//       });

//       const result = await res.json() as any;

//       if (!result.success || !result.data) {
//         alert("Failed to create order: " + (result.error || "Unknown error"));
//         return;
//       }

//       const { orderId, paymentSessionId } = result.data;
//       if (!orderId || !paymentSessionId) {
//         alert("Missing order details");
//         return;
//       }

//       // 2. Cashfree checkout (unchanged)
//       const cashfree = (window.Cashfree as any)({ mode: "production" });
//       const checkoutOptions = { paymentSessionId, redirectTarget: "_modal" as const };
//       const paymentResult = await cashfree.checkout(checkoutOptions);

//       if (paymentResult.error) {
//         alert("Payment failed: " + paymentResult.error.message);
//         return;
//       }

//       if (paymentResult.paymentDetails) {
//         // 3. Verify
//         const verifyRes = await fetch(config.verifyOrderApi, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ order_id: orderId }),
//         });

//         const verifyResult = await verifyRes.json();
//         if (verifyResult.success) {
//           alert("Payment successful!");
//           router.push(config.successRedirect || "/dashboard");
//         } else {
//           alert("Payment verification failed: " + (verifyResult.error || "Unknown error"));
//         }
//       }
//     } catch (err) {
//       alert("Payment error. Try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [config, isScriptLoaded, router]);

//   const buttonText = (() => {
//     if (session === undefined || !isScriptLoaded || (config.requiresSize && !itemDetail)) {
//       return "Loading...";
//     }
//     if (!session) return "Login";
//     if (isLoading) return "Processing...";
//     return "Buy Now";
//   })();

//   const isButtonDisabled = session === undefined || !isScriptLoaded || 
//     (config.requiresSize && !itemDetail) || isLoading;

//   const isReady = isScriptLoaded && session !== undefined;

//   return {
//     session,
//     itemDetail,
//     isReady,
//     isLoading,
//     buttonText,
//     isButtonDisabled,
//     onPaymentClick: handlePayment,
//     paymentDialogRef,
//   };
// }