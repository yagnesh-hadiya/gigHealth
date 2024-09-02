import { checkAclPermission } from "../helpers";
import UnAuthorized from "../pages/unauthorized";
import { ACLRouteProps } from "../types/RouteTypes";

const ACLRoute: React.FC<ACLRouteProps> = ({ children, module, submodule, action }) => {
    const allow = checkAclPermission(module, submodule, action);
    if (allow) {
        return <>{children}</>;
    }

    return <UnAuthorized />;
}

export default ACLRoute;