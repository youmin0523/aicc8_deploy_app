/* ====== Common Post Request Function ====== */
export async function postRequest(url, options) {
  const defaultOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw data;
  }
  return data;
}

/* ====== Common Put Request Function ====== */
export async function putRequest(url, options) {
  const defaultOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };
  const response = await fetch(url, defaultOptions);
  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw data;
  }
  return data;
}

/* ====== Common Patch Request Function ====== */
export async function patchRequest(url, options) {
  const response = await fetch(url, options);
  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw data;
  }
  return data;
}

/* ====== Common Delete Request Function ====== */
export async function deleteRequest(url, options) {
  const response = await fetch(url, options);
  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw data;
  }
  return data;
}

/* ====== Common GET Request Function ====== */
export async function getRequest(url) {
  const response = await fetch(url);
  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw data;
  }
  return data;
}
