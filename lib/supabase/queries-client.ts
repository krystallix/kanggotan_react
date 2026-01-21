// lib/supabase/queries-client.ts
import { createClient } from '@/lib/supabase/client'
import { DeleteArwahResult, DeleteSenderResult } from '@/types/haul'

export async function getSendersNameDistinct() {
  const supabase = createClient()

  const { data, error } = await supabase
    .rpc('get_senders_name_distinct', {
      result_limit: 3000  // unlimited
    })

  if (error) {
    console.error('Error fetching senders:', error)
    return []
  }

  return (data || []).map((item: { name: string }) => item.name)
}

export async function getArwahsNameDistinct() {
  const supabase = createClient()

  const { data, error } = await supabase
    .rpc('get_arwahs_name_distinct', {
      result_limit: 10000  // unlimited
    })

  if (error) {
    console.error('Error fetching arwahs:', error)
    return []
  }

  return (data || []).map((item: { name: string }) => item.name)
}

export async function getAddressDistinct() {
  const supabase = createClient()

  const { data, error } = await supabase
    .rpc('get_address_distinct', {
      result_limit: 10000  // unlimited
    })

  if (error) {
    console.error('Error fetching arwahs:', error)
    return []
  }

  return (data || []).map((item: { name: string }) => item.name)
}


export async function insertDataHaul(data: {
  name: string;
  address: string;
  arwahs: Array<{
    arwah_name: string;
    arwah_address: string;
  }>;
}) {
  const supabase = createClient();

  const { data: result, error } = await supabase
    .rpc('insert_sender_with_arwahs', {
      p_name: data.name,
      p_address: data.address,
      p_arwahs: data.arwahs
    });

  if (error) {
    console.error('Error inserting data:', error);
    throw error;
  }

  return result;
  return result;
}

export async function insertArwahs(data: Array<{
  sender_id: number;
  arwah_name: string;
  arwah_address: string;
}>) {
  const supabase = createClient();

  const { data: insertedData, error } = await supabase
    .schema('db_kanggotan2')
    .from('arwahs')
    .insert(data.map(item => ({
      sender_id: item.sender_id,
      arwah_name: item.arwah_name,
      arwah_address: item.arwah_address,
      created_at: new Date(),
      updated_at: new Date(),
    })))
    .select('id, arwah_name')

  if (error) {
    console.error('Error inserting arwahs:', error);
    throw error;
  }

  return {
    success: true,
    data: insertedData
  };
}

export async function updateSender(data: {
  id: number;
  name: string;
  address: string;
}) {
  const supabase = createClient();

  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('senders')
    .update({
      name: data.name,
      address: data.address
    })
    .eq('id', data.id)

  if (error) {
    console.error('Error updating data:', error);
    throw error;
  }

  return { success: true }
}

export async function updateArwah(data: {
  id: number;
  name: string;
  address: string;
}) {
  const supabase = createClient();

  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('arwahs')
    .update({
      arwah_name: data.name,
      arwah_address: data.address
    })
    .eq('id', data.id)

  if (error) {
    console.error('Error updating data:', error);
    throw error;
  }

  return { success: true }
}

export async function deleteSender(id: number): Promise<DeleteSenderResult> {
  const supabase = createClient();

  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('senders')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting sender:', error);
    throw error;
  }

  return { success: true }
}

export async function deleteArwah(arwahId: number, senderId: number): Promise<DeleteArwahResult> {
  const supabase = createClient();

  const { data: arwahs, error: countError } = await supabase
    .schema('db_kanggotan2')
    .from('arwahs')
    .select('id', { count: 'exact' })
    .eq('sender_id', senderId);

  if (countError) {
    console.error('Error counting arwahs:', countError);
    throw countError;
  }

  if (arwahs && arwahs.length <= 1) {
    throw new Error('Tidak dapat menghapus arwah terakhir. Setiap pengirim harus memiliki minimal 1 arwah.');
  }

  const { error: deleteError } = await supabase
    .schema('db_kanggotan2')
    .from('arwahs')
    .delete()
    .eq('id', arwahId);

  if (deleteError) {
    console.error('Error deleting arwah:', deleteError);
    throw deleteError;
  }

  const { data: remainingArwahs, error: fetchError } = await supabase
    .schema('db_kanggotan2')
    .from('arwahs')
    .select('id, arwah_name')
    .eq('sender_id', senderId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error('Error fetching remaining arwahs:', fetchError);
    throw fetchError;
  }

  return {
    success: true,
    nextArwah: remainingArwahs && remainingArwahs.length > 0 ? remainingArwahs[0] : null
  };
}