// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useGetMembersQuery } from "@/state/member/MemberApiSlice";
// import {
//   useGetBooksQuery,
//   useBorrowBookMutation,
// } from "@/state/book/BookApiSlice";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { BookStatus, mapBookEnum } from "@/types/Book";
// import { Badge } from "@/components/ui/badge";

// export const BorrowBooks = () => {
//   const [selectedMemberId, setSelectedMemberId] = useState("");
//   const [selectedBookId, setSelectedBookId] = useState("");

//   const {
//     data: members,
//     isLoading: isLoadingMembers,
//     isError: isErrorMembers,
//   } = useGetMembersQuery();

//   const {
//     data: books,
//     isLoading: isLoadingBooks,
//     isError: isErrorBooks,
//   } = useGetBooksQuery();

//   const [borrowBook, { isLoading: isBorrowing }] = useBorrowBookMutation();

//   const handleBorrow = async () => {
//     if (!selectedMemberId || !selectedBookId) return;

//     try {
//       await borrowBook({
//         memberId: selectedMemberId,
//         bookId: selectedBookId,
//       }).unwrap();

//       // Reset selections after successful borrow
//       setSelectedMemberId("");
//       setSelectedBookId("");

//       // You could add a success message here using a toast notification
//     } catch (error) {
//       console.error("Failed to borrow book:", error);
//       // You could add an error message here using a toast notification
//     }
//   };

//   if (isLoadingMembers || isLoadingBooks) {
//     return <div>Loading...</div>;
//   }

//   if (isErrorMembers || isErrorBooks) {
//     return <div>Error fetching data</div>;
//   }

//   const statusVariant: Record<BookStatus, string> = {
//     [BookStatus.AVAILABLE]: "available",
//     [BookStatus.BORROWED]: "borrowed",
//     [BookStatus.DAMAGED]: "damaged",
//   };

//   return (
//     <div className="px-4 md:px-16 py-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold">Borrow Book</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Select Member</label>
//               <Select
//                 value={selectedMemberId}
//                 onValueChange={setSelectedMemberId}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select a member" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {members?.value.map((member) => (
//                     <SelectItem key={member.id} value={member.id}>
//                       {member.fullName}
//                     </SelectItem>
//                   )) || []}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium">Select Books</label>
//               <Select value={selectedBookId} onValueChange={setSelectedBookId}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select a Book" />
//                 </SelectTrigger>
//                 <SelectContent className="w-full">
//                   {books?.value.map((book) => (
//                     <SelectItem key={book.id} value={book.id}>
//                       <div className="flex justify-between items-center w-full">
//                         <p>
//                           {book.title}
//                           {"             "}
//                         </p>
//                         <Badge
//                           variant={
//                             statusVariant[book.status as BookStatus] as
//                               | "available"
//                               | "borrowed"
//                               | "damaged"
//                           }
//                           className="px-3 py-1"
//                         >
//                           {mapBookEnum[book.status as BookStatus]}
//                         </Badge>
//                       </div>
//                     </SelectItem>
//                   )) || []}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex items-end">
//               <Button
//                 onClick={handleBorrow}
//                 disabled={!selectedMemberId || !selectedBookId || isBorrowing}
//                 className="w-full"
//               >
//                 {isBorrowing ? "Processing..." : "Borrow Book"}
//               </Button>
//             </div>
//           </div>

//           <div className="mt-8">
//             <h2 className="text-xl font-semibold mb-4">
//               Currently Borrowed Books
//             </h2>
//             <Table>
//               <TableCaption>List of currently borrowed books</TableCaption>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Book Title</TableHead>
//                   <TableHead>Borrowed By</TableHead>
//                   <TableHead>Borrow Date</TableHead>
//                   <TableHead>Due Date</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 <TableRow>
//                   <TableCell colSpan={4} className="text-center">
//                     Select a Member to View all Borrowed Books
//                   </TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default BorrowBooks;
