import express from "express";
import { createShortUrl, getShortUrl, addClick } from "../models/Url.js";
import { Log } from "logging-middleware";

const router = express.Router();
const STACK = "url-service";
const PKG = "urls.js";

/**
 * POST /shorturls
 * Create a new short URL
 */
router.post("/shorturls", (req, res) => {
    try {
        const { url, validity, shortcode } = req.body;

        if (!url) {
            Log(STACK, "ERROR", PKG, "Missing url field in request body");
            return res.status(400).json({ error: "URL is required" });
        }

        const { code, expiry } = createShortUrl({ url, validity, shortCode: shortcode });

        Log(STACK, "INFO", PKG, `Short URL created: ${code} -> ${url}`);

        return res.status(201).json({
            shortLink: `${req.protocol}://${req.get("host")}/${code}`,
            expiry,
        });
    } catch (err) {
        Log(STACK, "ERROR", PKG, `Failed to create short URL: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * GET /shorturls/:shortcode
 * Retrieve statistics for a short URL
 */
router.get("/shorturls/:shortcode", (req, res) => {
    try {
        const { shortcode } = req.params;
        const url = getShortUrl(shortcode);

        if (!url) {
            Log(STACK, "WARN", PKG, `Stats requested for non-existent code: ${shortcode}`);
            return res.status(404).json({ error: "Shortcode not found" });
        }

        const stats = {
            totalClicks: url.clicks.length,
            url: url.url,
            createdAt: url.createdAt,
            expiry: url.expiry,
            clicks: url.clicks,
        };

        Log(STACK, "INFO", PKG, `Stats retrieved for ${shortcode}`);
        res.json(stats);
    } catch (err) {
        Log(STACK, "ERROR", PKG, `Failed to retrieve stats: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * GET /:shortcode
 * Redirect to the original URL and log click
 */
router.get("/:shortcode", (req, res) => {
    try {
        const { shortcode } = req.params;
        const url = getShortUrl(shortcode);

        if (!url) {
            Log(STACK, "WARN", PKG, `Redirect requested for non-existent code: ${shortcode}`);
            return res.status(404).json({ error: "Shortcode not found" });
        }

        // Check expiry
        if (new Date(url.expiry) < new Date()) {
            Log(STACK, "WARN", PKG, `Shortcode expired: ${shortcode}`);
            return res.status(410).json({ error: "Short link expired" });
        }

        // Log click
        addClick(shortcode, {
            timestamp: new Date().toISOString(),
            referrer: req.get("referer") || null,
            ip: req.ip,
        });

        Log(STACK, "INFO", PKG, `Redirecting ${shortcode} -> ${url.url}`);
        return res.redirect(url.url);
    } catch (err) {
        Log(STACK, "ERROR", PKG, `Failed redirect: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
