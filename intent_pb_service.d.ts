// package: intent
// file: intent.proto

import * as intent_pb from "./intent_pb";
import {grpc} from "@improbable-eng/grpc-web";

type IntentServiceParseIntent = {
  readonly methodName: string;
  readonly service: typeof IntentService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof intent_pb.ParseIntentRequest;
  readonly responseType: typeof intent_pb.ParseIntentResponse;
};

export class IntentService {
  static readonly serviceName: string;
  static readonly ParseIntent: IntentServiceParseIntent;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class IntentServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  parseIntent(
    requestMessage: intent_pb.ParseIntentRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: intent_pb.ParseIntentResponse|null) => void
  ): UnaryResponse;
  parseIntent(
    requestMessage: intent_pb.ParseIntentRequest,
    callback: (error: ServiceError|null, responseMessage: intent_pb.ParseIntentResponse|null) => void
  ): UnaryResponse;
}

