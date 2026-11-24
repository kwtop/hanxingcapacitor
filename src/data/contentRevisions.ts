import revisions from './contentRevisions.json';

/** Actual substantive editorial edits; this ledger is never updated by the build clock. */
export const contentModifiedAt: Readonly<Record<string, string>> = revisions;
