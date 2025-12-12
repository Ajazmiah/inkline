import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Styles from "./RichText.module.css";
import classnames from "classnames";
import { sanitizeContent } from "../../utils";
import { toast } from "react-toastify";
import UploadFileButton from "../UploadButton/UploadFileButton";
import Button from "../Atoms/Button/Button";

const VALID_FILE_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

function QuillRichText({
  editQuillValue,
  editTitle,
  editSummary,
  editCoverImage,
  handleSubmit,
  handleBackdrop = () => {},
  ...rest
}) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };
  const formats = [
    "header",
    "font",
    "size",
    "color",
    "background",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "code-block",
    "align",
    "link",
    "image",
    "video",
  ];

  const [previewCoverImage, setPreviewCoverImage] = useState(null);

  const titleRef = useRef();

  const [s3Image, setS3Image] = useState(null);
  const [title, setTitle] = useState(editTitle || "");
  const [summary, setSummary] = useState(editSummary || "");
  const [QuillValue, setQuillValue] = React.useState(editQuillValue || null);
  const coverImage = previewCoverImage || editCoverImage;

  const [error, setError] = useState([]);

  const validateInputs = (titleInput, summaryInput, quillInput, image) => {
    let errors = [];

    // Check if any of the inputs are empty
    if (
      [titleInput, summaryInput, quillInput].some(
        (input) => input.trim() === ""
      )
    ) {
      errors.push("You need to fill up all the fields");
    }

    // Check if the image is missing
    if (!coverImage) {
      errors.push("You need to upload a cover image");
    }

    // Set error if there are any errors
    if (errors.length > 0) {
      setError(errors);
      return false;
    }

    return true;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!VALID_FILE_TYPES.includes(file.type)) {
      toast.error("Please choose an image file");
      return;
    }

    setPreviewCoverImage(URL.createObjectURL(file));
    setS3Image(file);
  };

  useEffect(() => {
    if (error.length > 0) {
      let errorDiv = error.map((er) => <div> *{er}</div>);
      toast.error(<div>{errorDiv}</div>);
    }
  }, [error]);

  useEffect(() => titleRef.current.focus(), []);

  const handleClick = () => {
    if (validateInputs(title, summary, QuillValue, s3Image)) {
      handleBackdrop();

      handleSubmit(title, summary, QuillValue, s3Image);
    } else return;
  };

  return (
    <>
      <div className={classnames("pageContainer", Styles.richText)}>
        <img src={coverImage} />
        <div>
          <input
            required={true}
            placeholder="Title.."
            ref={titleRef}
            id="title"
            className={Styles.input}
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <input
            required={true}
            className={Styles.input}
            id="summary"
            placeholder="Summary.."
            name="summary"
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            autoComplete=""
          />
        </div>
        <div className={Styles.uploadFile}>
          <UploadFileButton type="file" handleChange={handleFileChange} />
          {s3Image ? (
            <>
              {s3Image.name}{" "}
              <span
                className={Styles.unselectFile}
                onClick={() => setS3Image(null)}
              >
                {" "}
                X{" "}
              </span>{" "}
            </>
          ) : null}
        </div>

        <ReactQuill
          className={classnames(Styles["ql-toolbar"], Styles["ql-editor"])}
          theme="snow"
          modules={modules}
          formats={formats}
          value={QuillValue}
          onChange={(QuillValue) => setQuillValue(QuillValue)}
          placeholder="Start Writing.."
        ></ReactQuill>

        <Button onClick={handleClick} classes="buttonPost">
          Post
        </Button>
      </div>
    </>
  );
}

export default QuillRichText;
