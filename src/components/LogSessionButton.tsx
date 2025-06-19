import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function LogSessionButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button
  onClick={onClick}
  className="bg-purple-500 hover:bg-purple-600 text-white rounded-full w-14 h-14 flex items-center justify-center"
>
  <Plus className="w-5 h-5" />
</Button>

  );
}