import crypto from "crypto";

export function extractExtensionFromString(fileName) {
    if(typeof fileName !== "string") return undefined;
    return fileName.split(".").at(-1);
}

export function generateRandomId() {
    return crypto.randomBytes(16).toString("hex");
}