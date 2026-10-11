import { environment } from '../config/environment';

// Clase simple para guardar los errores que nos devuelve la API con su código HTTP
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Función común para hacer peticiones fetch a la API.
// Funciona igual que en React web, pero apuntando a la URL calculada según si estamos en Android o no.
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  const url = `${environment.apiUrl}${path}`;

  try {
    res = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch (err: unknown) {
    // Si cancelamos la petición nosotros mismos (AbortController), dejamos pasar el error
    if (typeof DOMException !== 'undefined' && err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    // Si no conecta, avisamos de que comprueben si el backend está arrancado
    throw new ApiError(
      `No se puede conectar con la API en ${url}. ¿Está arrancado el backend en el puerto 1337?`,
      0,
    );
  }

  // Si la API responde con error (400, 404, 422, etc.), leemos el mensaje
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.message ?? `Error HTTP ${res.status}`, res.status);
  }

  // Si es un DELETE que responde 204 No Content, no hay cuerpo JSON que leer
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
