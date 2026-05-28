// src/app/[[...slug]]/page.tsx
"use client"; 

// 1. Import dynamic from Next.js
import dynamic from 'next/dynamic';
import { AuthProvider } from '../../lib/AuthContext';

// 2. DYNAMICALLY import your App component and explicitly turn OFF Server-Side Rendering
const App = dynamic(() => import('../App'), {
  ssr: false, 
});

export default function HomePage() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}