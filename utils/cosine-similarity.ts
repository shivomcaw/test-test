import { pipeline } from "@xenova/transformers";
import { ElementInfo } from "./types/element-info";

function cosineSimilarity(vecA: any, vecB: any) {
  const dotProduct = vecA.data.reduce((sum, a, i) => sum + a * vecB.data[i], 0);
  const magnitudeA = Math.sqrt(vecA.data.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.data.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function computeSimilarity(
  sourceSentence: string,
  sentencesToCompare: string[]
) {
  const model = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  const sourceEmbedding = await model(sourceSentence);
  const comparisons = await Promise.all(
    sentencesToCompare.map((sentence) => model(sentence))
  );

  const similarityScores = comparisons.map((embedding) =>
    cosineSimilarity(sourceEmbedding, embedding)
  );

  return similarityScores;
}

export async function findMostSimilarElementHandle(
  sourceSentence: string,
  elementsToCompare: ElementInfo[]
): Promise<{ score: number; element: ElementInfo }> {
  const textsToCompare = elementsToCompare.map((e) => e.text);
  const similarityScores = await computeSimilarity(
    sourceSentence,
    textsToCompare
  );

  const maxIndex = similarityScores.indexOf(Math.max(...similarityScores));

  return {
    element: elementsToCompare[maxIndex],
    score: similarityScores[maxIndex],
  };
}
