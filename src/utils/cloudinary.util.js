import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

export const uploadFileOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null
        }
        const response = await cloudinary.uploader
            .upload(
                localFilePath, {
                resource_type: "auto"
            }
            )
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}