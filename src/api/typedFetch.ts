export type FetchSuccess<T> = {
  ok: true;
  data: T;
};

export type FetchError = {
  ok: false;
  status?: number;
  message: string;
};

export type FetchResult<T> = FetchSuccess<T> | FetchError;

export async function typedFetch<T>(
  url: string,
  options?: RequestInit
): Promise<FetchResult<T>> {
  try {
    const response = await fetch(url, options);

    if (!response.ok && response.status != null) {
      return {
        ok: false,
        status: response.status,
        message: response.statusText
      };
    }

    const data = await response.json() as T;
    return { ok: true, data };
  } catch (error: any) {
    if (error && error.name === "AbortError") {
      return {
        ok: false,
        message: "Request cancelled"
      };
    }

    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error"
    };
  }
}