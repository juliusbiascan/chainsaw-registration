import * as z from "zod";

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }

    return true;
  }, {
    message: "Password is required!",
    path: ["password"]
  })

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const ClockInSchema = z.object({
  userId: z.string().min(1, {
    message: "UserId is required",
  }),
  deviceId: z.string().min(1, {
    message: "DeviceId required",
  }),
});

export const DeviceUserForm = z.object({
  schoolId: z.string().min(1),
});

export const EquipmentSchema = z.object({
  name: z.string().min(2, {
    message: 'Equipment name must be at least 2 characters.'
  }).max(100, {
    message: 'Equipment name must not exceed 100 characters.'
  }).trim(),
  category: z.string().min(1, {
    message: 'Please select a category.'
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.'
  }).max(500, {
    message: 'Description must not exceed 500 characters.'
  }).trim(),
  validUntil: z.date()
    .optional()
    .refine((date) => {
      if (!date) return true; // Optional field
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Valid until date must be today or in the future"),
});

export const EquipmentUpdateSchema = EquipmentSchema.partial().extend({
  id: z.string().min(1, {
    message: 'Equipment ID is required.'
  }),
});