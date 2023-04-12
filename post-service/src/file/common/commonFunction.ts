import bcrypt from 'bcrypt';

export function makeFileUrl(fileName: string): string {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}
