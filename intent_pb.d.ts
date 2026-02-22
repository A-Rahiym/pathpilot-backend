// package: intent
// file: intent.proto

import * as jspb from "google-protobuf";

export class ParseIntentRequest extends jspb.Message {
  getTranscribedText(): string;
  setTranscribedText(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseIntentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ParseIntentRequest): ParseIntentRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseIntentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseIntentRequest;
  static deserializeBinaryFromReader(message: ParseIntentRequest, reader: jspb.BinaryReader): ParseIntentRequest;
}

export namespace ParseIntentRequest {
  export type AsObject = {
    transcribedText: string,
  }
}

export class ParseIntentResponse extends jspb.Message {
  getIntent(): string;
  setIntent(value: string): void;

  hasDestination(): boolean;
  clearDestination(): void;
  getDestination(): string;
  setDestination(value: string): void;

  hasCategory(): boolean;
  clearCategory(): void;
  getCategory(): string;
  setCategory(value: string): void;

  getConfidence(): number;
  setConfidence(value: number): void;

  getOriginalText(): string;
  setOriginalText(value: string): void;

  getTimestamp(): string;
  setTimestamp(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseIntentResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ParseIntentResponse): ParseIntentResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseIntentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseIntentResponse;
  static deserializeBinaryFromReader(message: ParseIntentResponse, reader: jspb.BinaryReader): ParseIntentResponse;
}

export namespace ParseIntentResponse {
  export type AsObject = {
    intent: string,
    destination: string,
    category: string,
    confidence: number,
    originalText: string,
    timestamp: string,
  }
}

