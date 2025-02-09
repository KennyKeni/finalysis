import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";
import dbConnect from '@/lib/db/db';

const cache = {
    chain: new WeakMap()
};

export function clearChainCache() {
    cache.chain = new WeakMap();
}

export async function initChain() {
    const mongoose = await dbConnect();
    const collection = mongoose.connection.collection("documents");

    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "text-embedding-ada-002"
    });

    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
        collection,
        indexName: "default",
        textKey: "text",
        embeddingKey: "embedding",
        searchType: "similarity",
        searchOptions: {
            numCandidates: 100,
            limit: 3
        }
    });

    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0,
    });

    const retrievalChain = RunnableSequence.from([
        async (input) => {
            try {
                // First check if we can find any documents at all
                const count = await collection.countDocuments();
                console.log('Total documents in collection:', count);

                const results = await vectorStore.similaritySearch(input, 3);
                console.log('Search Results:', {
                    query: input,
                    count: results.length,
                    documents: results.map(doc => ({
                        textPreview: (doc.pageContent || doc.text || '').substring(0, 100) + '...',
                        metadata: doc.metadata
                    }))
                });

                if (results.length === 0) {
                    console.log('No results found - checking collection content');
                    const sampleDocs = await collection.find({}).limit(1).toArray();
                    console.log('Sample document structure:', JSON.stringify(sampleDocs[0], null, 2));
                }

                const context = results
                    .map(doc => String(doc?.text || doc?.pageContent || ''))
                    .filter(text => text.length > 0)
                    .join('\n\n');

                return {
                    context: context || 'No relevant information found.',
                    question: input
                };
            } catch (error) {
                console.error('Vector Search Error:', error);
                throw error;
            }
        },
        PromptTemplate.fromTemplate(`
            Answer the question based only on the following context:
            {context}
            
            Question: {question}
            
            Respond in a concise sentences.
            If the context doesn't contain the information, say "The context provided does not contain this information."
            
            Answer:
        `),
        model,
        new StringOutputParser()
    ]);

    return retrievalChain;
}

export { initChain };