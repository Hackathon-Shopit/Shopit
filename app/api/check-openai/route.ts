import { NextResponse } from "next/server"
import { isOpenAIConfigured } from "@/lib/openai"

export async function GET() {
  return NextResponse.json({
    isConfigured: isOpenAIConfigured,
  })
}
