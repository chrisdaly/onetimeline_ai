import type { NextApiRequest, NextApiResponse } from "next";
import { AzureOpenAI } from "openai";

const endpoint = process.env.AZURE_ENDPOINT;
const apiKey = process.env.OPENAI_API_KEY;
const deployment = process.env.OPENAI_MODEL;
const apiVersion = process.env.OPENAI_API_VERSION;

console.log(endpoint, apiKey, deployment, apiVersion);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { prompt } = req.body;
      const client = new AzureOpenAI({
        apiKey,
        endpoint,
        deployment,
        apiVersion,
      });

      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

      const response = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "", // Ensure this is set correctly
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that translates natural language from the user into machine-readable data. Today's date is ${today}. Here is the structure of the data you must create: [{"id": 1, "name": "Project Planning", "start": "2024-09-01", "end": "2024-09-05", "dependency": "2"}]. Please ensure it's valid JSON. DO NOT ADD ANY EXTRA INFORMATION.`,
          },
          { role: "user", content: prompt },
        ],
      });

      console.log("CHATGPT response", response.choices[0]?.message?.content, typeof response.choices[0]?.message?.content);
      // Extract and format the content from the response
      let content = response.choices[0]?.message?.content?.trim().replace("```json", "").replace("```", "") || "[]";
      console.log("content", content, typeof content);

      content = JSON.parse(content);
      console.log("content", content, typeof content);
      // Return formatted response
      res.status(200).json({ content });
    } catch (error) {
      console.error("Error contacting Azure OpenAI:", error);
      res.status(500).json({ error: "Error contacting Azure OpenAI" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
