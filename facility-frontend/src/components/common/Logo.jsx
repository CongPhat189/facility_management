import React from 'react';

const Logo = ({ size = 'large' }) => {
    const sizeClasses = {
        small: 'text-xl',
        medium: 'text-2xl',
        large: 'text-3xl xl:text-4xl'
    };

    return (
        <div className="text-center">
            <h1 className={`${sizeClasses[size]} font-bold text-blue-600 mb-2`}>
                {size === 'large' ? (
                    <>
                        <span className="italic">OU </span>Facility Management
                    </>
                ) : (
                    'Logo'
                )}
            </h1>
            {size === 'large' && (
                <>

                    <p className="text-gray-600">Trường Đại học Mở Thành phố Hồ Chí Minh</p>
                </>
            )}
            {size !== 'large' && (
                <>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                        Hệ thống quản lý cơ sở vật chất
                    </h2>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">OU</h3>
                    <p className="text-gray-600">Đăng nhập để sử dụng dịch vụ</p>
                </>
            )}
        </div>
    );
};

export default Logo;