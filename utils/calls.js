import consts from '../consts';

const call = async ({path, body, method = 'GET', token, headers={}}) => {
  const res = await fetch(`${consts.HOST_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify(body),
  });

  return await res.json();
};

export const login = (email, password) =>
  call({path: '/users/login', body: {email, password}, method: 'POST'});

export const signup = (username, email, password, passwordConfirm) => {
  call({
    path: '/users/signup',
    body: {username, email, password, passwordConfirm},
    method: 'POST',
  });
};
