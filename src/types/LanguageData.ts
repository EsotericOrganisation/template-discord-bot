import { Language } from "../enums/Language.js";
import { LanguageInformation } from "./LanguageInformation.js";

export type LanguageData = {[key in Language]: LanguageInformation};