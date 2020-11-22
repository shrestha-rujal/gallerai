import consts from '../consts';

const call = async ({path, body, method = 'GET', token, headers = {}}) => {
  try {
    const res = await fetch(`${consts.HOST_URL}${path}`, {
      method,
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body,
    });

    const resJson = await res.json();
    return resJson;
  } catch (err) {
    console.log('NETWORK CALL ERROR: ', err);
  }
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

export const uploadImage = (payload, token) => {
  return call({
    path: '/images',
    body: payload,
    method: 'POST',
    token,
  });
};

export const searchSimilarImages = (token) => {
  return call({path: '/images/find-similar', token, method: 'GET'});
};

export const deleteImages = (token, payload) => {
  return call({
    path: '/images',
    body: payload,
    token,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
