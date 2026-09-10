"use client"

/*
 * file-upload (reconstruction of the Create UI Pro component)
 * ----------------------------------------------------------
 * 원본은 `@/registry/pro/ui/file-upload` 에서 `createui login`으로만 다운로드되는
 * Pro(有料) 컴포넌트이다 (/r/file-upload.json -> 401).
 *
 * 이 파일은 문서를 통해 공개된 API 스펙 + 무료 훅(useFileUpload) + 무료
 * dropzone를 바탕으로 재구현한 것이다. 실제 동작 구현체와 동일한 public API를
 * 제공한다.
 *
 * public API (createui.co/docs/components/file-upload 문서 + demo 기준):
 *   - FileUpload      : compound container. props: onUpload, accept, maxSize,
 *                       multiple, files, onFilesChange, onPause, onResume, onRemove
 *   - FileUploadList  : files -> FileUploadItem 행 나열
 *   - FileUploadItem  : single row (data-slot="file-upload-item", data-status=...)
 *                       children slots: FileUploadItemMain, FileUploadItemIcon,
 *                       FileUploadItemName, FileUploadItemProgress, FileUploadItemStatus
 *
 * 의존 (무료): use-file-upload (hook), dropzone (DropzoneContext bridge)
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { RiCloseFill, RiRefreshLine, RiUploadCloud2Line } from "@create-ui/assets/icons"

import { useFileUpload, type UploadFile, type UploadHandlers, type FileUploadStatus } from "@/registry/hooks/use-file-upload"
import { DropzoneContext, type DropzoneContextValue } from "@/registry/ui/dropzone"
import { cn } from "@/registry/lib/utils"

/* -------------------------------------------------------------------------- */
/* Contexts                                                                    */
/* -------------------------------------------------------------------------- */

type FileUploadContextValue = ReturnType<typeof useFileUpload> &
  Pick<
    DropzoneContextValue,
    "accept" | "maxSize" | "multiple" | "disabled" | "error" | "errorMessage"
  > & {
    onFilesChange: (files: UploadFile[]) => void
  }

const FileUploadContext = React.createContext<FileUploadContextValue | null>(null)

function useFileUploadContext() {
  const ctx = React.useContext(FileUploadContext)
  if (!ctx) throw new Error("<FileUpload> is a compound component: use FileUpload/List/Item together.")
  return ctx
}

type FileUploadItemContextValue = {
  file: UploadFile
  status: FileUploadStatus
  onRemove: (id: string) => void
  onRetry: (id: string) => void
  onPause: (id: string) => void
  onResume: (id: string) => void
}

const FileUploadItemContext = React.createContext<FileUploadItemContextValue | null>(null)

function useFileUploadItemContext() {
  const ctx = React.useContext(FileUploadItemContext)
  if (!ctx) throw new Error("<FileUploadItem> must be used inside <FileUpload>.")
  return ctx
}

/* -------------------------------------------------------------------------- */
/* Status helpers                                                              */
/* -------------------------------------------------------------------------- */

const STATUS_LABEL: Record<FileUploadStatus, string> = {
  queued: "Queued",
  uploading: "Uploading…",
  paused: "Paused",
  completed: "Uploaded",
  error: "Failed",
}

function formatStatusLabel(file: UploadFile): string {
  const base = STATUS_LABEL[file.status] ?? file.status
  return file.status === "uploading" ? `${base} ${Math.round(file.progress)}%` : base
}

/* -------------------------------------------------------------------------- */
/* Variants                                                                    */
/* -------------------------------------------------------------------------- */

const fileUploadVariants = cva("flex w-full flex-col gap-component-sm", {
  variants: {},
  defaultVariants: {},
})

const fileUploadItemVariants = cva(
  [
    "relative flex w-full items-center gap-component-sm rounded-lg border border-stable-weak bg-static p-component-md",
    // hidden when the whole list is empty (FileUploadList gates this)
  ],
  {
    variants: {
      status: {
        queued: "opacity-70",
        uploading: "",
        paused: "opacity-80",
        completed: "",
        error: "border-error-base bg-error-weakest",
      },
    },
    defaultVariants: { status: "queued" },
  }
)

const fileUploadItemNameVariants = cva(
  "text-body-sm font-medium text-strongest truncate",
  {
    variants: {
      status: {
        queued: "text-placeholder",
        uploading: "text-strongest",
        paused: "text-placeholder",
        completed: "text-strongest",
        error: "text-error-base",
      },
    },
    defaultVariants: { status: "queued" },
  }
)

/* -------------------------------------------------------------------------- */
/* FileUpload (compound container)                                             */
/* -------------------------------------------------------------------------- */

type FileUploadProps = {
  files?: UploadFile[]
  onFilesChange?: (files: UploadFile[]) => void
  onUpload?: (
    files: UploadFile[],
    handlers: UploadHandlers
  ) => void | Promise<void>
  onPause?: (file: UploadFile) => void
  onResume?: (file: UploadFile) => void
  onRemove?: (file: UploadFile) => void
  accept?: string
  maxSize?: number
  maxFiles?: number
  multiple?: boolean
  disabled?: boolean
  children?: React.ReactNode
} & React.ComponentProps<"div">

function FileUpload({
  files,
  onFilesChange,
  onUpload,
  onPause,
  onResume,
  onRemove,
  accept,
  maxSize,
  maxFiles,
  multiple = false,
  disabled = false,
  children,
  className,
  ...props
}: FileUploadProps) {
  const hook = useFileUpload({
    files,
    onFilesChange,
    onUpload,
    onPause,
    onResume,
    onRemove,
    accept,
    maxSize,
    maxFiles,
    multiple,
    disabled,
  })

  // Bridge FileUpload props into the free Dropzone's context so the nested
  // <Dropzone /> inherits accept / maxSize / multiple / validation.
  const dropzoneBridge: DropzoneContextValue = {
    accept,
    maxSize,
    multiple,
    disabled,
    error: hook.rejectionMessage != null,
    errorMessage: hook.rejectionMessage,
    onFilesAccepted: hook.onFilesAccepted,
  }

  const contextValue: FileUploadContextValue = {
    ...hook,
    onFilesChange: onFilesChange ?? (() => {}),
    error: hook.rejectionMessage != null,
    errorMessage: hook.rejectionMessage,
  }

  return (
    <FileUploadContext.Provider value={contextValue}>
      <DropzoneContext.Provider value={dropzoneBridge}>
        <div
          data-slot="file-upload"
          role="list"
          aria-disabled={disabled || undefined}
          className={cn(fileUploadVariants(), className)}
          {...props}
        >
          {children}
        </div>
      </DropzoneContext.Provider>
    </FileUploadContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/* FileUploadList                                                              */
/* -------------------------------------------------------------------------- */

function FileUploadList({ className, children, ...props }: React.ComponentProps<"div">) {
  const ctx = useFileUploadContext()
  const files = ctx.files
  if (files.length === 0) return null

  // Official create-ui usage is a bare <FileUploadList />: rows are auto-rendered
  // from context.files. A caller may instead supply FileUploadItem children; when
  // so, render them directly rather than double-wrapping inside our own rows.
  if (children) {
    return (
      <div
        data-slot="file-upload-list"
        role="listitem"
        className={cn("flex w-full flex-col gap-component-xs", className)}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      data-slot="file-upload-list"
      role="listitem"
      className={cn("flex w-full flex-col gap-component-xs", className)}
      {...props}
    >
      {files.map((file) => (
        <FileUploadItem key={file.id} file={file}>
          <FileUploadItemMain>
            <FileUploadItemIcon />
            <FileUploadItemName />
            <FileUploadItemProgress />
          </FileUploadItemMain>
        </FileUploadItem>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* FileUploadItem + slots                                                      */
/* -------------------------------------------------------------------------- */

function FileUploadItem({
  file,
  className,
  children,
  ...props
}: { file: UploadFile } & React.ComponentProps<"div">) {
  const ctx = useFileUploadContext()

  const status: FileUploadStatus = file.status
  const actions = file.status === "error"

  return (
    <FileUploadItemContext.Provider
      value={{
        file,
        status,
        onRemove: ctx.removeFile,
        onRetry: ctx.retryFile,
        onPause: ctx.pauseFile,
        onResume: ctx.resumeFile,
      }}
    >
      <div
        data-slot="file-upload-item"
        data-status={status}
        role="listitem"
        aria-disabled={ctx.disabled || undefined}
        className={cn(fileUploadItemVariants({ status }), className)}
        {...props}
      >
        {children ?? <FileUploadItemMain />}
        {actions && (
          <div
            data-slot="file-upload-item-actions"
            className="flex shrink-0 items-center gap-component-xs"
          >
            <button
              type="button"
              aria-label="Retry upload"
              onClick={() => ctx.retryFile(file.id)}
              className="flex size-8 items-center justify-center rounded-md text-error-base hover:bg-error-weakest"
            >
              <RiRefreshLine className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Remove file"
              onClick={() => ctx.removeFile(file.id)}
              className="flex size-8 items-center justify-center rounded-md text-placeholder hover:bg-weak"
            >
              <RiCloseFill className="size-4" />
            </button>
          </div>
        )}
      </div>
    </FileUploadItemContext.Provider>
  )
}

function FileUploadItemMain({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-upload-item-main"
      className={cn(
        "flex w-full min-w-0 items-center gap-component-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function FileUploadItemIcon({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { file } = useFileUploadItemContext()
  const status = file.status

  const statusColor: Record<FileUploadStatus, string> = {
    queued: "text-placeholder",
    uploading: "text-strongest",
    paused: "text-placeholder",
    completed: "text-strongest",
    error: "text-error-base",
  }

  return (
    <div
      data-slot="file-upload-item-icon"
      aria-hidden="true"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md bg-weak",
        statusColor[status],
        className
      )}
      {...props}
    >
      <RiUploadCloud2Line className="size-4" />
    </div>
  )
}

function FileUploadItemName({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { file, status } = useFileUploadItemContext()
  return (
    <div
      data-slot="file-upload-item-name"
      className="flex min-w-0 flex-col"
    >
      <span
        className={cn(
          fileUploadItemNameVariants({ status }),
          className
        )}
        {...props}
      >
        {file.name}
      </span>
      {file.status === "error" && file.error && (
        <span className="text-paragraph-xs text-error-base truncate">
          {file.error}
        </span>
      )}
    </div>
  )
}

function FileUploadItemProgress({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { file } = useFileUploadItemContext()
  const completed = file.status === "completed"
  const value = completed ? 100 : file.progress

  return (
    <div
      data-slot="file-upload-item-progress"
      className="flex w-[120px] flex-col gap-component-xs"
      {...props}
    >
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-stable-weak">
        <div
          data-slot="file-upload-item-progress-fill"
          style={{ width: `${value}%` }}
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            completed ? "bg-success-base" : "bg-primary-base"
          )}
        />
      </div>
    </div>
  )
}

function FileUploadItemStatus({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { children?: React.ReactNode }) {
  const { file } = useFileUploadItemContext()
  return (
    <span
      data-slot="file-upload-item-status"
      className={cn(
        "text-paragraph-xs font-medium text-placeholder shrink-0",
        file.status === "error" && "text-error-base",
        className
      )}
      {...props}
    >
      {children ?? formatStatusLabel(file)}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Exports (mirrors create-ui's file-export)                                  */
/* -------------------------------------------------------------------------- */

const fileUpload = {
  FileUpload,
  FileUploadList,
  FileUploadItem,
  FileUploadItemMain,
  FileUploadItemIcon,
  FileUploadItemName,
  FileUploadItemProgress,
  FileUploadItemStatus,
}

export { fileUpload }
export {
  FileUpload,
  FileUploadList,
  FileUploadItem,
  FileUploadItemMain,
  FileUploadItemIcon,
  FileUploadItemName,
  FileUploadItemProgress,
  FileUploadItemStatus,
}
export { fileUploadItemVariants, fileUploadItemNameVariants }
export type { FileUploadProps }
export {
  FileUploadContext,
  FileUploadItemContext,
  useFileUploadContext,
  useFileUploadItemContext,
}
export type { FileUploadContextValue, FileUploadItemContextValue }
