import { useEffect } from 'react';

const Login = () => {
  useEffect(() => {
    // Check for verification params in URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const hash = params.get('hash');
    if (id && hash) {
      // Call backend verification endpoint
      fetch(`/verify-email/${id}/${hash}`)
        .then(() => {
          window.location.href = '/?verified=1&showLoginModal=1';
        })
        .catch(() => {
          window.location.href = '/?showLoginModal=1';
        });
    } else {
      window.location.href = '/?showLoginModal=1';
    }
  }, []);
  return null;
};

export default Login;
