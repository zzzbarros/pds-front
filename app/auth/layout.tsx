import { BaseTemplate } from '@/components/templates'
import { TabsComponents } from './components'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <BaseTemplate>
      <TabsComponents>{children}</TabsComponents>
    </BaseTemplate>
  )
}
