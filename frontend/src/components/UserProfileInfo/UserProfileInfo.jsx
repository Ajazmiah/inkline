import React, { Children } from "react";
import AuthorBio from "../AuthorBio/AuthorBio";
import { Link } from "react-router-dom";
import Styles from "./UserProfileInfo.module.css";
import { getIcon } from "../Icon";
import Button from "../Atoms/Button/Button";
import classNames from "classnames";
import ProfileImage from "../ProfileImage/ProfileImage";
import Initials from "../Initials/Initials";

const UpdateAccount = () => {
  return (
    <Link to="/profile/update">
      <Button classes="update">Update Account</Button>
    </Link>
  );
};

function UserProfileInfo({ userInfo, children }) {
  return (
    <div className={Styles.userProfileInfo}>
      <div className={classNames("container", Styles.profileInfo)}>
       
          <div className={Styles.profilePicture}>
            {userInfo.profilePicture ? (
              <ProfileImage
                empty
                imageURL={userInfo.profilePicture}
              />
            ) : (
              <Initials author={userInfo} type="profileScreen" />
            )}
          </div>
     

        <div className={Styles.profileRight}>
          <AuthorBio authorInfo={userInfo} />
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

UserProfileInfo.UpdateAccount = UpdateAccount;

export default UserProfileInfo;
