import React from 'react';
import Navbar from './components/Navbar';
import { Inter } from 'next/font/google';
import './styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Streamly',
  description: 'Your Gateway to Unlimited Entertainment',
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon.ico"/>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" 
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" 
          crossOrigin="anonymous" 
        />
        <meta name="google-site-verification" content="KwbrktzVgA87L-41bxaHEa1JBq9lrmiGKrqX1Fkv0O0" />
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
