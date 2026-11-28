import { supabase } from '../lib/supabase'

export interface FamilyMemberRecord {
  id: string
  name: string
  role: string
  generation: number
  birth_year: number | null
  death_year: number | null
  southern_rank: string | null
  father_id: string | null
  mother_id: string | null
  spouse_id: string | null
  lunar_day: number | null
  lunar_month: number | null
  default_worship_time: string | null
  favorite_foods: string[]
}

export type FamilyMemberDraft = Omit<FamilyMemberRecord, 'id'> & { id?: string }

export async function loadFamily(): Promise<FamilyMemberRecord[]> {
  if (!supabase) throw new Error('Chưa cấu hình Supabase cho frontend.')
  const seeded = await supabase.rpc('seed_mvp_family')
  if (seeded.error) throw seeded.error

  const [members, profiles, foods] = await Promise.all([
    supabase.from('family_members').select('id,name,role,generation,birth_year,death_year,southern_rank,father_id,mother_id,spouse_id').order('generation').order('birth_year'),
    supabase.from('deceased_profiles').select('member_id,lunar_day,lunar_month,default_worship_time'),
    supabase.from('favorite_foods').select('member_id,name').order('name'),
  ])
  if (members.error) throw members.error
  if (profiles.error) throw profiles.error
  if (foods.error) throw foods.error

  return members.data.map((member) => {
    const profile = profiles.data.find((item) => item.member_id === member.id)
    return {
      ...member,
      lunar_day: profile?.lunar_day ?? null,
      lunar_month: profile?.lunar_month ?? null,
      default_worship_time: profile?.default_worship_time ?? null,
      favorite_foods: foods.data.filter((item) => item.member_id === member.id).map((item) => item.name),
    }
  })
}

export async function saveFamilyMember(member: FamilyMemberDraft): Promise<string> {
  if (!supabase) throw new Error('Chưa cấu hình Supabase cho frontend.')
  const { data, error } = await supabase.rpc('save_family_member', {
    p_id: member.id ?? null,
    p_name: member.name,
    p_role: member.role,
    p_generation: member.generation,
    p_birth_year: member.birth_year,
    p_death_year: member.death_year,
    p_southern_rank: member.southern_rank,
    p_father_id: member.father_id,
    p_mother_id: member.mother_id,
    p_spouse_id: member.spouse_id,
    p_lunar_day: member.lunar_day,
    p_lunar_month: member.lunar_month,
    p_worship_time: member.default_worship_time,
    p_favorite_foods: member.favorite_foods,
  })
  if (error) throw error
  return data as string
}
