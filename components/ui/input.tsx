import * as React from "react"

import { cn } from "@/lib/utils"
import { Eye, EyeOff } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const [{ showPassword }, setState] = React.useState({ showPassword: false })
  const styles = cn(
    'flex h-12 md:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg md:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 justify-center',
    className
  )

  function toggleShowPassword() {
    setState((old) => ({ showPassword: !old.showPassword }))
  }

  if (type === 'password') {
    const currentType = showPassword ? 'text' : type
    return (
      <div className='flex gap-4 items-center relative'>
        <input type={currentType} className={styles} ref={ref} {...props} />
        <button
          type='button'
          className='absolute right-2 p-0.5 pl-2 bg-inherit border-l text-muted-foreground hover:text-primary-dark'
          onClick={toggleShowPassword}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>
    )
  }

  return <input type={type} className={styles} ref={ref} {...props} />
})
Input.displayName = "Input"

export { Input }
