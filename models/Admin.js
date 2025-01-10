import mongoose from 'mongoose';

const Schema = mongoose.Schema;
import bcrypt from 'bcrypt';

const adminSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

    // validating email and password
adminSchema.statics.signup = async function (email, password) {
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

adminSchema.statics.login = async function (email, password) {
    if (!email || !password)
        throw Error('All fields are mandatory');
    const admin = await this.findOne({ email });
    if (!admin)
        throw Error('Incorrect email');
    const match = await bcrypt.compare(password, admin.password);
    if (!match)
        throw Error('Incorrect password');
    return admin;
}

const Admin = mongoose.model('admin', adminSchema);
export { Admin };

