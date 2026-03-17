export type WishCommitment = {
    title: string;
    durationDays: number;
    startDateIso?: string;
    /** Start-of-day timestamps (ms) for checked-in days. */
    checkIns?: number[];
};

export type Wish = {
    id: string;
    title: string;
    description?: string;
    createdAtIso: string;
    updatedAtIso: string;
    imageUri?: string;
    commitment?: WishCommitment;
};

