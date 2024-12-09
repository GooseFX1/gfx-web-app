import Lottie from 'lottie-react'
import React, { useState, FormEvent } from 'react'
import passwordProtectionLight from '@/animations/passwordProtectionLight.json'
import passwordProtectionDark from '@/animations/passwordProtectionDark.json'
import { useDarkMode } from '@/context'
import { Button } from 'gfx-component-lib'
import { PASSWORD_BETA_ACCESS } from '@/pages/FarmV4/constants'

type PasswordScreenProps = {
  onSubmit: (password: string) => void
}

export const PasswordProtectionPage: React.FC<PasswordScreenProps> = ({ onSubmit }) => {
  const [password, setPassword] = useState<string>('')
  const { isDarkMode } = useDarkMode()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(password)
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <Lottie
        animationData={isDarkMode ? passwordProtectionDark : passwordProtectionLight}
        className="w-56 h-56 mb-6"
      />

      <h1 className="text-center text-[28px] mb-6 dark:text-grey-8 text-black-4">GAMMA is in Beta</h1>

      <p className="text-[18px] text-center text-grey-1 dark:text-grey-2 max-w-2xl mb-6">
        Join the Goose Gang community, send us a message on X for beta access to GAMMA, our new dynamic fee AMM.
        We'd love to hear your feedback.
      </p>

      <p className="text-center text-purple-4 dark:text-grey-1 mb-6">
        *GAMMA is in beta and some functionality may be unavailable until official launch.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-52">
        <input
          type="password"
          value={password}
          placeholder="Enter beta code"
          className="w-full px-4 py-2 mb-4 text-purple-4 dark:text-grey-1
        bg-white dark:bg-black-2 border border-grey-4 dark:border-black-4
          rounded-[4px] focus:outline-none focus:border-purple-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant={'primary'}
          className="w-full"
          colorScheme={'blue'}
          disabled={password.length !== PASSWORD_BETA_ACCESS.length}
        >
          Submit
        </Button>
      </form>
    </div>
  )
}
