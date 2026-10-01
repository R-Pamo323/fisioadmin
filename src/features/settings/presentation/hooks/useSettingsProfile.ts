import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import type {
  SettingsProfile,
  SettingsProfileField,
} from '../../domain/entities/SettingsProfile'
import { MockSettingsRepository } from '../../data/repositories/MockSettingsRepository'
import { GetSettingsProfile } from '../../domain/usecases/GetSettingsProfile'
import { UpdateSettingsProfile } from '../../domain/usecases/UpdateSettingsProfile'

const repository = new MockSettingsRepository()
const getSettingsProfile = new GetSettingsProfile(repository)
const updateSettingsProfile = new UpdateSettingsProfile(repository)

export function useSettingsProfile() {
  const [profile, setProfile] = useState<SettingsProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let active = true

    void (async () => {
      const next = await getSettingsProfile.execute()
      if (!active) return
      setProfile(next)
      setIsLoading(false)
    })()

    return () => {
      active = false
    }
  }, [])

  /** Curryado para poder pasar `setProfileField('name')` directo al Input. */
  const setProfileField = useCallback(
    (field: SettingsProfileField) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      setProfile((current) => (current ? { ...current, [field]: value } : current))
    },
    [],
  )

  const save = useCallback(async () => {
    if (!profile) return

    setIsSaving(true)
    const saved = await updateSettingsProfile.execute(profile)
    setProfile(saved)
    setIsSaving(false)
  }, [profile])

  return { profile, isLoading, isSaving, setProfileField, save }
}