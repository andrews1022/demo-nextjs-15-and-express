import { z } from "zod";
import { SignInFormSchema, SignUpFormSchema } from "@/lib/formSchemaDefinitions";

export type SignInFormInputs = z.infer<typeof SignInFormSchema>;
export type SignUpFormInputs = z.infer<typeof SignUpFormSchema>;
