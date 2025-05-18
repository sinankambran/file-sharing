import React, { useEffect, useRef, useState } from "react";
import { UploadFile } from "../service/api";
import "../App.css";
import { IoMdCloudUpload } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { QRCode } from "react-qrcode-logo";
import Popup from "../components/Popup";

function Home() {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState(null);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const uploadRef = useRef();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  const BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:9000"
      : import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!isLoggedIn) navigate("/home");
  }, [isLoggedIn, navigate]);

  const handleUpload = () => {
    uploadRef.current.click();
  };

  const handleCopy = () => {
    if (res) {
      navigator.clipboard.writeText(res);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpen = () => {
    if (res) window.open(res, "_blank");
  };

  const handleFileChange = async (event) => {
    const selected = event.target.files[0];

    if (selected && selected.size > 50 * 1024 * 1024) {
      alert("File is too large! Max size is 50MB.");
      return;
    }

    const data = new FormData();
    data.append("file", selected);
    data.append("upload_preset", "First_time_using_cloudinary");

    try {
      setUploading(true);
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dzyet3cyh/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploadedImage = await res.json();

      if (uploadedImage.secure_url) {
        setRes(uploadedImage.secure_url);
        const downloadLink = uploadedImage.secure_url.replace(
          "/upload/",
          "/upload/fl_attachment/"
        );
        setDownloadUrl(downloadLink);
        setShowPopup(true);
      } else {
        console.error("Upload failed", uploadedImage);
        alert("Upload failed. Check your upload preset and try again.");
      }
    } catch (error) {
      console.error("Upload error", error);
      alert("Upload error. See console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("loggedIn");
      navigate("/home");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    const upload = async () => {
      if (!file) return;
      setUploading(true);
      const formData = new FormData();
      formData.append("name", file.name);
      formData.append("file", file);

      const response = await UploadFile(formData);
      setRes(response?.path);
      if (response?.path) {
        const downloadLink = response.path.replace(
          "/upload/",
          "/upload/fl_attachment/"
        );
        setDownloadUrl(downloadLink);
      }
      setShowPopup(true);

      setUploading(false);
    };
    upload();
  }, [file]);

  return (
    <div
      style={{ backgroundImage: `url('./images/sky1.jpg')` }}
      className="flex flex-col items-center h-screen w-full px-4 sm:px-8 bg-cover"
    >
      <div className="flex flex-col items-center w-full h-full px-4 sm:px-8 bg-cover">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-2 bg-white w-full sm:w-[80%] h-auto sm:h-[15%] rounded-md shadow-md mt-4">
          <Link to="/home" className="flex items-center gap-2 mb-2 sm:mb-0">
            <img
              src="./images/checked.png"
              alt="Logo"
              className="w-8 sm:w-10 md:w-12 cursor-pointer"
            />
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold whitespace-nowrap">
              FileTransfer<span className="text-green-500">.io</span>
            </h2>
          </Link>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 items-center">
            <p>Send file</p>
            <p className="underline text-green-500">Request file</p>
            <p>Sent</p>
            {isLoggedIn ? (
              <p
                onClick={handleLogout}
                className="cursor-pointer text-green-500 underline"
              >
                Log out
              </p>
            ) : (
              <Link to="/login">
                <p className="cursor-pointer text-green-500 underline">
                  Log in
                </p>
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-6 bg-white w-full sm:w-[80%] h-[70%] mt-6 p-6 rounded-md shadow-md">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-black">
            Simple and reliable <br /> file transfers
          </h1>

          {isLoggedIn ? (
            <div className="relative">
              <button
                className="bg-green-500 text-white w-48 h-12 rounded-full flex items-center justify-center gap-2"
                onClick={handleUpload}
              >
                <IoMdCloudUpload className="w-6 h-6" />
                Upload
              </button>
              <input
                type="file"
                ref={uploadRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <button className="bg-green-500  w-48 h-12 rounded-full flex items-center justify-center gap-2">
              <Link to="/login" className=" text-white ">
                log in
              </Link>{" "}
            </button>
          )}

          {uploading && (
            <p className="text-blue-500 font-medium animate-pulse">
              Uploading...
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="bg-amber-100 w-full sm:w-[80%] h-[15%] mt-4 rounded-md shadow-md overflow-y-auto"></div>
      </div>

      {/* Modal Popup */}
      {showPopup && res && (
        <Popup
          res={res}
          downloadUrl={downloadUrl}
          copied={copied}
          handleCopy={handleCopy}
          handleOpen={handleOpen}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default Home;
