export interface Book {
  createdAt: string;
  name: string;
  author: string;
  publishedAt: string;
  id: string;
}

export type BookFormValue = Pick<Book, 'name' | 'author' | 'publishedAt'>;
