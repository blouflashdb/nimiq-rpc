import type { HttpClient } from '../client/http.ts'
import { DEFAULT_OPTIONS } from '../client/http.ts'
import type { RPCData } from "../types/logs.ts";

export interface HexSerializationParams {
  data: Uint8Array
}

export interface HexDeserializationParams {
  hexString: string
}

/**
 * SerdeHelper class provides methods to serialize and deserialize data.
 */
export class SerdeHelper {
  private client: HttpClient

  constructor(http: HttpClient) {
    this.client = http
  }

  /**
   * Serializes a byte array to a hexadecimal string.
   *
   * RPC method name: "serializeToHex"
   *
   * @param params - The byte array to serialize.
   * @param options - Optional settings for the request.
   * @returns The serialized hexadecimal string.
   */
  public serializeToHex(
    { data }: HexSerializationParams,
    options = DEFAULT_OPTIONS,
  ): Promise<RPCData<string>> {
    return this.client.call<string>({
      method: 'serializeToHex',
      params: [Array.from(data)],
    }, options)
  }

  /**
   * Deserializes a hexadecimal string to a byte array.
   *
   * RPC method name: "deserializeFromHex"
   *
   * @param params - The hexadecimal string to deserialize.
   * @param options - Optional settings for the request.
   * @returns The deserialized byte array.
   */
  public deserializeFromHex(
    { hexString }: HexDeserializationParams,
    options = DEFAULT_OPTIONS,
  ) {
    return this.client.call<Uint8Array>({
      method: 'deserializeFromHex',
      params: [hexString],
    }, options)
  }
}
