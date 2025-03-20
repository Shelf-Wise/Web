/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  LineChart,
  PieChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Pie,
  Cell,
} from "recharts";
import { BookOpen, Users, BookMarked, BookUp, AlertCircle } from "lucide-react";
import { useGetBooksQuery } from "../state/book/BookApiSlice";
import { BookStatus, mapBookEnum } from "../types/Book";
import { useGetAllGenreQuery } from "@/state/genre/genreApiSlice";
import { useGetMembersQuery } from "@/state/member/MemberApiSlice";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
];

const Dashboard = () => {
  // State for tabs
  const [activeTab, setActiveTab] = useState("overview");

  console.log("activeTab", activeTab);

  // Fetch data using RTK Query
  const {
    data: booksData,
    isLoading: booksLoading,
    error: booksError,
  } = useGetBooksQuery();
  const {
    data: genresData,
    isLoading: genresLoading,
    error: genresError,
  } = useGetAllGenreQuery();
  const {
    data: membersData,
    isLoading: membersLoading,
    error: membersError,
  } = useGetMembersQuery();

  // Derived state for dashboard
  const [booksByStatus, setBooksByStatus] = useState<
    { status: string; count: number }[]
  >([]);
  const [booksByGenre, setBooksByGenre] = useState<
    { name: string; count: number }[]
  >([]);
  const [memberBorrowStats, setMemberBorrowStats] = useState<
    { name: string; count: number }[]
  >([]);
  const [monthlyBorrowingTrend, setMonthlyBorrowingTrend] = useState<
    { month: string; books: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Process data when it's available
  useEffect(() => {
    if (booksData?.value && genresData?.value && membersData?.value) {
      // Process book status data
      const statusCounts = {
        [BookStatus.AVAILABLE]: 0,
        [BookStatus.BORROWED]: 0,
        [BookStatus.DAMAGED]: 0,
      };

      booksData.value.forEach((book) => {
        statusCounts[book.status]++;
      });

      const statusData = Object.entries(statusCounts).map(
        ([status, count]) => ({
          status: mapBookEnum[Number(status) as BookStatus],
          count,
        })
      );
      setBooksByStatus(statusData);

      // Process genre data
      const genreMap: { [key: string]: { name: string; count: number } } = {};
      genresData.value.forEach((genre) => {
        genreMap[genre.id] = { name: genre.name, count: 0 };
      });

      booksData.value.forEach((book) => {
        if (book.genreIds) {
          // Add this check
          book.genreIds.forEach((genreId) => {
            if (genreMap[genreId]) {
              genreMap[genreId].count++;
            }
          });
        }
      });

      const genreData = Object.values(genreMap)
        .filter((genre) => genre.count > 0)
        .sort((a, b) => b.count - a.count);
      setBooksByGenre(genreData);

      // Process member borrowing stats
      const memberStats = membersData.value
        .filter(
          (member) => member.noOfBooksBorrowed && member.noOfBooksBorrowed > 0
        )
        .map((member) => ({
          name: member.fullName,
          count: member.noOfBooksBorrowed || 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      setMemberBorrowStats(memberStats);

      // Generate monthly borrowing trend (simulated from borrowed books)
      // const borrowedCount = booksData.value.filter(
      //   (book) => book.status === BookStatus.BORROWED
      // ).length;
      // const monthlyData = [
      //   { month: "Jan", books: Math.floor(borrowedCount * 0.7) },
      //   { month: "Feb", books: Math.floor(borrowedCount * 0.8) },
      //   { month: "Mar", books: Math.floor(borrowedCount * 0.9) },
      //   { month: "Apr", books: borrowedCount },
      //   { month: "May", books: Math.floor(borrowedCount * 1.1) },
      //   { month: "Jun", books: Math.floor(borrowedCount * 1.2) },
      //   { month: "Jul", books: Math.floor(borrowedCount * 1.1) },
      //   { month: "Aug", books: Math.floor(borrowedCount * 0.9) },
      //   { month: "Sep", books: Math.floor(borrowedCount * 1.0) },
      //   { month: "Oct", books: Math.floor(borrowedCount * 1.1) },
      //   { month: "Nov", books: Math.floor(borrowedCount * 1.2) },
      //   { month: "Dec", books: Math.floor(borrowedCount * 1.0) },
      // ];
      // setMonthlyBorrowingTrend(monthlyData);

      setIsLoading(false);
    }
  }, [booksData, genresData, membersData]);

  if (booksLoading || genresLoading || membersLoading || isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (booksError || genresError || membersError) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              <CardTitle>Error Loading Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>
              There was an error loading the dashboard data. Please try again
              later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate summary stats
  const totalBooks = booksData?.value?.length || 0;
  const totalMembers = membersData?.value?.length || 0;
  const totalBorrowed =
    booksData?.value?.filter((book) => book.status === BookStatus.BORROWED)
      ?.length || 0;
  const totalGenres = genresData?.value?.length || 0;

  return (
    <div className="w-full p-4 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Library Management Dashboard
        </h1>
        <p className="text-gray-500">
          Visualizing library statistics and performance metrics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{totalBooks}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{totalMembers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Books Borrowed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookMarked className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">{totalBorrowed}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Genres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookUp className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">{totalGenres}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs
        defaultValue="overview"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          {/* <TabsTrigger value="borrowing">Borrowing Activity</TabsTrigger> */}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Book Collection by Genre</CardTitle>
                <CardDescription>
                  Distribution of books across different genres
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart width={400} height={300}>
                    <Pie
                      data={booksByGenre.slice(0, 6)}
                      cx={200}
                      cy={150}
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {booksByGenre.slice(0, 6).map((entry, index) => (
                        <Cell
                          key={`cell-${entry.name}-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Monthly Borrowing Trends</CardTitle>
                <CardDescription>
                  Number of books borrowed per month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LineChart
                    width={400}
                    height={300}
                    data={monthlyBorrowingTrend}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="books"
                      stroke="#0088FE"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </div>
              </CardContent>
            </Card> 
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Book Status</CardTitle>
                <CardDescription>
                  Current status of books in the library
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart width={400} height={300}>
                    <Pie
                      data={booksByStatus}
                      cx={200}
                      cy={150}
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="status"
                      label={({ status, percent }) =>
                        `${status}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {booksByStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.status === "Available"
                              ? "#4CAF50"
                              : entry.status === "Borrowed"
                              ? "#2196F3"
                              : "#FF5722"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Borrowers</CardTitle>
                <CardDescription>
                  Members with the most books borrowed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    width={400}
                    height={300}
                    data={memberBorrowStats}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#00C49F" name="Books Borrowed" />
                  </BarChart>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Books Tab */}
        <TabsContent value="books" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Books by Status</CardTitle>
                <CardDescription>
                  Current status of library books
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    width={400}
                    height={300}
                    data={booksByStatus}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#8884d8"
                      name="Number of Books"
                      isAnimationActive={true}
                    />
                  </BarChart>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Genres</CardTitle>
                <CardDescription>
                  Most popular book genres in the library
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    width={400}
                    height={300}
                    data={booksByGenre.slice(0, 5)}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#0088FE"
                      name="Number of Books"
                      isAnimationActive={true}
                    />
                  </BarChart>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Genre Distribution</CardTitle>
              <CardDescription>
                Complete breakdown of books by genre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <BarChart
                  width={800}
                  height={400}
                  data={booksByGenre}
                  margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#8884d8"
                    name="Number of Books"
                    isAnimationActive={true}
                  />
                </BarChart>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Borrowers</CardTitle>
                <CardDescription>
                  Members who borrow the most books
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    width={400}
                    height={300}
                    data={memberBorrowStats}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#00C49F"
                      name="Books Borrowed"
                      isAnimationActive={true}
                    />
                  </BarChart>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Member Statistics</CardTitle>
                <CardDescription>Key membership metrics</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Total Members</p>
                    <p className="text-2xl font-bold">{totalMembers}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">
                      Active Borrowers
                    </p>
                    <p className="text-2xl font-bold">
                      {membersData?.value?.filter(
                        (m) => m.noOfBooksBorrowed && m.noOfBooksBorrowed > 0
                      )?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm mb-1">
                    Average Books per Member
                  </p>
                  <p className="text-2xl font-bold">
                    {(
                      totalBorrowed /
                      Math.max(
                        1,
                        membersData?.value?.filter(
                          (m) => m.noOfBooksBorrowed && m.noOfBooksBorrowed > 0
                        )?.length || 0
                      )
                    ).toFixed(1)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Member Activity Overview</CardTitle>
              <CardDescription>
                Distribution of borrowing activity among members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <PieChart width={800} height={300}>
                  <Pie
                    data={[
                      {
                        name: "Active Members",
                        value:
                          membersData?.value?.filter(
                            (m) =>
                              m.noOfBooksBorrowed && m.noOfBooksBorrowed > 0
                          ).length || 0,
                      },
                      {
                        name: "Inactive Members",
                        value:
                          membersData?.value?.filter(
                            (m) =>
                              !m.noOfBooksBorrowed || m.noOfBooksBorrowed === 0
                          ).length || 0,
                      },
                    ]}
                    cx={400}
                    cy={150}
                    labelLine={true}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    <Cell fill="#4CAF50" />
                    <Cell fill="#9E9E9E" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Borrowing Activity Tab */}
        <TabsContent value="borrowing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Borrowing Trends</CardTitle>
              <CardDescription>
                Number of books borrowed each month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <LineChart
                  width={800}
                  height={400}
                  data={monthlyBorrowingTrend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="books"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Books Borrowed"
                    isAnimationActive={true}
                  />
                </LineChart>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Borrowing Statistics</CardTitle>
                <CardDescription>Current borrowing metrics</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Total Borrowed</p>
                    <p className="text-2xl font-bold">{totalBorrowed}</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Borrowing Rate</p>
                    <p className="text-2xl font-bold">
                      {((totalBorrowed / totalBooks) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm mb-1">Available Books</p>
                  <p className="text-2xl font-bold">
                    {booksData?.value?.filter(
                      (book) => book.status === BookStatus.AVAILABLE
                    )?.length || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>
                  Current status of library books
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart width={400} height={300}>
                    <Pie
                      data={booksByStatus}
                      cx={200}
                      cy={150}
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="status"
                      label={({ status, count, percent }) =>
                        `${status}: ${count} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {booksByStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.status === "Available"
                              ? "#4CAF50"
                              : entry.status === "Borrowed"
                              ? "#2196F3"
                              : "#FF5722"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
