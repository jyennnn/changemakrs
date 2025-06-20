import { z } from "zod";

export enum Cause {
  ENVIRONMENT = "Environment",
  ANIMALS = "Animals",
  YOUTHS = "Youths",
  ELDERLY = "Elderly",
  DISABILITIES = "Disabilities",
  ARTS_AND_CULTURE = "Arts & Culture",
  COMMUNITY = "Community",
  OTHERS = "Others",
}

export const SessionSchema = z.object({
  id: z.string().uuid(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  hours: z.number().min(1, "Must be at least 1 hour"),
  role: z.string().min(1, "Role is required"),
  cause: z.union([
    z.nativeEnum(Cause),
    z.string().min(1, "Custom cause must not be empty"),
  ]),
  organisation: z.string().optional(),
  description: z.string().optional(),
  photo_url: z.string().optional(),
  user_id: z.string().uuid()
});
export type Session = z.infer<typeof SessionSchema>;

export const ProfileSchema = z.object({
  user_id: z.string().uuid(), // Must match `auth.users.id`
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  birthday: z.string().optional(), // Could be changed to `z.coerce.date()` if you're handling Date objects
  avatar_url: z.string().url().optional(),
  bio: z.string().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
});

export type Profile = z.infer<typeof ProfileSchema>;
