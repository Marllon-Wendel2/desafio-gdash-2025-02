import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";

export const LoginSchema = z.object({
  userName: z.string(),
  password: z.string(),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export const LoginPipe = new ZodValidationPipe(LoginSchema);
