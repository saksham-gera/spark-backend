import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  cid: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Document = mongoose.model('GovDocuments', DocumentSchema);


export default Document;