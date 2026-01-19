import React from 'react'
import { Textarea } from './textarea'
import { Label } from './label'
import { Info, List } from 'lucide-react'
import { Button } from './button'

interface DescriptionEditorProps {
    label: string
    value: string
    onChange: (val: string) => void
    placeholder?: string
    helperText?: string
    className?: string
}

/**
 * DescriptionEditor Component
 * A wrapper for Textarea that nudges users to use bullet points for better visibility.
 */
export function DescriptionEditor({
    label,
    value,
    onChange,
    placeholder,
    helperText,
    className = ""
}: DescriptionEditorProps) {

    const insertBullet = () => {
        const lines = value.split('\n')
        const lastLine = lines[lines.length - 1]

        if (lastLine.trim() === '') {
            onChange(value + '- ')
        } else {
            onChange(value + '\n- ')
        }
    }

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</Label>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={insertBullet}
                    className="h-8 text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white rounded-full px-4 gap-2 transition-all"
                >
                    <List size={12} strokeWidth={3} />
                    Add Bullet
                </Button>
            </div>

            <div className="relative group">
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder || "내용을 입력해주세요..."}
                    className="rounded-3xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all p-5 font-medium leading-relaxed resize-none pb-12 min-h-[140px]"
                />

                {/* Visual Nudge / Tooltip */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-xl border border-slate-50 pointer-events-none transition-all group-focus-within:border-slate-100 group-focus-within:text-slate-500">
                    <Info size={12} className="text-slate-300" />
                    <span>문장 앞에 <b className="text-slate-900 font-black">'-'</b>를 붙여 전문적인 목록을 만들어보세요.</span>
                </div>
            </div>

            {helperText && (
                <p className="text-[10px] text-slate-400 font-medium px-1">
                    {helperText}
                </p>
            )}
        </div>
    )
}
