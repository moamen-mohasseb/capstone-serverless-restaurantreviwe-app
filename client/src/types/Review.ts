export interface Review {
  reviewId: string
  createdAt: string
  restaurantName: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
  reviewDetails: string
  reviewDegree: Number

}
