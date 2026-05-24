export function getApiData<T>(payload: unknown): T | undefined {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data?: T }).data;
  }

  return payload as T;
}

export function isApiSuccess(response: Response, payload: unknown): boolean {
  if (!response.ok) return false;

  if (payload && typeof payload === 'object') {
    const envelope = payload as { ok?: boolean; success?: boolean };
    if (envelope.ok === false || envelope.success === false) return false;
  }

  return true;
}

export function getApiErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const error = (payload as { error?: unknown; message?: unknown }).error;
    const message = (payload as { message?: unknown }).message;

    if (error && typeof error === 'object' && 'message' in error) {
      const nestedMessage = (error as { message?: unknown }).message;
      if (typeof nestedMessage === 'string' && nestedMessage.trim()) {
        return nestedMessage;
      }
    }

    if (typeof error === 'string' && error.trim()) return error;
    if (typeof message === 'string' && message.trim()) return message;
  }

  return fallback;
}

export async function readApiJson(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}
