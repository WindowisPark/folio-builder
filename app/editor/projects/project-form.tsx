'use client'

import { useState, useEffect } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createProject, updateProject, deleteProject, reorderProjects, getProjects, type Project } from './actions'
import { X, Pencil, Trash2, Plus, ExternalLink, GripVertical, UploadCloud, ImageIcon, Loader2, FolderOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ProjectFormProps {
    projects: Project[]
    portfolioId: string
}

export function ProjectForm({ projects: initialProjects, portfolioId }: ProjectFormProps) {
    const [mounted, setMounted] = useState(false)
    const [projects, setProjects] = useState<Project[]>(initialProjects)

    useEffect(() => {
        setMounted(true)
    }, [])
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Preview states for new project
    const [previewUrl, setPreviewUrl] = useState('')

    const mainProjects = projects.filter(p => p.project_type === 'main')
    const toyProjects = projects.filter(p => p.project_type === 'toy')

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    async function handleDragEnd(event: DragEndEvent, type: 'main' | 'toy') {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const currentList = type === 'main' ? mainProjects : toyProjects
            const oldIndex = currentList.findIndex(p => p.id === active.id)
            const newIndex = currentList.findIndex(p => p.id === over.id)

            const reorderedList = arrayMove(currentList, oldIndex, newIndex)

            // Update local state immediately for smooth UX
            const otherList = type === 'main' ? toyProjects : mainProjects
            const newProjects = type === 'main'
                ? [...reorderedList, ...otherList]
                : [...otherList, ...reorderedList]
            setProjects(newProjects)

            // Save to database
            const orderedIds = reorderedList.map(p => p.id)
            const result = await reorderProjects(orderedIds)
            if (result.error) {
                alert(result.error)
                // Revert on error
                setProjects(initialProjects)
            }
        }
    }

    async function handleCreate(formData: FormData) {
        setLoading(true)
        try {
            // Check for file upload
            const file = formData.get('imageFile') as File
            if (file && file.size > 0) {
                const supabase = createClient()
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
                const filePath = fileName

                const { error: uploadError } = await supabase.storage
                    .from('project-images')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                // Manual URL construction to ensure /public/ segment
                const bucket = 'project-images'
                const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`

                console.log('UPLOAD SUCCESS URL:', publicUrl)
                formData.set('imageUrl', publicUrl)
            }

            const result = await createProject(formData)
            if (result.error) {
                alert(result.error)
            } else {
                setIsAdding(false)
                setPreviewUrl('')
                // Refresh list
                const { data } = await getProjects()
                if (data) setProjects(data)
            }
        } catch (error: any) {
            if (error.message?.includes('Bucket not found')) {
                alert('Storage Bucket "project-images"를 찾을 수 없습니다. supabase/storage_setup.sql 스크립트를 Supabase SQL Editor에서 실행했는지 확인해주세요.')
            } else {
                alert('업로드 오류: ' + error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    async function handleUpdate(formData: FormData) {
        setLoading(true)
        try {
            const file = formData.get('imageFile') as File
            if (file && file.size > 0) {
                const supabase = createClient()
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
                const filePath = fileName

                const { error: uploadError } = await supabase.storage
                    .from('project-images')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                // Manual URL construction to ensure /public/ segment
                const bucket = 'project-images'
                const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`

                console.log('UPDATE SUCCESS URL:', publicUrl)
                formData.set('imageUrl', publicUrl)
            }

            const result = await updateProject(formData)
            if (result.error) {
                alert(result.error)
            } else {
                setEditingId(null)
                // Refresh list
                const { data } = await getProjects()
                if (data) setProjects(data)
            }
        } catch (error: any) {
            if (error.message?.includes('Bucket not found')) {
                alert('Storage Bucket "project-images"를 찾을 수 없습니다. supabase/storage_setup.sql 스크립트를 Supabase SQL Editor에서 실행했는지 확인해주세요.')
            } else {
                alert('업로드 오류: ' + error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) return
        setLoading(true)
        const result = await deleteProject(id)
        setLoading(false)
        if (result.error) {
            alert(result.error)
        } else {
            setProjects(projects.filter(p => p.id !== id))
        }
    }

    if (!mounted) return (
        <div className="max-w-5xl mx-auto space-y-8 animate-pulse px-4">
            <div className="h-32 bg-slate-50 rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-slate-50 rounded-3xl" />
                <div className="h-64 bg-slate-50 rounded-3xl" />
            </div>
        </div>
    )

    return (
        <div className="container mx-auto max-w-5xl py-12 px-4 animate-in fade-in duration-700">
            <div className="mb-10 space-y-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full w-fit">
                    <FolderOpen size={12} className="animate-bounce" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Projects</span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">
                    나의 <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">작업물</span> 관리
                </h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">
                    주요 프로젝트와 토이 프로젝트를 구분하여 관리하고 노출 순서를 변경하세요.
                </p>
            </div>

            <div className="space-y-12">
                {/* Add Button */}
                {!isAdding && (
                    <div className="flex justify-center">
                        <Button
                            onClick={() => setIsAdding(true)}
                            className="w-full py-8 border-dashed border-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all rounded-xl flex-col h-auto gap-1"
                            variant="outline"
                        >
                            <Plus className="w-6 h-6" />
                            <span className="font-semibold">새 프로젝트 추가하기</span>
                        </Button>
                    </div>
                )}

                {/* Add Form */}
                {isAdding && (
                    <Card className="border-2 border-black shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center justify-between">
                                새 프로젝트 추가
                                <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form action={handleCreate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">프로젝트명 *</label>
                                            <Input name="name" required placeholder="예: My Awesome Portfolio" className="h-11" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">프로젝트 유형 *</label>
                                            <select
                                                name="projectType"
                                                className="w-full h-11 rounded-md border border-input bg-transparent px-3 py-1 text-sm font-medium"
                                                defaultValue="toy"
                                            >
                                                <option value="main">주요 프로젝트 (Work Experience)</option>
                                                <option value="toy">토이 프로젝트 (Experiments)</option>
                                            </select>
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                주요 프로젝트는 상단에 크게 강조되며, 토이 프로젝트는 하단에 간단히 목록으로 표시됩니다.
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">설명</label>
                                            <Textarea name="description" placeholder="프로젝트의 핵심 가치와 성과를 요약해주세요." className="min-h-[120px] resize-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4 text-indigo-600" />
                                                대표 이미지 (JPG/PNG)
                                            </label>
                                            <div
                                                className="relative aspect-video rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer overflow-hidden group"
                                                onClick={() => document.getElementById('project-image-add')?.click()}
                                                onDragOver={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                }}
                                                onDrop={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    const file = e.dataTransfer.files?.[0]
                                                    if (file && file.type.startsWith('image/')) {
                                                        const url = URL.createObjectURL(file)
                                                        setPreviewUrl(url)
                                                        const input = document.getElementById('project-image-add') as HTMLInputElement
                                                        const dataTransfer = new DataTransfer()
                                                        dataTransfer.items.add(file)
                                                        input.files = dataTransfer.files
                                                    }
                                                }}
                                            >
                                                {previewUrl ? (
                                                    <>
                                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <p className="text-white text-xs font-bold">변경하려면 클릭 또는 드래그</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                                        <div className="p-3 rounded-full bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm transition-all">
                                                            <UploadCloud className="w-6 h-6" />
                                                        </div>
                                                        <div className="text-center px-4">
                                                            <p className="text-xs font-bold text-slate-600 group-hover:text-indigo-600">파일을 드래그하거나 클릭하여 업로드</p>
                                                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Max 5MB • JPG, PNG, WEBP</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <input
                                                    id="project-image-add"
                                                    name="imageFile"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) {
                                                            const url = URL.createObjectURL(file)
                                                            setPreviewUrl(url)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">데모 / 관련 URL</label>
                                            <Input name="url" type="url" placeholder="https://..." className="h-11" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">기술 스택</label>
                                            <Input name="techStack" placeholder="React, Next.js, TailwindCSS" className="h-11" />
                                            <p className="text-[10px] text-slate-400 mt-1">쉼표(,)로 구분하여 입력해주세요.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t">
                                    <Button type="submit" disabled={loading} size="lg" className="px-10 h-12 rounded-full font-bold">
                                        {loading ? '생성 중...' : '프로젝트 생성하기'}
                                    </Button>
                                    <Button type="button" variant="outline" size="lg" onClick={() => setIsAdding(false)} className="rounded-full h-12">
                                        취소
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Main Projects Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="w-1.5 h-6 rounded-full bg-indigo-600"></span>
                            Work Experience / Main Projects
                            <span className="text-sm font-normal text-slate-400 font-mono">({mainProjects.length})</span>
                        </h2>
                    </div>
                    {mainProjects.length === 0 ? (
                        <div className="bg-slate-50 border border-dashed rounded-xl py-12 text-center">
                            <p className="text-slate-400">아직 주요 프로젝트가 없습니다.</p>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(e) => handleDragEnd(e, 'main')}
                        >
                            <SortableContext items={mainProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-4">
                                    {mainProjects.map(project => (
                                        <SortableProjectCard
                                            key={project.id}
                                            project={project}
                                            isEditing={editingId === project.id}
                                            onEdit={() => setEditingId(project.id)}
                                            onCancelEdit={() => setEditingId(null)}
                                            onUpdate={handleUpdate}
                                            onDelete={() => handleDelete(project.id)}
                                            loading={loading}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </section>

                {/* Toy Projects Section */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="w-1.5 h-6 rounded-full bg-slate-200 group-hover:bg-indigo-400 transition-colors"></span>
                        Experiments / Toy Projects
                        <span className="text-sm font-normal text-slate-400 font-mono">({toyProjects.length})</span>
                    </h2>
                    {toyProjects.length === 0 ? (
                        <div className="bg-slate-50 border border-dashed rounded-xl py-12 text-center">
                            <p className="text-slate-400">아직 토이 프로젝트가 없습니다.</p>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(e) => handleDragEnd(e, 'toy')}
                        >
                            <SortableContext items={toyProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-4">
                                    {toyProjects.map(project => (
                                        <SortableProjectCard
                                            key={project.id}
                                            project={project}
                                            isEditing={editingId === project.id}
                                            onEdit={() => setEditingId(project.id)}
                                            onCancelEdit={() => setEditingId(null)}
                                            onUpdate={handleUpdate}
                                            onDelete={() => handleDelete(project.id)}
                                            loading={loading}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </section>
            </div>
        </div>
    )
}

interface SortableProjectCardProps {
    project: Project
    isEditing: boolean
    onEdit: () => void
    onCancelEdit: () => void
    onUpdate: (formData: FormData) => void
    onDelete: () => void
    loading: boolean
}

function SortableProjectCard(props: SortableProjectCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.project.id })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 10 : 1,
    }

    return (
        <div ref={setNodeRef} style={style}>
            <ProjectCard {...props} isDragging={isDragging} dragHandleProps={{ attributes, listeners }} />
        </div>
    )
}

interface ProjectCardProps {
    project: Project
    isEditing: boolean
    isDragging?: boolean
    onEdit: () => void
    onCancelEdit: () => void
    onUpdate: (formData: FormData) => void
    onDelete: () => void
    loading: boolean
    dragHandleProps?: {
        attributes: any
        listeners: any
    }
}

function ProjectCard({ project, isEditing, isDragging, onEdit, onCancelEdit, onUpdate, onDelete, loading, dragHandleProps }: ProjectCardProps) {
    const [editPreviewUrl, setEditPreviewUrl] = useState(project.image_url || '')

    if (isEditing) {
        return (
            <Card className="border-2 border-slate-900 shadow-xl">
                <CardHeader className="bg-slate-50/50">
                    <CardTitle className="text-lg flex items-center justify-between font-bold">
                        프로젝트 정보 수정
                        <Button variant="ghost" size="icon" onClick={onCancelEdit}>
                            <X className="w-5 h-5" />
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <form action={onUpdate} className="space-y-6">
                        <input type="hidden" name="id" value={project.id} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">프로젝트명 *</label>
                                    <Input name="name" required defaultValue={project.name} className="h-11 font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">프로젝트 유형 *</label>
                                    <select
                                        name="projectType"
                                        className="w-full h-11 rounded-md border border-input bg-transparent px-3 py-1 text-sm font-medium"
                                        defaultValue={project.project_type}
                                    >
                                        <option value="main">주요 프로젝트</option>
                                        <option value="toy">토이 프로젝트</option>
                                    </select>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        분류에 따라 포트폴리오 상의 노출 스타일이 결정됩니다.
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">설명</label>
                                    <Textarea name="description" defaultValue={project.description || ''} className="min-h-[120px] resize-none" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-indigo-600" />
                                        대표 이미지 변경
                                    </label>
                                    <div
                                        className="relative aspect-video rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer overflow-hidden group"
                                        onClick={() => document.getElementById(`project-image-edit-${project.id}`)?.click()}
                                        onDragOver={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            const file = e.dataTransfer.files?.[0]
                                            if (file && file.type.startsWith('image/')) {
                                                const url = URL.createObjectURL(file)
                                                setEditPreviewUrl(url)
                                                const input = document.getElementById(`project-image-edit-${project.id}`) as HTMLInputElement
                                                const dataTransfer = new DataTransfer()
                                                dataTransfer.items.add(file)
                                                input.files = dataTransfer.files
                                            }
                                        }}
                                    >
                                        {(editPreviewUrl || project.image_url) ? (
                                            <>
                                                <img src={editPreviewUrl || project.image_url || ''} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <p className="text-white text-xs font-bold font-bold">변경하려면 클릭 또는 드래그</p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                                <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all">
                                                    <UploadCloud className="w-5 h-5" />
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400">드래그 또는 클릭</p>
                                            </div>
                                        )}
                                        <input
                                            id={`project-image-edit-${project.id}`}
                                            name="imageFile"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    const url = URL.createObjectURL(file)
                                                    setEditPreviewUrl(url)
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">데모 URL</label>
                                    <Input name="url" type="url" defaultValue={project.url || ''} className="h-11" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">기술 스택</label>
                                    <Input name="techStack" defaultValue={project.tech_stack?.join(', ') || ''} className="h-11" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-6 border-t">
                            <Button type="submit" disabled={loading} size="lg" className="px-10 h-11 rounded-full font-bold">
                                {loading ? '변경사항 저장 중...' : '변경사항 저장'}
                            </Button>
                            <Button type="button" variant="outline" size="lg" onClick={onCancelEdit} className="rounded-full h-11">
                                취소
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={`group relative transition-all duration-300 ${isDragging ? 'border-slate-300 shadow-none' : 'hover:shadow-lg hover:border-slate-400'}`}>
            <CardContent className="p-0">
                <div className="flex items-center">
                    {/* Drag Handle */}
                    <div
                        className="p-4 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 transition-colors"
                        {...dragHandleProps?.attributes}
                        {...dragHandleProps?.listeners}
                    >
                        <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex flex-1 items-center gap-4 py-4 pr-6">
                        {/* Thumbnail Preview in list */}
                        <div className="w-24 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 relative group-hover:border-slate-300">
                            {project.image_url ? (
                                <img src={project.image_url} alt="" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Plus className="w-4 h-4 text-slate-200" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg truncate">{project.name}</h3>
                                {project.url && (
                                    <a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-300 hover:text-slate-900 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                            <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">{project.description || '설명이 없습니다.'}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {project.tech_stack?.slice(0, 4).map((tech, i) => (
                                    <span key={i} className="text-[10px] bg-slate-50 text-slate-400 border px-1.5 py-0.5 rounded">
                                        {tech}
                                    </span>
                                ))}
                                {project.tech_stack && project.tech_stack.length > 4 && (
                                    <span className="text-[10px] text-slate-300">+{project.tech_stack.length - 4}</span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" onClick={onEdit} className="h-9 w-9 rounded-full bg-slate-50">
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={onDelete} className="h-9 w-9 rounded-full bg-red-50 hover:bg-red-100">
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
