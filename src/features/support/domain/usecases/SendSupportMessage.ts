import type { SupportMessageDraft } from '../entities/SupportMessage'
import type { SupportRepository } from '../repositories/SupportRepository'

export class SendSupportMessage {
  private readonly repository: SupportRepository

  constructor(repository: SupportRepository) {
    this.repository = repository
  }

  execute(draft: SupportMessageDraft): Promise<void> {
    return this.repository.sendMessage({
      title: draft.title.trim(),
      subject: draft.subject.trim(),
      message: draft.message.trim(),
    })
  }
}