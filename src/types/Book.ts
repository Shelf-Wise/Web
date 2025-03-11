export type Book = {
  id: string;
  title: string;
  author: string;
  publicationYear: number;
  isbn: string;
  status: BookStatus;
  imageUrl: string;
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
