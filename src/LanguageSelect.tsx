const languages = {
    'en': 'English',
    'it': 'Italian',
    'es': 'Spanish',
}

export type LanguageKey = keyof typeof languages;

export function LanguageSelect({ onChange }: { onChange: (locale: LanguageKey) => void }) {
    return <div className="pb-5">
        <select className="select" onChange={evt => onChange(evt.currentTarget.value as LanguageKey)}>
            {Object.entries(languages).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
        </select>
    </div>
}