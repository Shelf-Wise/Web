import React, { useState } from "react";
import { useGetBookRecommendationByIdQuery } from "../state/book/BookApiSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpenText, UserCircle, BookIcon, RefreshCcw } from "lucide-react";

// Import your types
import { BookRecommendation, BookStatus } from "../types/Book";
import { useGetMembersQuery } from "@/state/member/MemberApiSlice";

const BookRecommendationPage: React.FC = () => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const { data: membersResponse, isLoading: isMembersLoading } =
    useGetMembersQuery();
  const {
    data: recommendationsResponse,
    isLoading: isRecommendationsLoading,
    refetch: refetchRecommendations,
  } = useGetBookRecommendationByIdQuery(selectedMemberId, {
    skip: !selectedMemberId,
  });

  // Access data using your ApiResponse structure
  const members = membersResponse?.value || [];
  const recommendations = Array.isArray(recommendationsResponse?.value)
    ? recommendationsResponse?.value
    : recommendationsResponse?.value
    ? [recommendationsResponse.value]
    : [];

  console.log(recommendations);

  const handleMemberChange = (value: string) => {
    setSelectedMemberId(value);
  };

  const refreshRecommendations = () => {
    if (selectedMemberId) {
      refetchRecommendations();
    }
  };

  return (
    <div className="container px-6 mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Book Recommendation System</h1>

      <div className="flex flex-col md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCircle className="mr-2" />
              Select Member
            </CardTitle>
            <CardDescription>
              Choose a member to get personalized book recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isMembersLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                onValueChange={handleMemberChange}
                value={selectedMemberId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={refreshRecommendations}
              disabled={!selectedMemberId}
              variant="outline"
              className="w-full"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh Recommendations
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpenText className="mr-2" />
              Book Recommendations
            </CardTitle>
            <CardDescription>
              Personalized book suggestions based on borrowing history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedMemberId ? (
              <div className="text-center p-8 text-gray-500">
                Please select a member to see recommendations
              </div>
            ) : isRecommendationsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-40 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                No recommendations found for this member
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface BookCardProps {
  book: BookRecommendation;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const statusVariant: Record<BookStatus, string> = {
    [BookStatus.AVAILABLE]: "available",
    [BookStatus.BORROWED]: "borrowed",
    [BookStatus.DAMAGED]: "damaged",
  };
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="h-40 bg-gray-100 flex items-center justify-center">
        {book.imageUrl ? (
          <img
            src={book.imageUrl}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <BookIcon className="h-16 w-16 text-gray-400" />
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg line-clamp-1">{book.title}</CardTitle>
        <CardDescription className="line-clamp-1">
          {book.author} ({book.publicationYear})
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex gap-1 flex-wrap mb-2">
          {book.genres && book.genres.length > 0 ? (
            <>
              {book.genres.slice(0, 3).map((genreId, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {genreId.name}
                </Badge>
              ))}
              {book.genres.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{book.genres.length - 3} more
                </Badge>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-500">No genres available</span>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-500 mt-2">
          <span className="capitalize">
            <Badge
              variant={
                statusVariant[book.status] as
                  | "available"
                  | "borrowed"
                  | "damaged"
              }
              className="px-3 py-1"
            >
              {statusVariant[book.status]}
            </Badge>
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookRecommendationPage;
