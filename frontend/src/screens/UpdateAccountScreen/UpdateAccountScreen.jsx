import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateProfileMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import Button from "../../components/Atoms/Button/Button";
import useUploadImage from "../../hooks/useUploadImage";
import { toast } from "react-toastify";
import ProfileImage from "../../components/ProfileImage/ProfileImage";

function UpdateAccountScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const MAX_BIO_CH = 200;

  const { userInfo } = useSelector((state) => state.auth);
  const [email, setEmail] = useState(userInfo.email);
  const [firstName, setFirstName] = useState(userInfo.firstName);
  const [lastName, setLastName] = useState(userInfo.lastName);
  const [bio, setBio] = useState(userInfo.bio);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  // CUSTOM USEHOOK
  const [previewImage, image, INPUT] = useUploadImage();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password do not match");
    } else {
      const form = new FormData();

      form.append("profilePicture", image);
      form.append("firstName", firstName);
      form.append("lastName", lastName);
      form.append("email", email);

      form.append("_id", userInfo._id);

      if (password && confirmPassword) {
        form.append("password", password);
        form.append("confirmPassword", confirmPassword);
      }
      if (bio) {
        form.append("bio", bio);
      }

      try {
        const res = await updateProfile(form).unwrap();
        toast.success("Your profile is updated");
        if (res) {
          dispatch(setCredentials(res));
          navigate("/profile");
        }
      } catch (err) {
        toast.error(err.data.message);
        console.log("ERR", err);
      }
    }
  };
  return (
    <div>
      <Container className="Container">
        <ProfileImage
          imageURL={previewImage || userInfo.profilePicture}
          customClasses="profileImage"
        />
        <form onSubmit={submitHandler}>
          <div>{INPUT}</div>
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <TextField
            label="Your Bio"
            multiline
            value={bio}
            rows={4} // Number of rows (lines) visible by default
            variant="outlined" // Can be 'filled' or 'standard'
            fullWidth
            onChange={(e) => setBio(e.target.value)}
            inputProps={{
              maxLength: MAX_BIO_CH,
            }}
          />
          <p style={bio?.length === MAX_BIO_CH ? { color: "red" } : null}>
            {bio?.length}/{MAX_BIO_CH} characters
          </p>

          <Typography
            variant="subtitle1"
            component="h1"
            sx={{
              mb: 2,
              marginTop: "3em",
              backgroundColor: "black", // Black background
              color: "white", // White text for contrast
              display: "inline-block", // Ensures background wraps around text
              padding: "4px 8px", // Padding inside the label
              borderRadius: "4px", // Optional: Slight rounding of corners
            }}
          >
            Account
          </Typography>

          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" className='btn-round-black text-white'>Update</button>
        </form>
      </Container>
    </div>
  );
}

export default UpdateAccountScreen;
