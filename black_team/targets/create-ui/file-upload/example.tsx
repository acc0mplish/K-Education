"use client"

/*
 * example.tsx — reconstructed file-upload end-to-end demo.
 *
 * Uses the free useFileUpload hook + the reconstructed FileUpload compound
 * component (this reconstruction of the gated create-ui Pro component) + the
 * free Dropzone. No Pro token required.
 */

import * as React from "react"

import {
  FileUpload,
  FileUploadList,
  FileUploadItem,
  FileUploadItemMain,
  FileUploadItemIcon,
  FileUploadItemName,
  FileUploadItemProgress,
  FileUploadItemStatus,
} from "@/registry/pro/ui/file-upload" // reconstructed path
import { Dropzone } from "@/registry/ui/dropzone"
import {
  useFileUpload,
  type UploadFile,
} from "@/registry/hooks/use-file-upload"

function durationFor(file: UploadFile) {
  return Math.min(Math.max((file.size / 1_000_000) * 1200, 2200), 7000)
}

export default function FileUploadExample() {
  const { files, onFilesChange, onUpload, pauseFile, resumeFile, removeFile } =
    useFileUpload({
      multiple: true,
      accept: ".zip,.pdf,.jpg,.png,.mp4",
      maxSize: 25 * 1024 * 1024,
      onFilesChange,
      onUpload,
    })

  const timers = React.useRef(new Map<string, number>())

  const drive = React.useCallback(
    (id: string, durationMs: number) => {
      const tickMs = 40
      const step = (100 * tickMs) / durationMs
      const existing = timers.current.get(id)
      if (existing) window.clearInterval(existing)
      const timerId = window.setInterval(() => {
        onFilesChange((prev) => {
          const file = prev.find((f) => f.id === id)
          if (!file || file.status !== "uploading") {
            window.clearInterval(timerId)
            timers.current.delete(id)
            return prev
          }
          const next = Math.min(file.progress + step, 100)
          if (next >= 100) {
            window.clearInterval(timerId)
            timers.current.delete(id)
            window.setTimeout(() => {
              onFilesChange((cur) =>
                cur.map((f) =>
                  f.id === id ? { ...f, status: "completed", progress: 100 } : f
                )
              )
            }, 900)
          }
          return prev.map((f) => (f.id === id ? { ...f, progress: next } : f))
        })
      }, tickMs)
      timers.current.set(id, timerId)
    },
    [onFilesChange]
  )

  const onUploadCb = React.useCallback(
    (batch: UploadFile[]) => {
      for (const file of batch) drive(file.id, durationFor(file))
    },
    [drive]
  )

  return (
    <div className="w-full max-w-[420px]">
      <FileUpload
        multiple
        accept=".zip,.pdf,.jpg,.png,.mp4"
        maxSize={25 * 1024 * 1024}
        files={files}
        onFilesChange={onFilesChange}
        onUpload={onUploadCb}
        onPause={pauseFile}
        onResume={resumeFile}
        onRemove={removeFile}
      >
        <Dropzone />
        <FileUploadList>
          <FileUploadItem>
            <FileUploadItemMain>
              <FileUploadItemIcon />
              <FileUploadItemName />
              <FileUploadItemProgress />
            </FileUploadItemMain>
            <FileUploadItemStatus />
          </FileUploadItem>
        </FileUploadList>
      </FileUpload>
      {files.length > 0 && (
        <button
          type="button"
          className="mt-3 text-sm text-placeholder underline"
          onClick={() => files.forEach((f) => removeFile(f.id))}
        >
          Clear all
        </button>
      )}
    </div>
  )
}
