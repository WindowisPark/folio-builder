'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from './button'
import { X, Check, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'

interface ImageCropperProps {
    imageSrc: string
    onCropComplete: (croppedImageBlob: Blob) => void
    onCancel: () => void
    aspectRatio?: number
}

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

export function ImageCropper({ imageSrc, onCropComplete, onCancel, aspectRatio = 16 / 9 }: ImageCropperProps) {
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<Crop>()
    const [scale, setScale] = useState(1)
    const [isDragging, setIsDragging] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const animationFrameRef = useRef<number | null>(null)

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget
        setCrop(centerAspectCrop(width, height, aspectRatio))
    }, [aspectRatio])

    const getCroppedImg = useCallback(async () => {
        if (!completedCrop || !imgRef.current) return

        const image = imgRef.current
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        const pixelRatio = window.devicePixelRatio || 1

        canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio)
        canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio)

        ctx.scale(pixelRatio, pixelRatio)
        ctx.imageSmoothingQuality = 'high'

        const cropX = completedCrop.x * scaleX
        const cropY = completedCrop.y * scaleY
        const cropWidth = completedCrop.width * scaleX
        const cropHeight = completedCrop.height * scaleY

        ctx.drawImage(
            image,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
        )

        // 최대 크기 제한 (1920x1080)
        const maxWidth = 1920
        const maxHeight = 1080
        let finalWidth = canvas.width / pixelRatio
        let finalHeight = canvas.height / pixelRatio

        if (finalWidth > maxWidth || finalHeight > maxHeight) {
            const ratio = Math.min(maxWidth / finalWidth, maxHeight / finalHeight)
            finalWidth *= ratio
            finalHeight *= ratio

            const resizedCanvas = document.createElement('canvas')
            resizedCanvas.width = finalWidth
            resizedCanvas.height = finalHeight
            const resizedCtx = resizedCanvas.getContext('2d')
            if (resizedCtx) {
                resizedCtx.imageSmoothingQuality = 'high'
                resizedCtx.drawImage(canvas, 0, 0, finalWidth, finalHeight)
                resizedCanvas.toBlob((blob) => {
                    if (blob) onCropComplete(blob)
                }, 'image/jpeg', 0.9)
                return
            }
        }

        canvas.toBlob((blob) => {
            if (blob) onCropComplete(blob)
        }, 'image/jpeg', 0.9)
    }, [completedCrop, onCropComplete])

    const resetCrop = () => {
        if (imgRef.current) {
            const { width, height } = imgRef.current
            setCrop(centerAspectCrop(width, height, aspectRatio))
        }
        setScale(1)
    }

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.25, 3))
    }

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.25, 0.5))
    }

    // 드래그 중 마우스 위치에 따라 자동 스크롤
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return

        const container = scrollContainerRef.current
        const rect = container.getBoundingClientRect()
        const scrollSpeed = 10
        const edgeThreshold = 50

        // 컨테이너 경계에서의 거리 계산
        const distanceFromTop = e.clientY - rect.top
        const distanceFromBottom = rect.bottom - e.clientY
        const distanceFromLeft = e.clientX - rect.left
        const distanceFromRight = rect.right - e.clientX

        let scrollX = 0
        let scrollY = 0

        // 상하 스크롤
        if (distanceFromTop < edgeThreshold) {
            scrollY = -scrollSpeed * (1 - distanceFromTop / edgeThreshold)
        } else if (distanceFromBottom < edgeThreshold) {
            scrollY = scrollSpeed * (1 - distanceFromBottom / edgeThreshold)
        }

        // 좌우 스크롤
        if (distanceFromLeft < edgeThreshold) {
            scrollX = -scrollSpeed * (1 - distanceFromLeft / edgeThreshold)
        } else if (distanceFromRight < edgeThreshold) {
            scrollX = scrollSpeed * (1 - distanceFromRight / edgeThreshold)
        }

        if (scrollX !== 0 || scrollY !== 0) {
            container.scrollBy(scrollX, scrollY)
        }
    }, [isDragging])

    // 드래그 시작/종료 감지
    const handleDragStart = useCallback(() => {
        setIsDragging(true)
    }, [])

    const handleDragEnd = useCallback(() => {
        setIsDragging(false)
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
        }
    }, [])

    // 마우스 이벤트 리스너 등록
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleDragEnd)
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleDragEnd)
        }
    }, [isDragging, handleMouseMove, handleDragEnd])

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div
                className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-black tracking-tight text-slate-900">이미지 크롭</h3>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onCancel}
                        className="rounded-full h-10 w-10"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </Button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-500 text-center">
                        드래그하여 썸네일로 사용할 영역을 선택하세요 (16:9 비율)
                    </p>

                    {/* Zoom Controls */}
                    <div className="flex items-center justify-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleZoomOut}
                            disabled={scale <= 0.5}
                            className="rounded-full h-9 w-9"
                        >
                            <ZoomOut size={16} />
                        </Button>
                        <span className="text-sm font-medium text-slate-600 min-w-[60px] text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleZoomIn}
                            disabled={scale >= 3}
                            className="rounded-full h-9 w-9"
                        >
                            <ZoomIn size={16} />
                        </Button>
                    </div>

                    <div
                        ref={scrollContainerRef}
                        className="flex justify-center bg-slate-50 rounded-2xl p-4 max-h-[50vh] overflow-auto overscroll-contain"
                        onWheel={(e) => e.stopPropagation()}
                    >
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspectRatio}
                            className="max-w-full"
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <img
                                ref={imgRef}
                                src={imageSrc}
                                alt="Crop"
                                onLoad={onImageLoad}
                                style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
                                className="max-w-full object-contain transition-transform"
                            />
                        </ReactCrop>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={resetCrop}
                        className="h-12 px-6 rounded-full font-bold text-slate-400 gap-2"
                    >
                        <RotateCcw size={16} />
                        초기화
                    </Button>
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCancel}
                            className="h-12 px-6 rounded-full font-bold text-slate-400"
                        >
                            취소
                        </Button>
                        <Button
                            type="button"
                            onClick={getCroppedImg}
                            className="h-12 px-8 rounded-full bg-slate-900 hover:bg-black text-white font-bold gap-2"
                        >
                            <Check size={16} />
                            적용하기
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
