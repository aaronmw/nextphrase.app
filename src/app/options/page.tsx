import { PhraseList, phrases } from '@/app/phrases'

export default function OptionsPage() {
  const phraseLists = Object.keys(phrases) as PhraseList[]

  return (
    <div>
      <h1>Phrase Lists</h1>
      {phraseLists.map(phraseList => (
        <div key={phraseList}>
          <h2>{phraseList}</h2>
        </div>
      ))}
    </div>
  )
}
