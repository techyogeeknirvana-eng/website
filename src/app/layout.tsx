import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NirvanaAIChatbot } from '@/components/ai/NirvanaAIChatbot';
import { CommandPalette } from '@/components/command/CommandPalette';
import { LeftSideThemeToggle } from '@/components/common/LeftSideThemeToggle';
import { LaunchScreen } from '@/components/common/LaunchScreen';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { BroadcastModal } from '@/components/announcements/BroadcastModal';

export const metadata: Metadata = {
  title: 'Techyogeek Nirvana — Where Tech Minds Connect, Create & Grow',
  description: 'An AI-powered technology community platform combining Discord-style discussions, Unstop-style opportunities, Mentimeter-style live presentations, career tools, and developer networking.',
  keywords: ['Techyogeek Nirvana', 'Developer Community', 'Tech Internships', 'Hackathons', 'Live Quizzes', 'AI Resume Checker', 'Tech Radar', 'Collab Finder'],
  authors: [{ name: 'Techyogeek Nirvana Team', url: 'https://nirvana.community' }],
  openGraph: {
    title: 'Techyogeek Nirvana — Connect. Create. Learn. Grow.',
    description: 'An AI-powered technology community for learning, opportunities, collaboration, and live quizzes.',
    url: 'https://nirvana.community',
    siteName: 'Techyogeek Nirvana',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Techyogeek Nirvana Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Techyogeek Nirvana — Connect. Create. Learn. Grow.',
    description: 'An AI-powered technology community platform for developers and students.',
    creator: '@techyogeek',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className="bg-cyber-grid">
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <AuthProvider>
          <RouteGuard>
            <LaunchScreen />
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - 68px)' }}>
              {children}
            </main>
            <Footer />
            <LeftSideThemeToggle />
            <NirvanaAIChatbot />
            <CommandPalette />
            <BroadcastModal />
          </RouteGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
