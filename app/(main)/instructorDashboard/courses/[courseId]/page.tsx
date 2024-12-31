'use client';
import { useParams } from 'next/navigation';
import React from 'react';

const Course = () => {

    const param = useParams();
    return (
        <div className="grid">
            {/* <Toast ref={toast} /> */}
            <div className="col-12">
                <div className="card">
                    <h5>Course</h5>
                    <p>Use this page to show the course .</p>
                    <p>course with id : {param.courseId}</p>
                </div>
            </div>
        </div>
    );
};

export default Course;
