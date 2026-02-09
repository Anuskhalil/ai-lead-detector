// models/User.ts

import mongoose, { Schema, Model } from 'mongoose';

export interface User {
    _id?: string;
    name: string;
    email: string;
    password: string;
    marketingEmails: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<User>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name must not exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
        },
        marketingEmails: {
            type: Boolean,
            default: false,
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

