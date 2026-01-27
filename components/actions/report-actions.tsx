// components/ReportActions.tsx
import { TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReportActionsProps {
    phoneNumber?: string
    data?: any
    className?: string
}

export const ReportActions = ({
    phoneNumber = "6281247759998",
    data,
}: ReportActionsProps) => {
    const handleWhatsAppClick = () => {
        const message = `
*Data Pengirim*
Nama: ${data?.name || '-'}
Alamat: ${data?.address || '-'}

*Data Arwah*
Nama: ${data?.arwahName || '-'}
Makam: ${data?.arwahAddress || '-'}

ID Sender: ${data?.id || '-'}
ID Arwah: ${data?.arwahId || '-'}

Silahkan jelaskan bagian penulisan yang salah...
        `.trim()

        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
        window.open(whatsappUrl, "_blank")
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleWhatsAppClick}
            className="hover:bg-yellow-50 hover:text-yellow-600"
        >
            <TriangleAlert className="h-4 w-4" />
        </Button>
    )
}
