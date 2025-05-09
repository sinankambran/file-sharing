import React, { useEffect, useRef, useState } from "react";
import { UploadFile } from "../service/api";
import "../App.css";
import { IoMdCloudUpload } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { QRCode } from "react-qrcode-logo";

function Home() {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState(null);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const uploadRef = useRef();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

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
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dzyet3cyh/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploadedImage = await res.json();

      if (uploadedImage.secure_url) {
        console.log("Uploaded URL:", uploadedImage.secure_url);
        setFile(selected);
        // setRes(uploadedImage.secure_url);
      } else {
        console.error("Upload failed", uploadedImage);
        alert("Upload failed. Check your upload preset and try again.");
      }
    } catch (error) {
      console.error("Upload error", error);
      alert("Upload error. See console for details.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:9000/auth/logout", { method: "POST" });
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

        {/* Main section */}
        <div className="flex flex-col justify-center items-center gap-6 bg-white w-full sm:w-[80%] h-[70%] mt-6 p-6 rounded-md shadow-md">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-black">
            Simple and reliable <br /> file transfers
          </h1>

          {/* Upload UI only if logged in */}
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
            <p className="text-red-500 font-medium">
              Please{" "}
              <Link to="/login" className="underline text-green-600 ">
                log in
              </Link>{" "}
              to upload files.
            </p>
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
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4 text-black">
              File Uploaded!
            </h2>

            <a
              href={res}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 underline break-words mb-4"
            >
              {res}
            </a>

            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={handleCopy}
                className="bg-green-100 text-green-600 px-4 py-2 rounded hover:bg-green-200 font-semibold"
              >
                {copied ? "✔ Copied!" : "Copy"}
              </button>
              <button
                onClick={handleOpen}
                className="bg-green-100 text-green-600 px-4 py-2 rounded hover:bg-green-200 font-semibold"
              >
                Open
              </button>
            </div>
            <div className="flex justify-center mt-4">
              <QRCode value={res} size={128} />
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
