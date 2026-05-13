'use client'

import { useState, useRef } from 'react'
import { uploadDocument, queryDocument } from '@/lib/api'
import type { Document, DocumentQueryResult } from '@/lib/types'

const statusColors: Record<Document['status'], string> = {
  ready: 'bg-emerald-100 text-emerald-700',
  processing: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
}

interface Message {
  role: 'user' | 'assistant'
  text: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selected, setSelected] = useState<Document | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [question, setQuestion] = useState('')
  const [uploading, setUploading] = useState(false)
  const [querying, setQuerying] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(file: File) {
    if (!file.name.endsWith('.pdf')) {
      setUploadError('Only PDF files are accepted.')
      return
    }
    setUploadError('')
    setUploading(true)
    try {
      const doc = await uploadDocument(file)
      setDocuments((prev) => [doc, ...prev])
      if (!selected) setSelected(doc)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  async function handleQuery(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!selected || !question.trim() || selected.status !== 'ready') return
    const q = question.trim()
    setMessages((prev) => [...prev, { role: 'user', text: q }])
    setQuestion('')
    setQuerying(true)
    try {
      const result: DocumentQueryResult = await queryDocument(selected.id, q)
      setMessages((prev) => [...prev, { role: 'assistant', text: result.answer }])
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: '⚠️ ' + (err instanceof Error ? err.message : 'Error') }])
    } finally {
      setQuerying(false)
    }
  }

  function selectDoc(doc: Document) {
    setSelected(doc)
    setMessages([])
    setQuestion('')
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
        <p className="text-slate-500 text-sm mt-1">Upload PDFs and ask questions via RAG + Claude</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: upload + doc list */}
        <div className="flex flex-col gap-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              dragOver ? 'border-slate-400 bg-slate-100' : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm font-medium text-slate-700">
              {uploading ? 'Uploading...' : 'Drop PDF here or click to browse'}
            </p>
            <p className="text-xs text-slate-400 mt-1">PDF only</p>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }}
            />
          </div>

          {uploadError && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{uploadError}</p>
          )}

          {/* Document list */}
          {documents.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => selectDoc(doc)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-100 last:border-0 transition-colors flex items-center justify-between gap-2 ${
                    selected?.id === doc.id ? 'bg-slate-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm font-medium text-slate-800 truncate">{doc.filename}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColors[doc.status]}`}>
                    {doc.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: chat */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-96">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Upload a document to start asking questions
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800 truncate">{selected.filename}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[selected.status]}`}>
                  {selected.status}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.length === 0 && (
                  <p className="text-slate-400 text-sm text-center mt-8">Ask anything about this document</p>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-sm rounded-xl px-4 py-2.5 text-sm ${
                      m.role === 'user'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {querying && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 text-slate-500 rounded-xl px-4 py-2.5 text-sm">Thinking...</div>
                  </div>
                )}
              </div>

              <form onSubmit={handleQuery} className="p-3 border-t border-slate-100 flex gap-2">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={selected.status === 'ready' ? 'Ask something about this document...' : 'Document is not ready yet'}
                  disabled={selected.status !== 'ready' || querying}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50 disabled:text-slate-400 transition"
                />
                <button
                  type="submit"
                  disabled={!question.trim() || selected.status !== 'ready' || querying}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-40 transition-colors"
                >
                  →
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
