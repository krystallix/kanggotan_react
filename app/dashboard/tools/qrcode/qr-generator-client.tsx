"use client"

import { useEffect, useRef, useState } from "react"
import { Download, Upload, Sparkles, Image as ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import QRCode from "qrcode"

type CustomDotType = "extra-rounded" | "rounded" | "dots" | "square" | "love" | "diamond"

export default function QrGeneratorClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Options states
  const [data, setData] = useState("https://kanggotan.site")
  const [dotType, setDotType] = useState<CustomDotType>("love")
  const [color, setColor] = useState("#4538c8") // Risma Indigo
  const [bgColor, setBgColor] = useState("#ffffff")
  
  // Logo states
  const [logoOption, setLogoOption] = useState<"risma" | "custom" | "none">("risma")
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null)
  const [logoSize, setLogoSize] = useState(0.25) // Scale multiplier (smaller for safety)

  // Render QR Code on Canvas manually
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = 320
    canvas.width = size
    canvas.height = size

    // Clear background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    // Generate QR matrix
    const qrData = QRCode.create(data || " ", { errorCorrectionLevel: "H" })
    const modules = qrData.modules
    const count = modules.size
    const cellSize = (size - 24) / count // margin 12px each side
    const margin = 12

    // Load logo image if needed
    let logoImg: HTMLImageElement | null = null
    const drawAll = () => {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, size, size)

      const logoSizePixels = size * logoSize
      const logoX = (size - logoSizePixels) / 2
      const logoY = (size - logoSizePixels) / 2

      // Draw modules
      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (!modules.get(c, r)) continue

          const x = c * cellSize + margin
          const y = r * cellSize + margin

          // Check if coordinate overlaps with logo area (keep middle clean)
          if (logoOption !== "none") {
            const buffer = cellSize * 0.8
            if (
              x + cellSize > logoX - buffer &&
              x < logoX + logoSizePixels + buffer &&
              y + cellSize > logoY - buffer &&
              y < logoY + logoSizePixels + buffer
            ) {
              continue
            }
          }

          // Check if it's one of the three finder patterns (corners)
          const isFinder =
            (r < 7 && c < 7) || // Top-left
            (r < 7 && c >= count - 7) || // Top-right
            (r >= count - 7 && c < 7) // Bottom-left

          ctx.fillStyle = color

          if (isFinder) {
            // Render finder pattern cleanly as rounded rectangle
            ctx.beginPath()
            ctx.roundRect(x, y, cellSize, cellSize, cellSize * 0.25)
            ctx.fill()
            continue
          }

          // Custom dot pattern drawing
          if (dotType === "love") {
            ctx.save()
            ctx.translate(x + cellSize / 2, y + cellSize / 2)
            ctx.beginPath()
            // Simple SVG Love Path scaled to cell size
            const s = cellSize / 16
            ctx.scale(s, s)
            ctx.moveTo(0, -3)
            ctx.bezierCurveTo(-2, -6, -7, -6, -7, -1)
            ctx.bezierCurveTo(-7, 3, -1, 6, 0, 8)
            ctx.bezierCurveTo(1, 6, 7, 3, 7, -1)
            ctx.bezierCurveTo(7, -6, 2, -6, 0, -3)
            ctx.closePath()
            ctx.fill()
            ctx.restore()
          } else if (dotType === "diamond") {
            ctx.beginPath()
            ctx.moveTo(x + cellSize / 2, y)
            ctx.lineTo(x + cellSize, y + cellSize / 2)
            ctx.lineTo(x + cellSize / 2, y + cellSize)
            ctx.lineTo(x, y + cellSize / 2)
            ctx.closePath()
            ctx.fill()
          } else if (dotType === "dots") {
            ctx.beginPath()
            ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.4, 0, Math.PI * 2)
            ctx.fill()
          } else if (dotType === "rounded") {
            ctx.beginPath()
            ctx.roundRect(x + cellSize * 0.05, y + cellSize * 0.05, cellSize * 0.9, cellSize * 0.9, cellSize * 0.25)
            ctx.fill()
          } else if (dotType === "extra-rounded") {
            ctx.beginPath()
            ctx.roundRect(x + cellSize * 0.05, y + cellSize * 0.05, cellSize * 0.9, cellSize * 0.9, cellSize * 0.45)
            ctx.fill()
          } else {
            // Square (standard)
            ctx.fillRect(x, y, cellSize, cellSize)
          }
        }
      }

      // Draw logo in the middle
      if (logoOption !== "none" && logoImg) {
        // Draw circular background for logo (for contrast)
        ctx.fillStyle = bgColor
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, (logoSizePixels / 2) * 1.15, 0, Math.PI * 2)
        ctx.fill()

        // Draw image logo
        try {
          ctx.drawImage(logoImg, logoX, logoY, logoSizePixels, logoSizePixels)
        } catch (e) {
          console.error("Failed to draw logo onto canvas:", e)
        }
      }
    }

    // Handle image loading
    if (logoOption === "risma") {
      logoImg = new Image()
      logoImg.src = "/logo-risma.png"
      logoImg.onload = drawAll
    } else if (logoOption === "custom" && customLogoUrl) {
      logoImg = new Image()
      logoImg.src = customLogoUrl
      logoImg.onload = drawAll
    } else {
      drawAll()
    }
  }, [data, dotType, color, bgColor, logoOption, customLogoUrl, logoSize])

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

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    const cleanName = data
      .replace(/^https?:\/\//, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .slice(0, 30) || "qr-code"

    link.download = `risma-qr-${cleanName}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
    toast.success("QR Code berhasil diunduh (PNG)")
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
              <Select value={dotType} onValueChange={(val) => setDotType(val as CustomDotType)}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="love">Love ❤️ (Kustom)</SelectItem>
                  <SelectItem value="diamond">Diamond 💎 (Kustom)</SelectItem>
                  <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="square">Square (Kotak)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  max="0.4"
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

      <Card className="border-border/50 shadow-sm sticky top-6 bg-card flex flex-col items-center">
        <CardContent className="p-6 md:p-8 flex flex-col items-center w-full">
          <div className="bg-muted/10 border border-dashed border-border rounded-2xl p-4 flex items-center justify-center shrink-0 size-[320px]">
            <canvas ref={canvasRef} className="size-[288px] overflow-hidden" />
          </div>

          <div className="w-full mt-6">
            <Button
              type="button"
              className="w-full rounded-xl font-bold h-11"
              onClick={handleDownload}
            >
              <Download className="size-4 mr-2" /> Unduh PNG
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
