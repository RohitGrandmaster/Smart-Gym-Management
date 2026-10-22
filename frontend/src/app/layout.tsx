// RESPONSIBILITY: Root layout component that wraps the entire application. Initializes global font (Inter), Next-Themes provider, and Hot-Toast provider.
import type { Metadata } from 'next';
import '@/app/globals.css';
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'GymSmart ERP – Gym Management Software',
  description: 'Professional Gym Management ERP – Members, Plans, HR, Finance, Store, and more in one powerful platform.',
  keywords: 'gym management, ERP, gym software, member management, fitness center',
  openGraph: {
    title: 'GymSmart ERP',
    description: 'All-in-one Gym Management Software',
    images: ['/opengraph.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="font-sans" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader 
            color="#FACC15"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #FACC15,0 0 5px #FACC15"
          />
          {children}
          <Toaster 
            position="top-center" 
            containerStyle={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bottom: 'auto',
              right: 'auto'
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
