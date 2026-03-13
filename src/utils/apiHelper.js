import axios from "axios";
import {
  devConsoleLog,
  errorToast,
  getLocal,
  getSession,
  getUserData,
  infoToast,
  sessionDestroy,
  warningToast,
} from "./projectHelper.js";
import { NETWORK_ERROR } from "../config/constants/projectConstant.js";
import { STUDENT_LOGIN_PAGE } from "../config/constants/routePathConstants/student.js";
import Swal from "sweetalert2";

class ApiClass {
  _url = "";
  _data = {};
  _method = "";
  _badRequest = null;
  _authFail = null;
  _accessDenied = null;
  _notFound = null;
  _serverError = null;
  _success = null;
  _error = null;
  _query = null;
  _progress = null;
  _api_root = null;
  _headers = {
    "Content-Type": "application/json",
    "Time-Zone": "Asia/Kolkata",
  };
  _responseType = "json";
  _downloadFilename = "download.zip";

  root = (root) => {
    this._api_root = root;
    return this;
  };

  get = (path) => {
    this._method = "GET";
    this._url = this._api_root + path;
    return this;
  };

  post = (path) => {
    this._method = "POST";
    this._url = this._api_root + path;
    return this;
  };

  put = (path) => {
    this._method = "PUT";
    this._url = this._api_root + path;
    return this;
  };

  patch = (path) => {
    this._method = "PATCH";
    this._url = this._api_root + path;
    return this;
  };

  onUploadProgress = (callback = null) => {
    this._progress = callback;
    return this;
  };

  delete = (path) => {
    this._method = "DELETE";
    this._url = this._api_root + path;
    return this;
  };

  success = (callback = null) => {
    this._success = callback;
    return this;
  };

  error = (callback = null) => {
    this._error = callback;
    return this;
  };

  badRequest400 = (callback = null) => {
    this._badRequest = callback;
    return this;
  };

  authFail401 = (callback = null) => {
    this._authFail = callback;
    return this;
  };

  accessDenied403 = (callback = null) => {
    this._accessDenied = callback;
    return this;
  };

  notFound404 = (callback = null) => {
    this._notFound = callback;
    return this;
  };

  serverErr500 = (callback = null) => {
    this._serverError = callback;
    return this;
  };

  data = (a) => {
    if (this._query) {
      this._data["variables"] = a;
    } else {
      this._data = a;
    }
    return this;
  };

  upload = (callback = null) => {
    this._headers = {
      "Content-type": "multipart/form-data",
    };
    return this.send(callback);
  };

  /**
   * Sets up the request to download a ZIP file.
   * @param {string} filename - The desired name for the downloaded ZIP file.
   * @returns {ApiClass} - Returns the instance for chaining.
   */
  downloadZip = (filename = "download.zip") => {
    this._responseType = "blob";
    this._downloadFilename = filename;
    return this;
  };

  /**
   * Sends the HTTP request.
   * @param {function} callback - Optional callback to execute after request.
   * @param {any} data - Optional data payload.
   */
  send = async (callback = null, data) => {
    if (!this._api_root) {
      throw new Error("root path missing");
    }
    const token = getLocal() ?? getSession();
    let res = null;
    let err = null;

    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
    }

    try {
      const response = await axios({
        method: this._method,
        url: this._url,
        data: this._data,
        headers: token
          ? {
              ...this._headers,
              "Access-Control-Allow-Origin": "*",
              "x-auth-token": token,
              "Cache-Control":
                "no-store, no-cache, must-revalidate, proxy-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            }
          : { ...this._headers },
        onUploadProgress: this._progress,
        responseType: this._responseType,
      });

      res = response;

      if (this._responseType === "blob") {
        const contentType = response.headers["content-type"] || "";
        const contentDisposition = response.headers["content-disposition"];
        this._downloadFilename =
          contentDisposition?.split("filename=")?.["1"] ||
          "AttendanceSheet.pdf";
        const filename = this._downloadFilename || "download.file";

        this.exportFile?.call(this, response.data, filename, contentType);

        this._success?.call(this, { message: "Download started." });
      } else if (response?.data?.statusCode) {
        this._success?.call(this, res.data);
      } else {
        throw { response: { data: res.data } };
      }
    } catch (e) {
      err = e;
      if (!err?.response && err.toString().includes(NETWORK_ERROR)) {
        infoToast({
          title: "Network Error",
          msg: "Please check your internet connection and try again.",
        });
        devConsoleLog(
          "Network error. Please check your internet connection and try again."
        );
        return;
      }
      const data = err?.response?.data ?? {};
      const { message: msg = "" } = data;
      const { status } = e?.response ?? {};
      let errorExec = true;
      switch (status) {
        case 400: // Input fails
          this._badRequest?.call(this, data);
          break;
        case 401:
          // Session fail or expiry
          if (!this._authFail) {
            Swal.fire("Unauthorized", "Your session has expired", "error");
            if (this._url.includes("/api/student")) {
              sessionDestroy(STUDENT_LOGIN_PAGE);
            } else {
              sessionDestroy();
            }
          }
          break;
        case 410: // Session fail or expiry
          const { user_details = {} } = getUserData();
          this._authFail?.call(this, data);
          if (!this._authFail) {
            Swal.fire("Authentication Failed", "Please login again", "error");
            if (user_details) {
              if (this._url.includes("/api/student")) {
                sessionDestroy(STUDENT_LOGIN_PAGE);
              } else {
                sessionDestroy();
              }
            }
            errorExec = false;
          }
          break;
        case 403: // Access denied
          this._accessDenied?.call(this, data);
          if (!this._accessDenied) {
            warningToast("Something went wrong");
          }
          errorExec = false;
          break;
        case 404: // Not found
          this._notFound?.call(this, data);
          if (!this._notFound) {
            errorToast("Not Found");
          }
          errorExec = false;
          break;
        case 500: // Internal server error
          this._serverError?.call(this, data);
          if (!this._serverError) {
            errorToast("Internal Server Error");
            this._error?.call(this, err?.response?.data ?? {});
          }
          errorExec = false;
          break;
        default:
          break;
      }

      if (this._error && errorExec) {
        this._error?.call(this, err?.response?.data ?? {});
      }
    }

    if (callback && (res || err?.response)) {
      callback?.call(this, err?.response, err?.response?.statusCode, res);
    }
  };

  downloadFilename(name, blob) {
    this._downloadFilename = name;
    this._responseType = blob;
    return this;
  }

  exportFile = (blob, filename = this._downloadFilename, mimeType = "") => {
    const fileBlob = mimeType
      ? new Blob([blob], { type: mimeType })
      : new Blob([blob]);

    const url = window.URL.createObjectURL(fileBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  };

  /**
   * Triggers the download of a ZIP file in the browser.
   * @param {Blob} blob - The binary data of the ZIP file.
   */
  _downloadFile = (blob) => {
    const url = window.URL.createObjectURL(
      new Blob([blob], { type: "application/zip" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", this._downloadFilename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
}

const api = () => new ApiClass();
export default api;
