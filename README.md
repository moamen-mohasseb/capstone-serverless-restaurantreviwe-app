# Serverless review
By Moamen Mohasseb
    Capstone Project based on ToDO list Project
    AWS serverless cloud system App
    Its about restaurant food review

# Functionality of the application

This application will allow creating/updating/removing/fetching review items. Each review item can optionally have an attachment image. Each user only has access to review items that he/she has created.

# review items

The application should store review items, and each review item contains the following fields:

* `reviewId` (string) - a unique id for an item
* `reviewDetails` (string) (optional) - a Data about resturant and best food
* `reviewDegree` (Number)  - how many star this resturant desirve
* `name` (string) - name of a resturant  (e.g. "KFC")
* `reviewDate` (string) - date and time by which an reiew happend
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a review item

You might also store an id of a user who created a review item.

## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx 
* Serverless 
   * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
   * Install the Serverless Framework’s CLI  (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
   ```bash
   npm install -g serverless@2.21.1
   serverless --version
   ```
   * Login and configure serverless to use the AWS credentials 
   ```bash
   # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
   serverless login
   # Configure serverless to use the AWS credentials to deploy the application
   # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
   sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
   ```
   
# Functions to be implemented

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

* `Getreviews` - should return all reviews for a current user. A user id can be extracted from a JWT token that is sent by the frontend
![Alt text](images/2.png?raw=true "Image 2")

![Alt text](images/1.png?raw=true "Image 1")
