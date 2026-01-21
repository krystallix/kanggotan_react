// lib/supabase/queries.ts
import { createClient } from '@/lib/supabase/server'
export type SenderWithArwahs = {
  id: number
  sender: string
  address: string
  arwahs: Array<{
    id: number
    name: string
    address: string
  }>
}

export type PaginatedResponse = {
  data: SenderWithArwahs[]
  total: number
  page_size: number
  current_offset: number
}

export async function getSendersWithArwahs(
  YEAR: number,
  PAGE: number = 1,
  PAGESIZE: number = 10,
  SEARCH: string = ""
): Promise<PaginatedResponse> {
  
  const supabase = await createClient()
  const OFFSET = (PAGE - 1) * PAGESIZE
  
  const { data, error } = await supabase
    .rpc('get_senders_with_arwahs', {
      target_year: YEAR,
      page_limit: PAGESIZE,
      page_offset: OFFSET,
      search_term: SEARCH
    })

  if (error) {
    console.error('Error fetching paginated senders:', error)
    return {
      data: [],
      total: 0,
      page_size: PAGESIZE,
      current_offset: OFFSET
    }
  }

  return data
}

