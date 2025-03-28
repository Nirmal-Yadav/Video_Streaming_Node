import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    // Upload file
    const response = await cloudinary.uploader.upload(
      localFilePath, //"https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg"
      {
        resource_type: "auto", // image , raw , video
      }
    );
    console.log("file uploaded in cloudinary", response.url);
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  }
  return null; // remove locally saved temp file as the upload operation got failed
};

export { uploadOnCloudinary };

//   reponse object {
//     "asset_id": "123abc456def",
//     "public_id": "sample-folder/my-uploaded-file",
//     "version": 1700000000,
//     "version_id": "abcd1234efgh5678ijkl",
//     "signature": "d1a2b3c4d5e6f7g8h9i0",
//     "width": 800,
//     "height": 600,
//     "format": "jpg",
//     "resource_type": "image",
//     "created_at": "2024-03-24T12:34:56Z",
//     "tags": [],
//     "bytes": 123456,
//     "type": "upload",
//     "etag": "abc123def456",
//     "placeholder": false,
//     "url": "http://res.cloudinary.com/demo/image/upload/v1700000000/sample-folder/my-uploaded-file.jpg",
//     "secure_url": "https://res.cloudinary.com/demo/image/upload/v1700000000/sample-folder/my-uploaded-file.jpg",
//     "original_filename": "my-local-file"
//   }
