'use client'
import { Box, LinearProgress } from '@mui/material';
import { Skeleton } from 'primereact/skeleton';
import React from 'react';

const Loading = () => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    return 0;
                }
                const diff = Math.random() * 100;
                return Math.min(oldProgress + diff, 100);
            });
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgress variant="determinate" value={progress} />
        </Box>

        // <div className="flex items-center justify-center h-screen">
        //     <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
        // </div>

        // <div>
        //     <h1 style={{ fontSize: '50px' }}>Loading....</h1>
        // </div>

        // <div className="border-round border-1 surface-border p-4">
        //     <div className="flex mb-3">
        //         <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
        //         <div>
        //             <Skeleton width="10rem" className="mb-2"></Skeleton>
        //             <Skeleton width="5rem" className="mb-2"></Skeleton>
        //             <Skeleton height=".5rem"></Skeleton>
        //         </div>
        //     </div>
        //     <Skeleton width="100%" height="150px"></Skeleton>
        //     <div className="flex justify-content-between mt-3">
        //         <Skeleton width="4rem" height="2rem"></Skeleton>
        //         <Skeleton width="4rem" height="2rem"></Skeleton>
        //     </div>
        // </div>
    );
};

export default Loading;
