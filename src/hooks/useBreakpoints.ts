import { useMediaQuery } from "./useMediaQuery";

export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsSmallScreen = () => useMediaQuery("(max-width: 1023px)");
