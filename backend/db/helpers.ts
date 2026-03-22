import { db } from "./database";

//wrapping db.run db.get db.all in a Promise for use with async/await
export const run = (sql: string, params: unknown[] = []) =>
    new Promise<void>((res, rej) =>
        db.run(sql, params, (e: Error | null) => (e ? rej(e) : res()))
    );

export const get = <T>(sql: string, params: unknown[] = []) =>
    new Promise<T | undefined>((res, rej) =>
        db.get(sql, params, (e: Error | null, row: unknown) => (e ? rej(e) : res(row as T)))
    );

export const all = <T>(sql: string, params: unknown[] = []) =>
    new Promise<T[]>((res, rej) =>
        db.all(sql, params, (e: Error | null, rows: unknown[]) => (e ? rej(e) : res(rows as T[])))
    );
