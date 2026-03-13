export const base64ToBlobUrl = async (image) => {
    const cleanedBase64 = image.replace(/"/g, '');
    const response = await fetch(cleanedBase64);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
};
