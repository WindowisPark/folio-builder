'use client'

import { useState } from 'react'
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
import { createProject, updateProject, deleteProject, reorderProjects, type Project } from './actions'
import { X, Pencil, Trash2, Plus, ExternalLink, GripVertical } from 'lucide-react'

interface ProjectFormProps {
    projects: Project[]
}

export function ProjectForm({ projects: initialProjects }: ProjectFormProps) {
    const [projects, setProjects] = useState(initialProjects)
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

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
        const result = await createProject(formData)
        setLoading(false)
        if (result.error) {
            alert(result.error)
        } else {
            setIsAdding(false)
            // Refresh will happen via revalidatePath
        }
    }

    async function handleUpdate(formData: FormData) {
        setLoading(true)
        const result = await updateProject(formData)
        setLoading(false)
        if (result.error) {
            alert(result.error)
        } else {
            setEditingId(null)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this project?')) return
        setLoading(true)
        const result = await deleteProject(id)
        setLoading(false)
        if (result.error) {
            alert(result.error)
        }
    }

    return (
        <div className="space-y-8">
            {/* Add Button */}
            <div className="flex justify-end">
                <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
                    <Plus className="w-4 h-4 mr-2" />
                    프로젝트 추가
                </Button>
            </div>

            {/* Add Form */}
            {isAdding && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                            새 프로젝트
                            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">프로젝트명 *</label>
                                    <Input name="name" required placeholder="나의 멋진 프로젝트" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">유형 *</label>
                                    <select
                                        name="projectType"
                                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                        defaultValue="toy"
                                    >
                                        <option value="main">주요 프로젝트</option>
                                        <option value="toy">토이 프로젝트</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">설명</label>
                                <Textarea name="description" placeholder="프로젝트에 대한 간단한 설명" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">URL</label>
                                    <Input name="url" type="url" placeholder="https://example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">이미지 URL</label>
                                    <Input name="imageUrl" type="url" placeholder="https://example.com/image.png" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">기술 스택</label>
                                <Input name="techStack" placeholder="React, Next.js, TypeScript" />
                                <p className="text-xs text-muted-foreground mt-1">쉼표로 구분해서 입력</p>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={loading}>
                                    {loading ? '생성 중...' : '프로젝트 생성'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                                    취소
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Main Projects Section */}
            <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    주요 프로젝트 ({mainProjects.length})
                </h2>
                {mainProjects.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4">아직 주요 프로젝트가 없습니다.</p>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(e) => handleDragEnd(e, 'main')}
                    >
                        <SortableContext items={mainProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-3">
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
            <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    토이 프로젝트 ({toyProjects.length})
                </h2>
                {toyProjects.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4">아직 토이 프로젝트가 없습니다.</p>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(e) => handleDragEnd(e, 'toy')}
                    >
                        <SortableContext items={toyProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-3">
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
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
    }

    return (
        <div ref={setNodeRef} style={style}>
            <ProjectCard {...props} dragHandleProps={{ attributes, listeners }} />
        </div>
    )
}

interface ProjectCardProps {
    project: Project
    isEditing: boolean
    onEdit: () => void
    onCancelEdit: () => void
    onUpdate: (formData: FormData) => void
    onDelete: () => void
    loading: boolean
    dragHandleProps?: {
        attributes: Record<string, unknown>
        listeners: Record<string, unknown> | undefined
    }
}

function ProjectCard({ project, isEditing, onEdit, onCancelEdit, onUpdate, onDelete, loading, dragHandleProps }: ProjectCardProps) {
    if (isEditing) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                        프로젝트 수정
                        <Button variant="ghost" size="icon" onClick={onCancelEdit}>
                            <X className="w-4 h-4" />
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={onUpdate} className="space-y-4">
                        <input type="hidden" name="id" value={project.id} />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">프로젝트명 *</label>
                                <Input name="name" required defaultValue={project.name} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">유형 *</label>
                                <select
                                    name="projectType"
                                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                    defaultValue={project.project_type}
                                >
                                    <option value="main">주요 프로젝트</option>
                                    <option value="toy">토이 프로젝트</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">설명</label>
                            <Textarea name="description" defaultValue={project.description || ''} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">URL</label>
                                <Input name="url" type="url" defaultValue={project.url || ''} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">이미지 URL</label>
                                <Input name="imageUrl" type="url" defaultValue={project.image_url || ''} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">기술 스택</label>
                            <Input name="techStack" defaultValue={project.tech_stack?.join(', ') || ''} />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button type="submit" disabled={loading}>
                                {loading ? '저장 중...' : '저장'}
                            </Button>
                            <Button type="button" variant="outline" onClick={onCancelEdit}>
                                취소
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="group hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                    {/* Drag Handle */}
                    <button
                        className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
                        {...dragHandleProps?.attributes}
                        {...dragHandleProps?.listeners}
                    >
                        <GripVertical className="w-5 h-5" />
                    </button>

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{project.name}</h3>
                            {project.url && (
                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                        {project.description && (
                            <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                        )}
                        {project.tech_stack && project.tech_stack.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {project.tech_stack.map((tech, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={onEdit}>
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onDelete}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
