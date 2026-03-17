import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Wish, WishCommitment } from './types';
import {
    computeCommitmentProgress,
    getStartOfDayMs,
    isSameCalendarDay,
} from './commitmentUtils';
import {
    insertWish,
    loadWishes,
    updateWish as persistWish,
} from './sqliteStore';

function nowIso(): string {
    return new Date().toISOString();
}

function createId(): string {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function uniqSorted(nums: number[]): number[] {
    return [...new Set(nums)].sort((a, b) => a - b);
}


export type CreateWishInput = {
    title: string;
    description?: string;
    imageUri?: string;
    commitmentTitle?: string;
    durationDays?: number;
    commitmentStartDateIso?: string;
};

export type UpdateWishInput = CreateWishInput;

export type WishesStore = {
    wishes: Wish[];
    getById: (id: string) => Wish | undefined;
    createWish: (input: CreateWishInput) => Wish;
    updateWish: (id: string, input: UpdateWishInput) => Wish | undefined;
    checkIn: (wishId: string) => { completed: boolean };
};

export function useWishesStore(): WishesStore {
    const [wishes, setWishes] = useState<Wish[]>([]);

    useEffect(() => {
        loadWishes()
            .then(setWishes)
            .catch((err) => console.error('Failed to load wishes:', err));
    }, []);

    const getById = useCallback(
        (id: string) => wishes.find((w) => w.id === id),
        [wishes]
    );

    const createWish = useCallback((input: CreateWishInput) => {
        const ts = nowIso();
        const commitment: WishCommitment | undefined =
            input.commitmentTitle && input.durationDays
                ? {
                      title: input.commitmentTitle.trim(),
                      durationDays: input.durationDays,
                      startDateIso:
                          input.commitmentStartDateIso ||
                          new Date().toISOString().slice(0, 10),
                      checkIns: [],
                  }
                : undefined;

        const wish: Wish = {
            id: createId(),
            title: input.title.trim(),
            description: input.description?.trim() || undefined,
            imageUri: input.imageUri,
            createdAtIso: ts,
            updatedAtIso: ts,
            commitment,
        };

        setWishes((prev) => [wish, ...prev]);
        persistWish(wish).catch((err) =>
            console.error('Failed to persist new wish:', err)
        );
        return wish;
    }, []);

    const updateWish = useCallback((id: string, input: UpdateWishInput) => {
        let updated: Wish | undefined;

        setWishes((prev) =>
            prev.map((w) => {
                if (w.id !== id) {
                    return w;
                }

                const existingCheckIns = w.commitment?.checkIns ?? [];
                updated = {
                    ...w,
                    title: input.title.trim(),
                    description: input.description?.trim() || undefined,
                    imageUri: input.imageUri,
                    updatedAtIso: nowIso(),
                    commitment:
                        input.commitmentTitle && input.durationDays
                            ? {
                                  title: input.commitmentTitle.trim(),
                                  durationDays: input.durationDays,
                                  startDateIso:
                                      input.commitmentStartDateIso ||
                                      w.commitment?.startDateIso ||
                                      new Date().toISOString().slice(0, 10),
                                  checkIns: existingCheckIns,
                              }
                            : undefined,
                };
                return updated;
            })
        );

        if (updated) {
            persistWish(updated).catch((err) =>
                console.error('Failed to persist wish update:', err)
            );
        }
        return updated;
    }, []);

    const checkIn = useCallback((wishId: string): { completed: boolean } => {
        let completed = false;
        setWishes((prev) =>
            prev.map((w) => {
                if (w.id !== wishId || !w.commitment) return w;
                const currentProgress = computeCommitmentProgress(w.commitment);
                if (currentProgress.completed) return w;
                const c = w.commitment;
                const todayStart = getStartOfDayMs(Date.now());
                const startMs = c.startDateIso
                    ? getStartOfDayMs(new Date(c.startDateIso).getTime())
                    : todayStart;
                if (todayStart < startMs) return w;
                const alreadyChecked = (c.checkIns ?? []).some((d) =>
                    isSameCalendarDay(d, todayStart)
                );
                if (alreadyChecked) return w;
                const nextCheckIns = uniqSorted([
                    ...(c.checkIns ?? []),
                    todayStart,
                ]);
                const newProgress = computeCommitmentProgress({
                    ...c,
                    checkIns: nextCheckIns,
                });
                completed = newProgress.completed;
                const updated: Wish = {
                    ...w,
                    updatedAtIso: nowIso(),
                    commitment: { ...c, checkIns: nextCheckIns },
                };
                persistWish(updated).catch((err) =>
                    console.error('Failed to persist check-in:', err)
                );
                return updated;
            })
        );
        return { completed };
    }, []);

    return useMemo(
        () => ({
            wishes,
            getById,
            createWish,
            updateWish,
            checkIn,
        }),
        [wishes, getById, createWish, updateWish, checkIn]
    );
}

