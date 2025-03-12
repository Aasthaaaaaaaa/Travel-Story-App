import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    if (!imageFile) {
        throw new Error("No image file provided");
    }

    const toBase64 = (file) => 
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    try {
        const base64Image = await toBase64(imageFile);
        const response = await axiosInstance.post("/image-upload", { image: base64Image });

        console.log("✅ Upload Successful:", response.data);

        return { imageUrl: response.data.imageUrl, publicId: response.data.publicId }; // Ensure it returns an object
    } catch (error) {
        console.error("❌ Error uploading the image:", error.response?.data || error.message);
        throw error;
    }
};

export default uploadImage;
