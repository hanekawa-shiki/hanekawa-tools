declare module 'mime-db' {
  interface MimeEntry {
    source?: string;
    charset?: string;
    compressible?: boolean;
    extensions?: string[];
  }

  const db: Record<string, MimeEntry>;
  export default db;
}
