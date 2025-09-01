import { ScrollArea } from "@/components/ui/scroll-area";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollArea className='h-[calc(100dvh-52px)]'>
        <div className='flex flex-1'>{children}</div>
      </ScrollArea>
    </>
  )
}