import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from '@langchain/openai';
import dbConnect from '@/lib/db/db';
import { formidable } from 'formidable';

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the multipart form data
    const form = formidable();
    const [fields, files] = await form.parse(req);

    if (!files.pdf?.[0]) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }

    const pdfFile = files.pdf[0];

    // Connect to MongoDB
    const mongoose = await dbConnect();
    const collection = mongoose.connection.collection("documents");

    // Initialize embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-ada-002"
    });

    // Clear existing documents
    await collection.deleteMany({});

    // Load and process the PDF
    const loader = new PDFLoader(pdfFile.filepath);
    const docs = await loader.load();

    // Split documents
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 400,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);

    console.log(`Processing ${splitDocs.length} document chunks...`);

    // Store documents with embeddings
    for (const doc of splitDocs) {
      try {
        // Generate embedding for the document
        const embedding = await embeddings.embedQuery(doc.pageContent);
        
        // Store document with embedding as an array
        const docToStore = {
          text: doc.pageContent,
          embedding: embedding,
          metadata: doc.metadata
        };
        
        await collection.insertOne(docToStore);
        console.log('Stored document:', {
          textLength: doc.pageContent.length,
          hasEmbedding: embedding.length === 1536,
          metadata: doc.metadata
        });
      } catch (error) {
        console.error('Error processing document:', error);
      }
    }

    // Remove the programmatic index creation since we're uxsing Atlas Search
    console.log('Documents stored successfully with embeddings');

    return res.status(200).json({
      success: true,
      message: `Processed ${splitDocs.length} document chunks`
    });

  } catch (error) {
    console.error('Ingest error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}