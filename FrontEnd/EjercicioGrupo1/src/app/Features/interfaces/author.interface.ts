export interface Author {
  createdAt: string;
  name: string;
  country: string;
  phoneNumber: string;
  id: string;
}

export type AuthorFormValue = Pick<Author, 'name' | 'country' | 'phoneNumber'>;
