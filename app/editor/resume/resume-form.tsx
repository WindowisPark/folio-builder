'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Briefcase, GraduationCap, Award as AwardIcon, BadgeCheck, Save, Loader2, Calendar, ChevronDown, ChevronUp, Languages, UploadCloud, FileText, X, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { updateWorkExperience, updateEducation, updateAwards, updateCertifications, updateLanguageCerts, WorkExperience, Education, Award, Certification, LanguageCertification } from './actions'
import { createClient } from '@/lib/supabase/client'

interface ResumeFormProps {
    portfolioId: string
    initialData: {
        work: WorkExperience[]
        education: Education[]
        awards: Award[]
        certifications: Certification[]
        languages: LanguageCertification[]
    }
}

type TabType = 'work' | 'edu' | 'awards' | 'certs' | 'languages'

export function ResumeForm({ portfolioId, initialData }: ResumeFormProps) {
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState<TabType | null>(null)
    const [uploading, setUploading] = useState<string | null>(null)
    const [activeSection, setActiveSection] = useState<TabType>('work')

    useEffect(() => {
        setMounted(true)
    }, [])

    const [workItems, setWorkItems] = useState<WorkExperience[]>(initialData.work)
    const [eduItems, setEduItems] = useState<Education[]>(initialData.education)
    const [awardItems, setAwardItems] = useState<Award[]>(initialData.awards)
    const [certItems, setCertItems] = useState<Certification[]>(initialData.certifications)
    const [langItems, setLangItems] = useState<LanguageCertification[]>(initialData.languages || [])

    const handleFileUpload = async (index: number, section: 'certs' | 'languages', file: File) => {
        if (!file) return
        setUploading(`${section}-${index}`)
        try {
            const supabase = createClient()
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
            const filePath = `proofs/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('resume-proofs')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('resume-proofs')
                .getPublicUrl(filePath)

            if (section === 'certs') {
                const newItems = [...certItems]
                newItems[index].file_url = publicUrl
                setCertItems(newItems)
            } else {
                const newItems = [...langItems]
                newItems[index].file_url = publicUrl
                setLangItems(newItems)
            }
        } catch (error: any) {
            alert('업로드 실패: ' + error.message)
        } finally {
            setUploading(null)
        }
    }

    const handleSave = async (section: TabType) => {
        setLoading(true)
        try {
            let result
            if (section === 'work') result = await updateWorkExperience(portfolioId, workItems)
            if (section === 'edu') result = await updateEducation(portfolioId, eduItems)
            if (section === 'awards') result = await updateAwards(portfolioId, awardItems)
            if (section === 'certs') result = await updateCertifications(portfolioId, certItems)
            if (section === 'languages') result = await updateLanguageCerts(portfolioId, langItems)

            if (result?.error) alert(result.error)
            else {
                setSaved(section)
                setTimeout(() => setSaved(null), 3000)
            }
        } catch (error: any) {
            alert('오류 발생: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const addItem = (section: string) => {
        if (section === 'work') {
            setWorkItems([...workItems, { id: '', portfolio_id: portfolioId, company_name: '', role: '', start_date: '', end_date: null, is_current: false, description: '', display_order: workItems.length }])
        }
        if (section === 'edu') {
            setEduItems([...eduItems, { id: '', portfolio_id: portfolioId, school_name: '', degree: '', major: '', status: '졸업', start_date: '', end_date: null, is_current: false, display_order: eduItems.length }])
        }
        if (section === 'awards') {
            setAwardItems([...awardItems, { id: '', portfolio_id: portfolioId, title: '', issuer: '', date: '', description: '', display_order: awardItems.length }])
        }
        if (section === 'certs') {
            setCertItems([...certItems, { id: '', portfolio_id: portfolioId, name: '', issuer: '', date: '', credential_url: '', file_url: null, display_order: certItems.length }])
        }
        if (section === 'languages') {
            setLangItems([...langItems, { id: '', portfolio_id: portfolioId, language: '', test_name: '', score: '', date: '', file_url: null, display_order: langItems.length }])
        }
    }

    const removeItem = (section: string, index: number) => {
        if (section === 'work') setWorkItems(workItems.filter((_, i) => i !== index))
        if (section === 'edu') setEduItems(eduItems.filter((_, i) => i !== index))
        if (section === 'awards') setAwardItems(awardItems.filter((_, i) => i !== index))
        if (section === 'certs') setCertItems(certItems.filter((_, i) => i !== index))
        if (section === 'languages') setLangItems(langItems.filter((_, i) => i !== index))
    }

    if (!mounted) return (
        <div className="container mx-auto max-w-5xl py-12 px-4 animate-pulse">
            <div className="h-40 bg-slate-50 rounded-[2.5rem] mb-12" />
            <div className="h-96 bg-slate-50 rounded-[2.5rem]" />
        </div>
    )

    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: 'work', label: '경력', icon: Briefcase },
        { id: 'edu', label: '학력', icon: GraduationCap },
        { id: 'awards', label: '수상', icon: AwardIcon },
        { id: 'certs', label: '자격증', icon: BadgeCheck },
        { id: 'languages', label: '어학', icon: Languages },
    ]

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }

    const sectionVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="container mx-auto max-w-5xl py-12 px-4 pb-32"
        >
            {/* Header section with consistent branding */}
            <div className="mb-12 flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200">
                        <Sparkles size={18} strokeWidth={2.5} />
                    </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">커리어 정보</h2>
                <p className="text-slate-400 font-medium text-lg max-w-md">
                    당신의 전문성을 증명할 수 있는 경험들을 정밀하게 기록하세요.
                </p>
            </div>

            {/* Custom Premium Tabs */}
            <div className="flex flex-wrap bg-slate-50/50 p-2 rounded-[2rem] gap-2 mb-10 backdrop-blur-sm border border-slate-100">
                {tabs.map((tab) => {
                    const isActive = activeSection === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl text-sm font-black tracking-tight transition-all relative overflow-hidden ${isActive
                                ? 'text-white'
                                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100/50'
                                }`}
                        >
                            <tab.icon size={18} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                            <span className="relative z-10">{tab.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="active-tab"
                                    className="absolute inset-0 bg-slate-900 -z-0"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Content Area with Animation Transitions */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-8"
                    >
                        {/* 1. Work Experience */}
                        {activeSection === 'work' && (
                            <div className="space-y-6">
                                {workItems.map((item, index) => (
                                    <ResumeItemCard
                                        key={index}
                                        index={index}
                                        title={`Entry #${index + 1}`}
                                        onRemove={() => removeItem('work', index)}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">회사명</Label>
                                                <Input
                                                    value={item.company_name}
                                                    onChange={e => {
                                                        const newItems = [...workItems];
                                                        newItems[index].company_name = e.target.value;
                                                        setWorkItems(newItems);
                                                    }}
                                                    placeholder="예: 구글 코리아"
                                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold placeholder:font-medium"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">직무/직책</Label>
                                                <Input
                                                    value={item.role}
                                                    onChange={e => {
                                                        const newItems = [...workItems];
                                                        newItems[index].role = e.target.value;
                                                        setWorkItems(newItems);
                                                    }}
                                                    placeholder="예: 프론트엔드 개발자"
                                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold placeholder:font-medium"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">시작일</Label>
                                                <Input
                                                    type="date"
                                                    value={item.start_date || ''}
                                                    onChange={e => {
                                                        const newItems = [...workItems];
                                                        newItems[index].start_date = e.target.value;
                                                        setWorkItems(newItems);
                                                    }}
                                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">종료일</Label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`current-${index}`}
                                                            checked={item.is_current}
                                                            onChange={e => {
                                                                const newItems = [...workItems];
                                                                newItems[index].is_current = e.target.checked;
                                                                if (e.target.checked) newItems[index].end_date = null;
                                                                setWorkItems(newItems);
                                                            }}
                                                            className="w-4 h-4 accent-slate-900 border-slate-200 rounded"
                                                        />
                                                        <Label htmlFor={`current-${index}`} className="text-[10px] font-black text-slate-500 cursor-pointer">재직 중</Label>
                                                    </div>
                                                </div>
                                                <Input
                                                    type="date"
                                                    disabled={item.is_current}
                                                    value={item.end_date || ''}
                                                    onChange={e => {
                                                        const newItems = [...workItems];
                                                        newItems[index].end_date = e.target.value;
                                                        setWorkItems(newItems);
                                                    }}
                                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold disabled:opacity-30"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-3 mt-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">주요 업무 및 성과</Label>
                                                <Textarea
                                                    value={item.description || ''}
                                                    onChange={e => {
                                                        const newItems = [...workItems];
                                                        newItems[index].description = e.target.value;
                                                        setWorkItems(newItems);
                                                    }}
                                                    placeholder="어떤 일을 하셨나요? 구체적인 기술 스택이나 수치 기반의 성과를 적어주세요."
                                                    className="min-h-[140px] rounded-3xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all p-5 font-medium leading-relaxed resize-none"
                                                />
                                            </div>
                                        </div>
                                    </ResumeItemCard>
                                ))}
                                <SectionControls
                                    onAdd={() => addItem('work')}
                                    onSave={() => handleSave('work')}
                                    loading={loading}
                                    saved={saved === 'work'}
                                    addLabel="경력 추가"
                                    saveLabel="경력 정보 저장"
                                />
                            </div>
                        )}

                        {/* 2. Education */}
                        {activeSection === 'edu' && (
                            <div className="space-y-6">
                                {eduItems.map((item, index) => (
                                    <ResumeItemCard
                                        key={index}
                                        index={index}
                                        title={`Entry #${index + 1}`}
                                        onRemove={() => removeItem('edu', index)}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">학교명</Label>
                                                <Input
                                                    value={item.school_name}
                                                    onChange={e => {
                                                        const newItems = [...eduItems];
                                                        newItems[index].school_name = e.target.value;
                                                        setEduItems(newItems);
                                                    }}
                                                    placeholder="예: 한국대학교"
                                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold placeholder:font-medium"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">학위 및 전공</Label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Input
                                                        value={item.degree || ''}
                                                        onChange={e => {
                                                            const newItems = [...eduItems];
                                                            newItems[index].degree = e.target.value;
                                                            setEduItems(newItems);
                                                        }}
                                                        placeholder="예: 학사"
                                                        className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold placeholder:font-medium"
                                                    />
                                                    <Input
                                                        value={item.major || ''}
                                                        onChange={e => {
                                                            const newItems = [...eduItems];
                                                            newItems[index].major = e.target.value;
                                                            setEduItems(newItems);
                                                        }}
                                                        placeholder="예: 컴퓨터공학"
                                                        className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold placeholder:font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">학적 상태</Label>
                                                <select
                                                    value={item.status || '졸업'}
                                                    onChange={e => {
                                                        const newItems = [...eduItems];
                                                        newItems[index].status = e.target.value;
                                                        setEduItems(newItems);
                                                    }}
                                                    className="w-full h-12 px-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all cursor-pointer font-bold"
                                                >
                                                    <option value="졸업">졸업</option>
                                                    <option value="졸업예정">졸업예정</option>
                                                    <option value="재학">재학</option>
                                                    <option value="휴학">휴학</option>
                                                    <option value="수료">수료</option>
                                                    <option value="중퇴">중퇴</option>
                                                    <option value="자퇴">자퇴</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">졸업(예정)일</Label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`current-edu-${index}`}
                                                            checked={item.is_current}
                                                            onChange={e => {
                                                                const newItems = [...eduItems];
                                                                newItems[index].is_current = e.target.checked;
                                                                if (e.target.checked) newItems[index].end_date = null;
                                                                setEduItems(newItems);
                                                            }}
                                                            className="w-4 h-4 accent-slate-900 border-slate-200 rounded"
                                                        />
                                                        <Label htmlFor={`current-edu-${index}`} className="text-[10px] font-black text-slate-500 cursor-pointer">재학 중</Label>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Input
                                                        type="date"
                                                        value={item.start_date || ''}
                                                        onChange={e => {
                                                            const newItems = [...eduItems];
                                                            newItems[index].start_date = e.target.value;
                                                            setEduItems(newItems);
                                                        }}
                                                        className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold"
                                                    />
                                                    <Input
                                                        type="date"
                                                        disabled={item.is_current}
                                                        value={item.end_date || ''}
                                                        onChange={e => {
                                                            const newItems = [...eduItems];
                                                            newItems[index].end_date = e.target.value;
                                                            setEduItems(newItems);
                                                        }}
                                                        className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold disabled:opacity-30"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </ResumeItemCard>
                                ))}
                                <SectionControls
                                    onAdd={() => addItem('edu')}
                                    onSave={() => handleSave('edu')}
                                    loading={loading}
                                    saved={saved === 'edu'}
                                    addLabel="학력 추가"
                                    saveLabel="학력 정보 저장"
                                />
                            </div>
                        )}

                        {/* 3. Awards */}
                        {activeSection === 'awards' && (
                            <div className="space-y-6">
                                {awardItems.map((item, index) => (
                                    <ResumeItemCard
                                        key={index}
                                        index={index}
                                        title={`Entry #${index + 1}`}
                                        onRemove={() => removeItem('awards', index)}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                                            <div className="md:col-span-2 space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">수상 및 활동 명칭</Label>
                                                <Input
                                                    value={item.title}
                                                    onChange={e => {
                                                        const newItems = [...awardItems];
                                                        newItems[index].title = e.target.value;
                                                        setAwardItems(newItems);
                                                    }}
                                                    placeholder="예: 공공데이터 해커톤 대상"
                                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold text-lg placeholder:font-medium"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">수여 기관</Label>
                                                <Input
                                                    value={item.issuer || ''}
                                                    onChange={e => {
                                                        const newItems = [...awardItems];
                                                        newItems[index].issuer = e.target.value;
                                                        setAwardItems(newItems);
                                                    }}
                                                    placeholder="예: 행정안전부"
                                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold placeholder:font-medium"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">일자</Label>
                                                <Input
                                                    type="date"
                                                    value={item.date || ''}
                                                    onChange={e => {
                                                        const newItems = [...awardItems];
                                                        newItems[index].date = e.target.value;
                                                        setAwardItems(newItems);
                                                    }}
                                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">활동 설명</Label>
                                                <Textarea
                                                    value={item.description || ''}
                                                    onChange={e => {
                                                        const newItems = [...awardItems];
                                                        newItems[index].description = e.target.value;
                                                        setAwardItems(newItems);
                                                    }}
                                                    placeholder="활동 내용이나 수상 배경을 간단히 적어주세요."
                                                    className="min-h-[100px] rounded-3xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all p-5 font-medium leading-relaxed resize-none"
                                                />
                                            </div>
                                        </div>
                                    </ResumeItemCard>
                                ))}
                                <SectionControls
                                    onAdd={() => addItem('awards')}
                                    onSave={() => handleSave('awards')}
                                    loading={loading}
                                    saved={saved === 'awards'}
                                    addLabel="수상 내역 추가"
                                    saveLabel="수상 정보 저장"
                                />
                            </div>
                        )}

                        {/* 4. Certifications */}
                        {activeSection === 'certs' && (
                            <div className="space-y-6">
                                {certItems.map((item, index) => (
                                    <ResumeItemCard
                                        key={index}
                                        index={index}
                                        title={`Entry #${index + 1}`}
                                        onRemove={() => removeItem('certs', index)}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                                            <div className="md:col-span-2 space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">자격증 명칭</Label>
                                                <Input
                                                    value={item.name}
                                                    onChange={e => {
                                                        const newItems = [...certItems];
                                                        newItems[index].name = e.target.value;
                                                        setCertItems(newItems);
                                                    }}
                                                    placeholder="예: AWS Certified Solutions Architect"
                                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold placeholder:font-medium"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">발급 기관</Label>
                                                <Input
                                                    value={item.issuer || ''}
                                                    onChange={e => {
                                                        const newItems = [...certItems];
                                                        newItems[index].issuer = e.target.value;
                                                        setCertItems(newItems);
                                                    }}
                                                    placeholder="예: Amazon Web Services"
                                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold placeholder:font-medium"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">취득일</Label>
                                                <Input
                                                    type="date"
                                                    value={item.date || ''}
                                                    onChange={e => {
                                                        const newItems = [...certItems];
                                                        newItems[index].date = e.target.value;
                                                        setCertItems(newItems);
                                                    }}
                                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">증명서 파일</Label>
                                                <FileUploadZone
                                                    id={`certs-${index}`}
                                                    fileUrl={item.file_url}
                                                    onUpload={(file) => handleFileUpload(index, 'certs', file)}
                                                    onClear={() => {
                                                        const newItems = [...certItems];
                                                        newItems[index].file_url = null;
                                                        setCertItems(newItems);
                                                    }}
                                                    uploading={uploading === `certs-${index}`}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Credential URL</Label>
                                                <Input
                                                    value={item.credential_url || ''}
                                                    onChange={e => {
                                                        const newItems = [...certItems];
                                                        newItems[index].credential_url = e.target.value;
                                                        setCertItems(newItems);
                                                    }}
                                                    placeholder="https://..."
                                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold placeholder:font-medium"
                                                />
                                            </div>
                                        </div>
                                    </ResumeItemCard>
                                ))}
                                <SectionControls
                                    onAdd={() => addItem('certs')}
                                    onSave={() => handleSave('certs')}
                                    loading={loading}
                                    saved={saved === 'certs'}
                                    addLabel="자격증 추가"
                                    saveLabel="자격증 정보 저장"
                                />
                            </div>
                        )}

                        {/* 5. Languages */}
                        {activeSection === 'languages' && (
                            <div className="space-y-6">
                                {langItems.map((item, index) => (
                                    <ResumeItemCard
                                        key={index}
                                        index={index}
                                        title={`Entry #${index + 1}`}
                                        onRemove={() => removeItem('languages', index)}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">언어</Label>
                                                <Input
                                                    value={item.language}
                                                    onChange={e => {
                                                        const newItems = [...langItems];
                                                        newItems[index].language = e.target.value;
                                                        setLangItems(newItems);
                                                    }}
                                                    placeholder="예: 영어, 일본어"
                                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold placeholder:font-medium"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">시험 명칭</Label>
                                                <Input
                                                    value={item.test_name}
                                                    onChange={e => {
                                                        const newItems = [...langItems];
                                                        newItems[index].test_name = e.target.value;
                                                        setLangItems(newItems);
                                                    }}
                                                    placeholder="예: TOEIC, JLPT N1"
                                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold placeholder:font-medium"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">점수/급수</Label>
                                                <Input
                                                    value={item.score || ''}
                                                    onChange={e => {
                                                        const newItems = [...langItems];
                                                        newItems[index].score = e.target.value;
                                                        setLangItems(newItems);
                                                    }}
                                                    placeholder="예: 950점"
                                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold placeholder:font-medium"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">취득일</Label>
                                                <Input
                                                    type="date"
                                                    value={item.date || ''}
                                                    onChange={e => {
                                                        const newItems = [...langItems];
                                                        newItems[index].date = e.target.value;
                                                        setLangItems(newItems);
                                                    }}
                                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all font-bold"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">성적표/증명서</Label>
                                                <FileUploadZone
                                                    id={`lang-${index}`}
                                                    fileUrl={item.file_url}
                                                    onUpload={(file) => handleFileUpload(index, 'languages', file)}
                                                    onClear={() => {
                                                        const newItems = [...langItems];
                                                        newItems[index].file_url = null;
                                                        setLangItems(newItems);
                                                    }}
                                                    uploading={uploading === `lang-${index}`}
                                                />
                                            </div>
                                        </div>
                                    </ResumeItemCard>
                                ))}
                                <SectionControls
                                    onAdd={() => addItem('languages')}
                                    onSave={() => handleSave('languages')}
                                    loading={loading}
                                    saved={saved === 'languages'}
                                    addLabel="어학 성적 추가"
                                    saveLabel="어학 정보 저장"
                                />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

/**
 * Sub-components for cleaner code
 */

function ResumeItemCard({ title, onRemove, children, index }: { title: string; onRemove: () => void; children: React.ReactNode; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group"
        >
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.03)] bg-white/50 backdrop-blur-sm rounded-[2.5rem] overflow-hidden transition-all group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] border border-slate-50">
                <div className="bg-slate-50/30 px-8 py-4 border-b border-slate-100 flex justify-between items-center bg-transparent transition-colors group-hover:bg-slate-50/50">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{title}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all gap-2"
                        onClick={onRemove}
                    >
                        <Trash2 size={14} />
                        <span className="font-bold text-xs">REMOVE</span>
                    </Button>
                </div>
                <CardContent className="p-8 md:p-10">
                    {children}
                </CardContent>
            </Card>
        </motion.div>
    )
}

function SectionControls({ onAdd, onSave, loading, saved, addLabel, saveLabel }: { onAdd: () => void; onSave: () => void; loading: boolean; saved: boolean; addLabel: string; saveLabel: string }) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center py-8 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    variant="outline"
                    onClick={onAdd}
                    className="h-14 px-8 rounded-full border-2 border-dashed border-slate-200 hover:border-slate-900 hover:text-slate-900 transition-all font-black"
                >
                    <Plus size={18} className="mr-2" strokeWidth={3} />
                    {addLabel}
                </Button>
            </motion.div>

            <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    disabled={loading || saved}
                    onClick={onSave}
                    className={`h-16 px-12 rounded-full text-lg font-black shadow-2xl transition-all duration-500 min-w-[240px] ${saved
                        ? 'bg-green-500 text-white shadow-green-100'
                        : 'bg-slate-900 hover:bg-black text-white shadow-slate-200'
                        }`}
                >
                    {loading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" as const }}
                            className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                        />
                    ) : saved ? (
                        <div className="flex items-center gap-2">
                            <Check size={24} strokeWidth={3} />
                            <span>저장 완료</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Save size={20} strokeWidth={2.5} />
                            <span>{saveLabel}</span>
                        </div>
                    )}
                </Button>
            </motion.div>
        </div>
    )
}

function FileUploadZone({ id, fileUrl, onUpload, onClear, uploading }: { id: string; fileUrl: string | null; onUpload: (f: File) => void; onClear: () => void; uploading: boolean }) {
    return (
        <div className="relative">
            {fileUrl ? (
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl shadow-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                            <FileText size={18} />
                        </div>
                        <span className="text-xs font-bold text-white tracking-tight">
                            {fileUrl.split('/').pop()?.substring(0, 20)}...
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        className="h-8 w-8 p-0 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl"
                    >
                        <X size={16} />
                    </Button>
                </div>
            ) : (
                <div className="relative group">
                    <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) onUpload(file);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center p-4 h-[56px] border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50 text-slate-300 gap-2 group-hover:bg-white group-hover:border-slate-900 group-hover:text-slate-900 transition-all">
                        {uploading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <UploadCloud size={18} strokeWidth={2.5} />
                                <span className="text-xs font-black uppercase tracking-widest">파일 업로드</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
