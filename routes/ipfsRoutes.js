import express from "express";
import multer from "multer";
import { uploadToPinata } from "../services/ipfsService.js";
import Document from "../models/Document.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });


router.post("/upload", upload.single("doc"), async (req, res) => {
  console.log("📌 POST /ipfs/upload route hit");

  try {
    if (!req.file) {
      console.error("❌ No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`📄 File received: ${req.file.originalname}, Path: ${req.file.path}`);

    // Upload to Pinata IPFS
    const cid = await uploadToPinata(req.file.path, req.file.originalname);

    console.log(`✅ File uploaded to IPFS with CID: ${cid}`);

    // Store in Database
    const newDocument = await Document.create({
      filename: req.file.originalname,
      cid,
      uploadedAt: new Date(),
    });

    newDocument.save();
    console.log(`✅ CID stored in DB: ${cid}`);
    
    res.json({ message: "File uploaded successfully!", cid });
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/document/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        console.log(`📌 GET /ipfs/document/${cid} requested`);
        const fileUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
        console.log(`✅ Returning file URL: ${fileUrl}`);
        res.json({ fileUrl });
    } catch (error) {
        console.error("❌ Error fetching file from IPFS:", error);
        res.status(500).json({ error: error.message });
    }
});


export default router;
