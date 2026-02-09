// models/PasswordReset.ts

import mongoose, { Schema, Model } from 'mongoose';

export interface PasswordReset {
    _id?: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt?: Date;
}

const PasswordResetSchema = new Schema<PasswordReset>(
    {
        userId: {
            type: String,
            required: true,
            ref: 'User',
        },
        token: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes
PasswordResetSchema.index({ token: 1 });
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetModel: Model<PasswordReset> =
    mongoose.models.PasswordReset ||
    mongoose.model<PasswordReset>('PasswordReset', PasswordResetSchema);

export default PasswordResetModel;