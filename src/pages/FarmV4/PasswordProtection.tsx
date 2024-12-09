import Lottie from 'lottie-react'
import React, { useState, FormEvent } from 'react'
// import passwordProtectionLight from '@/animations/passwordProtectionLight.json'
// import passwordProtectionDark from '@/animations/passwordProtectionDark.json'
import CreatePoolConfetti from '@/animations/createPoolConfetti.json'

type PasswordScreenProps = {
  onSubmit: (password: string) => void
}

export const PasswordProtectionPage: React.FC<PasswordScreenProps> = ({ onSubmit }) => {
  const [password, setPassword] = useState<string>('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(password)
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <Lottie animationData={CreatePoolConfetti} className="w-32 h-32 mb-8" />

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
          placeholder="Enter password"
          className="w-full px-4 py-2 mb-4 text-purple-4 dark:text-grey-1
        bg-white dark:bg-black-2 border border-grey-4 dark:border-black-4
          rounded-lg focus:outline-none focus:border-purple-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-2 bg-[#ECE3F4] dark:bg-black-2 text-purple-4 dark:text-grey-1 
          hover:bg-purple-5 hover:text-white dark:hover:bg-gray-700 rounded-full font-bold"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
