'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useContext } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { LayoutContext } from '../../../layout/context/layoutcontext';

const LandingPage = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const t = useTranslations('LandingPage');

    return (
        <div className="surface-0 flex justify-content-center">
            <div id="home" className="landing-wrapper overflow-hidden">
                <div
                    id="hero"
                    className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                    style={{
                        background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EEEFAF 0%, #C3E3FA 100%)',
                        clipPath: 'ellipse(150% 87% at 93% 13%)'
                    }}
                >
                    <div className="mx-4 md:mx-8 mt-0 md:mt-4">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                            <span className="font-light block">{t('title')}</span>
                            <span className="block">{t('subtitle')}</span>
                        </h1>
                        <p className="font-normal text-lg md:text-2xl leading-relaxed md:mt-4 text-gray-700 w-screen">
                            {t('description')}
                        </p>


                    </div>
                    <div className="flex justify-content-center md:justify-content-end">
                        <img src="/demo/images/landing/screen-1.png" alt="Hero Image" className="w-9 md:w-auto" />
                    </div>
                </div>

                <div className="py-4 px-4 mx-0 mt-8 lg:mx-8">
                    <div className="grid justify-content-between">
                        <div className="col-12 md:col-3 my-auto" style={{ marginTop: '-1.5rem' }}>
                            <Link href="/" className="flex align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
                                <img src={`/layout/images/${layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'}.svg`} alt="footer sections" width="50" height="50" className="mr-2" />
                                <span className="font-medium text-3xl mx-4 text-900">{t('websiteName')}</span>
                            </Link>
                        </div>

                        <div className="col-12 md:col-10 lg:col-7">
                            <div className="grid text-center md:text-left">
                                {/* Company Section */}
                                <div className="col-12 md:col-3">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">{t('Footer.Company')}</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">{t('Footer.AboutUs')}</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">{t('Footer.News')}</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">{t('Footer.InvestorRelations')}</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">{t('Footer.Careers')}</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">{t('Footer.MediaKit')}</a>
                                </div>

                                {/* Resources Section */}
                                <div className="col-12 md:col-3 mt-4 md:mt-0">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">{t('Footer.Resources')}</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">{t('Footer.GetStarted')}</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">{t('Footer.Learn')}</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">{t('Footer.CaseStudies')}</a>
                                </div>

                                {/* Community Section */}
                                <div className="col-12 md:col-3 mt-4 md:mt-0">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">{t('Footer.Community')}</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">{t('Footer.Discord')}</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                        {t('Footer.Events')}
                                        <img src="/demo/images/landing/new-badge.svg" className="ml-2" alt="badge" />
                                    </a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">{t('Footer.FAQ')}</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">{t('Footer.Blog')}</a>
                                </div>

                                {/* Legal Section */}
                                <div className="col-12 md:col-3 mt-4 md:mt-0">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">{t('Footer.Legal')}</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">{t('Footer.BrandPolicy')}</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">{t('Footer.PrivacyPolicy')}</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">{t('Footer.TermsOfService')}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
