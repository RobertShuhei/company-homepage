'use client'

import { useState } from 'react'
// Import removed - using direct translation access instead
import { type Locale, type Translations } from '@/lib/i18n'

interface AdminGeneratorClientProps {
  locale: Locale
  translations: Translations
}

export default function AdminGeneratorClient({
  locale,
  translations,
}: AdminGeneratorClientProps) {
  const [formData, setFormData] = useState({
    topic: '',
    referenceUrl: '',
    keywords: '',
    instructions: '',
    resourceCategory: 'blog', // Default to blog
    model: 'gpt-5-nano' // Default to most cost-effective model
  })
  const [generatedContent, setGeneratedContent] = useState('')
  const [editedContent, setEditedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)

  // Check if translations are loaded properly
  if (!translations || !translations.admin) {
    // Only log in development mode to avoid console noise in production
    if (process.env.NODE_ENV === 'development') {
      console.warn('Admin translations not available:', {
        hasTranslations: !!translations,
        hasAdmin: !!(translations?.admin),
        locale
      })
    }
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading translations...</p>
      </div>
    )
  }

  // Helper function to get translations safely from client-side data
  const getText = (path: string, fallback: string): string => {
    try {
      const keys = path.split('.')
      let value: unknown = translations

      for (const key of keys) {
        if (value && typeof value === 'object' && value !== null && key in value) {
          value = (value as Record<string, unknown>)[key]
        } else {
          return fallback
        }
      }

      return typeof value === 'string' ? value : fallback
    } catch (error) {
      console.warn(`Error getting nested translation for path: ${path}`, error)
      return fallback
    }
  }

  const instructionItems = translations.admin?.generator?.instructions?.items?.length
    ? translations.admin.generator.instructions.items
    : [
        getText('admin.generator.instructions.items.0', 'Enter a detailed topic and outline in the textarea to guide the AI generation'),
        getText('admin.generator.instructions.items.1', 'Add relevant keywords to improve SEO optimization of the generated content'),
        getText('admin.generator.instructions.items.2', 'Click "Generate Blog Post" to create AI-powered content based on your inputs'),
        getText('admin.generator.instructions.items.3', 'Review and copy the generated content for use in your blog posts'),
      ]

  // Validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.topic.trim()) {
      errors.topic = getText('admin.generator.validation.topicRequired', 'Topic is required')
    } else if (formData.topic.trim().length < 10) {
      errors.topic = getText('admin.generator.validation.topicTooShort', 'Topic must be at least 10 characters')
    }

    if (formData.referenceUrl && !isValidUrl(formData.referenceUrl)) {
      errors.referenceUrl = getText('admin.generator.validation.invalidUrl', 'Please enter a valid URL')
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // URL validation helper
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Character count helpers
  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      model: e.target.value
    }))
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsGenerating(true)

    try {
      // Call our AI API with current locale
      const response = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: formData.topic,
          referenceUrl: formData.referenceUrl,
          keywords: formData.keywords,
          instructions: formData.instructions,
          resourceCategory: formData.resourceCategory,
          model: formData.model,
          currentLocale: locale
        })
      })

      if (response.status === 401 || response.status === 403) {
        window.location.href = `/${locale}/admin/login?redirectTo=${encodeURIComponent(`/${locale}/admin/generator`)}`
        return
      }

      const data = await response.json() as {
        success?: boolean
        content?: string
        error?: string
      }

      if (!response.ok) {
        throw new Error(data.error || getText('admin.generator.errors.fallbackGeneration', 'Failed to generate blog post'))
      }

      if (data.success && data.content) {
        setGeneratedContent(data.content)
        setEditedContent(data.content) // Initialize edited content with generated content
      } else {
        throw new Error(getText('admin.generator.errors.fallbackResponse', 'Invalid response from API'))
      }
    } catch (error) {
      console.error('Error generating blog post:', error)

      // Provide user-friendly error messages
      let errorMessage = getText('admin.generator.errors.default', 'Error generating blog post. Please try again.')

      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = getText('admin.generator.errors.apiKey', 'OpenAI API is not configured. Please contact the administrator.')
        } else if (error.message.includes('quota')) {
          errorMessage = getText('admin.generator.errors.quota', 'API quota exceeded. Please try again later.')
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = getText('admin.generator.errors.network', 'Network error. Please check your connection and try again.')
        }
      }

      setGeneratedContent(`# ${getText('admin.generator.errors.errorTitle', 'Error')}

${errorMessage}

**${getText('admin.generator.errors.debugInfo', 'Debug Info')}**: ${error instanceof Error ? error.message : getText('admin.generator.errors.unknownError', 'Unknown error')}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)

    try {
      const response = await fetch('/api/blog/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.topic.split('\n')[0] || 'Generated Blog Post', // Use first line as title
          content: editedContent,
          originalContent: generatedContent,
          model: formData.model,
          keywords: formData.keywords,
          referenceUrl: formData.referenceUrl,
          instructions: formData.instructions,
          locale: locale
        })
      })

      if (response.status === 401 || response.status === 403) {
        window.location.href = `/${locale}/admin/login?redirectTo=${encodeURIComponent(`/${locale}/admin/generator`)}`
        return
      }

      const data = await response.json() as {
        success?: boolean
        id?: string
        error?: string
      }

      if (!response.ok) {
        throw new Error(data.error || getText('admin.generator.errors.publishFailed', 'Failed to publish blog post'))
      }

      if (data.success) {
        // Show success message or redirect
        alert(getText('admin.generator.success.published', 'Blog post published successfully!'))

        // Reset form after successful publish
        setFormData({
          topic: '',
          referenceUrl: '',
          keywords: '',
          instructions: '',
          resourceCategory: 'blog',
          model: 'gpt-5-nano'
        })
        setGeneratedContent('')
        setEditedContent('')
      } else {
        throw new Error(getText('admin.generator.errors.publishResponse', 'Invalid response from publish API'))
      }
    } catch (error) {
      console.error('Error publishing blog post:', error)

      let errorMessage = getText('admin.generator.errors.publishDefault', 'Error publishing blog post. Please try again.')

      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = getText('admin.generator.errors.publishNetwork', 'Network error. Please check your connection and try again.')
        }
      }

      alert(errorMessage)
    } finally {
      setIsPublishing(false)
    }
  }

  const canGenerate = formData.topic.trim().length > 0
  const canPublish = editedContent.trim().length > 0

  return (
    <>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">
            {getText('admin.generator.title', 'Blog Generator Admin Panel')}
          </h1>
          <p className="text-gray-600">
            {getText('admin.generator.subtitle', 'Generate AI-powered blog content for Global Genex Inc.')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-navy mb-6">
              {getText('admin.generator.form.contentGeneration', 'Content Generation')}
            </h2>

            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Topic/Outline Textarea */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {getText('admin.generator.form.topicLabel', 'Topic / Outline')} *
                  </label>
                  <span className="text-xs text-gray-500">
                    {formData.topic.length} {getText('admin.generator.form.characters', 'characters')} | {getWordCount(formData.topic)} {getText('admin.generator.form.words', 'words')}
                  </span>
                </div>
                <textarea
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  rows={8}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent resize-vertical ${
                    validationErrors.topic ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={getText('admin.generator.form.topicPlaceholder', 'Enter the main topic and outline for your blog post. Include key points you want to cover, target audience, and any specific angles or perspectives...')}
                  required
                />
                {validationErrors.topic && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.topic}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {getText('admin.generator.form.topicHelper', 'Describe your blog topic and provide an outline of key points to cover.')}
                </p>
              </div>

              {/* Reference URL Input */}
              <div>
                <label
                  htmlFor="referenceUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {getText('admin.generator.form.referenceUrlLabel', 'Reference URL')}
                </label>
                <input
                  type="url"
                  id="referenceUrl"
                  name="referenceUrl"
                  value={formData.referenceUrl}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent ${
                    validationErrors.referenceUrl ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={getText('admin.generator.form.referenceUrlPlaceholder', 'https://example.com/reference-article')}
                />
                {validationErrors.referenceUrl && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.referenceUrl}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {getText('admin.generator.form.referenceUrlHelper', 'Optional URL to reference for context and inspiration when generating the blog post.')}
                </p>
              </div>

              {/* Keywords Input */}
              <div>
                <label
                  htmlFor="keywords"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {getText('admin.generator.form.keywordsLabel', 'Keywords')}
                </label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                  placeholder={getText('admin.generator.form.keywordsPlaceholder', 'manufacturing, consulting, AI, Japan market entry...')}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {getText('admin.generator.form.keywordsHelper', 'Comma-separated keywords to include in the blog post for SEO optimization.')}
                </p>
              </div>

              {/* Instructions for AI */}
              <div>
                <label
                  htmlFor="instructions"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {getText('admin.generator.form.instructionsLabel', 'Instructions for AI')}
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent resize-vertical"
                  placeholder={getText('admin.generator.form.instructionsPlaceholder', 'Specify tone, style, target audience, or any specific instructions for the AI. E.g., "Write in a professional tone for manufacturing executives" or "Include technical details and case studies"...')}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {getText('admin.generator.form.instructionsHelper', 'Provide specific guidance for the AI regarding tone, style, target audience, or content requirements.')}
                </p>
              </div>

              {/* Resource Category Selection */}
              <div>
                <label
                  htmlFor="resourceCategory"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {getText('admin.generator.form.categoryLabel', 'Content Category')}
                </label>
                <select
                  id="resourceCategory"
                  name="resourceCategory"
                  value={formData.resourceCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, resourceCategory: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                >
                  <option value="blog">{getText('admin.generator.form.categoryBlog', 'Blog')}</option>
                  <option value="case-studies">{getText('admin.generator.form.categoryCaseStudies', 'Case Studies')}</option>
                  <option value="white-papers">{getText('admin.generator.form.categoryWhitePapers', 'White Papers')}</option>
                  <option value="industry-insights">{getText('admin.generator.form.categoryIndustryInsights', 'Industry Insights')}</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  {getText('admin.generator.form.categoryHelper', 'Select the type of content to generate appropriate structure and tone.')}
                </p>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {getText('admin.generator.form.modelLabel', 'AI Model Selection')}
                </label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="gpt-5-nano"
                      name="model"
                      type="radio"
                      value="gpt-5-nano"
                      checked={formData.model === 'gpt-5-nano'}
                      onChange={handleModelChange}
                      className="h-4 w-4 text-teal focus:ring-teal border-gray-300"
                    />
                    <label htmlFor="gpt-5-nano" className="ml-3 block text-sm text-gray-700">
                      <span className="font-medium">GPT-5 nano</span>
                      <span className="text-teal ml-2">{getText('admin.generator.form.modelNanoLabel', '(Default - Fastest & Cheapest)')}</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="gpt-5-mini"
                      name="model"
                      type="radio"
                      value="gpt-5-mini"
                      checked={formData.model === 'gpt-5-mini'}
                      onChange={handleModelChange}
                      className="h-4 w-4 text-teal focus:ring-teal border-gray-300"
                    />
                    <label htmlFor="gpt-5-mini" className="ml-3 block text-sm text-gray-700">
                      <span className="font-medium">GPT-5 mini</span>
                      <span className="text-blue-600 ml-2">{getText('admin.generator.form.modelMiniLabel', '(Balanced)')}</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="gpt-5"
                      name="model"
                      type="radio"
                      value="gpt-5"
                      checked={formData.model === 'gpt-5'}
                      onChange={handleModelChange}
                      className="h-4 w-4 text-teal focus:ring-teal border-gray-300"
                    />
                    <label htmlFor="gpt-5" className="ml-3 block text-sm text-gray-700">
                      <span className="font-medium">GPT-5</span>
                      <span className="text-purple-600 ml-2">{getText('admin.generator.form.modelFullLabel', '(Highest Quality)')}</span>
                    </label>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {getText('admin.generator.form.modelHelper', 'Choose the AI model based on your quality and speed requirements.')}
                </p>
              </div>

              {/* Generate Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!canGenerate || isGenerating}
                  className={`w-full px-6 py-3 rounded-md font-semibold text-white transition-colors duration-200 ${
                    canGenerate && !isGenerating
                      ? 'bg-teal hover:bg-teal/90 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {getText('admin.generator.form.generating', 'Generating Blog Post...')}
                    </div>
                  ) : (
                    getText('admin.generator.form.generateButton', 'Generate Blog Post')
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Generated Content Display */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-navy mb-6">
              {getText('admin.generator.content.title', 'Generated Content')}
            </h2>

            {generatedContent ? (
              <div className="space-y-4">
                {/* Editable Content Area */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="editedContent"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {getText('admin.generator.content.editorLabel', 'Edit Content (Markdown)')}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {editedContent.length} {getText('admin.generator.form.characters', 'characters')} | {getWordCount(editedContent)} {getText('admin.generator.form.words', 'words')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200"
                      >
                        {showPreview ? getText('admin.generator.content.hidePreview', 'Hide Preview') : getText('admin.generator.content.showPreview', 'Show Preview')}
                      </button>
                    </div>
                  </div>

                  <div className={`grid gap-4 ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <div>
                      <textarea
                        id="editedContent"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={20}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent resize-vertical font-mono text-sm"
                        placeholder={getText('admin.generator.content.editorPlaceholder', 'Edit your generated content here...')}
                      />
                    </div>

                    {showPreview && (
                      <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          {getText('admin.generator.content.previewLabel', 'Preview')}
                        </h4>
                        <div className="prose prose-sm max-w-none h-[480px] overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                            {editedContent || getText('admin.generator.content.previewEmpty', 'Preview will appear here...')}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {getText('admin.generator.content.editorHelper', 'You can edit the generated content directly. Markdown formatting is supported.')}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(editedContent)}
                    className="px-4 py-2 bg-navy text-white rounded-md hover:bg-navy/90 transition-colors duration-200 text-sm font-medium"
                  >
                    {getText('admin.generator.content.copyButton', 'Copy Content')}
                  </button>
                  <button
                    onClick={() => setEditedContent(generatedContent)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                  >
                    {getText('admin.generator.content.resetButton', 'Reset to Original')}
                  </button>
                  <button
                    onClick={() => {
                      setGeneratedContent('')
                      setEditedContent('')
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                  >
                    {getText('admin.generator.content.clearButton', 'Clear All')}
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={!canPublish || isPublishing}
                    className={`px-6 py-2 rounded-md font-medium text-white transition-colors duration-200 ${
                      canPublish && !isPublishing
                        ? 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isPublishing ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {getText('admin.generator.content.publishing', 'Publishing...')}
                      </div>
                    ) : (
                      getText('admin.generator.content.publishButton', 'Publish Blog Post')
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">
                  {getText('admin.generator.content.placeholder', 'Generated blog content will appear here')}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {getText('admin.generator.content.placeholderSubtext', 'Fill out the form and click "Generate Blog Post" to create content')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            {getText('admin.generator.instructions.title', 'Instructions')}
          </h3>
          <ul className="space-y-2 text-blue-800">
            {instructionItems.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
    </>
  )
}
