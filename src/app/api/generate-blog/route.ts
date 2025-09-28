import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { authenticateAdmin, createAuthErrorResponse } from '@/lib/auth'
import { isResourceCategory, type ResourceCategory } from '@/lib/resourceCategories'

// Initialize OpenAI client only when needed
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured')
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

// Language-specific prompt templates optimized for GPT-5
const LANGUAGE_PROMPTS = {
  ja: {
    systemPrompt: `あなたは株式会社グローバルジェネックスの専門的なブログ記事作成アシスタントです。小売業・製造業向けのAI活用コンサルティング、データ分析、市場参入支援に関する高品質なブログ記事を日本語で作成してください。

まず与えられたトピックについて深く分析し、読者にとって最も価値のある情報を特定してから執筆してください。`,
    instructionSuffix: `以下の要件を満たした、戦略的で洞察に富んだ記事を作成してください：
- 日本語で執筆（自然で読みやすい文章）
- 専門的かつ親しみやすい文体
- SEOを意識した階層的見出し構造
- 実践的な内容と具体的なアクションアイテム
- 業界のトレンドと将来予測を含む
- 実際の事例やケーススタディを盛り込む
- 1500-2000文字程度
- マークダウン形式で出力
- 読者の課題解決に直結する価値提供`
  },
  en: {
    systemPrompt: `You are a professional blog content assistant for Global Genex Inc., specializing in AI-driven consulting, data analytics, and market entry support for retail & manufacturing industries.

Before writing, analyze the given topic thoroughly to identify the most valuable insights for our target audience of retail and manufacturing executives, then create compelling, strategic content.`,
    instructionSuffix: `Create a comprehensive, thought-leadership article that:
- Is written in engaging, professional English
- Uses strategic SEO-optimized heading structure (H1, H2, H3)
- Includes practical insights with actionable implementation steps
- Incorporates industry trends, data points, and future predictions
- Features real-world examples or case studies when relevant
- Demonstrates Global Genex's deep expertise in manufacturing, retail operations, and cross-border business
- Addresses common pain points and challenges in the industry
- Is approximately 1500-2000 words
- Is formatted in clean Markdown
- Provides clear ROI and value proposition for readers`
  },
  zh: {
    systemPrompt: `您是Global Genex株式会社的专业博客内容助手，专门从事AI驱动的咨询、数据分析以及针对零售和制造业的市场进入支持。

请先深入分析给定的主题，识别对零售和制造业高管最有价值的见解，然后创作具有战略性和前瞻性的内容。`,
    instructionSuffix: `创作一篇深度、权威的行业思想领导力文章，确保：
- 使用专业且引人入胜的中文撰写
- 采用战略性SEO优化的标题层次结构
- 包含实用见解和可执行的实施步骤
- 融入行业趋势、数据要点和未来预测
- 结合相关的真实案例或案例研究
- 体现Global Genex在制造业、零售运营和跨境业务方面的深厚专业知识
- 解决行业中的常见痛点和挑战
- 为读者提供清晰的投资回报率和价值主张
- 大约1500-2000字
- 使用简洁的Markdown格式
- 提供切实可行的解决方案`
  }
}

// Request validation interface
interface BlogGenerationRequest {
  topic: string
  referenceUrl?: string
  keywords?: string
  instructions?: string
  resourceCategory?: ResourceCategory
  model?: 'gpt-5-nano' | 'gpt-5-mini' | 'gpt-5'
  currentLocale: 'ja' | 'en' | 'zh'
}

// Validate request data
function validateRequest(data: unknown): data is BlogGenerationRequest {
  if (!data || typeof data !== 'object') return false

  const req = data as Record<string, unknown>

  return (
    typeof req.topic === 'string' &&
    req.topic.trim().length > 0 &&
    (req.referenceUrl === undefined || typeof req.referenceUrl === 'string') &&
    (req.keywords === undefined || typeof req.keywords === 'string') &&
    (req.instructions === undefined || typeof req.instructions === 'string') &&
    (req.resourceCategory === undefined || (typeof req.resourceCategory === 'string' && isResourceCategory(req.resourceCategory))) &&
    (req.model === undefined || ['gpt-5-nano', 'gpt-5-mini', 'gpt-5'].includes(req.model as string)) &&
    typeof req.currentLocale === 'string' &&
    ['ja', 'en', 'zh'].includes(req.currentLocale)
  )
}

// Create language-specific prompt
function createPrompt(topic: string, referenceUrl: string, keywords: string, instructions: string, resourceCategory: ResourceCategory, locale: 'ja' | 'en' | 'zh'): string {
  const langConfig = LANGUAGE_PROMPTS[locale]

  // Add category-specific instructions
  const categoryInstructions = {
    'case-studies': {
      ja: 'これは事例研究として執筆してください。具体的な課題、解決プロセス、結果と成果を明確に示してください。',
      en: 'Write this as a case study. Present specific challenges, solution process, and measurable results.',
      zh: '请写成案例研究。展示具体挑战、解决过程和可衡量的结果。'
    },
    'white-papers': {
      ja: 'これはホワイトペーパーとして執筆してください。業界の深い分析、データに基づく洞察、戦略的な提言を含めてください。',
      en: 'Write this as a white paper. Include in-depth industry analysis, data-driven insights, and strategic recommendations.',
      zh: '请写成白皮书。包含深入的行业分析、基于数据的洞察和战略建议。'
    },
    'industry-insights': {
      ja: 'これは業界インサイトとして執筆してください。最新のトレンド分析、市場予測、専門的な見解を提供してください。',
      en: 'Write this as an industry insight. Provide trend analysis, market forecasts, and expert perspectives.',
      zh: '请写成行业洞察。提供趋势分析、市场预测和专家观点。'
    },
    'blog': {
      ja: 'これはブログ記事として執筆してください。読みやすく、実践的で、読者の関心を引く内容にしてください。',
      en: 'Write this as a blog post. Make it engaging, practical, and reader-friendly.',
      zh: '请写成博客文章。使其引人入胜、实用且易于阅读。'
    }
  }

  const categoryInstruction = categoryInstructions[resourceCategory]?.[locale] || ''

  let prompt = `${langConfig.systemPrompt}

${categoryInstruction}

トピック/Topic/主题: ${topic}`

  if (referenceUrl && referenceUrl.trim()) {
    prompt += `
参考URL/Reference URL/参考链接: ${referenceUrl}`
  }

  if (keywords && keywords.trim()) {
    prompt += `
キーワード/Keywords/关键词: ${keywords}`
  }

  if (instructions && instructions.trim()) {
    prompt += `
特別な指示/Special Instructions/特殊说明: ${instructions}`
  }

  prompt += `

${langConfig.instructionSuffix}`

  return prompt
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate admin user
    const authResult = authenticateAdmin(request)
    if (!authResult.isAuthenticated) {
      return createAuthErrorResponse(authResult.error || 'Authentication failed', authResult.statusCode)
    }

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
        { error: 'Invalid request. Required: topic (string), currentLocale (ja|en|zh). Optional: referenceUrl (string), keywords (string), instructions (string), model (gpt-5-nano|gpt-5-mini|gpt-5)' },
        { status: 400 }
      )
    }

    const { topic, referenceUrl = '', keywords = '', instructions = '', resourceCategory = 'blog', model = 'gpt-5-nano', currentLocale } = data

    // Create language-specific prompt
    const prompt = createPrompt(topic, referenceUrl, keywords, instructions, resourceCategory, currentLocale)

    // Get OpenAI client and call API
    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model: model, // Use dynamically selected model
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.65, // Slightly more focused for professional content
      max_tokens: 6000, // Increased for GPT-5's enhanced capabilities
      presence_penalty: 0.15, // Enhanced diverse content generation
      frequency_penalty: 0.12, // Improved repetition reduction
      top_p: 0.9 // Leverage GPT-5's improved reasoning
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
        model: model,
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
