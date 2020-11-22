import consts from '../consts';

const call = async ({path, body, method = 'GET', token, headers = {}}) => {
  const res = await fetch(`${consts.HOST_URL}${path}`, {
    method,
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body,
  });

  return await res.json();
};

export const login = (email, password) =>
  call({
    path: '/users/login',
    body: JSON.stringify({email, password}),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const signup = (name, email, password, passwordConfirm) =>
  call({
    path: '/users/signup',
    body: JSON.stringify({name, email, password, passwordConfirm}),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const uploadImage = (payload) => {
  return call({
    path: '/images/upload',
    body: payload,
    method: 'POST',
  });
};
