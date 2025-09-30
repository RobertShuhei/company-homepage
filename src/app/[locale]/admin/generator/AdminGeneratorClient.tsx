'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useTranslations, useIntlMessages } from 'next-intl'
import { type Locale } from '@/lib/i18n'

type FormState = {
  topic: string
  referenceUrl: string
  keywords: string
  instructions: string
  resourceCategory: 'blog' | 'case-studies' | 'white-papers' | 'industry-insights'
  model: 'gpt-5-nano' | 'gpt-5-mini' | 'gpt-5'
}

const INITIAL_FORM_STATE: FormState = {
  topic: '',
  referenceUrl: '',
  keywords: '',
  instructions: '',
  resourceCategory: 'blog',
  model: 'gpt-5-nano',
}

interface AdminGeneratorClientProps {
  locale: Locale
}

interface SaveMessage {
  type: 'success' | 'error'
  text: string
}

export default function AdminGeneratorClient({ locale }: AdminGeneratorClientProps) {
  const tGenerator = useTranslations('admin.generator')
  const tForm = useTranslations('admin.generator.form')
  const tContent = useTranslations('admin.generator.content')
  const tValidation = useTranslations('admin.generator.validation')
  const tErrors = useTranslations('admin.generator.errors')
  const tSuccess = useTranslations('admin.generator.success')
  const messages = useIntlMessages()

  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE)
  const [generatedContent, setGeneratedContent] = useState('')
  const [editedContent, setEditedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'draft' | 'publish'>('idle')
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<SaveMessage | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [hasAttemptedGenerate, setHasAttemptedGenerate] = useState(false)

  const instructionItems = useMemo(() => {
    const raw = (messages as Record<string, unknown>)?.admin as Record<string, unknown> | undefined
    const generatorNode = raw?.generator as Record<string, unknown> | undefined
    const instructionsNode = generatorNode?.instructions as Record<string, unknown> | undefined
    const items = instructionsNode?.items

    if (Array.isArray(items) && items.every((item) => typeof item === 'string')) {
      return items as string[]
    }

    return [
      tGenerator('instructions.items.0'),
      tGenerator('instructions.items.1'),
      tGenerator('instructions.items.2'),
      tGenerator('instructions.items.3'),
    ]
  }, [messages, tGenerator])

  const isValidUrl = useCallback((value: string) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }, [])

  const runValidation = useCallback((data: FormState) => {
    const errors: Record<string, string> = {}

    const topic = data.topic.trim()
    const referenceUrl = data.referenceUrl.trim()
    const keywords = data.keywords.trim()
    const instructions = data.instructions.trim()

    const hasTopic = topic.length > 0
    const hasReferenceUrl = referenceUrl.length > 0
    const hasKeywords = keywords.length > 0

    if (!instructions) {
      errors.instructions = tValidation('instructionsRequired')
    }

    if (!hasTopic && !hasReferenceUrl && !hasKeywords) {
      errors.contentInputs = tValidation('atLeastOneInput')
    }

    if (hasTopic && topic.length < 10) {
      errors.topic = tValidation('topicTooShort')
    }

    if (hasReferenceUrl && !isValidUrl(referenceUrl)) {
      errors.referenceUrl = tValidation('invalidUrl')
    }

    return errors
  }, [isValidUrl, tValidation])

  const validationResult = useMemo(() => runValidation(formData), [formData, runValidation])
  const hasInstructions = formData.instructions.trim().length > 0
  const hasContentInput = [formData.topic, formData.referenceUrl, formData.keywords].some((value) => value.trim().length > 0)
  const isFormValid = hasInstructions && hasContentInput && Object.keys(validationResult).length === 0

  useEffect(() => {
    if (hasAttemptedGenerate) {
      setValidationErrors(validationResult)
    }
  }, [hasAttemptedGenerate, validationResult])

  const getWordCount = useCallback((text: string) => {
    return text.trim().split(/\s+/).filter((word) => word.length > 0).length
  }, [])

  const updateFormField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value }
      if (hasAttemptedGenerate) {
        setValidationErrors(runValidation(next))
      }
      return next
    })
  }, [hasAttemptedGenerate, runValidation])

  const resetState = () => {
    setFormData({ ...INITIAL_FORM_STATE })
    setGeneratedContent('')
    setEditedContent('')
    setShowPreview(false)
    setIsEditing(false)
    setGenerationError(null)
    setSaveMessage(null)
    setValidationErrors({})
    setHasAttemptedGenerate(false)
  }

  const generateContent = async () => {
    setGenerationError(null)
    setSaveMessage(null)
    setIsGenerating(true)

    try {
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
          currentLocale: locale,
        }),
      })

      if (response.status === 401 || response.status === 403) {
        window.location.href = `/${locale}/admin/login?redirectTo=${encodeURIComponent(`/${locale}/admin/generator`)}`
        return
      }

      const data = await response.json() as { success?: boolean; content?: string; error?: string }

      if (!response.ok || !data.success || !data.content) {
        throw new Error(data.error || tErrors('fallbackGeneration'))
      }

      setGeneratedContent(data.content)
      setEditedContent(data.content)
      setIsEditing(false)
      setShowPreview(false)
      setHasAttemptedGenerate(false)
      setValidationErrors({})
    } catch (error) {
      console.error('Error generating blog post:', error)

      let message = tErrors('default')

      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          message = tErrors('apiKey')
        } else if (error.message.includes('quota')) {
          message = tErrors('quota')
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          message = tErrors('network')
        } else if (error.message) {
          message = error.message
        }
      }

      setGenerationError(message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setHasAttemptedGenerate(true)

    const errors = runValidation(formData)
    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    await generateContent()
  }

  const handleRegenerate = async () => {
    setHasAttemptedGenerate(true)
    const errors = runValidation(formData)
    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    await generateContent()
  }

  const handleSave = async (status: 'draft' | 'published') => {
    if (!editedContent.trim()) {
      return
    }

    setSaveState(status === 'draft' ? 'draft' : 'publish')
    setSaveMessage(null)

    try {
      const defaultTitleTranslation = tGenerator('defaultTitle')
      const defaultTitle = defaultTitleTranslation === 'admin.generator.defaultTitle'
        ? 'Generated Blog Post'
        : defaultTitleTranslation

      const response = await fetch('/api/blog/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.topic.split('\n')[0] || defaultTitle,
          content: editedContent,
          originalContent: generatedContent,
          model: formData.model,
          keywords: formData.keywords,
          referenceUrl: formData.referenceUrl,
          instructions: formData.instructions,
          locale,
          status,
        }),
      })

      if (response.status === 401 || response.status === 403) {
        window.location.href = `/${locale}/admin/login?redirectTo=${encodeURIComponent(`/${locale}/admin/generator`)}`
        return
      }

      const data = await response.json() as { success?: boolean; error?: string }

      if (!response.ok || !data.success) {
        throw new Error(data.error || tErrors(status === 'published' ? 'publishFailed' : 'publishDefault'))
      }

      if (status === 'published') {
        setSaveMessage({ type: 'success', text: tSuccess('published') })
        resetState()
      } else {
        setSaveMessage({ type: 'success', text: tSuccess('draftSaved') })
      }
    } catch (error) {
      console.error('Error saving blog post:', error)

      let message = tErrors(status === 'published' ? 'publishDefault' : 'draftFailed')

      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          message = tErrors('publishNetwork')
        } else if (error.message) {
          message = error.message
        }
      }

      setSaveMessage({ type: 'error', text: message })
    } finally {
      setSaveState('idle')
    }
  }

  const hasGeneratedContent = generatedContent.trim().length > 0
  const canGenerate = isFormValid && !isGenerating
  const canSaveDraft = hasGeneratedContent && editedContent.trim().length > 0 && saveState !== 'draft' && saveState !== 'publish'
  const canPublish = hasGeneratedContent && editedContent.trim().length > 0 && saveState !== 'publish' && saveState !== 'draft'
  const isSavingDraft = saveState === 'draft'
  const isPublishing = saveState === 'publish'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">
          {tGenerator('title')}
        </h1>
        <p className="text-gray-600">
          {tGenerator('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-navy mb-6">
            {tForm('contentGeneration')}
          </h2>

          {generationError && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {generationError}
            </div>
          )}

          <form onSubmit={handleGenerateSubmit} className="space-y-6">
            {validationErrors.contentInputs && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {validationErrors.contentInputs}
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                  {tForm('topicLabel')}
                </label>
                <span className="text-xs text-gray-500">
                  {formData.topic.length} {tForm('characters')} | {getWordCount(formData.topic)} {tForm('words')}
                </span>
              </div>
              <textarea
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={(event) => updateFormField('topic', event.target.value)}
                rows={8}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent resize-vertical ${validationErrors.topic ? 'border-red-300' : 'border-gray-300'}`}
                placeholder={tForm('topicPlaceholder')}
              />
              {validationErrors.topic && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.topic}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {tForm('topicHelper')}
              </p>
            </div>

            <div>
              <label htmlFor="referenceUrl" className="block text-sm font-medium text-gray-700 mb-2">
                {tForm('referenceUrlLabel')}
              </label>
              <input
                type="url"
                id="referenceUrl"
                name="referenceUrl"
                value={formData.referenceUrl}
                onChange={(event) => updateFormField('referenceUrl', event.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent ${validationErrors.referenceUrl ? 'border-red-300' : 'border-gray-300'}`}
                placeholder={tForm('referenceUrlPlaceholder')}
              />
              {validationErrors.referenceUrl && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.referenceUrl}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {tForm('referenceUrlHelper')}
              </p>
            </div>

            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                {tForm('keywordsLabel')}
              </label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={formData.keywords}
                onChange={(event) => updateFormField('keywords', event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                placeholder={tForm('keywordsPlaceholder')}
              />
              <p className="mt-1 text-sm text-gray-500">
                {tForm('keywordsHelper')}
              </p>
            </div>

            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                {tForm('instructionsLabel')}
              </label>
              <textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={(event) => updateFormField('instructions', event.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent resize-vertical ${validationErrors.instructions ? 'border-red-300' : 'border-gray-300'}`}
                placeholder={tForm('instructionsPlaceholder')}
              />
              {validationErrors.instructions && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.instructions}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {tForm('instructionsHelper')}
              </p>
            </div>

            <div>
              <label htmlFor="resourceCategory" className="block text-sm font-medium text-gray-700 mb-2">
                {tForm('categoryLabel')}
              </label>
              <select
                id="resourceCategory"
                name="resourceCategory"
                value={formData.resourceCategory}
                onChange={(event) => updateFormField('resourceCategory', event.target.value as FormState['resourceCategory'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              >
                <option value="blog">{tForm('categoryBlog')}</option>
                <option value="case-studies">{tForm('categoryCaseStudies')}</option>
                <option value="white-papers">{tForm('categoryWhitePapers')}</option>
                <option value="industry-insights">{tForm('categoryIndustryInsights')}</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {tForm('categoryHelper')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {tForm('modelLabel')}
              </label>
              <div className="space-y-3">
                {(
                  [
                    { value: 'gpt-5-nano', label: 'GPT-5 nano', helper: tForm('modelNanoLabel') },
                    { value: 'gpt-5-mini', label: 'GPT-5 mini', helper: tForm('modelMiniLabel') },
                    { value: 'gpt-5', label: 'GPT-5', helper: tForm('modelFullLabel') },
                  ] as const
                ).map(({ value, label, helper }) => (
                  <label key={value} htmlFor={value} className="flex items-center space-x-3 text-sm text-gray-700">
                    <input
                      id={value}
                      name="model"
                      type="radio"
                      value={value}
                      checked={formData.model === value}
                      onChange={(event) => updateFormField('model', event.target.value as FormState['model'])}
                      className="h-4 w-4 text-teal focus:ring-teal border-gray-300"
                    />
                    <span>
                      <span className="font-medium mr-2">{label}</span>
                      <span className="text-gray-500">{helper}</span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {tForm('modelHelper')}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!canGenerate}
                className={`w-full flex justify-center items-center px-6 py-3 rounded-md font-semibold text-white transition-colors duration-200 ${
                  canGenerate
                    ? 'bg-teal hover:bg-teal/90 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {tForm('generating')}
                  </>
                ) : (
                  tForm('generateButton')
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-navy mb-6">
            {tContent('title')}
          </h2>

          {saveMessage && (
            <div
              className={`mb-4 rounded-md px-4 py-3 text-sm ${
                saveMessage.type === 'success'
                  ? 'border border-green-200 bg-green-50 text-green-700'
                  : 'border border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {saveMessage.text}
            </div>
          )}

          {hasGeneratedContent ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(editedContent)}
                  className="px-4 py-2 bg-navy text-white rounded-md hover:bg-navy/90 transition-colors duration-200 text-sm font-medium"
                >
                  {tContent('copyButton')}
                </button>
                <button
                  type="button"
                  onClick={() => setEditedContent(generatedContent)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  {tContent('resetButton')}
                </button>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isGenerating ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  {tContent('regenerateButton')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGeneratedContent('')
                    setEditedContent('')
                    setIsEditing(false)
                    setShowPreview(false)
                    setSaveMessage(null)
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                >
                  {tContent('discardButton')}
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  disabled={!canSaveDraft}
                  className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                    canSaveDraft
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isSavingDraft ? tContent('savingDraft') : tContent('saveDraftButton')}
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('published')}
                  disabled={!canPublish}
                  className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                    canPublish
                      ? 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isPublishing ? tContent('publishing') : tContent('publishButton')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing((prev) => !prev)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                >
                  {isEditing ? tContent('finishEditingButton') : tContent('editButton')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview((prev) => !prev)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                >
                  {showPreview ? tContent('hidePreview') : tContent('showPreview')}
                </button>
              </div>

              <div className="border border-gray-200 rounded-md">
                {isEditing ? (
                  <div className={`grid gap-4 ${showPreview ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                    <div className="p-4">
                      <label htmlFor="editedContent" className="block text-sm font-medium text-gray-700 mb-2">
                        {tContent('editorLabel')}
                      </label>
                      <textarea
                        id="editedContent"
                        value={editedContent}
                        onChange={(event) => setEditedContent(event.target.value)}
                        rows={showPreview ? 20 : 26}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent resize-vertical font-mono text-sm"
                        placeholder={tContent('editorPlaceholder')}
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        {editedContent.length} {tForm('characters')} | {getWordCount(editedContent)} {tForm('words')}
                      </p>
                    </div>
                    {showPreview && (
                      <div className="p-4 bg-gray-50 border-l border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">{tContent('previewLabel')}</h4>
                        <div className="prose prose-sm max-w-none h-[520px] overflow-y-auto">
                          {editedContent ? (
                            <ReactMarkdown>{editedContent}</ReactMarkdown>
                          ) : (
                            <p className="text-sm text-gray-500">{tContent('previewEmpty')}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="prose max-w-none">
                      <ReactMarkdown>{editedContent}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-500">
                {tContent('editorHelper')}
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">{tContent('placeholder')}</p>
              <p className="text-sm text-gray-400 mt-2">{tContent('placeholderSubtext')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">{tGenerator('instructions.title')}</h3>
        <ul className="space-y-2 text-blue-800">
          {instructionItems.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
