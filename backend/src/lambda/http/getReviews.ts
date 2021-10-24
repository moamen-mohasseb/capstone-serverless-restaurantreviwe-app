import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getreviewsForUser} from '../../businessLogic/reviews'
import { getUserId } from '../utils';
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId=getUserId(event)
    const reviews  = await getreviewsForUser(userId)
    if (reviews.count !== 0)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PATCH',
        'Access-Control-Allow-Headers': 'Accept'
      },
      body: JSON.stringify({ items: reviews }),
    }

  return {
    statusCode: 404,
    body: JSON.stringify({
      error: "Item not found",
    })
  }
})
handler.use(
  cors({
    credentials: true
  })
)
