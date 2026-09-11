function inlineMarkdown(text) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g)
  return parts.map((part, index) => {
    if (part.startsWith('`')) return <code key={index} className="rounded bg-black/25 px-1 py-0.5 text-emerald-200">{part.slice(1, -1)}</code>
    if (part.startsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/)
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer" className="text-emerald-300 underline">{link[1]}</a>
    return part
  })
}

function MarkdownMessage({ content }) {
  return <div className="whitespace-pre-wrap break-words leading-7">{content.split('\n').map((line, index) => <div key={index} className={line.startsWith('# ') ? 'text-lg font-bold' : ''}>{line.startsWith('# ') ? inlineMarkdown(line.slice(2)) : inlineMarkdown(line)}</div>)}</div>
}

export default MarkdownMessage
