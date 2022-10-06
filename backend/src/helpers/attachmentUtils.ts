import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
import { TodosAccess } from './todosAcess';

if (process.env.IS_OFFLINE) {
    AWSXRay.setContextMissingStrategy("LOG_ERROR");
}

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')
const s3 = new XAWS.S3({ signatureVersion: 'v4' })
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

// TODO: Implement the fileStogare logic
export function getAttachmentUrl(todoId: string) {
    return `https://${bucketName}.s3.amazonaws.com/${todoId}`
}

export async function createAttachmentPresignedUrl(todoId: string, userId: string) {
    logger.info('createAttachmentPresignedUrl', { todoId })

    // Update attachment url in dynamodb
    const url = getAttachmentUrl(todoId)
    logger.info('createAttachmentPresignedUrl', { url })

    const toDoAccessor = new TodosAccess();
    await toDoAccessor.updateAttachmentUrl(todoId, url, userId)

    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: parseInt(urlExpiration)
    })
}
