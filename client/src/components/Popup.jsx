import React from "react";
import { QRCode } from "react-qrcode-logo";
const Popup = ({
  res,
  downloadUrl,
  copied,
  handleCopy,
  handleOpen,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold mb-4 text-black">
          File Uploaded!
        </h2>

        {/* {/\.(jpe?g|png|gif)$/i.test(res) && (
                      <img
                        src={res}
                        alt="Uploaded Preview"
                        className="w-full max-h-64 object-contain rounded mb-4"
                      />
                    )} */}

        <a
          href={downloadUrl || res}
          download
          className="block text-blue-600 underline break-words mb-4"
        >
          {downloadUrl || res}
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
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
