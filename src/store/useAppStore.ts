import { create } from 'zustand'

interface AppState {
  isOrbitActive: boolean
  setOrbitActive: (active: boolean) => void
  orbitSpeed: number
  setOrbitSpeed: (speed: number) => void
}

export const useAppStore = create<AppState>((set) => ({
  isOrbitActive: true,
  setOrbitActive: (active: boolean) => set({ isOrbitActive: active }),
  orbitSpeed: 0.5,
  setOrbitSpeed: (speed: number) => set({ orbitSpeed: speed }),
}))
