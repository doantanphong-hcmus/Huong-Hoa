import { memorialEvents } from '../src/data/calendar.ts'
import { splitByStatus } from '../src/data/preparation.ts'

const occasion = memorialEvents.find((event) => event.date === '2026-11-29')
const [pendingTasks, doneTasks] = splitByStatus(occasion.tasks)
const [pendingHomes, invitedHomes] = splitByStatus(occasion.households, 'invited')

if (pendingTasks.length !== 3 || doneTasks.length !== 1) throw new Error('Initial task groups are incorrect')
if (pendingHomes.length !== 2 || invitedHomes.length !== 2) throw new Error('Initial household groups are incorrect')

console.log('preparation data check passed')
