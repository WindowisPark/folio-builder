'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { createProject, updateProject, deleteProject, reorderProjects, getProjects, type Project } from './actions'
import { X, Pencil, Trash2, Plus, ExternalLink, GripVertical, UploadCloud, ImageIcon, Loader2, FolderOpen, Sparkles, LayoutGrid, Check, ChevronDown, Crop } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DescriptionEditor } from '@/components/ui/description-editor'
import { ImageCropper } from '@/components/ui/image-cropper'

interface ProjectFormProps {
    projects: Project[]
    portfolioId: string
}

export function ProjectForm({ projects: initialProjects, portfolioId }: ProjectFormProps) {
    const [mounted, setMounted] = useState(false)
    const [projects, setProjects] = useState<Project[]>(initialProjects)
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const [previewUrl, setPreviewUrl] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [newLongDescription, setNewLongDescription] = useState('')
    const [newChallenges, setNewChallenges] = useState('')
    const [newSolutions, setNewSolutions] = useState('')
    const [newTroubleshooting, setNewTroubleshooting] = useState('')

    const mainProjects = projects.filter(p => p.project_type === 'main')
    const toyProjects = projects.filter(p => p.project_type === 'toy')

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    async function handleDragEnd(event: DragEndEvent, type: 'main' | 'toy') {
        const { active, over } = event
        if (over && active.id !== over.id) {
            const currentList = type === 'main' ? mainProjects : toyProjects
            const oldIndex = currentList.findIndex(p => p.id === active.id)
            const newIndex = currentList.findIndex(p => p.id === over.id)
            const reorderedList = arrayMove(currentList, oldIndex, newIndex)
            const otherList = type === 'main' ? toyProjects : mainProjects
            const newProjects = type === 'main' ? [...reorderedList, ...otherList] : [...otherList, ...reorderedList]
            setProjects(newProjects)
            const result = await reorderProjects(reorderedList.map(p => p.id))
            if (result.error) { alert(result.error); setProjects(initialProjects); }
        }
    }

    async function handleCreate(formData: FormData) {
        setLoading(true)
        try {
            const file = formData.get('imageFile') as File
            if (file && file.size > 0) {
                const supabase = createClient()
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
                const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, file)
                if (uploadError) throw uploadError
                const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(fileName)
                formData.set('imageUrl', publicUrl)
            }
            const result = await createProject(formData)
            if (result.error) alert(result.error)
            else {
                setIsAdding(false); setPreviewUrl('');
                const { data } = await getProjects(); if (data) setProjects(data);
                setNewDescription(''); setNewLongDescription(''); setNewChallenges(''); setNewSolutions(''); setNewTroubleshooting('');
            }
        } catch (error: any) { alert('오류: ' + error.message) }
        finally { setLoading(false) }
    }

    async function handleUpdate(formData: FormData) {
        setLoading(true)
        try {
            const file = formData.get('imageFile') as File
            if (file && file.size > 0) {
                const supabase = createClient()
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
                const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, file)
                if (uploadError) throw uploadError
                const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(fileName)
                formData.set('imageUrl', publicUrl)
            }
            const result = await updateProject(formData)
            if (result.error) alert(result.error)
            else {
                setEditingId(null)
                const { data } = await getProjects(); if (data) setProjects(data)
            }
        } catch (error: any) { alert('오류: ' + error.message) }
        finally { setLoading(false) }
    }

    async function handleDelete(id: string) {
        if (!confirm('정말 삭제하시겠습니까?')) return
        setLoading(true)
        try {
            const result = await deleteProject(id)
            if (result.error) alert(result.error)
            else {
                const { data } = await getProjects(); if (data) setProjects(data)
            }
        } catch (error: any) { alert('오류: ' + error.message) }
        finally { setLoading(false) }
    }

    if (!mounted) return (
        <div className="container mx-auto max-w-5xl py-12 px-4 animate-pulse">
            <div className="h-40 bg-slate-50 rounded-[2.5rem] mb-12" />
            <div className="space-y-6">
                <div className="h-24 bg-slate-50 rounded-3xl" />
                <div className="h-24 bg-slate-50 rounded-3xl" />
            </div>
        </div>
    )

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="container mx-auto max-w-5xl py-12 px-4 pb-32"
        >
            {/* Header Section */}
            <div className="mb-12 flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200">
                        <LayoutGrid size={18} strokeWidth={2.5} />
                    </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">프로젝트 쇼케이스</h2>
                <p className="text-slate-400 font-medium text-lg max-w-md">
                    최고의 성과물을 선별하고 매력적인 스토리로 구성하세요.
                </p>
            </div>

            <div className="space-y-16">
                {/* Add Flow */}
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {!isAdding ? (
                            <motion.div
                                key="add-button"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <Button
                                    onClick={() => setIsAdding(true)}
                                    className="w-full py-10 border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-900 text-slate-400 hover:text-slate-900 transition-all rounded-[2.5rem] flex flex-col h-auto gap-2 group"
                                    variant="outline"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <Plus className="w-6 h-6" strokeWidth={3} />
                                    </div>
                                    <span className="font-black text-sm tracking-tight">새 프로젝트 등록하기</span>
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="add-form"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 30 }}
                            >
                                <Card className="border-none shadow-[0_30px_60px_rgb(0,0,0,0.06)] bg-white rounded-[3rem] overflow-hidden">
                                    <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between">
                                        <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">New Project</h3>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsAdding(false)}
                                            className="rounded-full hover:bg-slate-50 h-10 w-10"
                                        >
                                            <X className="w-5 h-5 text-slate-400" />
                                        </Button>
                                    </div>
                                    <CardContent className="p-10">
                                        <form action={handleCreate} className="space-y-10">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                <div className="space-y-8">
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">프로젝트명</Label>
                                                        <Input name="name" required placeholder="예: My Awesome Portfolio" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold text-lg" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">프로젝트 유형</Label>
                                                        <div className="relative">
                                                            <select
                                                                name="projectType"
                                                                className="w-full h-14 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-1 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-slate-900/5 appearance-none cursor-pointer"
                                                                defaultValue="toy"
                                                            >
                                                                <option value="main">주요 프로젝트 (Work Experience)</option>
                                                                <option value="toy">토이 프로젝트 (Experiments)</option>
                                                            </select>
                                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                                        </div>
                                                    </div>
                                                    <DescriptionEditor
                                                        label="짧은 설명"
                                                        value={newDescription}
                                                        onChange={setNewDescription}
                                                        placeholder="프로젝트의 핵심 가치와 성과를 요약해주세요."
                                                        className="mt-4"
                                                    />
                                                    <input type="hidden" name="description" value={newDescription} />
                                                </div>
                                                <div className="space-y-8">
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">대표 이미지</Label>
                                                        <ImageUploadZone
                                                            previewUrl={previewUrl}
                                                            onFileSelect={(url) => setPreviewUrl(url)}
                                                            id="project-add"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">관련 링크</Label>
                                                        <div className="flex items-center h-14 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 group-focus-within:bg-white group-focus-within:ring-4 group-focus-within:ring-slate-900/5 transition-all">
                                                            <ExternalLink size={16} className="text-slate-300 mr-2" />
                                                            <Input name="url" type="url" placeholder="https://..." className="border-none shadow-none focus-visible:ring-0 px-0 font-bold h-full" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">기술 스택</Label>
                                                        <Input name="techStack" placeholder="React, Next.js, TailwindCSS (쉼표 구분)" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Case Study Section */}
                                            <div className="pt-10 border-t border-slate-100 space-y-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                                        <Sparkles size={16} />
                                                    </div>
                                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Case Study (상세 설명)</h3>
                                                </div>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                    <DescriptionEditor
                                                        label="상세 배경 및 설명"
                                                        value={newLongDescription}
                                                        onChange={setNewLongDescription}
                                                        placeholder="상세 배경..."
                                                        className="h-full"
                                                    />
                                                    <input type="hidden" name="longDescription" value={newLongDescription} />
                                                    <div className="grid grid-cols-1 gap-6">
                                                        <DescriptionEditor label="도전 과제 (Challenges)" value={newChallenges} onChange={setNewChallenges} />
                                                        <input type="hidden" name="challenges" value={newChallenges} />
                                                        <DescriptionEditor label="해결 방법 (Solutions)" value={newSolutions} onChange={setNewSolutions} />
                                                        <input type="hidden" name="solutions" value={newSolutions} />
                                                        <DescriptionEditor label="트러블슈팅 (Troubleshooting)" value={newTroubleshooting} onChange={setNewTroubleshooting} />
                                                        <input type="hidden" name="troubleshooting" value={newTroubleshooting} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end gap-4 pt-4">
                                                <Button type="button" variant="ghost" className="h-14 px-8 rounded-full font-black text-slate-400" onClick={() => setIsAdding(false)}>CANCEL</Button>
                                                <Button type="submit" disabled={loading} className="h-16 px-12 rounded-full bg-slate-900 hover:bg-black text-white font-black shadow-xl shadow-slate-200 min-w-[200px]">
                                                    {loading ? <Loader2 className="animate-spin" /> : 'CREATE PROJECT'}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Projects List Sections */}
                <div className="space-y-20">
                    <ProjectSection
                        title="Work Experience"
                        subtitle="Main Projects"
                        projects={mainProjects}
                        type="main"
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        editingId={editingId}
                        setEditingId={setEditingId}
                        handleUpdate={handleUpdate}
                        handleDelete={handleDelete}
                        loading={loading}
                    />

                    <ProjectSection
                        title="Experiments"
                        subtitle="Toy Projects"
                        projects={toyProjects}
                        type="toy"
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        editingId={editingId}
                        setEditingId={setEditingId}
                        handleUpdate={handleUpdate}
                        handleDelete={handleDelete}
                        loading={loading}
                        isMinimal
                    />
                </div>
            </div>
        </motion.div>
    )
}

/** 
 * Subheader & List Component 
 */
function ProjectSection({ title, subtitle, projects, type, onDragEnd, sensors, editingId, setEditingId, handleUpdate, handleDelete, loading, isMinimal = false }: any) {
    return (
        <section className="space-y-8">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-2">
                <div className="flex items-baseline gap-3">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
                    <span className="text-xs font-black uppercase text-slate-300 tracking-[0.2em]">{subtitle}</span>
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{projects.length} Items</span>
            </div>

            {projects.length === 0 ? (
                <div className="py-20 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-100">
                    <p className="text-slate-400 font-bold text-sm">등록된 프로젝트가 없습니다.</p>
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => onDragEnd(e, type)}>
                    <SortableContext items={projects.map((p: any) => p.id)} strategy={verticalListSortingStrategy}>
                        <div className="grid grid-cols-1 gap-6">
                            {projects.map((project: any) => (
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
    )
}

function SortableProjectCard({ project, isEditing, onEdit, onCancelEdit, onUpdate, onDelete, loading }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id })
    const style = { transform: CSS.Translate.toString(transform), transition, zIndex: isDragging ? 50 : 1 }

    return (
        <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-30' : 'opacity-100'}>
            <ProjectCard
                project={project}
                isEditing={isEditing}
                isDragging={isDragging}
                dragHandleProps={{ attributes, listeners }}
                onEdit={onEdit}
                onCancelEdit={onCancelEdit}
                onUpdate={onUpdate}
                onDelete={onDelete}
                loading={loading}
            />
        </div>
    )
}

function ProjectCard({ project, isEditing, isDragging, onEdit, onCancelEdit, onUpdate, onDelete, loading, dragHandleProps }: any) {
    const [editPreviewUrl, setEditPreviewUrl] = useState(project.image_url || '')
    const [editDescription, setEditDescription] = useState(project.description || '')
    const [editLongDescription, setEditLongDescription] = useState(project.long_description || '')
    const [editChallenges, setEditChallenges] = useState(project.challenges || '')
    const [editSolutions, setEditSolutions] = useState(project.solutions || '')
    const [editTroubleshooting, setEditTroubleshooting] = useState(project.troubleshooting || '')

    if (isEditing) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="border-none shadow-[0_30px_60px_rgb(0,0,0,0.1)] bg-white rounded-[3rem] overflow-hidden">
                    <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <h3 className="text-sm font-black tracking-widest text-slate-900 uppercase">Edit Project</h3>
                        <Button variant="ghost" size="icon" onClick={onCancelEdit} className="rounded-full h-10 w-10">
                            <X className="w-5 h-5 text-slate-400" />
                        </Button>
                    </div>
                    <CardContent className="p-10">
                        <form action={onUpdate} className="space-y-10">
                            <input type="hidden" name="id" value={project.id} />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">프로젝트명</Label>
                                        <Input name="name" required defaultValue={project.name} className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold text-lg" />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">프로젝트 유형</Label>
                                        <div className="relative">
                                            <select
                                                name="projectType"
                                                className="w-full h-14 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-1 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-slate-900/5 appearance-none cursor-pointer"
                                                defaultValue={project.project_type}
                                            >
                                                <option value="main">주요 프로젝트</option>
                                                <option value="toy">토이 프로젝트</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                    <DescriptionEditor label="짧은 설명" value={editDescription} onChange={setEditDescription} className="mt-4" />
                                    <input type="hidden" name="description" value={editDescription} />
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">대표 이미지</Label>
                                        <ImageUploadZone
                                            previewUrl={editPreviewUrl}
                                            onFileSelect={(url) => setEditPreviewUrl(url)}
                                            id={`edit-${project.id}`}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">관련 링크</Label>
                                        <div className="flex items-center h-14 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 transition-all">
                                            <ExternalLink size={16} className="text-slate-300 mr-2" />
                                            <Input name="url" type="url" defaultValue={project.url || ''} className="border-none shadow-none focus-visible:ring-0 px-0 font-bold h-full" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">기술 스택</Label>
                                        <Input name="techStack" defaultValue={project.tech_stack?.join(', ') || ''} className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold" />
                                    </div>
                                </div>
                            </div>

                            {/* Case Study Section */}
                            <div className="pt-10 border-t border-slate-100 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                        <Sparkles size={16} />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Case Study (상세 설명)</h3>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <DescriptionEditor label="상세 배경 및 설명" value={editLongDescription} onChange={setEditLongDescription} />
                                    <input type="hidden" name="longDescription" value={editLongDescription} />
                                    <div className="grid grid-cols-1 gap-6">
                                        <DescriptionEditor label="도전 과제 (Challenges)" value={editChallenges} onChange={setEditChallenges} />
                                        <input type="hidden" name="challenges" value={editChallenges} />
                                        <DescriptionEditor label="해결 방법 (Solutions)" value={editSolutions} onChange={setEditSolutions} />
                                        <input type="hidden" name="solutions" value={editSolutions} />
                                        <DescriptionEditor label="트러블슈팅 (Troubleshooting)" value={editTroubleshooting} onChange={setEditTroubleshooting} />
                                        <input type="hidden" name="troubleshooting" value={editTroubleshooting} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4">
                                <Button type="button" variant="ghost" className="h-14 px-8 rounded-full font-black text-slate-400" onClick={onCancelEdit}>CANCEL</Button>
                                <Button type="submit" disabled={loading} className="h-16 px-12 rounded-full bg-slate-900 hover:bg-black text-white font-black shadow-xl shadow-slate-200 min-w-[200px]">
                                    {loading ? <Loader2 className="animate-spin" /> : 'SAVE CHANGES'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <Card className="border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden transition-all hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] group border border-slate-50">
            <CardContent className="p-0">
                <div className="flex items-center">
                    {/* Drag Handle */}
                    <div
                        className="p-5 cursor-grab active:cursor-grabbing text-slate-200 hover:text-slate-900 transition-colors"
                        {...dragHandleProps?.attributes}
                        {...dragHandleProps?.listeners}
                    >
                        <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex flex-1 items-center gap-6 py-5 pr-8">
                        {/* Thumbnail */}
                        <div className="w-28 h-20 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 relative shadow-inner">
                            {project.image_url ? (
                                <img src={project.image_url} alt="" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-6 h-6 text-slate-200" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-black text-lg text-slate-900 truncate tracking-tight">{project.name}</h3>
                                {project.url && (
                                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-50 rounded-lg text-slate-300 hover:text-slate-900 transition-all">
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                                {project.long_description && (
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                                        <Sparkles size={10} />
                                        Case Study
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-slate-400 font-medium line-clamp-1">{project.description || '설명이 없습니다.'}</p>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {project.tech_stack?.slice(0, 5).map((tech: string, i: number) => (
                                    <span key={i} className="text-[10px] font-black text-slate-400 border border-slate-100 px-2 py-0.5 rounded-lg bg-white/50 lowercase tracking-tight">
                                        {tech}
                                    </span>
                                ))}
                                {project.tech_stack && project.tech_stack.length > 5 && (
                                    <span className="text-[10px] font-black text-slate-300 ml-1">+{project.tech_stack.length - 5}</span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={onEdit} className="h-10 w-10 rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all">
                                <Pencil size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={onDelete} className="h-10 w-10 rounded-2xl bg-red-50 text-red-400 hover:bg-black hover:text-white transition-all border border-red-100 hover:border-black">
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

interface ImageUploadZoneProps {
    previewUrl: string | null
    onFileSelect: (url: string, file?: File) => void
    id: string
}

function ImageUploadZone({ previewUrl, onFileSelect, id }: ImageUploadZoneProps) {
    const [showCropper, setShowCropper] = useState(false)
    const [originalImage, setOriginalImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // 파일 타입 검증
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
            if (!allowedTypes.includes(file.type)) {
                alert('JPG, PNG, WebP, GIF 형식만 업로드 가능합니다.')
                return
            }
            // 파일 크기 검증 (10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('파일 크기는 10MB 이하여야 합니다.')
                return
            }
            const url = URL.createObjectURL(file)
            setOriginalImage(url)
            setShowCropper(true)
        }
    }

    const handleCropComplete = (croppedBlob: Blob) => {
        const croppedUrl = URL.createObjectURL(croppedBlob)
        // DataTransfer를 사용하여 File 객체 생성
        const croppedFile = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' })

        // hidden input에 파일 설정
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(croppedFile)
        if (fileInputRef.current) {
            fileInputRef.current.files = dataTransfer.files
        }

        onFileSelect(croppedUrl, croppedFile)
        setShowCropper(false)
        setOriginalImage(null)
    }

    const handleCancelCrop = () => {
        setShowCropper(false)
        setOriginalImage(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <>
            <div
                className="relative aspect-video rounded-3xl border-2 border-dashed border-slate-100 hover:border-slate-900 hover:bg-slate-50/50 transition-all cursor-pointer overflow-hidden group bg-slate-50/30"
                onClick={() => fileInputRef.current?.click()}
            >
                {previewUrl ? (
                    <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <Crop size={20} className="text-white" />
                            <p className="text-white text-xs font-black uppercase tracking-widest">Change Image</p>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-200 group-hover:text-slate-900 transition-all">
                            <UploadCloud size={24} strokeWidth={2.5} />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-black text-slate-300 group-hover:text-slate-900 uppercase tracking-widest">Upload Cover</p>
                            <p className="text-[9px] text-slate-200 mt-1">자동 크롭 (16:9)</p>
                        </div>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    id={id}
                    name="imageFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {showCropper && originalImage && (
                <ImageCropper
                    imageSrc={originalImage}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCancelCrop}
                    aspectRatio={16 / 9}
                />
            )}
        </>
    )
}
