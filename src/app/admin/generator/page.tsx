'use client'

import { useState } from 'react'

export default function BlogGeneratorPage() {
  const [formData, setFormData] = useState({
    topic: '',
    keywords: ''
  })
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    // Placeholder for AI API call - will be implemented in next step
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock generated content for now
      setGeneratedContent(`# Generated Blog Post

## Topic: ${formData.topic}

This is a placeholder for the AI-generated blog content. The actual API integration will be implemented in the next phase.

**Keywords**: ${formData.keywords}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Section 1
Content related to ${formData.topic}...

### Section 2
More detailed analysis incorporating ${formData.keywords}...

### Conclusion
Summary of the blog post content.`)
    } catch (error) {
      console.error('Error generating blog post:', error)
      setGeneratedContent('Error generating blog post. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const canGenerate = formData.topic.trim().length > 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">
            Blog Generator Admin Panel
          </h1>
          <p className="text-gray-600">
            Generate AI-powered blog content for Global Genex Inc.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-navy mb-6">
              Content Generation
            </h2>

            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Topic/Outline Textarea */}
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Topic / Outline *
                </label>
                <textarea
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent resize-vertical"
                  placeholder="Enter the main topic and outline for your blog post. Include key points you want to cover, target audience, and any specific angles or perspectives..."
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Describe your blog topic and provide an outline of key points to cover.
                </p>
              </div>

              {/* Keywords Input */}
              <div>
                <label
                  htmlFor="keywords"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Keywords
                </label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                  placeholder="manufacturing, consulting, AI, Japan market entry..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Comma-separated keywords to include in the blog post for SEO optimization.
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
                      Generating Blog Post...
                    </div>
                  ) : (
                    'Generate Blog Post'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Generated Content Display */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-navy mb-6">
              Generated Content
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
                    Copy Content
                  </button>
                  <button
                    onClick={() => setGeneratedContent('')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                  >
                    Clear
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
                  Generated blog content will appear here
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Fill out the form and click &quot;Generate Blog Post&quot; to create content
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Instructions
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              Enter a detailed topic and outline in the textarea to guide the AI generation
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              Add relevant keywords to improve SEO optimization of the generated content
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              Click &quot;Generate Blog Post&quot; to create AI-powered content based on your inputs
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              Review and copy the generated content for use in your blog posts
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}