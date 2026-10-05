const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

const getImageUrl = (image) => {
    if (!image) {
        return null;
    }

    if (image.startsWith("gridfs:")) {
        const fileId = image.substring(7);

        return `${API_URL}/listings/image/${fileId}`;
    }

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }

    return `${API_URL}/uploads/${image}`;
};

export default getImageUrl;