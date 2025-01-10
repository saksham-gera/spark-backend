import mongoose from 'mongoose';

const Schema = mongoose.Schema;
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    services: { type: Number, default: 0 },
    aboutUs: { type: Number, default: 0 },
    nutritionStrategy: { type: Number, default: 0 },
    ayurveda: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    diet: { type: Number, default: 0 },
})

    // validating email and password
userSchema.statics.signup = async function (email, password, phone) {
    // checking for uniqueness of email
    const exists = await this.findOne({ email });
    if (exists)
        throw Error('Email already exists');

    // if email is unique hash the password and create the user
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
export { User};

