"use client"

import dynamic from "next/dynamic"
import DashLayout from "@/components/layout/dash-layout"

const QrGeneratorClient = dynamic(
  () => import("./qr-generator-client"),
  { ssr: false }
)

export default function QrGeneratorPage() {
  return (
    <DashLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QR Code Generator</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Buat QR Code dengan pola dot dinamis dan kustom logo tengah RISMA / brand sendiri.
          </p>
        </div>
        <QrGeneratorClient />
      </div>
    </DashLayout>
  )
}
