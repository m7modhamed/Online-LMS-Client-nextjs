import React from 'react';
import StudentCourseList from '../../../../../../demo/components/(student)/StudentCourseList';
import { getTranslations } from 'next-intl/server';

const learningCourses = async () => {
    const t = await getTranslations('studentCourses');

   

    return (
        <div>
            <div className="card">
                <h4>{t('title')}</h4>
                <h6>{t('description')}</h6>
            </div>
            <StudentCourseList />
        </div>
    );
};

export default learningCourses;
