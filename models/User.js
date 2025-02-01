import mongoose from 'mongoose';

const Schema = mongoose.Schema;
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
    },
    role: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    }
}, { timestamps: true });


userSchema.statics.signup = async function (email, password) {
    const exists = await this.findOne({ email });
    if (exists)
        throw Error('Email already exists');

    const salt = await bcrypt.genSalt(10);
    const hashPswd = await bcrypt.hash(password, salt);
    const user = await this.create({ email, password: hashPswd });
    return user;
}

userSchema.statics.login = async function (email, password) {
    if (!email || !password)
        throw Error('All fields are mandatory');
    const user = await this.findOne({ email });
    if (!user)
        throw Error('Incorrect email');
    const match = await bcrypt.compare(password, user.password);
    if (!match)
        throw Error('Incorrect password');
    return user;
}

const User = mongoose.model('user', userSchema);
export { User };

