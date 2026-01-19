import { Request } from 'express';
import { PayloadInterface } from 'src/interface/payload.interface';

// Utility function to extract token payload from request
export function getPayload(req: Request) {
  return req['user'] as PayloadInterface;
}
