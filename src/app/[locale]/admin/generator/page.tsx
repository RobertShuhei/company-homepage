'use client'

import { useState } from 'react'
import { useTranslations } from '@/lib/hooks/useTranslations'
import { getNestedTranslation } from '@/lib/translations'

export default function BlogGeneratorPage() {
  const { t, locale, isLoading } = useTranslations()
  const [formData, setFormData] = useState({
    topic: '',
    keywords: '',
    model: 'gpt-5-nano' // Default to most cost-effective model
  })
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Helper function to get translations safely
  const getText = (path: string, fallback: string) => {
    if (!t) return fallback
    return getNestedTranslation(t, path, fallback)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      model: e.target.value
    }))
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
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
          keywords: formData.keywords,
          model: formData.model,
          currentLocale: locale // Use the locale from useTranslations hook
        })
      })

      const data = await response.json() as {
        success?: boolean
        content?: string
        error?: string
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate blog post')
      }

      if (data.success && data.content) {
        setGeneratedContent(data.content)
      } else {
        throw new Error('Invalid response from API')
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

      setGeneratedContent(`# Error

${errorMessage}

**Debug Info**: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const canGenerate = formData.topic.trim().length > 0

  // Show loading state while translations are loading
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto"></div>
        <p className="mt-4 text-gray-600">{getText('common.loading', 'Loading...')}</p>
      </div>
    )
  }

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
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {getText('admin.generator.form.topicLabel', 'Topic / Outline')} *
                </label>
                <textarea
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent resize-vertical"
                  placeholder={getText('admin.generator.form.topicPlaceholder', 'Enter the main topic and outline for your blog post. Include key points you want to cover, target audience, and any specific angles or perspectives...')}
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  {getText('admin.generator.form.topicHelper', 'Describe your blog topic and provide an outline of key points to cover.')}
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
                      <span className="text-teal ml-2">(デフォルト - 最安・高速)</span>
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
                      <span className="text-blue-600 ml-2">(バランス)</span>
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
                      <span className="text-purple-600 ml-2">(最高品質)</span>
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
                {/* Content Preview */}
                <div className="bg-gray-50 rounded-md p-4 border border-gray-200 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {generatedContent}
                  </pre>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedContent)}
                    className="px-4 py-2 bg-navy text-white rounded-md hover:bg-navy/90 transition-colors duration-200 text-sm font-medium"
                  >
                    {getText('admin.generator.content.copyButton', 'Copy Content')}
                  </button>
                  <button
                    onClick={() => setGeneratedContent('')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                  >
                    {getText('admin.generator.content.clearButton', 'Clear')}
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
            {(t?.admin?.generator?.instructions?.items || [
              getText('admin.generator.instructions.items.0', 'Enter a detailed topic and outline in the textarea to guide the AI generation'),
              getText('admin.generator.instructions.items.1', 'Add relevant keywords to improve SEO optimization of the generated content'),
              getText('admin.generator.instructions.items.2', 'Click "Generate Blog Post" to create AI-powered content based on your inputs'),
              getText('admin.generator.instructions.items.3', 'Review and copy the generated content for use in your blog posts')
            ]).map((item: string, index: number) => (
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