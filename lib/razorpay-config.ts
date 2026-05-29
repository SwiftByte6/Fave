export function getRazorpayKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '';
}

export function hasRazorpayCredentials() {
  return Boolean(getRazorpayKeyId() && process.env.RAZORPAY_KEY_SECRET);
}
