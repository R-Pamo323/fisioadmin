import type { SupportMessageDraft } from '../entities/SupportMessage'

export interface SupportRepository {
  sendMessage(draft: SupportMessageDraft): Promise<void>
}