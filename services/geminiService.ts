
import { GoogleGenAI, Type } from "@google/genai";
import { LoanDetails, AIAdvice } from "../types";

export const getFinancialAdvice = async (details: LoanDetails): Promise<AIAdvice> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    As a professional financial advisor, analyze this loan scenario:
    - Principal: $${details.principal}
    - Interest Rate: ${details.interestRate}%
    - Term: ${details.termYears} years
    - Borrower's Monthly Income: $${details.monthlyIncome || 'Not provided'}
    - Borrower's Monthly Expenses: $${details.monthlyExpenses || 'Not provided'}
    
    Calculate the potential impact on the borrower's life and provide structured advice.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: {
            type: Type.NUMBER,
            description: "A financial risk score from 1 (low risk) to 10 (very high risk).",
          },
          verdict: {
            type: Type.STRING,
            description: "A short, catchy verdict like 'Highly Recommended' or 'Proceed with Caution'.",
          },
          pros: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 3 pros of this loan.",
          },
          cons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 3 potential drawbacks.",
          },
          recommendation: {
            type: Type.STRING,
            description: "A 2-3 sentence personalized recommendation.",
          },
        },
        required: ["riskScore", "verdict", "pros", "cons", "recommendation"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid AI response format");
  }
};
