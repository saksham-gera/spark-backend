import fs from "fs";
import FormData from "form-data";
import pinataSDK from "@pinata/sdk";
import dotenv from "dotenv";

dotenv.config();

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);

console.log("✅ Pinata SDK Initialized");

export const uploadToPinata = async (filePath, fileName) => {
  try {
    console.log(`📤 Uploading file to Pinata: ${filePath}`);

    const fileStream = fs.createReadStream(filePath);
    const options = {
      pinataMetadata: {
        name: fileName, // ✅ Include the file name
      },
      pinataOptions: {
        cidVersion: 1,
      },
    };

    const result = await pinata.pinFileToIPFS(fileStream, options);
    console.log(`✅ Pinata Response: CID = ${result.IpfsHash}`);

    return result.IpfsHash; // Returns the CID
  } catch (error) {
    console.error("❌ Error uploading to Pinata:", error);
    throw error;
  }
};
