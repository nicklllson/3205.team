const SERVER_API = 'http://localhost:3000/api';

export const api = async <ReqData, ResData>(
  route: string,
  init?: RequestInit & { json?: ReqData; params?: Record<string, unknown> },
): Promise<ResData> => {
  let serverRoute = `${SERVER_API}${route}`;

  if (init?.params) {
    const searchParams = new URLSearchParams();
    Object.entries(init.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      serverRoute = `${serverRoute}?${queryString}`;
    }
  }

  const baseHeaders = new Headers(init?.headers as HeadersInit);

  if (init?.json) {
    baseHeaders.set('Content-Type', 'application/json');
  }

  const initParams: RequestInit = {
    ...init,
    ...(init?.json && { body: JSON.stringify(init.json) }),
    headers: baseHeaders,
  };

  try {
    const res = await fetch(serverRoute, initParams);

    if (!res.ok) {
      let errData: { message: string } | null = null;
      try {
        errData = await res.json();
      } catch {
        errData = { message: res.statusText };
      }

      const error = new Error(
        errData?.message ?? `HTTP ${res.status}`,
      ) as Error & {
        response: { status: number; data: unknown };
        status: number;
      };
      error.response = { status: res.status, data: errData };
      error.status = res.status;
      throw error;
    }

    return (await res.json()) as ResData;
  } catch (error) {
    if (error instanceof Error) {
      console.error('[api] Caught error:', error.message);
      throw error;
    }
    throw new Error('Error in api request', {
      cause: error,
    });
  }
};
