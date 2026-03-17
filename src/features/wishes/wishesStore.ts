import { useCallback, useMemo, useState } from 'react';

import type { Wish } from './types';

function nowIso(): string {
    return new Date().toISOString();
}

function createId(): string {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const seed: Wish[] = [
    {
        id: 'seed-1',
        title: 'Learn React Native',
        description: 'Build the first offline screens and navigation.',
        createdAtIso: nowIso(),
        updatedAtIso: nowIso(),
        commitment: {
            title: 'Work on it daily',
            durationDays: 14,
        },
    },
];

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
};

export function useWishesStore(): WishesStore {
    const [wishes, setWishes] = useState<Wish[]>(seed);

    const getById = useCallback(
        (id: string) => wishes.find((w) => w.id === id),
        [wishes]
    );

    const createWish = useCallback((input: CreateWishInput) => {
        const ts = nowIso();
        const wish: Wish = {
            id: createId(),
            title: input.title.trim(),
            description: input.description?.trim() || undefined,
            imageUri: input.imageUri,
            createdAtIso: ts,
            updatedAtIso: ts,
            commitment:
                input.commitmentTitle && input.durationDays
                    ? {
                          title: input.commitmentTitle.trim(),
                          durationDays: input.durationDays,
                          startDateIso: input.commitmentStartDateIso,
                      }
                    : undefined,
        };

        setWishes((prev) => [wish, ...prev]);
        return wish;
    }, []);

    const updateWish = useCallback((id: string, input: UpdateWishInput) => {
        let updated: Wish | undefined;

        setWishes((prev) =>
            prev.map((w) => {
                if (w.id !== id) {
                    return w;
                }

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
                                  startDateIso: input.commitmentStartDateIso,
                              }
                            : undefined,
                };
                return updated;
            })
        );

        return updated;
    }, []);

    return useMemo(
        () => ({
            wishes,
            getById,
            createWish,
            updateWish,
        }),
        [wishes, getById, createWish, updateWish]
    );
}

