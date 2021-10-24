import { apiEndpoint } from '../config'
import { Review } from '../types/Review';
import { CreateReviewRequest } from '../types/CreateReviewRequest';
import Axios from 'axios'
import { UpdateReviewRequest } from '../types/UpdateReviewRequest';

export async function getreviews(idToken: string): Promise<Review[]> {
  console.log('Fetching reviews')

  const response = await Axios.get(`${apiEndpoint}/reviews`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('reviews:', response.data)
  return response.data.items
}

export async function createreview(
  idToken: string,
  newreview: CreateReviewRequest
): Promise<Review> {
  const response = await Axios.post(`${apiEndpoint}/reviews`,  JSON.stringify(newreview), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function updatereview(
  idToken: string,
  reviewId: string,
  updatedreview: UpdateReviewRequest
): Promise<void> {
  console.log(`${apiEndpoint}/reviews/${reviewId} :Obj: ${JSON.stringify(updatedreview)}`)
  try{const result=await Axios.patch(`${apiEndpoint}/reviews/${reviewId}`, JSON.stringify(updatedreview), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`     
    }
  })
  console.log(`result : ${result}`)
}
catch(error){console.log(`error : ${error}`)}

}

export async function deletereview(
  idToken: string,
  reviewId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/reviews/${reviewId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  reviewId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/reviews/${reviewId}/attachment`, '', {
    headers: {
     
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
 // console.log('received upload url: ' + JSON.stringify(response.data.uploadUrl))
  //console.log("back",response.data)
  return response.data.Url
  
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
