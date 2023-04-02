export default function SelectButton ({onClick, title, isSelected}: {onClick: any, title: string, isSelected: boolean}) {
    return (<button className={`px-2 mx-1 rounded-sm ${isSelected ? 'bg-violet-700 text-white' : 'bg-slate-300'}`} onClick={onClick}>{title}</button>)
}