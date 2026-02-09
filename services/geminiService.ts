import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StockData } from "../types";

const SYSTEM_INSTRUCTION = `
You are Gemini Financial Analyst Pro, a CFA Level 3 expert.
Your task is to analyze a given stock symbol based on real-time or latest available public data.
You must be conservative, data-driven, and objective.
Do not hallucinate data. If data is unclear, default to false.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    current_price: { type: Type.STRING, description: "Current market price of the stock" },
    symbol: { type: Type.STRING, description: "The stock symbol analyzed" },
    historical_data: {
      type: Type.ARRAY,
      description: "Approximate monthly closing prices for the last 6 months",
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "Month/Year e.g. 'Oct 23'" },
          price: { type: Type.NUMBER, description: "Closing price" }
        },
        required: ["date", "price"]
      }
    },
    criteria: {
      type: Type.OBJECT,
      properties: {
        rev_growth_pos: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.BOOLEAN },
            reason: { type: Type.STRING, description: "Explanation for revenue/profit growth status" }
          },
          required: ["value", "reason"]
        },
        val_attractive: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.BOOLEAN },
            reason: { type: Type.STRING, description: "Explanation for P/E or P/B valuation status" }
          },
          required: ["value", "reason"]
        },
        health_safe: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.BOOLEAN },
            reason: { type: Type.STRING, description: "Explanation for debt/cashflow status" }
          },
          required: ["value", "reason"]
        },
        story_clear: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.BOOLEAN },
            reason: { type: Type.STRING, description: "Explanation for growth story" }
          },
          required: ["value", "reason"]
        },
        trend_up: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.BOOLEAN },
            reason: { type: Type.STRING, description: "Is the main trend UP?" }
          },
          required: ["value", "reason"]
        },
        price_abv_ma: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.BOOLEAN },
            reason: { type: Type.STRING, description: "Is price above MA20 and MA50?" }
          },
          required: ["value", "reason"]
        },
        vol_support: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.BOOLEAN },
            reason: { type: Type.STRING, description: "Is volume increasing on price increases?" }
          },
          required: ["value", "reason"]
        },
        indicators_good: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.BOOLEAN },
            reason: { type: Type.STRING, description: "Are RSI/MACD positive?" }
          },
          required: ["value", "reason"]
        },
        news_support: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.BOOLEAN },
            reason: { type: Type.STRING, description: "Is macro/industry news supportive?" }
          },
          required: ["value", "reason"]
        },
        foreign_buy: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.BOOLEAN },
            reason: { type: Type.STRING, description: "Are foreign investors buying?" }
          },
          required: ["value", "reason"]
        },
      },
      required: [
        "rev_growth_pos", "val_attractive", "health_safe", "story_clear",
        "trend_up", "price_abv_ma", "vol_support", "indicators_good",
        "news_support", "foreign_buy"
      ]
    }
  },
  required: ["current_price", "symbol", "criteria", "historical_data"]
};

export const analyzeStock = async (symbol: string): Promise<StockData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze stock symbol: ${symbol}.
    
    1. Evaluate the following 10 criteria strictly based on facts (True/False + Reason).
    2. Provide approximate monthly closing prices for the last 6 months for the 'historical_data' array.
    
    Criteria:
    1. rev_growth_pos: YoY Revenue/Profit growth is positive.
    2. val_attractive: P/E or P/B is lower than industry average.
    3. health_safe: Low debt or positive cash flow.
    4. story_clear: Clear growth story in near future.
    5. trend_up: Main trend is UP.
    6. price_abv_ma: Price is above MA20 and MA50.
    7. vol_support: Volume increases on price increases.
    8. indicators_good: RSI/MACD are positive.
    9. news_support: Macro/Industry news is supportive.
    10. foreign_buy: Foreign investors or proprietary trading are net buying.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        tools: [{ googleSearch: {} }]
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as StockData;
      return data;
    } else {
        throw new Error("No text response from Gemini.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
