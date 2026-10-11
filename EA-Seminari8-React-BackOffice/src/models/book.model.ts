import type { Author } from './author.model';

export type BookLanguage = 'es' | 'ca' | 'en';

// Los mismos idiomas y etiquetas que acepta la API del backend
export const BOOK_LANGUAGES: BookLanguage[] = ['es', 'ca', 'en'];
export const BOOK_TAGS = ['ciencia-ficcion', 'fantasia', 'novela', 'ensayo', 'poesia', 'historia'];

// Datos para crear o actualizar un libro.
// Incluimos publisher (editorial) que pedía el ejercicio.
export interface BookInput {
  title: string;
  isbn: string;
  authors: string[];
  edition?: number;
  publisher?: string; // Campo opcional de editorial añadido en el ejercicio
  publishedYear?: number;
  pages?: number;
  language?: BookLanguage;
  tags?: string[];
  price?: number;
  description?: string;
}

// Libro completo tal como nos lo devuelve la API (con su _id y los autores ya cargados)
export interface Book extends Omit<BookInput, 'authors'> {
  _id: string;
  authors: Author[];
  createdAt?: string;
  updatedAt?: string;
}

export type CreateBook = BookInput;
export type UpdateBook = Partial<BookInput>;
