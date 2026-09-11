const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['student', 'teacher'],
      required: [true, 'Role is required (student or teacher)'],
      default: 'student',
    },
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    teacherId: {
      type: String,
      trim: true,
      sparse: true, // Allows null/undefined for students without unique constraint violations
    },
    rollNumber: {
      type: String,
      trim: true,
    },
    course: {
      type: String,
      trim: true,
    },
    semester: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    departmentOrGrade: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await argon2.hash(this.password);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await argon2.verify(this.password, enteredPassword);
  } catch (err) {
    return false;
  }
};

// Don't return password hash in JSON responses
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
