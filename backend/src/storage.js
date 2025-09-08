import fs from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "src", "data.json");

// Ensure file exists
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ urls: [] }, null, 2));
}

const readData = () => {
    const raw = fs.readFileSync(dataFile);
    return JSON.parse(raw);
};

const writeData = (data) => {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

export const getAllUrls = () => {
    return readData().urls;
};

export const saveUrl = (urlObj) => {
    const data = readData();
    data.urls.push(urlObj);
    writeData(data);
};

export const updateUrl = (shortCode, updatedFields) => {
    const data = readData();
    const index = data.urls.findIndex((u) => u.shortCode === shortCode);
    if (index !== -1) {
        data.urls[index] = { ...data.urls[index], ...updatedFields };
        writeData(data);
    }
};

export const findUrl = (shortCode) => {
    return getAllUrls().find((u) => u.shortCode === shortCode);
};
