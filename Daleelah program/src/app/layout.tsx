import { CartProvider } from '@/context/CartContext';
import "./globals.css";

export const metadata = {
  title: "Daleelah",
  description: "Smart tourism platform (Front-end first)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
     <body>
  <CartProvider>
    {children}
  </CartProvider>
</body>
    </html>
  );
}
