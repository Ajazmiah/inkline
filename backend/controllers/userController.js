import userModel from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "express-async-handler"; // This eliminates the need to use try and catch in Controller function
import { body, validationResult } from "express-validator";
import blogModel from "../models/blogModels.js";
import User from "../models/userModel.js";
import { getRandomHex } from "../utils/randomHex.js";
import { getFileFromS3, uploadToS3 } from "../utils/s3.js";
import { attachPresignedURLs } from "../utils/attachedSignedURL.js";
import { optimizeImage } from "../utils/imageOptimize.js";
import { sendMail, transporter } from "../utils/nodemailer.js";
import { verificationToken } from "../utils/verificationCodeGenerator.js";
import ejs from "ejs";
import path from "path";


const signup = asyncHandler(async (req, res, next) => {
  const registerForm = req.body;

  const firstName = registerForm.firstName;
  const lastName = registerForm.lastName;
  const email = registerForm.email;
  const password = registerForm.password;

  const verificationToken = Math.floor(
    10000 + Math.random() * 90000
  ).toString();


  const URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.BASE_URL;

  const linkToVerify = `<a href=${URL}/verify-email?token=${verificationToken}>Click here to verify your email</a>`;
  
  const html = await ejs.renderFile(
    path.join(process.cwd(), "templates", "resetPassword.ejs"),
    {
      firstName,
      verificationLink:`${URL}/verify-email?token=${verificationToken}`,
      url:linkToVerify
    }
  );
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422);
    throw new Error(errors.errors[0].msg);
  }

  const userExist = await userModel.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error(
      `${email} is already in use, please use a different E-mail`
    );
  }


  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password,
    verificationToken,
    isVerified: false,
    verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });
  // Create a new user instance
  // - Another way of creating it
  // const newUser = new User({
  //   username: "john_doe",
  //   email: "john@example.com",
  // });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isVerified: user.isVerified,
    });
   
    const mailOptions = {
      from: "miahajaz@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Verification code sent by CodersJournal", // Subject line
      html,
    };

    sendMail(transporter, mailOptions);
  } else {
    res.status(400);
    throw new Error("Could not create an account - please try again later..");
  }
});

//Confirm Email with Code sent
const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token, id } = req.body;

  console.log("__BODY__", req.body)

  const user = await userModel.findById(id);

  if (user.verificationToken === token) {
    user.isVerified = true;
    const updatedUser = await user.save();

    res.status(200).json({
      _id: user._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      bio: updatedUser.bio,
      isVerified: updatedUser.isVerified,
    });
  } else {
    res.status(401);
    throw new Error("Verification Code is wrong");
  }
});

const singin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    if (user.profilePicture) {
      let presignedURL = null;

      presignedURL = await getFileFromS3(user.profilePicture, "profilePic");
      user.profilePicture = presignedURL;
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: presignedURL,
        bio: user.bio,
        isVerified: user.isVerified,
      });
    }

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      bio: user.bio,
      isVerified: user.isVerified,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const logout = asyncHandler(async (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  /*ANOTHER WAY TO DO THIS
    return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out 😏 🍀" });
*/

  res.status(200).json({ message: " Logged out" });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const updateForm = req.body;
  const userId = updateForm._id;

  const firstName = updateForm.firstName;
  const lastName = updateForm.lastName;
  const email = updateForm.email;
  const bio = updateForm.bio;
  const password = updateForm.password;
  const confirmPassword = updateForm.confirmPassword;

  const user = await userModel.findById(userId);

  if (user) {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.bio = bio || user.bio;

    if (req?.file) {
      const customFileName = user.profilePicture
        ? user.profilePicture
        : getRandomHex();
      user.profilePicture = customFileName;
      const optimizedBuffer = await optimizeImage(
        req.file.buffer,
        "profilePicture"
      );

      await uploadToS3(optimizedBuffer, customFileName, "profilePic");
    }

    if (password) {
      user.password = password;
      user.confirmPassword = confirmPassword;
    }

    const updatedUser = await user.save();

    if (updatedUser.profilePicture) {
      let presignedURL = null;

      presignedURL = await getFileFromS3(user.profilePicture, "profilePic");

      res.status(200).json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        profilePicture: presignedURL,
        bio: updatedUser.bio,
      });
    }
  } else {
    res.status(404);
    throw new Error("USER NOT FOUND!");
  }
});

// public profile -
const userPublicProfile = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const blogs = await blogModel.find({ authorId: id });

  const authorInfo = await userModel
    .findById(id)
    .select("-password -confirmPassword");

  if (!authorInfo) {
    throw new Error("This user profile is unavailable");
  }
  let presignedURL = null;
  let SignedPosts = null;

  if (blogs && authorInfo) {
    if (authorInfo.profilePicture) {
      presignedURL = await getFileFromS3(
        authorInfo.profilePicture,
        "profilePic"
      );
    }
    SignedPosts = await attachPresignedURLs(blogs);
  }

  authorInfo.profilePicture = presignedURL;

  res.status(200).json({ SignedPosts, authorInfo });
});

const verifyCheck = asyncHandler(async (req, res, next) => {
  const { id } = req.body;


  const user = await userModel.findById(id);

  if (user) {
    res.status(200).json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
    });
  }
});

//send email with password reset link
const resetPasswordLink = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  const URL = process.env.BASE_URL;

  if (user) {
    const token = verificationToken();
    const verificationLink = `<a href=${URL}/forgot-password?token=${token}>Click here to verify your email</a>`;
    user.verificationToken = token;
    await user.save();
    const mailOptions = {
      from: "miahajaz@gmail.com", // sender address
      to: user.email, // list of receivers
      subject: "Verification code sent by CodersJournal", // Subject line
      html: `<h3> hi ${user.firstName}</h3>
      <b>Click on this link to reset your password</b>
      ${verificationLink}`,
    };

    sendMail(transporter, mailOptions);

    res.status(200).json({ message: "Email Sent" });
  } else {
    res.status(401);
    throw new Error("No user found with the email you provided");
  }
});

// checks if the token matches
const confirmResetPasswordToken = asyncHandler(async (req, res, next) => {
  const verificationToken = req.body.token;

  const user = await userModel.findOne({ verificationToken });

  if (user.verificationToken === verificationToken) {
    res.status(200).json({ message: "Token matches" });
  } else {
    res.status(401);
    throw new Error("Token does not match");
  }
});

const setNewPassword = asyncHandler(async (req, res, next) => {
  const verificationToken = req.body.token;
  const user = await userModel.findOne({ verificationToken });



  if (user) {
    console.log("___2222", user)
    user.password = req.body.password;
    await user.save();
    res.status(200).json({message: 'password reset'})
  } else {
    res.status(401)
    throw new Error('Password could not be updated')
  }
});

export {
  signup,
  singin,
  logout,
  updateUser,
  userPublicProfile,
  verifyEmail,
  verifyCheck,
  resetPasswordLink,
  confirmResetPasswordToken,
  setNewPassword,
};
