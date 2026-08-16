import { Response } from 'express';

export interface ResponseCapture {
  write: Response['write'];
  end: Response['end'];
  chunks: Buffer[];
}
