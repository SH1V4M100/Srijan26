// 'use client';

// import Image from 'next/image';
// import { FaXmark } from 'react-icons/fa6';
// import Link from 'next/link';
// import { usePayment } from '@/hooks/usePayment';

// interface PaymentSectionProps {
//   title: string;
//   subtitle: string;
//   price: number;
//   imageSrc: string;
//   createOrderApi: string;
//   verifyOrderApi: string;
//   createOrderPayload: any;
//   requiresSize?: boolean;
//   termsLink?: string;
//   successRedirect?: string;
// }

// export function PaymentSection({
//   title,
//   subtitle,
//   price,
//   imageSrc,
//   createOrderApi,
//   verifyOrderApi,
//   createOrderPayload,
//   requiresSize = false,
//   termsLink,
//   successRedirect,
// }: PaymentSectionProps) {
//   const {
//     session,
//     itemDetail,
//     isReady,
//     isLoading,
//     buttonText,
//     isButtonDisabled,
//     onPaymentClick,
//     paymentDialogRef,
//   } = usePayment({
//     createOrderApi,
//     verifyOrderApi,
//     price,
//     createOrderPayload,
//     itemName: title,
//     requiresSize,
//     successRedirect,
//   });

//   return (
//     <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
//       <h2 className="text-sm title-font text-[#ffffff] tracking-widest">
//         {subtitle}
//       </h2>
//       <h1 className="text-[#c085fd] text-2xl title-font font-semibold mb-1">
//         {title}
//       </h1>
      
//       {itemDetail && requiresSize && (
//         <div className="flex mb-4 text-gray-200">
//           <span className="flex ml-3 pl-3 py-2 space-x-2">
//             Size: {itemDetail}
//           </span>
//         </div>
//       )}

//       <p className="leading-relaxed text-[#eae2b7]">
//         {/* Your description */}
//       </p>

//       <div className="flex my-6">
//         <span className="title-font font-medium text-2xl text-white">
//           ₹{price}.00
//         </span>
//         <button
//           className={`flex ml-auto font-semibold border-0 py-2 px-6 focus:outline-none rounded-full cursor-pointer transition-colors ${
//             isButtonDisabled()
//               ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
//               : 'bg-[#c085fd] text-[#101720] hover:bg-[#EAE2B7]'
//           }`}
//           onClick={onPaymentClick}
//           disabled={isButtonDisabled()}
//         >
//           {buttonText}
//         </button>
        
//         <dialog
//           ref={paymentDialogRef}
//           className="relative h-[90vh] w-[70vw] rounded-xl backdrop:bg-[#00000080] bg-[#101720] text-[#c085fd] font-semibold"
//         >
//           <button
//             onClick={() => paymentDialogRef.current?.close()}
//             className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors"
//           >
//             <FaXmark size={24} />
//           </button>
//         </dialog>
//       </div>

//       {termsLink && (
//         <Link 
//           href={termsLink} 
//           className="text-sm underline text-gray-300 underline-offset-2"
//         >
//           Terms and Conditions
//         </Link>
//       )}
//     </div>
//   );
// }