export type AntiThrottleConfiguration = {
  maxRequest?: number;
  interval?: number;
  readMaxRequest?: number;
  readInterval?: number;
  writeMaxRequest?: number;
  writeInterval?: number;
  strictMaxRequest?: number;
  strictInterval?: number;
};
