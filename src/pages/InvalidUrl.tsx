import React, { FC } from 'react'
import { useDarkMode } from '@/context'
import { useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react'
import notFound from '@/animations/404.json'
import { APP_DEFAULT_ROUTE } from '@/constants'
import { Button } from 'gfx-component-lib'

const GenericNotFound: FC<{ redirectLink?: string; redirectString?: string }> = ({
  redirectLink,
  redirectString
}) => {
  const { mode } = useDarkMode()
  const navigate = useNavigate()

  return (
    <div
      className={`
    flex flex-1 flex-col items-center relative h-[calc(100vh_-_39px)] w-full
    `}
    >
      <Lottie animationData={notFound} className="h-[500px]" />
      <img className="absolute bottom-[58px] left-0" src={`/img/assets/plug2-${mode}.svg`} alt="" />
      <img className="absolute top-[50px] right-0" src={`/img/assets/plug-${mode}.svg`} alt="" />
      <h3
        className={` h-[25px] text-text-darkmode-tertiary dark:text-buttons-lightmode-primary
      `}
      >
        Oops! We can't find the page that you are looking for.
      </h3>

      <Button
        className={'w-[267px] mt-[42px]'}
        status={'action'}
        onClick={() => navigate(redirectLink ? redirectLink : APP_DEFAULT_ROUTE)}
        colorScheme={'primaryGradient'}
      >
        {redirectString ? redirectString : `Go Back Home`}
      </Button>
    </div>
  )
}
export default GenericNotFound
