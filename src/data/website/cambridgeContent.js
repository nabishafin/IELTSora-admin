/*
 * reading.js, listening.js, writing.js and speaking.js in this folder are IDENTICAL copies of the
 * student website's src/data files, so the admin shows exactly the built-in Cambridge content the
 * website shows. Keep them in sync when the website's files change.
 *
 * On the website this module returns uploaded content; in the admin there is none, so every lookup
 * returns the built-in default.
 */
export const getCambridgeOverride = () => null;
export const parseUploadedId = () => null;
