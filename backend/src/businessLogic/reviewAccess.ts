import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import {reviewItem} from "../models/ReviewItem"
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);
export default class reviewAccess {
    
    //const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
    s3 = new XAWS.S3({signatureVersion: "v4",
      }) 
    constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly Tabel_Name = process.env.reviewS_TABLE,
      private readonly CREATED_AT_INDEX = process.env.reviewS_CREATED_AT_INDEX,
      private readonly s3_bucket = process.env.ATTACHMENT_S3_BUCKET
     // private  s3 = new AWS.S3({signatureVersion: "v4",
      
    ) { }

 async  accessCreatereview(
    newItem:reviewItem ):Promise<reviewItem> {
        await this.docClient.put({
            TableName: this.Tabel_Name,
            Item: newItem
        }).promise()
        return newItem
   }
    async  accessDeletereview(
    reviewId,
    userId
  ): Promise<void> {
    console.log("delete ID",reviewId, userId)
    try{
      await this.docClient.delete(
        {
          TableName: this.Tabel_Name,
          Key: {
            reviewId,
            userId
          }
  }).promise()
  console.log("Item Deleted")
    }
    catch(error){
      console.log(error)
    }
}

async  accessCreateAttachmentPresignedUrl(
  reviewId: String,
  userId: String,
): Promise<string> {
  try{
    console.log(userId)
  const attachmentUrl = await this.s3.getSignedUrl("putObject", {
      Bucket:this.s3_bucket,
      Key:reviewId,
      Expires: 500
    });
    const params1 = {
      TableName: this.Tabel_Name,
      Key: 
      {reviewId: reviewId,userId:userId },
      UpdateExpression: "set attachmentUrl = :a"
      ,
      ExpressionAttributeValues: {
        ':a':  `https://${this.s3_bucket}.s3.amazonaws.com/${reviewId}`
      },
      ReturnValues: 'UPDATED_NEW'
    }
    await this.docClient.update(params1,function (err, data) {
      if (err) {
        console.log("ERRROR " + err);
        throw new Error("Error " + err);
      } else {
        console.log("Element updated " + data);
      }
    }).promise()
    console.log(attachmentUrl)
    return attachmentUrl;
  }
  catch(error){
    console.log(error)
    return `${error}  error attachment url`
  }
}
  async  accessGetreviewsForUser(userId):Promise<any>{
    const allItems =await this.docClient
    .query({
      TableName: this.Tabel_Name,
      IndexName: this.CREATED_AT_INDEX,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    })
    .promise();

  return allItems.Items;
}
}
 