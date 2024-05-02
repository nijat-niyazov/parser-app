import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import GlobaProvider from './Context';

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobaProvider>{children}</GlobaProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Providers;
