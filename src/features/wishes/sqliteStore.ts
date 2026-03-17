import * as SQLite from 'expo-sqlite';

import type { Wish, WishCommitment } from './types';

const DB_NAME = 'ascend.db';

let db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
    if (db) return db;
    db = await SQLite.openDatabaseAsync(DB_NAME);
    await initSchema(db);
    return db;
}

async function initSchema(database: SQLite.SQLiteDatabase): Promise<void> {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS wishes (
            id TEXT PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            createdAtIso TEXT NOT NULL,
            updatedAtIso TEXT NOT NULL,
            imageUri TEXT,
            commitmentJson TEXT
        );
    `);
}

function parseCommitment(json: string | null): WishCommitment | undefined {
    if (!json) return undefined;
    try {
        const parsed = JSON.parse(json) as WishCommitment;
        if (parsed.checkIns && Array.isArray(parsed.checkIns)) {
            return parsed;
        }
        return { ...parsed, checkIns: [] };
    } catch {
        return undefined;
    }
}

function serializeCommitment(c: WishCommitment | undefined): string | null {
    if (!c) return null;
    return JSON.stringify(c);
}

export async function loadWishes(): Promise<Wish[]> {
    const database = await getDb();
    const rows = await database.getAllAsync<{
        id: string;
        title: string;
        description: string | null;
        createdAtIso: string;
        updatedAtIso: string;
        imageUri: string | null;
        commitmentJson: string | null;
    }>('SELECT * FROM wishes ORDER BY createdAtIso DESC');

    return rows.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description ?? undefined,
        createdAtIso: r.createdAtIso,
        updatedAtIso: r.updatedAtIso,
        imageUri: r.imageUri ?? undefined,
        commitment: parseCommitment(r.commitmentJson),
    }));
}

export async function insertWish(wish: Wish): Promise<void> {
    const database = await getDb();
    await database.runAsync(
        `INSERT INTO wishes (id, title, description, createdAtIso, updatedAtIso, imageUri, commitmentJson)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        wish.id,
        wish.title,
        wish.description ?? null,
        wish.createdAtIso,
        wish.updatedAtIso,
        wish.imageUri ?? null,
        serializeCommitment(wish.commitment)
    );
}

export async function updateWish(wish: Wish): Promise<void> {
    const database = await getDb();
    await database.runAsync(
        `UPDATE wishes SET title = ?, description = ?, updatedAtIso = ?, imageUri = ?, commitmentJson = ?
         WHERE id = ?`,
        wish.title,
        wish.description ?? null,
        wish.updatedAtIso,
        wish.imageUri ?? null,
        serializeCommitment(wish.commitment),
        wish.id
    );
}

export async function deleteWish(id: string): Promise<void> {
    const database = await getDb();
    await database.runAsync('DELETE FROM wishes WHERE id = ?', id);
}
