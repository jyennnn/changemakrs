import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function LogSessionButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button
  onClick={onClick}
  className="bg-[#6B59FF] hover:bg-[#6B59FF] text-white rounded-full w-14 h-14 flex items-center justify-center"
>
  <Plus className="w-5 h-5" />
</Button>

  );
}