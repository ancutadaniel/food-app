import { TIMEOUT_SEC } from '../js/config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async (url, uploadData = undefined) => {
  try {
    const fetchMethods = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const resp = await Promise.race([fetchMethods, timeout(TIMEOUT_SEC)]);

    const data = await resp.json();
    if (!resp.ok) throw new Error(`${data.message} (${resp.status})`);

    return data;
  } catch (error) {
    throw error; // propagate the error down to next async fct
  }
};
