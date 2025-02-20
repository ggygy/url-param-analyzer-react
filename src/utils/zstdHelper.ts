import { decompress as fzstdDecompress } from 'fzstd';
import * as pako from 'pako';

export const decodeZstdBase64 = async (base64Data: string): Promise<any> => {
  try {
    if (!base64Data) {
      throw new Error('Input data is empty');
    }

    let decodedString: string;

    // 根据前缀判断压缩方式
    if (base64Data.startsWith('KLUv/')) {
      // zstd压缩
      console.log('Using Zstd decompression');
      const buffer = Buffer.from(base64Data, 'base64');
      const decompressed = fzstdDecompress(buffer);
      decodedString = Buffer.from(decompressed).toString();
    } else if (base64Data.startsWith('H4sI')) {
      // gzip压缩
      console.log('Using Gzip decompression');
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decompressed = pako.inflate(bytes);
      decodedString = new TextDecoder().decode(decompressed);
    } else {
      // 无压缩或未知压缩方式，尝试直接解码
      console.log('No compression detected, trying direct decode');
      const buffer = Buffer.from(base64Data, 'base64');
      decodedString = buffer.toString();
    }

    return JSON.parse(decodedString);
  } catch (error) {
    console.error('Failed to decode or decompress:', error);
    throw new Error(`Decompression failed: ${error.message}`);
  }
};
