import { v4 as uuidv4 } from "uuid";
import { getAllUrls, saveUrl, findUrl, updateUrl } from "../routes/storage.js";

export const createShortUrl = ({ url, validity = 30, shortCode }) => {
    // If custom shortcode is provided, check uniqueness
    let code = shortCode || uuidv4().slice(0, 6);
    const existing = findUrl(code);
    while (existing) {
        code = uuidv4().slice(0, 6);
    }

    const createdAt = new Date();
    const expiry = new Date(createdAt.getTime() + validity * 60000);

    const urlObj = {
        shortCode: code,
        url,
        createdAt: createdAt.toISOString(),
        expiry: expiry.toISOString(),
        clicks: [],
    };

    saveUrl(urlObj);
    return { code, expiry: expiry.toISOString() };
};

export const getShortUrl = (code) => {
    return findUrl(code);
};

export const addClick = (code, meta) => {
    const url = findUrl(code);
    if (url) {
        url.clicks.push(meta);
        updateUrl(code, { clicks: url.clicks });
    }
};
