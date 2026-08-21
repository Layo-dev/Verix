import MobileHome from "@/components/dashboard/mobile/MobileHome";
import DesktopReceiveSms from "@/components/dashboard/DesktopReceiveSms";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardPage = () => {
  const isMobile = useIsMobile();

  if (isMobile) return <MobileHome />;

  return <DesktopReceiveSms />;
};

export default DashboardPage;
