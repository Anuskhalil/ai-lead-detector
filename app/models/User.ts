// models/User.ts

import mongoose, { Schema, Model } from 'mongoose';

export interface User {
    _id?: string;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<User>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create index on email for faster lookups
UserSchema.index({ email: 1 }, { unique: true });

const UserModel: Model<User> =
    mongoose.models.User || mongoose.model<User>('User', UserSchema);

export default UserModel;