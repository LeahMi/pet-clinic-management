'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const ClientProviders = dynamic(() => import('./ClientProviders'), { ssr: false });

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <ClientProviders>{children}</ClientProviders>;
}