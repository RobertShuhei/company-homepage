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
  outline?: string
  keywords?: string
  referenceUrl?: string
  aiInstruction?: string
  category?: ResourceCategory
  model?: 'gpt-5' | 'gpt-5-mini' | 'gpt-5-nano'
  currentLocale: 'ja' | 'en' | 'zh'
}

// Valid model types
const VALID_MODELS = ['gpt-5', 'gpt-5-mini', 'gpt-5-nano'] as const
type ValidModel = typeof VALID_MODELS[number]

// Validate and normalize model parameter
function validateModel(model: unknown): ValidModel {
  if (typeof model === 'string' && VALID_MODELS.includes(model as ValidModel)) {
    return model as ValidModel
  }
  return 'gpt-5-mini' // Default fallback
}

// Validate request data
function validateRequest(data: unknown): data is BlogGenerationRequest {
  if (!data || typeof data !== 'object') return false

  const req = data as Record<string, unknown>

  return (
    typeof req.topic === 'string' &&
    req.topic.trim().length > 0 &&
    (req.outline === undefined || typeof req.outline === 'string') &&
    (req.keywords === undefined || typeof req.keywords === 'string') &&
    (req.referenceUrl === undefined || typeof req.referenceUrl === 'string') &&
    (req.aiInstruction === undefined || typeof req.aiInstruction === 'string') &&
    (req.category === undefined || (typeof req.category === 'string' && isResourceCategory(req.category))) &&
    typeof req.currentLocale === 'string' &&
    ['ja', 'en', 'zh'].includes(req.currentLocale)
  )
}

// Create language-specific prompts for Responses API
function createPrompts(
  topic: string,
  outline: string,
  keywords: string,
  referenceUrl: string,
  aiInstruction: string,
  category: ResourceCategory,
  locale: 'ja' | 'en' | 'zh'
): { systemPrompt: string; userPrompt: string } {
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

  const categoryInstruction = categoryInstructions[category]?.[locale] || ''

  const systemPrompt = `${langConfig.systemPrompt}

${categoryInstruction}

${langConfig.instructionSuffix}`

  let userPrompt = `トピック/Topic/主题: ${topic}`

  if (outline && outline.trim()) {
    userPrompt += `

アウトライン/Outline/大纲:
${outline}`
  }

  if (keywords && keywords.trim()) {
    userPrompt += `

キーワード/Keywords/关键词: ${keywords}`
  }

  if (referenceUrl && referenceUrl.trim()) {
    userPrompt += `

参考URL/Reference URL/参考链接: ${referenceUrl}`
  }

  if (aiInstruction && aiInstruction.trim()) {
    userPrompt += `

特別な指示/Special Instructions/特殊说明: ${aiInstruction}`
  }

  return { systemPrompt, userPrompt }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[BLOG API] Request received')

    // Authenticate admin user
    const authResult = authenticateAdmin(request)
    console.log('[BLOG API] Auth result:', { isAuthenticated: authResult.isAuthenticated, error: authResult.error, statusCode: authResult.statusCode })

    if (!authResult.isAuthenticated) {
      console.log('[BLOG API] Authentication failed, returning error response')
      return createAuthErrorResponse(authResult.error || 'Authentication failed', authResult.statusCode)
    }

    // Check if OpenAI API key is configured
    console.log('[BLOG API] Checking OpenAI API key:', process.env.OPENAI_API_KEY ? 'EXISTS' : 'MISSING')
    if (!process.env.OPENAI_API_KEY) {
      console.error('[BLOG API] OpenAI API key is not configured')
      return NextResponse.json(
        { ok: false, error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    // Parse and validate request
    console.log('[BLOG API] Parsing request body')
    const data = await request.json()
    console.log('[BLOG API] Request data:', JSON.stringify(data, null, 2))

    if (!validateRequest(data)) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid request. Required: topic (string), currentLocale (ja|en|zh). Optional: outline (string), keywords (string), referenceUrl (string), aiInstruction (string), category (blog|case-studies|white-papers|industry-insights), model (gpt-5|gpt-5-mini|gpt-5-nano)'
        },
        { status: 400 }
      )
    }

    const {
      topic,
      outline = '',
      keywords = '',
      referenceUrl = '',
      aiInstruction = '',
      category = 'blog',
      model,
      currentLocale
    } = data

    // Validate and normalize model parameter (defaults to gpt-5-mini if invalid)
    const chosenModel = validateModel(model)
    console.log('[BLOG API] Extracted parameters:', { topic, model: chosenModel, currentLocale, category })

    // Create language-specific prompts for Responses API
    const { systemPrompt, userPrompt } = createPrompts(topic, outline, keywords, referenceUrl, aiInstruction, category, currentLocale)
    console.log('[BLOG API] Prompts created, system length:', systemPrompt.length, 'user length:', userPrompt.length)

    // Get OpenAI client and call Responses API
    console.log('[BLOG API] Initializing OpenAI client')
    const client = getOpenAIClient()
    console.log('[BLOG API] Calling OpenAI Responses API with model:', chosenModel)

    const resp = await client.responses.create({
      model: chosenModel,
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    })

    const generatedContent = resp.output_text

    if (!generatedContent) {
      return NextResponse.json(
        { ok: false, error: 'Failed to generate content from OpenAI API' },
        { status: 500 }
      )
    }

    // Return successful response in new format
    return NextResponse.json({
      ok: true,
      post: {
        title: topic,
        content: generatedContent,
        summary: generatedContent.substring(0, 200) + '...',
        language: currentLocale,
        status: 'draft',
        resource_category: category,
        tags: keywords ? keywords.split(',').map(k => k.trim()) : [],
        ai_model: chosenModel,
        author: 'Global Genex Inc.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      model: chosenModel,
    })

  } catch (error) {
    console.error('[BLOG API] ===== ERROR CAUGHT =====')
    console.error('[BLOG API] Error type:', error instanceof Error ? 'Error object' : typeof error)
    console.error('[BLOG API] Error message:', error instanceof Error ? error.message : String(error))
    console.error('[BLOG API] Full error:', error)
    console.error('[BLOG API] Error stack:', error instanceof Error ? error.stack : 'No stack trace')

    // Handle specific OpenAI errors with graceful error responses
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        console.error('[BLOG API] Invalid API key error detected')
        return NextResponse.json(
          { ok: false, error: 'Invalid OpenAI API key' },
          { status: 401 }
        )
      }

      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        console.error('[BLOG API] Quota/rate limit exceeded error detected')
        return NextResponse.json(
          { ok: false, error: 'OpenAI API quota exceeded or rate limited' },
          { status: 429 }
        )
      }

      if (error.message.includes('model')) {
        console.error('[BLOG API] Model-related error detected')
        return NextResponse.json(
          { ok: false, error: 'Invalid model or model access denied' },
          { status: 400 }
        )
      }
    }

    // Generic error response
    console.error('[BLOG API] Returning generic error response')
    return NextResponse.json(
      { ok: false, error: 'Failed to generate blog post. Please try again later.' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { ok: false, error: 'Method not allowed. Use POST.' },
    { status: 405 }
  )
}
