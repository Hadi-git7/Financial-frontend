
import { useState } from 'react';


export default function useToken() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isSuper, setIsSuper] = useState(localStorage.getItem('is_super'));

  const saveToken = (userToken, userIsSuper) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('is_super', userIsSuper);
    setToken(userToken);
    setIsSuper(userIsSuper);
  };

  return {
    token: token || '',
    isSuper: isSuper || '',
    setToken: saveToken,
  };
}