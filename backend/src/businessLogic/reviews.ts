import {reviewItem} from "../models/ReviewItem"
import reviewAccess from "./reviewAccess";
//import {accessCreateAttachmentPresignedUrl,accessCreatereview,accessDeletereview,accessGetreviewsForUser,accessUpdatereview} from "./reviewAccess"
const acessobj= new reviewAccess
export async function createreview(
    newItem:reviewItem ):Promise<reviewItem> {
        await acessobj.accessCreatereview(newItem)
        return newItem
   }
   export async function deletereview(
    reviewId,
    userId
  ): Promise<void> {
    console.log("delete ID",reviewId, userId)
    acessobj.accessDeletereview(reviewId,userId)
}
export async function createAttachmentPresignedUrl(
    reviewId: String,
    userId: String
  ): Promise<string> {
   
      return acessobj.accessCreateAttachmentPresignedUrl(reviewId,userId); 
  }
  export async function getreviewsForUser(userId):Promise<any>{
   
  return acessobj.accessGetreviewsForUser(userId);
}
