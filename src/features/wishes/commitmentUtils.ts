import type { WishCommitment } from './types';

function getStartOfDay(ts: number): number {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

function uniqSorted(nums: number[]): number[] {
    return [...new Set(nums)].sort((a, b) => a - b);
}

export type CommitmentProgress = {
    streak: number;
    completed: boolean;
    currentDay: number;
    startDateMs: number;
    endDateMs: number;
};

/**
 * Computes streak, completed status, and current day from a commitment.
 * Mirrors the Angular wish-store logic.
 */
export function computeCommitmentProgress(c: WishCommitment): CommitmentProgress {
    const now = Date.now();
    const todayStart = getStartOfDay(now);

    const startDateMs = c.startDateIso
        ? getStartOfDay(new Date(c.startDateIso).getTime())
        : todayStart;
    const duration = Math.max(0, c.durationDays);
    const endDateMs = startDateMs + duration * 24 * 60 * 60 * 1000;

    const all = uniqSorted((c.checkIns ?? []).map(getStartOfDay));
    const inWindow = all.filter((d) => d >= startDateMs && d < endDateMs);
    const streak = inWindow.length;
    const completed = duration > 0 && streak >= duration;

    const daysSinceStart = Math.floor((todayStart - startDateMs) / (24 * 60 * 60 * 1000));
    const currentDay = Math.min(Math.max(0, daysSinceStart) + 1, duration);

    return {
        streak,
        completed,
        currentDay,
        startDateMs,
        endDateMs,
    };
}

export function isSameCalendarDay(a: number, b: number): boolean {
    return getStartOfDay(a) === getStartOfDay(b);
}

export function getStartOfDayMs(ts: number): number {
    return getStartOfDay(ts);
}

/**
 * Formats a short streak summary for list display, e.g. "14‑day streak · Day 3" or "14‑day streak · Finished".
 */
export function formatStreakSummary(c: WishCommitment): string {
    const { streak, completed, currentDay } = computeCommitmentProgress(c);
    const duration = c.durationDays;
    const suffix = completed ? 'Finished' : `Day ${currentDay}`;
    return `${duration}-day streak · ${suffix}`;
}
