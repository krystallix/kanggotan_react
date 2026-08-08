"use client"

import { useEffect, useRef, useState } from "react"
import { Download, Upload, RefreshCw, Sparkles, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// Type definitions untuk qr-code-styling
type DotType = "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded"
type CornerDotType = "dot" | "square" | "rounded"
type CornerSquareType = "dot" | "square" | "extra-rounded" | "out-rounded"

interface QRCodeInstance {
  append: (container?: HTMLElement) => void
  update: (options: Record<string, unknown>) => void
  download: (options: { name: string; extension: "png" | "svg" }) => Promise<void>
}

export default function QrGeneratorClient() {
  const [qrCode, setQrCode] = useState<QRCodeInstance | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Options states
  const [data, setData] = useState("https://kanggotan.site")
  const [dotType, setDotType] = useState<DotType>("extra-rounded")
  const [cornerSquareType, setCornerSquareType] = useState<CornerSquareType>("extra-rounded")
  const [cornerDotType, setCornerDotType] = useState<CornerDotType>("dot")
  const [color, setColor] = useState("#4538c8") // Risma Indigo
  const [bgColor, setBgColor] = useState("#ffffff")
  
  // Logo states
  const [logoOption, setLogoOption] = useState<"risma" | "custom" | "none">("risma")
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null)
  const [logoSize, setLogoSize] = useState(0.4) // Scale multiplier

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize qr-code-styling
  useEffect(() => {
    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      const qr = new QRCodeStyling({
        width: 320,
        height: 320,
        margin: 8,
        data: "https://kanggotan.site",
        qrOptions: {
          typeNumber: 0,
          mode: "Byte",
          errorCorrectionLevel: "H",
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 6,
        },
        dotsOptions: {
          type: "extra-rounded",
          color: "#4538c8",
        },
        backgroundOptions: {
          color: "#ffffff",
        },
        cornersSquareOptions: {
          type: "extra-rounded",
          color: "#4538c8",
        },
        cornersDotOptions: {
          type: "dot",
          color: "#4538c8",
        },
      })
      setQrCode(qr as unknown as QRCodeInstance)
      if (containerRef.current) {
        qr.append(containerRef.current)
      }
    })
  }, [])

  // Update QR options when states change
  useEffect(() => {
    if (!qrCode) return

    let image = ""
    if (logoOption === "risma") {
      image = "/logo-risma.png"
    } else if (logoOption === "custom" && customLogoUrl) {
      image = customLogoUrl
    }

    qrCode.update({
      data: data.trim() || " ",
      image,
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: logoSize,
        crossOrigin: "anonymous",
      },
      dotsOptions: {
        type: dotType,
        color,
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        type: cornerSquareType,
        color,
      },
      cornersDotOptions: {
        type: cornerDotType,
        color,
      },
    })
  }, [qrCode, data, dotType, cornerSquareType, cornerDotType, color, bgColor, logoOption, customLogoUrl, logoSize])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setCustomLogoUrl(url)
    setLogoOption("custom")
  }

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  const handleDownload = async (extension: "png" | "svg") => {
    if (!qrCode) return
    try {
      const cleanName = data
        .replace(/^https?:\/\//, "")
        .replace(/[^a-z0-9]+/gi, "-")
        .slice(0, 30) || "qr-code"

      await qrCode.download({
        name: `risma-qr-${cleanName}`,
        extension,
      })
      toast.success(`QR Code berhasil diunduh (${extension.toUpperCase()})`)
    } catch (err) {
      console.error(err)
      toast.error("Gagal mengunduh QR Code")
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-start max-w-5xl">
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6 md:p-8 space-y-6">
          <Field className="space-y-2">
            <FieldLabel className="text-sm font-semibold flex items-center gap-1.5">
              <Sparkles className="size-4 text-primary" /> Teks atau URL Tujuan *
            </FieldLabel>
            <Input
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="e.g. https://kanggotan.site/kegiatan"
              className="h-11 rounded-xl"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field>
              <FieldLabel className="text-xs font-semibold">Pola Dot (QR Code)</FieldLabel>
              <Select value={dotType} onValueChange={(val) => setDotType(val as DotType)}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="extra-rounded">Extra Rounded (Mulus)</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                  <SelectItem value="classy">Classy</SelectItem>
                  <SelectItem value="dots">Dots (Bulat-bulat)</SelectItem>
                  <SelectItem value="square">Square (Klasik Kotak)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel className="text-xs font-semibold">Bentuk Corner Square</FieldLabel>
              <Select value={cornerSquareType} onValueChange={(val) => setCornerSquareType(val as CornerSquareType)}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="out-rounded">Out Rounded</SelectItem>
                  <SelectItem value="dot">Circular</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field>
              <FieldLabel className="text-xs font-semibold">Warna Pola QR</FieldLabel>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="size-10 rounded-xl border border-border cursor-pointer bg-transparent"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#000000"
                  className="h-10 rounded-xl font-mono text-xs uppercase"
                />
              </div>
            </Field>

            <Field>
              <FieldLabel className="text-xs font-semibold">Warna Background</FieldLabel>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="size-10 rounded-xl border border-border cursor-pointer bg-transparent"
                />
                <Input
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  placeholder="#ffffff"
                  className="h-10 rounded-xl font-mono text-xs uppercase"
                />
              </div>
            </Field>
          </div>

          <div className="border-t border-border/50 pt-5 space-y-4">
            <FieldLabel className="text-xs font-semibold">Logo Tengah</FieldLabel>
            <div className="flex flex-wrap gap-2.5">
              <Button
                type="button"
                variant={logoOption === "risma" ? "default" : "outline"}
                size="sm"
                onClick={() => setLogoOption("risma")}
                className="rounded-xl font-bold"
              >
                <ImageIcon className="size-3.5 mr-1.5" /> Logo RISMA
              </Button>
              <Button
                type="button"
                variant={logoOption === "custom" ? "default" : "outline"}
                size="sm"
                onClick={triggerUpload}
                className="rounded-xl font-bold"
              >
                <Upload className="size-3.5 mr-1.5" /> {customLogoUrl ? "Ganti Logo" : "Upload Custom"}
              </Button>
              {logoOption !== "none" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setLogoOption("none")}
                  className="rounded-xl text-muted-foreground font-bold"
                >
                  <X className="size-3.5 mr-1.5" /> Tanpa Logo
                </Button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />

            {logoOption !== "none" && (
              <Field className="pt-2">
                <FieldLabel className="text-[10px] text-muted-foreground flex justify-between font-semibold">
                  <span>Ukuran Logo Tengah</span>
                  <span>{Math.round(logoSize * 100)}%</span>
                </FieldLabel>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={logoSize}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                />
              </Field>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm sticky top-6 bg-card flex flex-col items-center justify-center">
        <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center w-full">
          <div className="bg-muted/10 border border-dashed border-border rounded-2xl p-4 flex items-center justify-center shrink-0 size-[320px]">
            <div ref={containerRef} className="size-[288px] flex items-center justify-center overflow-hidden" />
          </div>

          <div className="w-full mt-6 space-y-3">
            <Button
              type="button"
              className="w-full rounded-xl font-bold h-11"
              onClick={() => handleDownload("png")}
            >
              <Download className="size-4 mr-2" /> Unduh PNG
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl font-bold h-11"
              onClick={() => handleDownload("svg")}
            >
              <Download className="size-4 mr-2" /> Unduh SVG (Vector)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
