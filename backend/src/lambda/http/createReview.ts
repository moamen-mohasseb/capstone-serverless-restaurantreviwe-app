import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import {CreaterReviewRequest } from '../../requests/CreateReviewRequest'
import { getUserId } from '../utils';
import { createreview } from '../../businessLogic/reviews'
import { v4 } from 'uuid';
import { reviewItem } from '../../models/ReviewItem'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newreview: CreaterReviewRequest = JSON.parse(event.body)
    const reviewId = v4()
    const userid=getUserId(event)
   
    const newItem = {
      reviewId: reviewId,
        userId: userid,
        done:false,    
        ...newreview
    }
    console.log("newItem: ",newItem)
    const newreviewList = await createreview(newItem as reviewItem)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newreviewList,
      }),
    };
  }
);
  
handler.use(
  cors({
    credentials: true
  })
)
