import type { Buffer } from 'node:buffer';

declare global {
  interface TorrentInfo {
    fileName: string;
    magnet: string;
  }

  interface TorrentFileDetail {
    file: File;
    magnetLink: string;
    totalSize: number;
  }

  type MessageType = 'success' | 'error' | 'warning' | 'info';

  interface DecodedTorrentFile {
    path: Buffer[];
    length: number;
  }

  interface ParsedTorrentInfo {
    magnetLink: string;
    totalSize: number; // 以字节为单位
  }

  interface DecodedTorrent {
    announce: Buffer;
    'announce-list'?: Buffer[][];
    info: {
      name: Buffer;
      length?: number;
      files?: DecodedTorrentFile[];
    };
  }
}
