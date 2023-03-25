import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export function generateHashToken(userId: number): string {
  const random = Math.floor(Math.random() * (10000 - 1000) + 1000);
  return `${userId}-${Date.now()}-${random}`;
}

export function extractToken(authorization = '') {
  if (/^Bearer /.test(authorization)) {
    return authorization.substring(7, authorization.length);
  }
  return '';
}

export function makeFileUrl(fileName: string): string {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}
