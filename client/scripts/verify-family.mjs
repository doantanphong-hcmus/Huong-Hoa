import { familyGenerations } from '../src/data/family.ts'
import { readFile } from 'node:fs/promises'

if (familyGenerations.length !== 3) throw new Error('Family tree must contain three generations')
if (familyGenerations.flatMap((generation) => generation.members).filter((member) => member.current).length !== 1) throw new Error('Family tree must identify one current member')

const app = await readFile(new URL('../src/features/family/FamilyPage.tsx', import.meta.url), 'utf8')
const styles = [
  await readFile(new URL('../src/styles/family.css', import.meta.url), 'utf8'),
  await readFile(new URL('../src/styles/print.css', import.meta.url), 'utf8'),
].join('\n')
if (!app.includes("setTab('members')") || !app.includes('family-members__filters')) throw new Error('Family member tab is not wired')
if (!app.includes('revealTree()') || !app.includes("next === 'family' ? revealTree()") || !styles.includes('.family-scroll.is-open') || !styles.includes('3750ms cubic-bezier')) throw new Error('Family scroll opening transition is missing')
if (!app.includes('family-title-curve') || !app.includes('familyTitleSize') || !app.includes('textAnchor="middle"') || !styles.includes('.family-banner-copy__title')) throw new Error('Scalable curved family banner copy is missing')
if (app.includes('family-tree__pillar')) throw new Error('Decorative pillar must not obstruct the family tree')
if (!styles.includes('@media print') || !app.includes('family-scroll__backdrop')) throw new Error('Printable family tree layout is missing')
if (!styles.includes('.family-scroll__roller { display: none !important; }')) throw new Error('Print layout must hide the decorative rollers')

console.log('family data check passed')
