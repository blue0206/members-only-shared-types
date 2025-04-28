import { z } from 'zod';

// Define Supported Image Formats.
export const supportedImageFormats = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
] as const;
export type SupportedImageFormatsType = (typeof supportedImageFormats)[number];

export const AvatarSchema = z.any().superRefine((file, ctx) => {
    // Validate image file size <= 8MB
    if (file?.size > 8000000) {
        ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            message: 'The image size cannot exceed 8MB.',
            maximum: 8000000,
            inclusive: true,
            type: 'number',
            fatal: true,
        });
    }

    // Validate the image format.
    if (
        !supportedImageFormats.includes(file?.type) &&
        !supportedImageFormats.includes(file?.mimetype)
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
                'The image format is not supported. Please upload a JPEG, JPG, PNG, or WebP image.',
        });
    }
});
export type AvatarType = z.infer<typeof AvatarSchema>;
