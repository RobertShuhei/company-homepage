import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client only when needed
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured')
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

// Language-specific prompt templates
const LANGUAGE_PROMPTS = {
  ja: {
    systemPrompt: `あなたは株式会社グローバルジェネックスの専門的なブログ記事作成アシスタントです。小売業・製造業向けのAI活用コンサルティング、データ分析、市場参入支援に関する高品質なブログ記事を日本語で作成してください。`,
    instructionSuffix: `以下の要件を満たしてください：
- 日本語で執筆
- 専門的かつ親しみやすい文体
- SEOを意識した見出し構造
- 実践的な内容とアクションアイテム
- 1500-2000文字程度
- マークダウン形式で出力`
  },
  en: {
    systemPrompt: `You are a professional blog content assistant for Global Genex Inc., specializing in AI-driven consulting, data analytics, and market entry support for retail & manufacturing industries. Create high-quality blog posts in English.`,
    instructionSuffix: `Please ensure the content:
- Is written in professional English
- Uses SEO-optimized heading structure
- Includes practical insights and actionable items
- Is approximately 1500-2000 words
- Is formatted in Markdown
- Reflects Global Genex's expertise in manufacturing, retail operations, and cross-border business`
  },
  zh: {
    systemPrompt: `您是Global Genex株式会社的专业博客内容助手，专门从事AI驱动的咨询、数据分析以及针对零售和制造业的市场进入支持。请用中文创建高质量的博客文章。`,
    instructionSuffix: `请确保内容：
- 使用专业的中文撰写
- 采用SEO优化的标题结构
- 包含实用见解和可操作项目
- 大约1500-2000字
- 使用Markdown格式
- 体现Global Genex在制造业、零售运营和跨境业务方面的专业知识`
  }
}

// Request validation interface
interface BlogGenerationRequest {
  topic: string
  keywords?: string
  currentLocale: 'ja' | 'en' | 'zh'
}

// Validate request data
function validateRequest(data: unknown): data is BlogGenerationRequest {
  if (!data || typeof data !== 'object') return false

  const req = data as Record<string, unknown>

  return (
    typeof req.topic === 'string' &&
    req.topic.trim().length > 0 &&
    (req.keywords === undefined || typeof req.keywords === 'string') &&
    typeof req.currentLocale === 'string' &&
    ['ja', 'en', 'zh'].includes(req.currentLocale)
  )
}

// Create language-specific prompt
function createPrompt(topic: string, keywords: string, locale: 'ja' | 'en' | 'zh'): string {
  const langConfig = LANGUAGE_PROMPTS[locale]

  let prompt = `${langConfig.systemPrompt}

トピック/Topic/主题: ${topic}`

  if (keywords && keywords.trim()) {
    prompt += `
キーワード/Keywords/关键词: ${keywords}`
  }

  prompt += `

${langConfig.instructionSuffix}`

  return prompt
}

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    // Parse and validate request
    const data = await request.json()

    if (!validateRequest(data)) {
      return NextResponse.json(
        { error: 'Invalid request. Required: topic (string), currentLocale (ja|en|zh). Optional: keywords (string)' },
        { status: 400 }
      )
    }

    const { topic, keywords = '', currentLocale } = data

    // Create language-specific prompt
    const prompt = createPrompt(topic, keywords, currentLocale)

    // Get OpenAI client and call API
    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use cost-effective model for blog generation
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7, // Balanced creativity
      max_tokens: 4000, // Allow for long-form content
      presence_penalty: 0.1, // Encourage diverse content
      frequency_penalty: 0.1 // Reduce repetition
    })

    const generatedContent = completion.choices[0]?.message?.content

    if (!generatedContent) {
      return NextResponse.json(
        { error: 'Failed to generate content' },
        { status: 500 }
      )
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      content: generatedContent,
      metadata: {
        locale: currentLocale,
        topic,
        keywords: keywords || null,
        wordCount: generatedContent.length,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Blog generation API error:', error)

    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid OpenAI API key' },
          { status: 401 }
        )
      }

      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  )
}