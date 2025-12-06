import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";

const CreateUserSchema = z.object({
  userName: z.string(),
  password: z.string(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export const CreateUserPipe = new ZodValidationPipe(CreateUserSchema);

export const UpdateUserSchema = CreateUserSchema.partial();

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export const UpdateUserPipe = new ZodValidationPipe(UpdateUserSchema);
