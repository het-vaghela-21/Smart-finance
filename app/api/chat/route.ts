import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE");

export async function POST(req: Request) {
    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json(
            { error: "GEMINI_API_KEY is not configured in the environment variables." },
            { status: 500 }
        );
    }

    try {
        const { message, transactions } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Initialize the model
        // We use gemini-2.5-flash as requested
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Calculate some basic contextual data up front for the LLM
        type TxContext = { type: string; amount: number };
        const totalDebit = transactions?.filter((t: TxContext) => t.type === 'debit').reduce((sum: number, t: TxContext) => sum + t.amount, 0) || 0;
        const totalCredit = transactions?.filter((t: TxContext) => t.type === 'credit').reduce((sum: number, t: TxContext) => sum + t.amount, 0) || 0;
        const netWorth = totalCredit - totalDebit;

        // Construct a highly strict system prompt
        const systemPrompt = `
You are FinAI, a highly advanced, professional, and strictly bounded Financial Advisor AI. 
You act as an intelligence layer on top of a user's personal dashboard.

CRITICAL RULES:
1. YOU MUST STRICTLY ONLY ANSWER QUESTIONS RELATED TO FINANCE, MARKETS, STOCKS, ECONOMICS, OR THE USER'S PERSONAL FINANCIAL PORTFOLIO.
2. If the user asks about ANYTHING else (e.g., coding, sports, history, general chat, jokes, recipes), you must firmly reject the query and state that you are a specialized financial AI and cannot discuss topics outside of finance and wealth management.
3. Be concise, professional, and analytical in your responses. Use formatting (bolding) to highlight key numbers or insights.
4. IMPORTANT: Always finish your thoughts completely. Never truncate your sentences. Provide a full, proper, and continuous response.

USER'S CURRENT FINANCIAL CONTEXT:
Here is real-time data from the user's dashboard based on their historic transactions:
- Total Cash Received (Credit): ₹${totalCredit.toFixed(2)}
- Total Cash Spent (Debit): ₹${totalDebit.toFixed(2)}
- Current Net Balance: ₹${netWorth.toFixed(2)}

Raw Transaction Data:
${JSON.stringify(transactions, null, 2)}

Only use the context above if the user specifically asks about their own spending, averages, or portfolio. Otherwise, rely on your broad internet knowledge of global finance.
        `;

        // Start a chat session with the system instructions injected via history
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "SYSTEM PROMPT INSTRUCTION (Do not reply to this msg, just acknowledge): " + systemPrompt }]
                },
                {
                    role: "model",
                    parts: [{ text: "I acknowledge the instructions. I am FinAI, a strict financial advisor. I will only answer finance-related queries and I have loaded the user's portfolio data into my context." }]
                }
            ],
            generationConfig: {
                temperature: 0.7,
            },
        });

        // Send the user's actual message
        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        return NextResponse.json({ reply: responseText });

    } catch (error) {
        const e = error as Error;
        console.error("Gemini API Error:", e);
        return NextResponse.json(
            { error: e?.message || "An error occurred during AI processing." },
            { status: 500 }
        );
    }
}
