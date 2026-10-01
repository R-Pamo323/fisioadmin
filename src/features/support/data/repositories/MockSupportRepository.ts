import type { SupportMessageDraft } from '../../domain/entities/SupportMessage'
import type { SupportRepository } from '../../domain/repositories/SupportRepository'
import { mockSupport } from '../datasources/mockSupport'

export class MockSupportRepository implements SupportRepository {
  sendMessage(draft: SupportMessageDraft): Promise<void> {
    return mockSupport.sendMessage(draft)
  }
}