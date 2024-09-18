import dotenv from "dotenv";
dotenv.config()

export const APPLICATION_URL                 = process.env.APPLICATION_URL;
export const APPLICATION_PORT      = process.env.APPLICATION_PORT;

export const CARMENTIS_APPLICATION_VERSION = parseInt(process.env.CARMENTIS_APPLICATION_VERSION);
export const CARMENTIS_APPLICATION_ID = process.env.CARMENTIS_APPLICATION_ID;

export const CARMENTIS_OPERATOR_HOST       = process.env.CARMENTIS_OPERATOR_HOST;
export const CARMENTIS_OPERATOR_PORT       = process.env.CARMENTIS_OPERATOR_PORT;
