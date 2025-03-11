export interface ApiResponse<T> {
  value: T;
  isSuccess: boolean;
  isFailure: boolean;
  error: Error | null;
}
