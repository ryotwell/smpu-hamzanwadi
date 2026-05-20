import { Button } from "@/components/ui/button";
import { FC } from "react";
interface IDashboardPageProps { };

export const DashboardPage: FC<IDashboardPageProps> = (props) => {
    return (
        <div>
            <Button>
                Hello
            </Button>
        </div>
    );
}

export default DashboardPage;
