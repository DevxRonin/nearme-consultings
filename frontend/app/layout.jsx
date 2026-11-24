import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'NearMe Consulting | AI-Powered Nearby Business Discovery and Booking',
  description:
    'Find and book trusted consulting professionals, IT advisors, financial planners, legal experts, and career coaches near your location.',
  keywords:
    'consulting near me, business consultant, IT consultant, legal advisor, financial planner, career coach, Pune, PCMC'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-bodyBg text-textMain min-h-screen flex flex-col antialiased selection:bg-teal selection:text-navy">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0A1F44',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '12px',
                padding: '12px 18px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              },
              success: {
                iconTheme: {
                  primary: '#00C2A8',
                  secondary: '#0A1F44'
                }
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FFFFFF'
                }
              }
            }}
          />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
