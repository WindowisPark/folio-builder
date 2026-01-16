'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Briefcase, GraduationCap, Award as AwardIcon, BadgeCheck, Save, Loader2, Calendar, ChevronDown, ChevronUp, Languages, UploadCloud, FileText, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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

export function ResumeForm({ portfolioId, initialData }: ResumeFormProps) {
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState<string | null>(null) // ID of item being uploaded
    const [activeSection, setActiveSection] = useState<'work' | 'edu' | 'awards' | 'certs' | 'languages'>('work')

    useEffect(() => {
        setMounted(true)
    }, [])

    // Local states
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

            const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resume-proofs/${filePath}`

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

    const handleSave = async (section: 'work' | 'edu' | 'awards' | 'certs' | 'languages') => {
        setLoading(true)
        try {
            let result
            if (section === 'work') result = await updateWorkExperience(portfolioId, workItems)
            if (section === 'edu') result = await updateEducation(portfolioId, eduItems)
            if (section === 'awards') result = await updateAwards(portfolioId, awardItems)
            if (section === 'certs') result = await updateCertifications(portfolioId, certItems)
            if (section === 'languages') result = await updateLanguageCerts(portfolioId, langItems)

            if (result?.error) alert(result.error)
            else alert('저장되었습니다!')
        } catch (error: any) {
            alert('오류 발생: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    // Helper to add items
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
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
            <div className="h-64 bg-slate-50 rounded-3xl" />
            <div className="h-96 bg-slate-50 rounded-3xl" />
        </div>
    )

    return (
        <div className="container mx-auto max-w-5xl py-12 px-4 animate-in fade-in duration-700 relative">
            <div className="mb-10 space-y-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-fuchsia-50 text-fuchsia-600 rounded-full w-fit">
                    <FileText size={12} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Resume Details</span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">
                    당신의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-indigo-600">커리어 스토리</span>
                </h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-lg">
                    경력, 학력, 수상 및 자격증 정보를 입력하여 전문성 있는 이력서를 구성하세요.
                </p>
            </div>

            <div className="space-y-6">
                {/* Custom Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                    <button
                        onClick={() => setActiveSection('work')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeSection === 'work' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Briefcase size={16} />
                        경력
                    </button>
                    <button
                        onClick={() => setActiveSection('edu')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeSection === 'edu' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <GraduationCap size={16} />
                        학력
                    </button>
                    <button
                        onClick={() => setActiveSection('awards')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeSection === 'awards' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <AwardIcon size={16} />
                        수상
                    </button>
                    <button
                        onClick={() => setActiveSection('certs')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeSection === 'certs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <BadgeCheck size={16} />
                        자격증
                    </button>
                    <button
                        onClick={() => setActiveSection('languages')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeSection === 'languages' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Languages size={16} />
                        어학
                    </button>
                </div>

                {/* Work Experience Section */}
                {activeSection === 'work' && (
                    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        {workItems.map((item, index) => (
                            <Card key={index} className="border-slate-200 overflow-hidden group">
                                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center group-hover:bg-indigo-50/30 transition-colors">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entry #{index + 1}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-slate-400 hover:text-red-500"
                                        onClick={() => removeItem('work', index)}
                                    >
                                        <Trash2 size={14} className="mr-2" />
                                        삭제
                                    </Button>
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">회사명</Label>
                                            <Input
                                                value={item.company_name}
                                                onChange={e => {
                                                    const newItems = [...workItems];
                                                    newItems[index].company_name = e.target.value;
                                                    setWorkItems(newItems);
                                                }}
                                                placeholder="예: 구글 코리아"
                                                className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">직무/직책</Label>
                                            <Input
                                                value={item.role}
                                                onChange={e => {
                                                    const newItems = [...workItems];
                                                    newItems[index].role = e.target.value;
                                                    setWorkItems(newItems);
                                                }}
                                                placeholder="예: 프론트엔드 개발자"
                                                className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">시작일</Label>
                                            <Input
                                                type="date"
                                                value={item.start_date || ''}
                                                onChange={e => {
                                                    const newItems = [...workItems];
                                                    newItems[index].start_date = e.target.value;
                                                    setWorkItems(newItems);
                                                }}
                                                className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">종료일</Label>
                                            <div className="flex gap-4">
                                                <Input
                                                    type="date"
                                                    disabled={item.is_current}
                                                    value={item.end_date || ''}
                                                    onChange={e => {
                                                        const newItems = [...workItems];
                                                        newItems[index].end_date = e.target.value;
                                                        setWorkItems(newItems);
                                                    }}
                                                    className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                                />
                                                <div className="flex items-center gap-2 pt-2">
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
                                                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <Label htmlFor={`current-${index}`} className="text-xs font-bold text-slate-500 cursor-pointer">재직 중</Label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">주요 성과 및 업무 내용</Label>
                                        <Textarea
                                            value={item.description || ''}
                                            onChange={e => {
                                                const newItems = [...workItems];
                                                newItems[index].description = e.target.value;
                                                setWorkItems(newItems);
                                            }}
                                            placeholder="어떤 일을 하셨나요? 구체적인 기술 스택이나 성과를 적어주세요."
                                            className="rounded-xl border-slate-200 focus:ring-indigo-500 min-h-[100px]"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <div className="flex justify-between items-center py-4">
                            <Button
                                variant="outline"
                                onClick={() => addItem('work')}
                                className="rounded-xl border-dashed border-2 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all border-slate-300"
                            >
                                <Plus size={16} className="mr-2" />
                                새 경력 추가
                            </Button>
                            <Button
                                disabled={loading}
                                onClick={() => handleSave('work')}
                                className="rounded-xl bg-indigo-600 hover:bg-fuchsia-700 shadow-lg shadow-indigo-100 px-10"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                                경력 정보 저장
                            </Button>
                        </div>
                    </section>
                )}

                {/* Education Section */}
                {activeSection === 'edu' && (
                    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        {eduItems.map((item, index) => (
                            <Card key={index} className="border-slate-200 overflow-hidden group">
                                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center group-hover:bg-indigo-50/30 transition-colors">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entry #{index + 1}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-slate-400 hover:text-red-500"
                                        onClick={() => removeItem('edu', index)}
                                    >
                                        <Trash2 size={14} className="mr-2" />
                                        삭제
                                    </Button>
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">학교명</Label>
                                            <Input
                                                value={item.school_name}
                                                onChange={e => {
                                                    const newItems = [...eduItems];
                                                    newItems[index].school_name = e.target.value;
                                                    setEduItems(newItems);
                                                }}
                                                placeholder="예: 한국대학교"
                                                className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">학위 및 전공</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    value={item.degree || ''}
                                                    onChange={e => {
                                                        const newItems = [...eduItems];
                                                        newItems[index].degree = e.target.value;
                                                        setEduItems(newItems);
                                                    }}
                                                    placeholder="예: 학사"
                                                    className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                                />
                                                <Input
                                                    value={item.major || ''}
                                                    onChange={e => {
                                                        const newItems = [...eduItems];
                                                        newItems[index].major = e.target.value;
                                                        setEduItems(newItems);
                                                    }}
                                                    placeholder="예: 컴퓨터공학"
                                                    className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">상태</Label>
                                            <select
                                                value={item.status || '졸업'}
                                                onChange={e => {
                                                    const newItems = [...eduItems];
                                                    newItems[index].status = e.target.value;
                                                    setEduItems(newItems);
                                                }}
                                                className="w-full h-11 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer font-medium"
                                            >
                                                <option value="졸업">졸업</option>
                                                <option value="졸업예정">졸업예정</option>
                                                <option value="재학">재학</option>
                                                <option value="휴학">휴학</option>
                                                <option value="수료">수료</option>
                                                <option value="중퇴">중퇴</option>
                                                <option value="자퇴">자퇴</option>
                                                <option value="재적">재적</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">입학일</Label>
                                            <Input
                                                type="date"
                                                value={item.start_date || ''}
                                                onChange={e => {
                                                    const newItems = [...eduItems];
                                                    newItems[index].start_date = e.target.value;
                                                    setEduItems(newItems);
                                                }}
                                                className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">졸업일 (또는 예정일)</Label>
                                            <div className="flex gap-4">
                                                <Input
                                                    type="date"
                                                    disabled={item.is_current}
                                                    value={item.end_date || ''}
                                                    onChange={e => {
                                                        const newItems = [...eduItems];
                                                        newItems[index].end_date = e.target.value;
                                                        setEduItems(newItems);
                                                    }}
                                                    className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                                />
                                                <div className="flex items-center gap-2 pt-2">
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
                                                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <Label htmlFor={`current-edu-${index}`} className="text-xs font-bold text-slate-500 cursor-pointer">재학 중</Label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <div className="flex justify-between items-center py-4">
                            <Button
                                variant="outline"
                                onClick={() => addItem('edu')}
                                className="rounded-xl border-dashed border-2 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all border-slate-300"
                            >
                                <Plus size={16} className="mr-2" />
                                새 학력 추가
                            </Button>
                            <Button
                                disabled={loading}
                                onClick={() => handleSave('edu')}
                                className="rounded-xl bg-indigo-600 hover:bg-fuchsia-700 shadow-lg shadow-indigo-100 px-10"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                                학력 정보 저장
                            </Button>
                        </div>
                    </section>
                )}

                {/* Awards Section */}
                {activeSection === 'awards' && (
                    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        {awardItems.map((item, index) => (
                            <Card key={index} className="border-slate-200 overflow-hidden group">
                                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center group-hover:bg-indigo-50/30 transition-colors">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entry #{index + 1}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-slate-400 hover:text-red-500"
                                        onClick={() => removeItem('awards', index)}
                                    >
                                        <Trash2 size={14} className="mr-2" />
                                        삭제
                                    </Button>
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">수상 명칭</Label>
                                        <Input
                                            value={item.title}
                                            onChange={e => {
                                                const newItems = [...awardItems];
                                                newItems[index].title = e.target.value;
                                                setAwardItems(newItems);
                                            }}
                                            placeholder="예: 공공데이터 해커톤 대상"
                                            className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">수여 기관</Label>
                                            <Input
                                                value={item.issuer || ''}
                                                onChange={e => {
                                                    const newItems = [...awardItems];
                                                    newItems[index].issuer = e.target.value;
                                                    setAwardItems(newItems);
                                                }}
                                                placeholder="예: 행정안전부"
                                                className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">수상일</Label>
                                            <Input
                                                type="date"
                                                value={item.date || ''}
                                                onChange={e => {
                                                    const newItems = [...awardItems];
                                                    newItems[index].date = e.target.value;
                                                    setAwardItems(newItems);
                                                }}
                                                className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">설명 (선택사항)</Label>
                                        <Textarea
                                            value={item.description || ''}
                                            onChange={e => {
                                                const newItems = [...awardItems];
                                                newItems[index].description = e.target.value;
                                                setAwardItems(newItems);
                                            }}
                                            placeholder="어떤 점을 높게 평가받았나요? 또는 수상의 의미를 간단히 적어주세요."
                                            className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <div className="flex justify-between items-center py-4">
                            <Button
                                variant="outline"
                                onClick={() => addItem('awards')}
                                className="rounded-xl border-dashed border-2 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all border-slate-300"
                            >
                                <Plus size={16} className="mr-2" />
                                새 수상 내역 추가
                            </Button>
                            <Button
                                disabled={loading}
                                onClick={() => handleSave('awards')}
                                className="rounded-xl bg-indigo-600 hover:bg-fuchsia-700 shadow-lg shadow-indigo-100 px-10"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                                수상 내역 저장
                            </Button>
                        </div>
                    </section>
                )}

                {/* Certifications Section */}
                {activeSection === 'certs' && (
                    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        {certItems.map((item, index) => (
                            <Card key={index} className="border-slate-200 overflow-hidden group">
                                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center group-hover:bg-indigo-50/30 transition-colors">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entry #{index + 1}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-slate-400 hover:text-red-500"
                                        onClick={() => removeItem('certs', index)}
                                    >
                                        <Trash2 size={14} className="mr-2" />
                                        삭제
                                    </Button>
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">자격증/어학 명칭</Label>
                                        <Input
                                            value={item.name}
                                            onChange={e => {
                                                const newItems = [...certItems];
                                                newItems[index].name = e.target.value;
                                                setCertItems(newItems);
                                            }}
                                            placeholder="예: AWS Certified Solutions Architect"
                                            className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">발급 기관</Label>
                                            <Input
                                                value={item.issuer || ''}
                                                onChange={e => {
                                                    const newItems = [...certItems];
                                                    newItems[index].issuer = e.target.value;
                                                    setCertItems(newItems);
                                                }}
                                                placeholder="예: Amazon Web Services"
                                                className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">취득일</Label>
                                            <Input
                                                type="date"
                                                value={item.date || ''}
                                                onChange={e => {
                                                    const newItems = [...certItems];
                                                    newItems[index].date = e.target.value;
                                                    setCertItems(newItems);
                                                }}
                                                className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">증명서 파일 (이미지 또는 PDF)</Label>
                                            <div className="flex items-center gap-4">
                                                {item.file_url ? (
                                                    <div className="flex-1 flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                                                        <div className="flex items-center gap-3">
                                                            <FileText size={18} className="text-indigo-600" />
                                                            <span className="text-xs font-bold text-indigo-900 truncate max-w-[150px]">
                                                                {item.file_url.split('/').pop()?.substring(0, 20)}...
                                                            </span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                const newItems = [...certItems];
                                                                newItems[index].file_url = null;
                                                                setCertItems(newItems);
                                                            }}
                                                            className="h-7 w-7 p-0 text-indigo-400 hover:text-red-500 hover:bg-white"
                                                        >
                                                            <X size={14} />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex-1 relative">
                                                        <Input
                                                            type="file"
                                                            accept="image/*,.pdf"
                                                            onChange={e => {
                                                                const file = e.target.files?.[0];
                                                                if (file) handleFileUpload(index, 'certs', file);
                                                            }}
                                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                        />
                                                        <div className="flex items-center justify-center p-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 gap-2 hover:bg-white hover:border-indigo-300 transition-all">
                                                            {uploading === `certs-${index}` ? (
                                                                <Loader2 size={16} className="animate-spin" />
                                                            ) : (
                                                                <UploadCloud size={16} />
                                                            )}
                                                            <span className="text-xs font-bold">파일 선택 (이미지/PDF)</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">추가 정보 링크 (선택사항)</Label>
                                            <Input
                                                value={item.credential_url || ''}
                                                onChange={e => {
                                                    const newItems = [...certItems];
                                                    newItems[index].credential_url = e.target.value;
                                                    setCertItems(newItems);
                                                }}
                                                placeholder="https://..."
                                                className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <div className="flex justify-between items-center py-4">
                            <Button
                                variant="outline"
                                onClick={() => addItem('certs')}
                                className="rounded-xl border-dashed border-2 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all border-slate-300"
                            >
                                <Plus size={16} className="mr-2" />
                                새 자격증 추가
                            </Button>
                            <Button
                                disabled={loading}
                                onClick={() => handleSave('certs')}
                                className="rounded-xl bg-indigo-600 hover:bg-fuchsia-700 shadow-lg shadow-indigo-100 px-10"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                                자격증 정보 저장
                            </Button>
                        </div>
                    </section>
                )}

                {/* Languages Section */}
                {activeSection === 'languages' && (
                    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        {langItems.map((item, index) => (
                            <Card key={index} className="border-slate-200 overflow-hidden group">
                                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center group-hover:bg-indigo-50/30 transition-colors">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entry #{index + 1}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-slate-400 hover:text-red-500"
                                        onClick={() => removeItem('languages', index)}
                                    >
                                        <Trash2 size={14} className="mr-2" />
                                        삭제
                                    </Button>
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">언어</Label>
                                            <Input
                                                value={item.language}
                                                onChange={e => {
                                                    const newItems = [...langItems];
                                                    newItems[index].language = e.target.value;
                                                    setLangItems(newItems);
                                                }}
                                                placeholder="예: 영어, 일본어"
                                                className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">시험 명칭</Label>
                                            <Input
                                                value={item.test_name}
                                                onChange={e => {
                                                    const newItems = [...langItems];
                                                    newItems[index].test_name = e.target.value;
                                                    setLangItems(newItems);
                                                }}
                                                placeholder="예: TOEIC, JLPT N1"
                                                className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">점수/급수</Label>
                                            <Input
                                                value={item.score || ''}
                                                onChange={e => {
                                                    const newItems = [...langItems];
                                                    newItems[index].score = e.target.value;
                                                    setLangItems(newItems);
                                                }}
                                                placeholder="예: 950점"
                                                className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">취득일</Label>
                                            <Input
                                                type="date"
                                                value={item.date || ''}
                                                onChange={e => {
                                                    const newItems = [...langItems];
                                                    newItems[index].date = e.target.value;
                                                    setLangItems(newItems);
                                                }}
                                                className="rounded-xl border-slate-200 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600">증빙 서류 (성적표 이미지/PDF)</Label>
                                        <div className="flex items-center gap-4">
                                            {item.file_url ? (
                                                <div className="flex-1 flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <FileText size={18} className="text-indigo-600" />
                                                        <span className="text-xs font-bold text-indigo-900 truncate max-w-[300px]">
                                                            {item.file_url.split('/').pop()?.substring(0, 30)}...
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            const newItems = [...langItems];
                                                            newItems[index].file_url = null;
                                                            setLangItems(newItems);
                                                        }}
                                                        className="h-7 w-7 p-0 text-indigo-400 hover:text-red-500 hover:bg-white"
                                                    >
                                                        <X size={14} />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex-1 relative">
                                                    <Input
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        onChange={e => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleFileUpload(index, 'languages', file);
                                                        }}
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className="flex items-center justify-center p-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 gap-2 hover:bg-white hover:border-indigo-300 transition-all">
                                                        {uploading === `languages-${index}` ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <UploadCloud size={16} />
                                                        )}
                                                        <span className="text-xs font-bold">파일 선택 (이미지/PDF)</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <div className="flex justify-between items-center py-4">
                            <Button
                                variant="outline"
                                onClick={() => addItem('languages')}
                                className="rounded-xl border-dashed border-2 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all border-slate-300"
                            >
                                <Plus size={16} className="mr-2" />
                                새 어학 성적 추가
                            </Button>
                            <Button
                                disabled={loading}
                                onClick={() => handleSave('languages')}
                                className="rounded-xl bg-indigo-600 hover:bg-fuchsia-700 shadow-lg shadow-indigo-100 px-10"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                                어학 정보 저장
                            </Button>
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
