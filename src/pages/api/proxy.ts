import type { APIRoute } from 'astro';

function isPrivateHost(hostname: string): boolean {
  if (hostname === 'localhost') return true;
  if (hostname === '127.0.0.1') return true;
  if (hostname.startsWith('192.168.')) return true;
  if (hostname.startsWith('10.')) return true;
  const parts = hostname.split('.').map(Number);
  if (parts.length === 4 && parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  return false;
}

export const GET: APIRoute = async ({ url: requestUrl }) => {
  const targetUrl = requestUrl.searchParams.get('url');

  if (!targetUrl || targetUrl.trim() === '') {
    return new Response('Missing URL parameter', { status: 400 });
  }

  const normalizedUrl = targetUrl.startsWith('http')
    ? targetUrl
    : 'http://' + targetUrl;

  let url;
  try {
    url = new URL(normalizedUrl);
  } catch {
    return new Response('Invalid URL', { status: 400 });
  }

  const hostname = url.hostname;
  if (!isPrivateHost(hostname)) {
    return new Response('Private network access only', { status: 403 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  const fetchUrls = url.hostname === 'localhost'
    ? [url.href, url.href.replace('//localhost', '//127.0.0.1')]
    : [url.href];

  try {
    const results = await Promise.allSettled(
      fetchUrls.map(u => fetch(u, {
        signal: controller.signal,
        headers: {
          'X-Frame-Options': '',
          'Content-Security-Policy': '',
        },
      }))
    );

    let proxyResponse: Response | undefined;
    for (const r of results) {
      if (r.status === 'fulfilled') { proxyResponse = r.value; break; }
    }
    if (!proxyResponse) throw (results[0] as PromiseRejectedResult).reason;

    clearTimeout(timeoutId);

    let text = await proxyResponse.text();

    const baseTag = `<base href="${url.origin}">`;
    const headIndex = text.toLowerCase().indexOf('<head>');

    if (headIndex !== -1) {
      text = text.substring(0, headIndex + 6) + baseTag + text.substring(headIndex + 6);
    } else {
      text = baseTag + text;
    }

    const headers = new Headers(proxyResponse.headers);
    headers.set('Content-Security-Policy', "frame-ancestors *; object-src 'none';");
    headers.delete('X-Frame-Options');

    return new Response(text, {
      status: proxyResponse.status,
      headers: headers,
    });
  } catch (error: any) {
    clearTimeout(timeoutId);
    const cause = error.cause?.code || error.code || '';
    if (error.name === 'TimeoutError' || cause === 'UND_ERR_CONNECT_TIMEOUT' || error.message?.includes('aborted')) {
      return new Response(`Proxy timeout — server di ${url.origin} tidak merespon dalam 30 detik. Pastikan server sedang running.`, { status: 504 });
    }
    if (cause === 'ECONNREFUSED') {
      return new Response(`Koneksi ditolak — tidak ada server yang berjalan di ${url.origin}`, { status: 502 });
    }
    if (cause === 'ECONNRESET') {
      return new Response(`Koneksi direset — server di ${url.origin} memutus koneksi`, { status: 502 });
    }
    console.error('Proxy error:', error.message);
    return new Response('Proxy error: ' + error.message, { status: 500 });
  }
};
