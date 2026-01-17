import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/common/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/signin');
    }
  }, [router, isAuthenticated]);

  return null;
}

