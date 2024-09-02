import { ACLProps } from '../../types/CustomElementTypes';
import { cloneElement } from 'react';
import { checkAclPermission } from '../../helpers';

const ACL: React.FC<ACLProps> = ({ children, module, submodule, action }) => {
    const allow = checkAclPermission(module, submodule, action);
    if (allow) {
        return cloneElement(children, { allow: true });
    }

    return cloneElement(children, { allow: false });
}

export default ACL;