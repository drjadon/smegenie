
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function polishReason(reason: string, tone: string = 'Standard'): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Refine the following leave reason for a formal application. 
      Tone: ${tone}
      Original: "${reason}"
      Output: Return only the polished text, keep it concise and professional.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 250,
        thinkingConfig: { thinkingBudget: 150 },
      }
    });

    return response.text?.trim() || reason;
  } catch (error) {
    console.error("Gemini Polish Error:", error);
    return reason;
  }
}

export async function composeReason(keywords: string, type: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a professional 2-sentence leave reason based on these keywords: "${keywords}". 
      Context: This is for a ${type} leave.
      Output: Just the reason text. No placeholders.`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 250,
        thinkingConfig: { thinkingBudget: 150 },
      }
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Compose Error:", error);
    return "";
  }
}

export async function suggestSubject(reason: string, leaveType: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a concise, formal subject line for a leave application email.
      Leave Type: ${leaveType}
      Reason: ${reason}
      Output: Just the subject text, starting with 'Subject: '`,
      config: {
        temperature: 0.5,
        maxOutputTokens: 100,
        thinkingConfig: { thinkingBudget: 50 },
      }
    });
    return response.text?.trim() || `Application for ${leaveType}`;
  } catch (error) {
    return `Application for ${leaveType}`;
  }
}

export async function getAIAssistantResponse(
  message: string, 
  context: { 
    balance: any, 
    holidays: any[], 
    history: any[],
    user: any 
  }
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are SMEGenie AI, a helpful business and leave management assistant. 
      Context:
      - User: ${context.user.name}, ${context.user.designation}
      - Balances: ${JSON.stringify(context.balance)}
      - Upcoming Holidays: ${JSON.stringify(context.holidays)}
      - Leave History: ${JSON.stringify(context.history)}
      
      User Question: "${message}"
      
      Instructions:
      1. Be concise, professional, and friendly.
      2. If asked about balances, provide the specific numbers.
      3. If asked about taking leave, check if it conflicts with holidays or if they have enough balance.
      4. Suggest taking bridge leaves if a holiday is near a weekend.
      
      Output: Just the conversational response.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 400,
      }
    });

    return response.text?.trim() || "I'm sorry, I couldn't process that. How can I help you with your SME operations today?";
  } catch (error) {
    console.error("Assistant Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again in a moment!";
  }
}

export async function analyzeLeavePatterns(
  context: { 
    history: any[], 
    holidays: any[], 
    balance: any 
  }
): Promise<{ burnoutRisk: string, suggestions: string[] }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the user's leave patterns and suggest optimizations.
      
      Context:
      - History: ${JSON.stringify(context.history)}
      - Holidays: ${JSON.stringify(context.holidays)}
      - Balances: ${JSON.stringify(context.balance)}
      
      Tasks:
      1. Detect Burnout: If no leave taken in 3+ months, flag high risk. If frequent short leaves, flag pattern.
      2. Smart Suggestions: Look for holidays on Thursday/Tuesday and suggest taking Friday/Monday off to get a 4-day weekend.
      
      Response Format: JSON only.
      Schema: { "burnoutRisk": "LOW" | "MEDIUM" | "HIGH", "suggestions": ["string"] }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            burnoutRisk: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["burnoutRisk", "suggestions"]
        }
      }
    });

    return JSON.parse(response.text || '{"burnoutRisk": "LOW", "suggestions": []}');
  } catch (error) {
    console.error("Pattern Analysis Error:", error);
    return { burnoutRisk: 'LOW', suggestions: ["I couldn't analyze your patterns right now, but remember to take regular breaks!"] };
  }
}
