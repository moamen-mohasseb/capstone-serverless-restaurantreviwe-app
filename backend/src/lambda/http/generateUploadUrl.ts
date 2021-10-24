import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createAttachmentPresignedUrl } from '../../businessLogic/reviews'
import { getUserId } from '../utils'
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const reviewId = event.pathParameters.reviewId
    const userId = getUserId(event)
   console.log(reviewId,userId)
    const attachmentUrl= await createAttachmentPresignedUrl(reviewId, userId)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PATCH',
        'Access-Control-Allow-Headers': 'Accept'
      },
      body: JSON.stringify({ Url: attachmentUrl })
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
