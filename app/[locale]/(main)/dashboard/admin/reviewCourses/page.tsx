import { getTranslations } from 'next-intl/server';
import ReviewCourseList from '@/demo/components/(admin)/ReviewCourseList';

const AdminCoursesForReview = async () => {
    const t = await getTranslations('coursesForReview');

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>{t('title')}</h5>
                    <p>{t('description')}</p>
                </div>
                <ReviewCourseList />
            </div>
        </div>
    );
};

export default AdminCoursesForReview;
