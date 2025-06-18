import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function LogSessionButton() {
  return (
    <Button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-6 py-2 text-base font-semibold">
      <Plus className="w-4 h-4 mr-2" />
      Log a session
    </Button>
  )
}