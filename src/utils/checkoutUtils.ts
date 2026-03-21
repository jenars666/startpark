export const PHONE_NUMBER = "919876543210"; // Placeholder
export const UPI_ID = "starmenspark@upi"; // Placeholder
export const SHOP_NAME = "Star Mens Park";

export function generateWhatsAppLink(productName: string, quantity: number = 1, size: string = 'L') {
  const message = `Hello ${SHOP_NAME},\nI want to order:\n*${productName}*\nQuantity: ${quantity}\nSize: ${size}\n\nPlease confirm availability and total price.`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
}

export function generateUPIIntent(amount: number, note: string) {
  // UPI Intent format: upi://pay?pa=UPI_ID&pn=PAYEE_NAME&am=AMOUNT&cu=INR&tn=NOTE
  return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(SHOP_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
}

export function handleInstantCheckout(amount: number, note: string) {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = generateUPIIntent(amount, note);
  } else {
    alert(`Please use a mobile device to complete UPI Checkouts, or scan the QR code (Mocked). Amount: ₹${amount}`);
  }
}
