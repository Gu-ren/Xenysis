'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { WorkspaceAsset, AssetPosition } from '../types'
import { MIN_ZOOM, MAX_ZOOM, DEFAULT_PAN_X, DEFAULT_PAN_Y, DEFAULT_ZOOM } from '../constants'
import { computeBounds } from '../utils/layout'

interface UseCanvasReturn {
  panX: number
  panY: number
  zoom: number
  positions: AssetPosition[]
  onWheel: (e: React.WheelEvent<HTMLDivElement>) => void
  onCanvasMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseUp: () => void
  onCanvasDblClick: (e: React.MouseEvent<HTMLDivElement>) => void
  onNodeMouseDown: (e: React.MouseEvent, id: string) => void
  zoomIn: () => void
  zoomOut: () => void
  resetView: () => void
  fitView: () => void
  panTo: (x: number, y: number) => void
}

export function useCanvas(
  assets: WorkspaceAsset[],
  initialPositions: AssetPosition[],
  viewW: number,
  viewH: number,
): UseCanvasReturn {
  const [panX, setPanX] = useState(DEFAULT_PAN_X)
  const [panY, setPanY] = useState(DEFAULT_PAN_Y)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [positions, setPositions] = useState<AssetPosition[]>(() => initialPositions)

  // When the computed layout changes (new assets added/removed), merge with existing
  // positions so manually dragged nodes keep their user-defined coordinates.
  useEffect(() => {
    if (initialPositions.length === 0) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPositions((prev) => {
      const existing = new Map(prev.map((p) => [p.id, p]))
      return initialPositions.map((lp) => existing.get(lp.id) ?? lp)
    })
  }, [initialPositions])

  // Keep a fast lookup for asset dimensions (used in fitView)
  const assetMap = useRef(new Map<string, { w: number; h: number }>())
  useEffect(() => {
    assetMap.current = new Map(assets.map((a) => [a.id, { w: a.w, h: a.h }]))
  }, [assets])

  const dragRef = useRef<{
    type: 'pan' | 'node'
    id?: string
    startMouseX: number
    startMouseY: number
    startValueX: number
    startValueY: number
  } | null>(null)

  // ── Wheel zoom (centred on cursor) ──────────────────────────────────────────

  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    const factor = e.ctrlKey ? 0.008 : 0.001   // pinch vs scroll
    const delta = -e.deltaY * factor
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta * z)))
  }, [])

  // ── Pan (canvas background drag) ────────────────────────────────────────────

  const onCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.button !== 1) return
    e.preventDefault()
    dragRef.current = {
      type: 'pan',
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startValueX: panX,
      startValueY: panY,
    }
  }, [panX, panY])

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const dx = (e.clientX - drag.startMouseX) / zoom
    const dy = (e.clientY - drag.startMouseY) / zoom
    if (drag.type === 'pan') {
      setPanX(drag.startValueX + dx * zoom)
      setPanY(drag.startValueY + dy * zoom)
    } else if (drag.type === 'node' && drag.id) {
      setPositions((prev) =>
        prev.map((p) =>
          p.id === drag.id
            ? { ...p, x: drag.startValueX + dx, y: drag.startValueY + dy }
            : p
        )
      )
    }
  }, [zoom])

  const onMouseUp = useCallback(() => { dragRef.current = null }, [])

  // ── Node drag ───────────────────────────────────────────────────────────────

  const onNodeMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const pos = positions.find((p) => p.id === id)
    if (!pos) return
    dragRef.current = {
      type: 'node',
      id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startValueX: pos.x,
      startValueY: pos.y,
    }
  }, [positions])

  // ── Fit view ─────────────────────────────────────────────────────────────────

  const fitView = useCallback(() => {
    if (positions.length === 0 || viewW === 0 || viewH === 0) return
    const bounds = computeBounds(positions, assetMap.current)
    if (!bounds) return
    const PAD = 80
    const bw = bounds.maxX - bounds.minX + PAD * 2
    const bh = bounds.maxY - bounds.minY + PAD * 2
    const newZoom = Math.min(
      Math.max(viewW / bw, MIN_ZOOM),
      Math.min(viewH / bh, MAX_ZOOM),
    )
    const newPanX = (viewW - (bounds.maxX - bounds.minX) * newZoom) / 2 - bounds.minX * newZoom
    const newPanY = (viewH - (bounds.maxY - bounds.minY) * newZoom) / 2 - bounds.minY * newZoom
    setZoom(+newZoom.toFixed(3))
    setPanX(newPanX)
    setPanY(newPanY)
  }, [positions, viewW, viewH])

  // Double-click on empty canvas → fit view
  const onCanvasDblClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-canvas-node]')) return
    fitView()
  }, [fitView])

  // ── Zoom controls ────────────────────────────────────────────────────────────

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.1).toFixed(2)))
  }, [])

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.1).toFixed(2)))
  }, [])

  const resetView = useCallback(() => {
    setPanX(DEFAULT_PAN_X)
    setPanY(DEFAULT_PAN_Y)
    setZoom(DEFAULT_ZOOM)
  }, [])

  const panTo = useCallback((x: number, y: number) => {
    setPanX(x)
    setPanY(y)
  }, [])

  // ── Keyboard shortcuts ───────────────────────────────────────────────────────

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return
      if (e.key === '=' || e.key === '+') { e.preventDefault(); zoomIn() }
      else if (e.key === '-') { e.preventDefault(); zoomOut() }
      else if (e.key === '0') { e.preventDefault(); resetView() }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [zoomIn, zoomOut, resetView])

  return {
    panX, panY, zoom, positions,
    onWheel, onCanvasMouseDown, onMouseMove, onMouseUp, onCanvasDblClick, onNodeMouseDown,
    zoomIn, zoomOut, resetView, fitView, panTo,
  }
}
