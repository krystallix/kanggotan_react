import { z } from "zod";
export type HaulType = {
  id: number
  no: number;
  name: string;
  address: string;
  isMainRow: boolean;
  index: number;
  arwahId: number;
  arwahName: string;
  arwahAddress: string;
  groupColor: string;
}

export const arwahSchema = z.object({
  greeting: z.string().min(1, "Sapaan arwah wajib diisi"),
  name: z.string().min(1, "Nama arwah wajib diisi"),
  address: z.string().min(1, "Alamat makam wajib diisi"),
});

export const haulFormSchema = z.object({
  senderName: z.string().min(1, "Nama pengirim wajib diisi"),
  senderGreeting: z.string().min(1, "Sapaan wajib diisi"),
  senderAddress: z.string().min(1, "Alamat pengirim wajib diisi"),
});

export type HaulFormValues = z.infer<typeof haulFormSchema>;
export type ArwahFormValues = z.infer<typeof arwahSchema>;

export type DeleteArwahResult = {
  success: boolean;
  nextArwah?: {
    id: number;
    arwah_name: string;
  } | null;
}

export type DeleteSenderResult = {
  success: boolean;
}