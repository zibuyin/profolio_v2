import { getRequestConfig } from "next-intl/server";

import enMessages from "../../messages/en.json";
import zhMessages from "../../messages/zh.json";

const messages = {
	en: enMessages,
	zh: zhMessages,
} as const;

const defaultLocale = "en" as const;

export default getRequestConfig(async () => ({
	locale: defaultLocale,
	messages: messages[defaultLocale],
}));
