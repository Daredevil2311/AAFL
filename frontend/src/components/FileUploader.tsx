"use client"

import type React from "react"
import { useState } from "react"

interface FileUploaderProps {
  label: string
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  onFilesSelected,
  accept = "*",
  multiple = true,
}) => {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const newFiles = Array.from(e.dataTransfer.files)
    handleFiles(newFiles)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (newFiles: File[]) => {
    const updated = multiple ? [...files, ...newFiles] : newFiles
    setFiles(updated)
    onFilesSelected(updated)
  }

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onFilesSelected(updated)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          dragActive ? "border-accent bg-accent bg-opacity-10" : "border-secondary hover:border-accent"
        }`}
      >
        <input
          type="file"
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
          className="hidden"
          id={`file-input-${label}`}
          aria-label={`Upload ${label}`}
        />
        <label htmlFor={`file-input-${label}`} className="cursor-pointer block">
          <p className="text-accent font-medium">Click to upload or drag and drop</p>
          <p className="text-xs text-muted mt-1">Any file type accepted</p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted">{files.length} file(s) selected</p>
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between bg-secondary p-2 rounded text-xs">
              <span className="truncate">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </span>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-destructive hover:text-red-400 ml-2"
                aria-label={`Remove file ${file.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
