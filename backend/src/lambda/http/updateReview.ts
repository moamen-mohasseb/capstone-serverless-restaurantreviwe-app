import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updatereview } from '../../businessLogic/reviews'
import { UpdateReviewRequest } from '../../requests/UpdateReviewRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const reviewId = event.pathParameters.reviewId
    const updatedreview: UpdateReviewRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const result=await updatereview(reviewId, updatedreview, userId)
     return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PATCH',
        'Access-Control-Allow-Headers': 'Accept'
      },
      body: JSON.stringify({result})
    }    

    }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
