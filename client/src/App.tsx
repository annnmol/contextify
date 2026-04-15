import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 gap-6 flex-col bg-background">
      <h1 className="text-3xl font-bold tracking-tight">shadcn/ui test</h1>

      <div className="flex gap-4 flex-wrap justify-center">
        <Button>Primary Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="destructive">Destructive</Button>
      </div>

      <Card className="w-80">
        <CardHeader>
          <CardTitle>Card Component</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Tailwind CSS v4 + shadcn/ui working correctly.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
