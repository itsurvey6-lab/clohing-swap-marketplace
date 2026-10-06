const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";


const getImageUrl = (image) => {

    if (!image) {
        return null;
    }


    // New GridFS image
    if (
        image.startsWith("gridfs:")
    ) {

        const fileId =
            image.replace(
                "gridfs:",
                ""
            );

        return `${API_URL}/listings/image/${fileId}`;

    }


    // Already a complete URL
    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {

        return image;

    }


    // Old filename-based image
    return `${API_URL}/uploads/${image}`;

};


export const getImageUrls = (
    listing
) => {

    if (
        listing?.images &&
        listing.images.length > 0
    ) {

        return listing.images.map(
            getImageUrl
        );

    }


    // Keep old listings working
    if (listing?.image) {

        return [
            getImageUrl(
                listing.image
            )
        ];

    }


    return [];

};


export default getImageUrl;