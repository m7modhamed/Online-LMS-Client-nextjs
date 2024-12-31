import React from 'react';
import CourseList from '../../(component)/CourseList';

const myCourses = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>My Courses</h5>
                    <p>Use this page to start from scratch and place your custom content.</p>
                </div>
            </div>


                <CourseList />
                
            
        </div>
    );
};

export default myCourses;
myCourses;
