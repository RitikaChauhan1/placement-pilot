import React, { useState, useRef } from 'react';
import { X, FileText, Upload, Trash2, Eye, Download, CheckCircle2, AlertCircle } from 'lucide-react';

export default function UploadResumeModal({ isOpen, onClose, currentResume, onSaveResume, onDeleteResume }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF file (.pdf only).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }

    setSelectedFile(file);
    const fakeSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const fakeUrl = URL.createObjectURL(file);
    setFilePreview({
      name: file.name,
      size: fakeSize,
      uploaded_at: 'Just now',
      url: fakeUrl
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!selectedFile && !filePreview) {
      setError('Please select a PDF resume file.');
      return;
    }

    setSaving(true);
    try {
      // In a full production setup with S3/upload bucket, we upload the blob.
      // Here we store resume metadata & preview URL to persist
      const resumePayload = {
        name: filePreview?.name || selectedFile.name,
        size: filePreview?.size || (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
        uploaded_at: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        url: filePreview?.url || '/uploads/resumes/ritika_resume.pdf'
      };

      await onSaveResume(resumePayload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save resume. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to remove your uploaded resume?')) {
      setSaving(true);
      try {
        await onDeleteResume();
        setSelectedFile(null);
        setFilePreview(null);
        onClose();
      } catch (err) {
        setError(err.message || 'Failed to delete resume.');
      } finally {
        setSaving(false);
      }
    }
  };

  const activeResume = filePreview || currentResume;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-[#0e1424] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#11182c]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Manage Resume</h3>
              <p className="text-xs text-slate-400">Upload or replace your placement resume (PDF only)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-slate-200">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,application/pdf"
            className="hidden"
          />

          {/* Active resume display */}
          {activeResume ? (
            <div className="p-4 bg-[#131b2e] border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-100 line-clamp-1">{activeResume.name || 'Resume.pdf'}</h4>
                    <p className="text-xs text-slate-400">
                      {activeResume.size || '1.2 MB'} • Uploaded {activeResume.uploaded_at || 'Recently'}
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Uploaded
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  {activeResume.url && (
                    <a
                      href={activeResume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#0e1424] hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </a>
                  )}
                  {activeResume.url && (
                    <a
                      href={activeResume.url}
                      download={activeResume.name || 'Resume.pdf'}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#0e1424] hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="px-3 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg transition-colors"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Upload drop area */
            <div
              onClick={handleUploadClick}
              className="border-2 border-dashed border-slate-700/80 hover:border-indigo-500/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-[#131b2e]/40 hover:bg-[#131b2e]/80 group"
            >
              <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-200 mb-1">Click to upload your resume</p>
              <p className="text-xs text-slate-400 mb-3">Accepts PDF files up to 10MB</p>
              <button
                type="button"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors shadow-lg shadow-indigo-600/20"
              >
                Choose PDF File
              </button>
            </div>
          )}

          <div className="bg-[#11182c]/80 rounded-xl p-3 border border-slate-800 text-xs text-slate-400 space-y-1">
            <p className="font-medium text-slate-300">Resume Tips for PlacementPilot:</p>
            <p>• Make sure your resume includes contact info, degree, CGPA, and key skills.</p>
            <p>• Our AI Interview and Resume Builder features will tailor questions directly from this file.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800/80 bg-[#11182c]">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 rounded-xl transition-colors"
          >
            Cancel
          </button>
          {selectedFile && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Resume</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
