import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMembersQuery } from "@/state/member/MemberApiSlice";
import {
    useGetBooksQuery,
    useBorrowBookMutation,
    useReturnBookMutation,
    useGetBorrowBooksByMemberQuery,
} from "@/state/book/BookApiSlice";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BookStatus, mapBookEnum } from "@/types/Book";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { formatDate } from "@/lib/date";

export const ReturnBooks = () => {
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [selectedBookId, setSelectedBookId] = useState("");
    const [activeTab, setActiveTab] = useState("borrow");

    const {
        data: members,
        isLoading: isLoadingMembers,
        isError: isErrorMembers,
    } = useGetMembersQuery();

    const {
        data: books,
        isLoading: isLoadingBooks,
        isError: isErrorBooks,
    } = useGetBooksQuery();

    const {
        data: borrowedBooksResponse,
        isLoading: isLoadingBorrowed,
        refetch: refetchBorrowed,
    } = useGetBorrowBooksByMemberQuery(selectedMemberId, {
        skip: !selectedMemberId,
    });

    const [borrowBook, { isLoading: isBorrowing }] = useBorrowBookMutation();
    const [returnBook, { isLoading: isReturning }] = useReturnBookMutation();

    const handleBorrow = async () => {
        if (!selectedMemberId || !selectedBookId) return;

        try {
            await borrowBook({
                memberId: selectedMemberId,
                bookId: selectedBookId,
            }).unwrap();

            // Reset book selection after successful borrow
            setSelectedBookId("");
            refetchBorrowed();

            // You could add a success message here using a toast notification
        } catch (error) {
            console.error("Failed to borrow book:", error);
            // You could add an error message here using a toast notification
        }
    };

    const handleReturn = async () => {
        if (!selectedBookId) return;

        try {
            await returnBook({
                memberId: selectedMemberId,
                bookId: selectedBookId,
            }).unwrap();

            // Reset book selection after successful return
            setSelectedBookId("");
            refetchBorrowed();

            // You could add a success message here using a toast notification
        } catch (error) {
            console.error("Failed to return book:", error);
            // You could add an error message here using a toast notification
        }
    };

    if (isLoadingMembers || isLoadingBooks) {
        return <div>Loading...</div>;
    }

    if (isErrorMembers || isErrorBooks) {
        return <div>Error fetching data</div>;
    }
    console.log(borrowedBooksResponse);

    // Access borrowed books from the response
    const borrowedBooks = Array.isArray(borrowedBooksResponse) ? borrowedBooksResponse : [];

    console.log("BorrowedBooks", borrowedBooksResponse);


    const statusVariant: Record<BookStatus, string> = {
        [BookStatus.AVAILABLE]: "available",
        [BookStatus.BORROWED]: "borrowed",
        [BookStatus.DAMAGED]: "damaged",
    };

    // Filter books based on the active tab and available data
    const availableBooks = books?.value.filter(
        (book) => book.status === BookStatus.AVAILABLE
    ) || [];

    // Get books borrowed by the selected member

    const memberBorrowedBooks = books?.value.filter(
        (book) =>
            book.status === BookStatus.BORROWED &&
            borrowedBooks.some(b => b.bookId === book.id)
    ) || [];

    return (
        <div className="px-4 md:px-16 py-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Library Book Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-medium">Select Member</label>
                        <Select
                            value={selectedMemberId}
                            onValueChange={(value) => {
                                setSelectedMemberId(value);
                                setSelectedBookId("");
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a member" />
                            </SelectTrigger>
                            <SelectContent>
                                {members?.value.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                        {member.fullName}
                                    </SelectItem>
                                )) || []}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedMemberId && (
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="borrow">Borrow Books</TabsTrigger>
                                <TabsTrigger value="return">Return Books</TabsTrigger>
                            </TabsList>

                            <TabsContent value="borrow" className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Select Available Book</label>
                                        <Select value={selectedBookId} onValueChange={setSelectedBookId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a Book" />
                                            </SelectTrigger>
                                            <SelectContent className="w-full">
                                                {availableBooks?.map((book) => (
                                                    <SelectItem key={book.id} value={book.id}>
                                                        <div className="flex justify-between items-center w-full">
                                                            <span>{book.title}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-end">
                                        <Button
                                            onClick={handleBorrow}
                                            disabled={!selectedMemberId || !selectedBookId || isBorrowing}
                                            className="w-full"
                                        >
                                            {isBorrowing ? "Processing..." : "Borrow Book"}
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="return" className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Select Book to Return</label>
                                        <Select value={selectedBookId} onValueChange={setSelectedBookId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a Book" />
                                            </SelectTrigger>
                                            <SelectContent className="w-full">
                                                {memberBorrowedBooks.map((book) => (
                                                    <SelectItem key={book.id} value={book.id}>
                                                        <div className="flex justify-between items-center w-full">
                                                            <span>{book.title}</span>
                                                            {/* <Badge
                                                                variant="borrowed"
                                                                className="px-3 py-1 ml-2"
                                                            >
                                                                {mapBookEnum[BookStatus.BORROWED]}
                                                            </Badge> */}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-end">
                                        <Button
                                            onClick={handleReturn}
                                            disabled={!selectedBookId || isReturning}
                                            className="w-full"
                                        >
                                            {isReturning ? "Processing..." : "Return Book"}
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedMemberId ? "Books Borrowed by Selected Member" : "Currently Borrowed Books"}
                        </h2>
                        <Table>
                            <TableCaption>List of currently borrowed books</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Book Title</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Borrow Date</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            {isLoadingBorrowed ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        Loading borrowed books...
                                    </TableCell>
                                </TableRow>
                            ) : borrowedBooks && borrowedBooks.length > 0 ? (
                                [...borrowedBooks]  // Create a new array with spread operator
                                    .sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
                                    .map((borrowing) => (
                                        <TableRow key={borrowing.id}>
                                            <TableCell>{borrowing.title}</TableCell>
                                            <TableCell>{borrowing.author}</TableCell>
                                            <TableCell>
                                                {formatDate(new Date(borrowing.borrowDate))}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(new Date(borrowing.dueDate))}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedBookId(borrowing.bookId);
                                                        setActiveTab("return");
                                                    }}
                                                    disabled={borrowing.returnDate !== "1/1/0001"}
                                                >
                                                    {borrowing.returnDate !== "1/1/0001" ? "Returned" : "Return"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        {selectedMemberId
                                            ? "This member has no borrowed books"
                                            : "Select a Member to View all Borrowed Books"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReturnBooks;