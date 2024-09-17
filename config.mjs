import dotenv from "dotenv";
dotenv.config()

export const FA_APPLICATION_ID      = process.env.FA_APPLICATION_ID;
export const FA_APPLICATION_VERSION = parseInt(process.env.FA_APPLICATION_VERSION);
export const URL                 = process.env.FA_URL;
export const PORT                = process.env.FA_PORT;
//export const UPLOAD_DIR          = process.env.FILESIGN_UPLOAD_DIR;
//export const DOWNLOAD_DIR        = process.env.FILESIGN_DOWNLOAD_DIR;
export const OPERATOR_HOST       = process.env.FA_OPERATOR_HOST;
export const OPERATOR_PORT       = process.env.FA_OPERATOR_PORT;
