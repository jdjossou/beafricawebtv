'use client'

import * as React from 'react'
import {PatchEvent, set, unset, type ArrayOfPrimitivesInputProps} from 'sanity'

const MAX_CHARS = 500

type Props = ArrayOfPrimitivesInputProps

function computeUsedChars(tags: string[]): number {
  if (tags.length === 0) return 0
  // Count total characters including comma separators between tags
  return tags.join(',').length
}

export default function TagInput({value, onChange}: Props) {
  const tags: string[] = React.useMemo(
    () => (Array.isArray(value) ? (value as string[]).filter(Boolean) : []),
    [value],
  )
  const [inputValue, setInputValue] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const usedChars = computeUsedChars(tags)
  // Characters that would be used if we add the current input text
  const pendingTotal = inputValue.trim()
    ? usedChars + (tags.length > 0 ? 1 : 0) + inputValue.trim().length
    : usedChars

  const patchTags = React.useCallback(
    (next: string[]) => {
      if (next.length === 0) {
        onChange(PatchEvent.from([unset()]))
      } else {
        onChange(PatchEvent.from([set(next)]))
      }
    },
    [onChange],
  )

  const addTag = React.useCallback(
    (raw: string) => {
      const tag = raw.trim()
      if (!tag) return

      // Duplicate check (case-insensitive)
      if (tags.some((t) => t.toLowerCase() === tag)) return

      const next = [...tags, tag]
      const nextChars = computeUsedChars(next)
      if (nextChars > MAX_CHARS) return

      patchTags(next)
      setInputValue('')
    },
    [tags, patchTags],
  )

  const removeTag = React.useCallback(
    (index: number) => {
      const next = tags.filter((_, i) => i !== index)
      patchTags(next)
    },
    [tags, patchTags],
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault()
        addTag(inputValue)
        return
      }

      if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
        e.preventDefault()
        removeTag(tags.length - 1)
      }
    },
    [addTag, inputValue, removeTag, tags.length],
  )

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      // If user pastes or types a comma, split and add each tag
      if (raw.includes(',')) {
        const parts = raw.split(',')
        // All parts except the last get added as tags
        for (let i = 0; i < parts.length - 1; i++) {
          addTag(parts[i])
        }
        // The last part stays in the input (may be empty)
        setInputValue(parts[parts.length - 1])
      } else {
        setInputValue(raw)
      }
    },
    [addTag],
  )

  const handleContainerClick = React.useCallback(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div style={{display: 'grid', gap: 6}}>
      {/* Tag input container */}
      <div
        onClick={handleContainerClick}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 6,
          padding: '8px 10px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          backgroundColor: '#101113',
          cursor: 'text',
          minHeight: 42,
          transition: 'border-color 0.15s ease',
        }}
        onFocus={() => {}}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Chips */}
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 6,
              fontSize: 13,
              lineHeight: '20px',
              color: '#e0e0e6',
              whiteSpace: 'nowrap',
            }}
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(index)
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#f0f0f5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b6b7a'
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 16,
                height: 16,
                padding: 0,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#6b6b7a',
                fontSize: 14,
                lineHeight: 1,
                borderRadius: 4,
                transition: 'color 0.15s ease',
              }}
              aria-label={`Remove tag "${tag}"`}
            >
              ×
            </button>
          </span>
        ))}

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? 'Add tag' : ''}
          style={{
            flex: '1 1 80px',
            minWidth: 80,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: 13,
            lineHeight: '20px',
            color: '#e0e0e6',
            padding: 0,
          }}
        />
      </div>

      {/* Subtitle with live character counter */}
      <div style={{fontSize: 12, color: '#6b6b7a'}}>
        Enter a comma after each tag. {pendingTotal}/{MAX_CHARS}.
      </div>
    </div>
  )
}
