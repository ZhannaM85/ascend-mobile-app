export type WishCommitment = {
    title: string;
    durationDays: number;
    startDateIso?: string;
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

