import { supabase } from '../../../../shared/lib/supabase'
import type { SupportMessageDraft } from '../../domain/entities/SupportMessage'
import type { SupportRepository } from '../../domain/repositories/SupportRepository'

export class SupabaseSupportRepository implements SupportRepository {
  async sendMessage(draft: SupportMessageDraft): Promise<void> {
    const { data } = await supabase.auth.getUser()

    const { error } = await supabase.from('support_messages').insert({
      user_id: data.user?.id ?? null,
      title: draft.title.trim(),
      subject: draft.subject.trim(),
      message: draft.message.trim(),
    })

    if (error) throw error
  }
}
