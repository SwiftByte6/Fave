"use client";
import dynamic from "next/dynamic";

const PaymentButton = dynamic(() => import("@/component/PaymentButton"), {
  ssr: false,
  loading: () => null,
});

export default function DeferredPaymentButton() {
  return <PaymentButton />;
}
