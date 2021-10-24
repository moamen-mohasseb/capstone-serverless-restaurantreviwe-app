/**
 * Fields in a request to update a single review item.
 */
export interface UpdateReviewRequest {
  restaurantName: string
  dueDate: string
  done: boolean
}