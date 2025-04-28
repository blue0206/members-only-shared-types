import { z } from 'zod';

export const AvatarSchema = z.any().superRefine((file, ctx) => {
    // Validate image file size <= 8MB
    if (file?.size > 8000000) {
        ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            message: 'The image size cannot exceed 8MB.',
            maximum: 8000000,
            inclusive: true,
            type: 'number',
        });
    }

    // Validate image format is supported.
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!supportedFormats.includes(file?.type)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
                'The image format is not supported. Please upload a JPEG, JPG, PNG, or WebP image.',
        });
    }
});
export type AvatarType = z.infer<typeof AvatarSchema>;
