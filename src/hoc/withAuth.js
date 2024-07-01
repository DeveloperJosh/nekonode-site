// hoc/withAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (Component) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }, []);

    return <Component {...props} />;
  };
};

export default withAuth;
