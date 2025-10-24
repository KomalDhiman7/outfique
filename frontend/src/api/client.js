const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch(e) { data = text; }
    if (!res.ok) {
      console.error(`[API ERR] ${res.status} ${url}`, data);
      const err = new Error('API error');
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  } catch (err) {
    console.error(`[NETWORK] Failed ${options.method || 'GET'} ${url}:`, err);
    throw err;
  }
}

export default { request };
