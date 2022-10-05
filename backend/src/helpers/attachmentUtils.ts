import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

if (process.env.IS_OFFLINE) {
    AWSXRay.setContextMissingStrategy("LOG_ERROR");
}

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')
const s3 = new XAWS.S3({ signatureVersion: 'v4' })
const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

// TODO: Implement the fileStogare logic
export function getAttachmentUrl(todoId: string) {
    return `https://${bucketName}.s3.amazonaws.com/${todoId}`
}

export async function createAttachmentPresignedUrl(todoId: string) {
    logger.info('createAttachmentPresignedUrl', { todoId })
    
    return s3.getSignedUrl('putObject', {
        Bucket: `${bucketName}`,
        Key: `${todoId}`,
        Expires: parseInt(urlExpiration)
    })
}
