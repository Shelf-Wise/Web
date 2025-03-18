import { Genre } from "./Genre";

export type Book = {
  id: string;
  title: string;
  author: string;
  publicationYear: number;
  isbn: string;
  status: BookStatus;
  imageUrl: string;
  genreIds: string[]
};

export type BookRead = {
  id: string;
  title: string;
  author: string;
  publicationYear: number;
  isbn: string;
  status: BookStatus;
  imageUrl: string;
  genres: Genre[]
};

export const enum BookStatus {
  AVAILABLE,
  BORROWED,
  DAMAGED,
}

export const mapBookEnum: Record<BookStatus, string> = {
  [BookStatus.AVAILABLE]: "Available",
  [BookStatus.BORROWED]: "Borrowed",
  [BookStatus.DAMAGED]: "Damaged",
};

export type BookBorrow = {
  id: string;
  bookId: string;
  memberId: string;
  borrowDate: string;
  dueDate: string;
};

export interface BorrowedBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  bookStatus: string;
  imageUrl: string;
  memberId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  createdAt: string;
}