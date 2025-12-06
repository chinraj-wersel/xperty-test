import { useState, useEffect } from 'react'
import {
  Upload, Search, Filter, FileText, File, Image, FileSpreadsheet,
  Download, Eye, Trash2, FolderOpen, Calendar, User, X
} from 'lucide-react'
import { getMockProperties } from '../lib/mockData'

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [viewDocument, setViewDocument] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = () => {
    // Add user uploaded documents from localStorage
    const savedDocs = JSON.parse(localStorage.getItem('xperty_documents') || '[]')
    setDocuments(savedDocs)
  }

  const categories = [
    { id: 'all', name: 'All Documents', count: documents.length },
    { id: 'compliance', name: 'Compliance', count: documents.filter(d => d.category === 'compliance').length },
    { id: 'tenancy', name: 'Tenancy', count: documents.filter(d => d.category === 'tenancy').length },
    { id: 'invoices', name: 'Invoices', count: documents.filter(d => d.category === 'invoices').length },
    { id: 'photos', name: 'Photos', count: documents.filter(d => d.category === 'photos').length },
    { id: 'inventory', name: 'Inventory', count: documents.filter(d => d.category === 'inventory').length },
    { id: 'insurance', name: 'Insurance', count: documents.filter(d => d.category === 'insurance').length },
    { id: 'other', name: 'Other', count: documents.filter(d => d.category === 'other').length }
  ]

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.propertyAddress?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getFileIcon = (type) => {
    const icons = {
      pdf: <FileText className="w-5 h-5 text-error" />,
      xlsx: <FileSpreadsheet className="w-5 h-5 text-success" />,
      xls: <FileSpreadsheet className="w-5 h-5 text-success" />,
      png: <Image className="w-5 h-5 text-info" />,
      jpg: <Image className="w-5 h-5 text-info" />,
      jpeg: <Image className="w-5 h-5 text-info" />,
      zip: <FolderOpen className="w-5 h-5 text-warning" />
    }
    return icons[type] || <File className="w-5 h-5 text-brand-600" />
  }

  const getCategoryColor = (category) => {
    const colors = {
      compliance: 'error',
      tenancy: 'primary',
      invoices: 'warning',
      photos: 'info',
      inventory: 'success',
      insurance: 'primary',
      other: 'neutral'
    }
    return colors[category] || 'neutral'
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = (e) => {
    e.preventDefault()
    // Simulate file upload
    const formData = new FormData(e.target)
    const fileName = formData.get('fileName') || (selectedFile ? selectedFile.name : 'New Document.pdf')
    const fileType = selectedFile ? selectedFile.name.split('.').pop().toLowerCase() : 'pdf'
    const fileSize = selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : '250 KB'
    
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: fileName,
      category: formData.get('category'),
      type: fileType,
      size: fileSize,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString().split('T')[0],
      propertyAddress: formData.get('property')
    }

    const updatedDocs = [...documents, newDoc]
    setDocuments(updatedDocs)

    // Save to localStorage
    localStorage.setItem('xperty_documents', JSON.stringify(updatedDocs))

    setUploadModalOpen(false)
    setSelectedFile(null)
    e.target.reset()
  }

  const handleDelete = (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      const updatedDocs = documents.filter(d => d.id !== docId)
      setDocuments(updatedDocs)

      // Update localStorage
      const userDocs = updatedDocs.filter(d => !d.id.startsWith('doc-'))
      localStorage.setItem('xperty_documents', JSON.stringify(updatedDocs))
    }
  }

  const handleDownload = (doc) => {
    // Simulate download
    alert(`Downloading: ${doc.name}`)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[clamp(100%,95vw,1280px)] mx-auto min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-900 mb-2">Documents</h1>
          <p className="text-brand-600">Manage property documents and files</p>
        </div>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="ent-btn-primary flex items-center gap-2 justify-center"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="ent-card p-4">
          <div className="text-2xl font-bold text-brand-900 mb-1">{documents.length}</div>
          <div className="text-sm text-brand-600">Total Documents</div>
        </div>
        <div className="ent-card p-4">
          <div className="text-2xl font-bold text-error mb-1">
            {documents.filter(d => d.category === 'compliance').length}
          </div>
          <div className="text-sm text-brand-600">Compliance</div>
        </div>
        <div className="ent-card p-4">
          <div className="text-2xl font-bold text-primary mb-1">
            {documents.filter(d => d.category === 'tenancy').length}
          </div>
          <div className="text-sm text-brand-600">Tenancy</div>
        </div>
        <div className="ent-card p-4">
          <div className="text-2xl font-bold text-warning mb-1">
            {documents.filter(d => d.category === 'invoices').length}
          </div>
          <div className="text-sm text-brand-600">Invoices</div>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Categories Sidebar */}
        <div className="lg:w-64 space-y-1">
          <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wide mb-3">
            Categories
          </h3>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors rounded ${selectedCategory === category.id
                ? 'bg-brand-900 text-white'
                : 'text-brand-700 hover:bg-brand-100'
                }`}
            >
              <span>{category.name}</span>
              <span className={`text-xs ${selectedCategory === category.id ? 'text-white' : 'text-brand-500'
                }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Documents List */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="ent-input pl-10"
              />
            </div>
          </div>

          {/* Documents Grid/List */}
          {filteredDocuments.length === 0 ? (
            <div className="ent-card p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-brand-400" />
              <h3 className="text-xl font-semibold text-brand-900 mb-2">
                {searchQuery || selectedCategory !== 'all' ? 'No documents found' : 'No Documents Yet'}
              </h3>
              <p className="text-sm text-brand-600 mb-6">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first document to get started'}
              </p>
              {!searchQuery && selectedCategory === 'all' && (
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="ent-btn-primary"
                >
                  Upload Your First Document
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="ent-card p-4 hover:border-brand-300 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* File Icon */}
                    <div className="w-12 h-12 bg-brand-100 flex items-center justify-center flex-shrink-0 rounded">
                      {getFileIcon(doc.type)}
                    </div>

                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-brand-900 truncate">{doc.name}</h3>
                          <p className="text-sm text-brand-600 truncate">{doc.propertyAddress}</p>
                        </div>
                        <span className={`ent-badge-${getCategoryColor(doc.category)} flex-shrink-0`}>
                          {doc.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-brand-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {doc.uploadedBy}
                        </span>
                        <span>{doc.size}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewDocument(doc)}
                          className="ent-btn-secondary py-1 px-3 text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="ent-btn-secondary py-1 px-3 text-xs flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 text-error hover:bg-error-light transition-colors rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div 
          className="fixed inset-0 bg-brand-900/50 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setUploadModalOpen(false)
            }
          }}
        >
          <div className="bg-white w-full max-w-[clamp(320px,90vw,448px)] rounded overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-brand-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-brand-900">Upload Document</h2>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 text-brand-600 hover:text-brand-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">
                  Select File
                </label>
                <div className="border-2 border-dashed border-brand-300 p-8 text-center hover:border-brand-400 transition-colors rounded">
                  <Upload className="w-10 h-10 mx-auto mb-3 text-brand-400" />
                  <p className="text-sm text-brand-600 mb-2">
                    Drag and drop or click to browse
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="ent-btn-secondary text-xs cursor-pointer inline-block">
                    Choose File
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  name="fileName"
                  className="ent-input"
                  placeholder="Gas Safety Certificate.pdf"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">
                  Category
                </label>
                <select name="category" className="ent-select" required>
                  <option value="compliance">Compliance</option>
                  <option value="tenancy">Tenancy</option>
                  <option value="invoices">Invoices</option>
                  <option value="photos">Photos</option>
                  <option value="inventory">Inventory</option>
                  <option value="insurance">Insurance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">
                  Property (Optional)
                </label>
                <input
                  type="text"
                  name="property"
                  className="ent-input"
                  placeholder="45 Oxford Street"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 ent-btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 ent-btn-primary">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Document Modal */}
      {viewDocument && (
        <div 
          className="fixed inset-0 bg-brand-900/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setViewDocument(null)
            }
          }}
        >
          <div className="bg-white w-full max-w-[clamp(320px,95vw,768px)] max-h-[90vh] flex flex-col rounded overflow-hidden">
            <div className="p-6 border-b border-brand-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-brand-900">{viewDocument.name}</h2>
                <p className="text-sm text-brand-600">{viewDocument.propertyAddress}</p>
              </div>
              <button
                onClick={() => setViewDocument(null)}
                className="p-1 text-brand-600 hover:text-brand-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="flex items-center justify-center h-full bg-brand-50 border border-brand-200 rounded">
                <div className="text-center">
                  {getFileIcon(viewDocument.type)}
                  <p className="text-sm text-brand-600 mt-4">
                    Document preview would appear here
                  </p>
                  <button
                    onClick={() => handleDownload(viewDocument)}
                    className="ent-btn-primary mt-4"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Download to View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentsPage