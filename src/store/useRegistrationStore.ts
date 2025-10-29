import { create } from 'zustand'

interface CognitoUserData {
  sub: string
  email: string
  name?: string
  picture?: string
}

interface RegistrationStore {
  cognitoData: CognitoUserData | null
  setCognitoData: (data: CognitoUserData) => void
  clearCognitoData: () => void
}

export const useRegistrationStore = create<RegistrationStore>((set) => ({
  cognitoData: null,
  setCognitoData: (data) => set({ cognitoData: data }),
  clearCognitoData: () => set({ cognitoData: null }),
}))