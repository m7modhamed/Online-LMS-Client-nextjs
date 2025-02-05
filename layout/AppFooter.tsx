/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { useTranslations } from 'next-intl';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const t = useTranslations('appFooter');
    return (
        <div className="layout-footer">
            <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Logo" height="20" className="mr-2" />
            {t('by')}
            <span className="font-medium ml-2">Xocialive</span>  
        </div>
    );
};

export default AppFooter;
