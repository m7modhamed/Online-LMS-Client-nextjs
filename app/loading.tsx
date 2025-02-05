'use client';

import React from 'react';
import { Oval } from 'react-loader-spinner';

const Loading = () => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light overlay effect
                backdropFilter: 'blur(5px)', // Glassmorphism effect
                zIndex: 9999, // Ensures it appears above everything
            }}
        >
            <div style={{ display : 'flex' , flexDirection : 'column'}}>
                {/* Loader Spinner */}
               <div style={{ margin : 'auto' }}>
               <Oval
                    visible={true}
                    height={80}
                    width={80}
                    color="#4fa94d"
                    ariaLabel="oval-loading"
                    strokeWidth={10}
                />
               </div>

                {/* Loading Text */}
                <p
                    style={{
                        marginTop: '16px',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#333',
                        animation: 'pulse 1.5s infinite',
                    }}
                >
                    Loading, please wait...
                </p>
            </div>
        </div>
    );
};

export default Loading;
