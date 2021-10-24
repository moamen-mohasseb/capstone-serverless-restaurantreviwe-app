/**
 * Fields in a request to create a single review item.
 */
export interface CreaterReviewRequest {
  restaurantName: string
  dueDate: string
  reviewDetails: string
  reviewDegree: Number
}
