import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email es requerido"),
  password: z.string().min(1, "Contraseña es requerida"),
});

export type LoginForm = z.infer<typeof loginSchema>;
